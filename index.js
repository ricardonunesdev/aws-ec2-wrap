'use strict';

require('dotenv').config();

const Promise = require('bluebird');
const AWS = require('aws-sdk');
const isIp = require('is-ip');

const latestApiVersion = '2016-11-15';

let EC2 = null;

/**
 * Checks if the EC2 connection has been initialized.
 */
const checkInitialized = () => {
    if (EC2 === null) {
        throw new Error(errors.NOT_INITIALIZED);
    }
};

/**
 * Checks if the region is valid for EC2
 * @param {string} region The region to validate
 */
const checkValidRegion = (region) => {
    if (validRegions.indexOf(region) === -1) {
        throw new Error(errors.INVALID_REGION);
    }
};

/**
 * Checks if the ip address is valid
 * @param {string} ipAddress The ip address to validate
 */
const checkValidIpAddress = (ipAddress) => {
    if (!isIp.v4(ipAddress)) {
        throw new Error(errors.INVALID_IP);
    }
}

/**
 * Initializes the EC2 connection and sets the AWS region.
 * @param {string} region The AWS region you want to interact with (example: 'us-west-1').
 */
const init = (region) => {
    checkValidRegion(region);

    AWS.config.region = region;
    EC2 = new AWS.EC2();
};

/**
 * Gets the currently selected AWS region.
 * @return {string} The name of the AWS region
 */
const getRegion = () => {
    checkInitialized();

    return EC2.config.region;
};

/**
 * Gets all of your instances.
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

// Get instance by ip address
const getInstanceByIpAddress = (ipAddress) => {
    checkInitialized();
    checkValidIpAddress(ipAddress);

    return new Promise((resolve, reject) => {
        let params = {
            DryRun: false,
            Filters: [ { Name: 'ip-address', Values: [ ipAddress ] } ]
        };

        EC2.describeInstances(params, (error, data) => {
            if (error) {
                return reject(error);
            }

            let instance = {};

            if ((data.Reservations.length > 0) && (data.Reservations[0].Instances.length > 0)) {
                instance = data.Reservations[0].Instances[0];
            }

            return resolve(instance);
        });
    });
};

// Get instance by instance id
// Get instances by instance state

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
 * Common error list.
 */
const errors = {
    NOT_INITIALIZED: 'EC2 not initialized. Please call EC2.init() with a valid region.',
    INVALID_REGION: 'Region is invalid. Please check the valid regions for EC2 @ http://docs.aws.amazon.com/general/latest/gr/rande.html#ec2_region.',
    INVALID_IP: 'IP address is invalid. Please insert a valid IPv4 address.'
};

module.exports = {
    init: init,
    getRegion: getRegion,

    getAllInstances: getAllInstances,
    getInstanceByIpAddress: getInstanceByIpAddress,

    validRegions: validRegions,
    errors: errors
};
