# AWS EC2 Wrapper

[![NPM](https://nodei.co/npm/aws-ec2-wrap.png)](https://nodei.co/npm/aws-ec2-wrap/)

[![Join the chat on Gitter](https://badges.gitter.im/ricardonunesdev/aws-ec2-wrap.svg)](https://gitter.im/ricardonunesdev/aws-ec2-wrap)

[![Build Status](https://travis-ci.org/ricardonunesdev/aws-ec2-wrap.svg?branch=master)](https://travis-ci.org/ricardonunesdev/aws-ec2-wrap)
[![Coverage Status](https://coveralls.io/repos/github/ricardonunesdev/aws-ec2-wrap/badge.svg?branch=master)](https://coveralls.io/github/ricardonunesdev/aws-ec2-wrap?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/ricardonunesdev/aws-ec2-wrap.svg)](https://gemnasium.com/github.com/ricardonunesdev/aws-ec2-wrap)
[![npm](https://img.shields.io/npm/v/aws-ec2-wrap.svg)](https://www.npmjs.com/package/aws-ec2-wrap)
[![license](https://img.shields.io/npm/l/aws-ec2-wrap.svg)](https://github.com/ricardonunesdev/aws-ec2-wrap/blob/master/LICENSE)

Simplified AWS EC2 wrapper written in Node.js, allowing you to easily work with **AWS SDK for Javascript** without messing around with all the parameters and restrictions.

Only some methods have been wrapped at the moment (see below on [Methods](#methods)), more will be implemented in the future.

## Warning

I'll be implementing changes as quickly as possible, if you have a bug report or feature request, please read the [Feedback](#feedback) section.

Please take note that this is still a beta module.

I'll ensure that `patch` (0.0.x) updates won't break your code, but `major` (x.0.0) and `minor` (0.x.0) ones might.

Always check this README file before upgrading to the latest version.

## Installation


To install the package, run this command inside your project's folder:

```sh
$ npm install aws-ec2-wrap --save
```

## Credentials

Before using this module you need to setup your credentials to allow access to your AWS account.

There two ways you can do that:

 - Create a `~/.aws/credentials` file to allow access that computer with the following content (replace the keys with your own):

    ```
    [default]
    aws_access_key_id=AKIAIOSFODNN7EXAMPLE
    aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    ```

    If you already use the AWS CLI, this file should already exist.

 - Create a `.env` at the root of your project's folder with the following content (again replace the keys with your own):

    ```
    AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
    AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
    ```

    The [dot-env](https://www.npmjs.com/package/dotenv) module will automatically import your keys from the `.env` file, there's no need to install it or require it in your project.

## Usage

To start using the module's methods, you need to initialize it first with your region (using the method [init](#init)).

After that you can start calling any of the included [methods](#methods), similar to the example below.

Once you initialized the module, you don't need to call the [init](#init) method again, unless you want to change regions.

All methods return a Promise that must be handled on your side.

```js
const EC2 = require('aws-ec2-wrap');

EC2.init('eu-west-1'); // Change to your region

EC2.getAllInstances()
    .then((instances) => {
        console.log(instances); // Your code here
    })
    .catch((error) => {
        console.error(error);
    });
```

### Valid Regions

At the time of writing this, these are the available regions:

 - `ap-northeast-1`
 - `ap-northeast-2`
 - `ap-south-1`
 - `ap-southeast-1`
 - `ap-southeast-2`
 - `ca-central-1`
 - `eu-central-1`
 - `eu-west-1`
 - `eu-west-2`
 - `sa-east-1`
 - `us-east-1`
 - `us-east-2`
 - `us-west-1`
 - `us-west-2`

Make sure you choose the right one, or the methods might not work correctly.

## Methods

In each method below you'll find the required parameters, output format, errors thrown, and usage examples.

### init

Receives a `region` as a parameter.

Doesn't return anything.

This method initializes the connection to the AWS API for the selected `region`.

```js
EC2.init('eu-west-1'); // Your region here
```

### getAllInstances

Doesn't receive any parameter.

Returns an array of `instances`, where each one is the exact object returned by the AWS API.

[API Reference](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property)

```js
EC2.getAllInstances()
    .then((instances) => {
        console.log(instances); // Your code here
    })
    .catch((error) => {
        console.error(error);
    });

/* Return example:
[
    { instance1 },
    { instance2 },
    { instance3 },
    ...
]
*/
```

### getInstancesByStatus

Receives a `status` as a parameter.

Returns an array of `instances` that have the `status` provided, where each one is the exact object returned by the AWS API.

[API Reference](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property)

```js
EC2.getInstancesByStatus(status)
    .then((instances) => {
        console.log(instances); // Your code here
    })
    .catch((error) => {
        console.error(error);
    });

/* Return example:
[
    { instance1 },
    { instance2 },
    { instance3 },
    ...
]
*/
```

### getInstanceByIpAddress

Receives an `ip address` as a parameter.

Returns the `instance` that has the public `ip address` provided, or an empty object if none was found. The `instance` is the exact object returned by the AWS API.

[API Reference](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property)

```js
EC2.getInstanceByIpAddress(ipAddress)
    .then((instance) => {
        console.log(instance); // Your code here
    })
    .catch((error) => {
        console.error(error);
    });

/* Return example:
{ instance }
*/
```

### getInstanceById

Receives an `instance id` as a parameter.

Returns the `instance` that has the `instance id` provided, or an empty object if none was found. The `instance` is the exact object returned by the AWS API.

[API Reference](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property)

```js
EC2.getInstanceById(instanceId)
    .then((instance) => {
        console.log(instance); // Your code here
    })
    .catch((error) => {
        console.error(error);
    });

/* Return example:
{ instance }
*/
```

### getInstanceStatus

Receives an `instance id` as a parameter.

Returns the current `status` of the instance that has the `instance id` provided. The `status` is the name of the status code returned by the AWS API (`InstanceState.Name`).

[API Reference](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstanceStatus-property)

```js
EC2.getInstanceStatus(instanceId)
    .then((status) => {
        console.log(status); // Your code here
    })
    .catch((error) => {
        console.error(error);
    });

/* Return example:
'running'
*/
```

### getInstanceIpAddress

Receives an `instance id` as a parameter.

Returns the public `ip address` of the instance that has the `instance id` provided. The `ip address` is the public ip address returned by the AWS API (`PublicIpAddress`).

[API Reference](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property)

```js
EC2.getInstanceIpAddress(instanceId)
    .then((ipAddress) => {
        console.log(ipAddress); // Your code here
    })
    .catch((error) => {
        console.error(error);
    });

/* Return example:
'1.2.3.4'
*/
```

### launchInstance

Receives the following parameters:

 - `image id` - the code for the AMI image to use, either a base one provided by AWS or a custom one created by you
 - `instance type` - the type of instance to launch ([Reference](https://aws.amazon.com/ec2/instance-types/))
 - `key name` - the key pair value used to access the instance by SSH
 - `security group` - the name of the security group to associate with this instance
 - `tag name` - the value of the `Name` tag to apply to this instance, as show in the **Instances List** on your AWS console

Returns the `instance id` of the newly created instance.

```js
EC2.launchInstance(imageId, instanceType, keyName, securityGroup, tagName)
    .then((instanceId) => {
        console.log(instanceId); // Your code here
    })
    .catch((error) => {
        console.error(error);
    });

/* Return example:
'i-0123456abc0123456'
*/
```

### stopInstance

Receives an `instance id` as a parameter.

Returns a `status` object that contains both the previous and the current statuses of the instance, as returned by the AWS API (`PreviousState.Name` and `CurrentState.Name`).

[API Reference](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#stopInstances-property)

```js
EC2.stopInstance(instanceId)
    .then((status) => {
        console.log(status); // Your code here
    })
    .catch((error) => {
        console.error(error);
    });

/* Return example:
{
    previous: 'running',
    current: 'stopping'
}
*/
```

### startInstance

Receives an `instance id` as a parameter.

Returns a `status` object that contains both the previous and the current statuses of the instance, as returned by the AWS API (`PreviousState.Name` and `CurrentState.Name`).

[API Reference](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#startInstances-property)

```js
EC2.startInstance(instanceId)
    .then((status) => {
        console.log(status); // Your code here
    })
    .catch((error) => {
        console.error(error);
    });

/* Return example:
{
    previous: 'stopped',
    current: 'starting'
}
*/
```

### terminateInstance

Receives an `instance id` as a parameter.

Returns a `status` object that contains both the previous and the current statuses of the instance, as returned by the AWS API (`PreviousState.Name` and `CurrentState.Name`).

[API Reference](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#terminateInstances-property)

```js
EC2.terminateInstance(instanceId)
    .then((status) => {
        console.log(status); // Your code here
    })
    .catch((error) => {
        console.error(error);
    });

/* Return example:
{
    previous: 'running',
    current: 'shutting-down'
}
*/
```

## Validation

A number of validation checks are performed before the actual AWS API is called. These might throw custom errors that are provided in the module.

These error types and messages are exposed in `EC2.errors` and are described in greater detail below.

Please check for them in your code, to ensure you are providing the correct arguments to all methods.

```js
{
    NOT_INITIALIZED: 'EC2 not initialized. Please call EC2.init() with a valid region.',
    EMPTY_VALUE: 'Empty argument provided. Please try again with valid arguments.',
    INVALID_REGION: 'Region is invalid. Please try again with a valid region.',
    INVALID_IP: 'IP address is invalid. Please try again with a valid IPv4 address.',
    INVALID_STATUS: 'Status is invalid. Please try again with a valid status.'
}
```

### NOT_INITIALIZED

Is thrown when you attempt to call a method without calling [init](#init) before, with a valid region.

### EMPTY_VALUE

Is thrown when you attempt to call a method with an empty value for a required argument.

### INVALID_REGION

Is thrown when you attempt to call [init](#init) with an invalid region. Check [Valid Regions](#valid-regions) above.

### INVALID_IP

Is thrown when you attempt to call [getInstanceByIp](#getinstancebyip) with an invalid ip (validated by [is-ip](https://www.npmjs.com/package/is-ip)).

### INVALID_STATUS

Is thrown when you attempt to call [getInstancesByStatus](#getinstancesbystatus) with an invalid status.

## Feedback

All bug reports and feature requests are welcome, and should be submitted through one of the following channels:

 - Create a Github issue [here](https://github.com/ricardonunesdev/aws-ec2-wrap/issues)
 - Tweet me at [@ricardonunesdev](https://twitter.com/ricardonunesdev)
 - Chat with me on [Gitter](https://gitter.im/ricardonunesdev/aws-ec2-wrap)
 - Send email to [ricardonunesdev@gmail.com](mailto://ricardonunesdev@gmail.com)

All requests will be created as Github issues, if you don't use that channel.

There are many more AWS API methods that aren't wrapped by this module. I implemented the ones that are most useful to me at the moment. I'll gladly add any that you might require on your project.

## Roadmap

 - Promisify validation and thrown errors
 - Handle valid but non-existing instance ids
 - Improve filtering on the getInstances methods (DRY)
 - Support for handling multiple instances on all methods
 - Separate code into modules
 - Add more methods (volumes, elastic ips, security groups, images, etc)
 - Support for handling large number of instances (above API limit)
 - Provide example for custom error handling
 - Replace most custom errors with AWS API error handling (empty values, invalid names, etc)
 - ~~Information on setting up credentials~~
 - ~~Additional feedback channels~~

## License

MIT © [Ricardo Nunes](https://github.com/ricardonunesdev)
