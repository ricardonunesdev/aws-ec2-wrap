'use strict';

require('dotenv').config();

const Promise = require('bluebird');
const AWS = require('aws-sdk');
const validate = require('./lib/validate');

const latestApiVersion = '2016-11-15';

let EC2 = null;

// -------------------------------------------------- //

/**
 * Initialize the EC2 connection and sets the AWS region.
 * @param {string} region The AWS region you want to interact with (example: 'us-west-1').
 */
const init = (region) => {
    validate.checkValidRegion(region);

    AWS.config.region = region;
    EC2 = new AWS.EC2();
};

/**
 * Closes the current EC2 connection. Used for testing purposes.
 */
const close = () => {
    EC2 = null;
};

/**
 * Get the currently selected AWS region.
 * @return {string} The name of the AWS region
 */
const getRegion = () => {
    validate.checkInitialized(EC2);

    return EC2.config.region;
};

/**
 * Get all instances.
 */
const getAllInstances = () => {
    return new Promise((resolve, reject) => {
        validate.checkInitialized(EC2);

        let params = {
            DryRun: false
        };

        EC2.describeInstances(params, (error, data) => {
            if (error) {
                return reject(error);
            }

            let instances = [];

            data.Reservations.forEach((reservation) => {
                reservation.Instances.forEach((instance) => {
                    instances.push(instance);
                });
            });

            return resolve(instances);
        });
    });
};

/**
 * Get many instances by state.
 * @param {string} state The state of the instances
 */
const getInstancesByStatus = (status) => {
    return new Promise((resolve, reject) => {
        validate.checkInitialized(EC2);
        validate.checkValidState(status);

        let params = {
            DryRun: false,
            Filters: [{ Name: 'instance-state-name', Values: [status] }]
        };

        EC2.describeInstances(params, (error, data) => {
            if (error) {
                return reject(error);
            }

            let instances = [];

            data.Reservations.forEach((reservation) => {
                reservation.Instances.forEach((instance) => {
                    instances.push(instance);
                });
            });

            return resolve(instances);
        });
    });
};

/**
 * Get one instance by ip address.
 * @param {string} ipAddress The ip address of the instance
 */
const getInstanceByIpAddress = (ipAddress) => {
    return new Promise((resolve, reject) => {
        validate.checkInitialized(EC2);
        validate.checkValidIpAddress(ipAddress);

        let params = {
            DryRun: false,
            Filters: [{ Name: 'ip-address', Values: [ipAddress] }]
        };

        EC2.describeInstances(params, (error, data) => {
            if (error) {
                return reject(error);
            }

            let instance;

            if ((data.Reservations.length > 0) && (data.Reservations[0].Instances.length > 0)) {
                instance = data.Reservations[0].Instances[0];
            } else {
                instance = {};
            }

            return resolve(instance);
        });
    });
};

/**
 * Get one instance by id.
 * @param {string} instanceId The id of the instance
 */
const getInstanceById = (instanceId) => {
    return new Promise((resolve, reject) => {
        validate.checkInitialized(EC2);
        validate.checkNotEmpty(instanceId);

        let params = {
            DryRun: false,
            InstanceIds: [instanceId]
        };

        EC2.describeInstances(params, (error, data) => {
            if (error) {
                return reject(error);
            }

            let instance = data.Reservations[0].Instances[0];

            return resolve(instance);
        });
    });
};

/**
 * Get instance status by id.
 * @param {string} instanceId The id of the instance
 */
const getInstanceStatus = (instanceId) => {
    return new Promise(function (resolve, reject) {
        validate.checkInitialized(EC2);
        validate.checkNotEmpty(instanceId);

        let instanceState;
        let params = {
            DryRun: false,
            IncludeAllInstances: true,
            InstanceIds: [instanceId]
        };

        EC2.describeInstanceStatus(params, function (error, data) {
            if (error) {
                return reject(error);
            }

            let instanceStatus = data.InstanceStatuses[0].InstanceState.Name;

            return resolve(instanceStatus);
        });
    });
};

/**
 * Get instance ip address by id.
 * @param {string} instanceId The id of the instance
 */
