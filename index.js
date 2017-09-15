'use strict';

const Promise = require('bluebird');
const AWS = require('aws-sdk');

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
 * @param {string} region
 * @return {boolean} True if region is valid, false otherwise
 */
const isValidRegion = (region) => {
    return (validRegions.indexOf(region) !== -1);
};

/**
 * Initializes the EC2 connection and sets the AWS region.
 * @param {string} region The AWS region you want to interact with (example: 'us-west-1').
 */
const init = (region) => {
    if (isValidRegion(region)) {
        AWS.config.region = region;
        EC2 = new AWS.EC2();
    } else {
        throw new Error(errors.INVALID_REGION);
    }
};

/**
 * Gets the currently selected AWS region.
 * @return {string} The name of the AWS region
 */
const getRegion = () => {
    checkInitialized();
    return EC2.config.region;
}

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
    NOT_INITIALIZED: 'EC2 not initialized. Please call EC2.init() with a valid region',
    INVALID_REGION: 'Region is invalid. Please check valid regions for EC2 here - http://docs.aws.amazon.com/general/latest/gr/rande.html#ec2_region'
};

module.exports = {
    init: init,
    getRegion: getRegion,

    validRegions: validRegions,
    errors: errors
};