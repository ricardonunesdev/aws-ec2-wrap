'use strict';

const EC2 = require('../');

EC2.init('us-west-1');

let res = EC2.launchInstance();

console.log(res);