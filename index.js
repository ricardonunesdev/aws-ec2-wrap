'use strict';

require('dotenv').config();

const Promise = require('bluebird');
const AWS = require('aws-sdk');
const isIp = require('is-ip');

const latestApiVersion = '2016-11-15';

let EC2 = null;

// -------------------------------------------------- //

/**
 * Check if the EC2 connection has been initialized.
 */
const checkInitialized = () => {
    if (EC2 === null) {
        throw new Error(errors.NOT_INITIALIZED);
    }
};

/**
 * Check if the region is valid for EC2.
 * @param {string} region The region to validate
 */
const checkValidRegion = (region) => {
    checkNotEmpty(region);

    if (validRegions.indexOf(region) === -1) {
        throw new Error(errors.INVALID_REGION);
    }
};

/**
 * Check if the ip address is valid.
 * @param {string} ipAddress The ip address to validate
 */
const checkValidIpAddress = (ipAddress) => {
    checkNotEmpty(ipAddress);

    if (!isIp.v4(ipAddress)) {
        throw new Error(errors.INVALID_IP);
    }
}

/**
 * Check if the state is valid.
 * @param {string} state The state to validate
 */
const checkValidState = (state) => {
    checkNotEmpty(state);

    if (validStates.indexOf(state) === -1) {
        throw new Error(errors.INVALID_STATE);
    }
};

/**
 * Check if the value is empty
 * @param {*} value The value to validate
 */
const checkNotEmpty = (value) => {
    if ((typeof value === 'undefined') ||
        (value === null) ||
        (value === '') ||
        (Array.isArray(value) && (value.length === 0)) ||
        ((typeof value === 'object') && (Object.keys(value).length === 0))) {
        throw new Error(errors.EMPTY_VALUE);
    }
};

// -------------------------------------------------- //

/**
 * Initialize the EC2 connection and sets the AWS region.
 * @param {string} region The AWS region you want to interact with (example: 'us-west-1').
 */
const init = (region) => {
    checkValidRegion(region);

    AWS.config.region = region;
    EC2 = new AWS.EC2();
};

/**
 * Get the currently selected AWS region.
 * @return {string} The name of the AWS region
 */
const getRegion = () => {
    checkInitialized();

    return EC2.config.region;
};

/**
 * Get all instances.
 */
const getAllInstances = () => {
    checkInitialized();

    return new Promise((resolve, reject) => {
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
 * Get one instance by ip address.
 * @param {string} ipAddress The ip address of the instance
 */
const getInstanceByIpAddress = (ipAddress) => {
    checkInitialized();
    checkValidIpAddress(ipAddress);

    return new Promise((resolve, reject) => {
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
    checkInitialized();
    checkNotEmpty(instanceId);

    return new Promise((resolve, reject) => {
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
 * Get many instances by state.
 * @param {string} state The state of the instances
 */
const getInstancesByState = (state) => {
    checkInitialized();
    checkValidState(state);

    return new Promise((resolve, reject) => {
        let params = {
            DryRun: false,
            Filters: [{ Name: 'instance-state-name', Values: [state] }]
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
 * Get instance status by id.
 * @param {string} instanceId The id of the instance
 */
const getInstanceStatus = (instanceId) => {
    checkInitialized();
    checkNotEmpty(instanceId);

    return new Promise(function (resolve, reject) {
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
 * Launch instance.
 * @param {string} imageId The id of the AMI image to use
 * @param {string} instanceType The instance type
 * @param {string} keyName The name of the KeyPair to access
 * @param {string} securityGroupName The name of the security group
 * @param {string} tagName The name tag you want to apply to the instance
 */
const launchInstance = (imageId, instanceType, keyName, securityGroupName, tagName) => {
    checkInitialized();
    checkNotEmpty(imageId);
    checkNotEmpty(instanceType);
    checkNotEmpty(keyName);
    checkNotEmpty(securityGroupName);
    checkNotEmpty(tagName);

    return new Promise((resolve, reject) => {
        let params = {
            ImageId: imageId,
            InstanceType: instanceType,
            KeyName: keyName,
            SecurityGroups: [securityGroupName],
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
    checkInitialized();
    checkNotEmpty(instanceId);

    return new Promise((resolve, reject) => {
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
    checkInitialized();
    checkNotEmpty(instanceId);

    return new Promise((resolve, reject) => {
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
    checkInitialized();
    checkNotEmpty(instanceId);

    return new Promise((resolve, reject) => {
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

/**
 * Valid AWS regions for EC2.
 */
const validRegions = [
    'ap-northeast-1',
    'ap-northeast-2',
    'ap-south-1',
    'ap-southeast-1',
    'ap-southeast-2',
    'ca-central-1',
    'eu-central-1',
    'eu-west-1',
    'eu-west-2',
    'sa-east-1',
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2'
];

/**
 * Valid states for EC2 instances
 */
const validStates = [
    'pending',
    'running',
    'shutting-down',
    'terminated',
    'stopping',
    'stopped'
];

/**
 * Common error list.
 */
const errors = {
    NOT_INITIALIZED: 'EC2 not initialized. Please call EC2.init() with a valid region.',
    EMPTY_VALUE: 'You provided an empty argument. Please fix it and try again.',
    INVALID_REGION: 'Region is invalid. Please check the valid regions for EC2 @ http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions.',
    INVALID_IP: 'IP address is invalid. Please insert a valid IPv4 address.',
    INVALID_STATE: 'State is invalid. Please check the valid states for EC2 @ http://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_InstanceState.html.'
};

// -------------------------------------------------- //

module.exports = {
    init: init,
    getRegion: getRegion,

    getAllInstances: getAllInstances,
    getInstancesByState: getInstancesByState,
    getInstanceById: getInstanceById,
    getInstanceByIpAddress: getInstanceByIpAddress,
    getInstanceStatus: getInstanceStatus,
    launchInstance: launchInstance,
    stopInstance: stopInstance,
    startInstance: startInstance,
    terminateInstance: terminateInstance,

    validRegions: validRegions,
    errors: errors
};
