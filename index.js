'use strict';

const Promise = require('bluebird');
const AWS = require('aws-sdk');

let EC2 = null;

/**
 * Initialize EC2 connection and set AWS region
 * @param {string} region The AWS region you want to interact with (example: 'us-west-1').
 */
const init = (region) => {
    AWS.config.region = region;
    EC2 = new AWS.EC2();
};

/**
 * Launch a new EC2 instance
 * @return {string} The name of the AWS region
 */
const launchInstance = () => {
    return EC2.config.region;
}

module.exports = {
    init: init,
    launchInstance: launchInstance
};