const getInstanceIpAddress = (instanceId) => {
    return new Promise(function (resolve, reject) {
        validate.checkInitialized(EC2);
        validate.checkNotEmpty(instanceId);

        getInstanceById(instanceId)
            .then((instance) => {
                return resolve(instance.PublicIpAddress);
            })
            .catch(reject);
    });
};

/**
 * Launch instance.
 * @param {string} imageId The id of the AMI image to use
 * @param {string} instanceType The instance type
 * @param {string} keyName The name of the KeyPair to access
 * @param {string} securityGroupName The name of the security group
 * @param {string} tagName The name tag you want to apply to the instance
 */
const launchInstance = (imageId, instanceType, keyName, securityGroup, tagName) => {
    return new Promise((resolve, reject) => {
        validate.checkInitialized(EC2);
        validate.checkNotEmpty(imageId);
        validate.checkNotEmpty(instanceType);
        validate.checkNotEmpty(keyName);
        validate.checkNotEmpty(securityGroup);
        validate.checkNotEmpty(tagName);

        let params = {
            ImageId: imageId,
            InstanceType: instanceType,
            KeyName: keyName,
            SecurityGroups: [securityGroup],
            MinCount: 1,
            MaxCount: 1
        };

        EC2.runInstances(params, (error, data) => {
            if (error) {
                return reject(error);
            }

            let instanceId = data.Instances[0].InstanceId;

            params = {
                Resources: [instanceId],
                Tags: [{ Key: 'Name', Value: tagName }]
            };

            EC2.createTags(params, (error, data) => {
                if (error) {
                    return reject(error);
                }

                return resolve(instanceId);
            });
        });
    });
};

/**
 * Stop instance.
 * @param {string} instanceId The id of the instance to stop
 */
const stopInstance = (instanceId) => {
    return new Promise((resolve, reject) => {
        validate.checkInitialized(EC2);
        validate.checkNotEmpty(instanceId);

        let params = {
            DryRun: false,
            InstanceIds: [instanceId]
        };

        EC2.stopInstances(params, (error, data) => {
            if (error) {
                return reject(error);
            }

            let instanceStatus = {
                previous: data.StoppingInstances[0].PreviousState.Name,
                current: data.StoppingInstances[0].CurrentState.Name
            };

            return resolve(instanceStatus);
        });
    });
};

/**
 * Start instance.
 * @param {string} instanceId The id of the instance to start
 */
const startInstance = (instanceId) => {
    return new Promise((resolve, reject) => {
        validate.checkInitialized(EC2);
        validate.checkNotEmpty(instanceId);

        let params = {
            DryRun: false,
            InstanceIds: [instanceId]
        };

        EC2.startInstances(params, (error, data) => {
            if (error) {
                return reject(error);
            }

            let instanceStatus = {
                previous: data.StartingInstances[0].PreviousState.Name,
                current: data.StartingInstances[0].CurrentState.Name
            };

            return resolve(instanceStatus);
        });
    });
};

/**
 * Terminate instance.
 * @param {string} instanceId The id of the instance to terminate
 */
const terminateInstance = (instanceId) => {
    return new Promise((resolve, reject) => {
        validate.checkInitialized(EC2);
        validate.checkNotEmpty(instanceId);

        let params = {
            DryRun: false,
            InstanceIds: [instanceId]
        };

        EC2.terminateInstances(params, (error, data) => {
            if (error) {
                return reject(error);
            }

            let instanceStatus = {
                previous: data.TerminatingInstances[0].PreviousState.Name,
                current: data.TerminatingInstances[0].CurrentState.Name
            };

            return resolve(instanceStatus);
        });
    });
};

// -------------------------------------------------- //

module.exports = {
    init: init,
    close: close,
    getRegion: getRegion,

    getAllInstances: getAllInstances,
    getInstancesByStatus: getInstancesByStatus,
    getInstanceById: getInstanceById,
    getInstanceByIpAddress: getInstanceByIpAddress,
    getInstanceStatus: getInstanceStatus,
    getInstanceIpAddress: getInstanceIpAddress,
    launchInstance: launchInstance,
    stopInstance: stopInstance,
    startInstance: startInstance,
    terminateInstance: terminateInstance,

    errors: validate.errors
};
