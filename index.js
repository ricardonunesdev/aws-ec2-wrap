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
 * Initializes the EC2 connection and sets the AWS region.
 * @param {string} region The AWS region you want to interact with (example: 'us-west-1').
 */
const init = (region) => {
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
}

/**
 * Common error list.
 */
const errors = {
    NOT_INITIALIZED: 'EC2 not initialized. Please call EC2.init() with a valid region'
};

module.exports = {
    init: init,
    getRegion: getRegion,

    errors: errors
};