'use strict';

const isIp = require('is-ip');

/**
 * Check if the EC2 connection has been initialized.
 */
const checkInitialized = (conn) => {
    if (conn === null) {
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
        throw new Error(errors.INVALID_STATUS);
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
    EMPTY_VALUE: 'You provided an empty argument. Please try again with the correct arguments.',
    INVALID_REGION: 'Region is invalid. Please try again with a valid region.',
    INVALID_IP: 'IP address is invalid. Please try again with a valid IPv4 address.',
    INVALID_STATUS: 'Status is invalid. Please try again with a valid status.'
};

module.exports = {
    checkInitialized: checkInitialized,
    checkValidRegion: checkValidRegion,
    checkValidIpAddress: checkValidIpAddress,
    checkValidState: checkValidState,
    checkNotEmpty: checkNotEmpty,

    errors: errors
};
