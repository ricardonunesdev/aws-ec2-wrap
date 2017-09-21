'use strict';

const expect = require('chai').expect;

const EC2 = require('../');

let tmpInstanceId = null;
let tmpIpAddress = null;

describe('AWS EC2 Wrapper', () => {

    describe('EC2.init()', () => {
        beforeEach(() => { EC2.close(); });

        it('should return error if not initialized (custom error)', () => {
            expect(() => { EC2.getRegion(); }).to.throw(EC2.errors.NOT_INITIALIZED);
        });

        it('should return error if empty (custom error)', () => {
            expect(() => { EC2.init(''); }).to.throw(EC2.errors.EMPTY_VALUE);
        });

        it('should return error if undefined (custom error)', () => {
            expect(() => { EC2.init(); }).to.throw(EC2.errors.EMPTY_VALUE);
        });

        it('should return error if empty array (custom error)', () => {
            expect(() => { EC2.init([]); }).to.throw(EC2.errors.EMPTY_VALUE);
        });

        it('should return error if empty object (custom error)', () => {
            expect(() => { EC2.init({}); }).to.throw(EC2.errors.EMPTY_VALUE);
        });

        it('should return error if invalid region (custom error)', () => {
            expect(() => { EC2.init('abc'); }).to.throw(EC2.errors.INVALID_REGION);
        });

        it('should create an EC2 connection (success)', () => {
            EC2.init('eu-west-1');
        });
    });

    // -------------------------------------------------- //

    describe('EC2.getRegion()', () => {
        beforeEach(() => { EC2.close(); });

        it('should return error if not initialized (custom error)', () => {
            expect(() => { EC2.getRegion(); }).to.throw(EC2.errors.NOT_INITIALIZED);
        });

        it('should return the correct region (success)', () => {
            EC2.init('eu-west-1');
            let res = EC2.getRegion();
            expect(res).to.be.a('string');
            expect(res).to.be.equal('eu-west-1');
        });
    });

    // -------------------------------------------------- //

    describe('EC2.getAllInstances()', () => {
        beforeEach(() => { EC2.close(); });

        it('should return error if not initialized (custom error)', (done) => {
            EC2.getAllInstances()
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.NOT_INITIALIZED);
                    done();
                });
        });

        it('should return an array of instances (success)', (done) => {
            EC2.init('eu-west-1');
            EC2.getAllInstances()
                .then((instances) => {
                    expect(instances).to.be.an('array');
                    done();
                })
                .catch(done);
        });
    });

    // -------------------------------------------------- //

    describe('EC2.getInstancesByStatus()', () => {
        beforeEach(() => { EC2.close(); });

        it('should return error if not initialized (custom error)', (done) => {
            EC2.getInstancesByStatus()
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.NOT_INITIALIZED);
                    done();
                });
        });

        it('should return error if status is empty (custom error)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstancesByStatus('')
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.EMPTY_VALUE);
                    done();
                });
        });

        it('should return error if status is invalid (custom error)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstancesByStatus('abc')
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.INVALID_STATUS);
                    done();
                });
        });

        it('should return an array of running instances (success)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstancesByStatus('running')
                .then((instances) => {
                    expect(instances).to.be.an('array');
                    done();
                })
                .catch(done);
        });
    });

    // -------------------------------------------------- //

    describe('EC2.getInstanceById()', () => {
        beforeEach(() => { EC2.close(); });

        it('should return error if not initialized (custom error)', (done) => {
            EC2.getInstanceById()
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.NOT_INITIALIZED);
                    done();
                });
        });

        it('should return error if instance id is empty (custom error)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceById('')
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.EMPTY_VALUE);
                    done();
                });
        });

        it('should return error if instance id is invalid (aws error)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceById('abc')
                .then((instance) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('code');
                    expect(error.code).to.be.equal('InvalidInstanceID.Malformed');
                    done();
                });
        });

        it('should return the instance with a valid instance id (success)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceById(process.env.TEST_INSTANCE_ID_1)
                .then((instance) => {
                    expect(instance).to.be.an('object');
                    expect(instance).to.not.be.empty;
                    done();
                })
                .catch(done);
        });
    });

    // -------------------------------------------------- //

    describe('EC2.getInstanceIpAddress()', () => {
        beforeEach(() => { EC2.close(); });

        it('should return error if not initialized (custom error)', (done) => {
            EC2.getInstanceIpAddress()
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.NOT_INITIALIZED);
                    done();
                });
        });

        it('should return error if instance id is empty (custom error)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceIpAddress('')
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.EMPTY_VALUE);
                    done();
                });
        });

        it('should return error if instance id is invalid (aws error)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceIpAddress('abc')
                .then((instance) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('code');
                    expect(error.code).to.be.equal('InvalidInstanceID.Malformed');
                    done();
                });
        });

        it('should return the ip address of the instance (custom error)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceIpAddress(process.env.TEST_INSTANCE_ID_1)
                .then((ipAddress) => {
                    tmpIpAddress = ipAddress;
                    expect(ipAddress).to.be.a('string');
                    done();
                })
                .catch(done);
        });
    });

    // -------------------------------------------------- //

    describe('EC2.getInstanceByIpAddress()', () => {
        beforeEach(() => { EC2.close(); });

        it('should return error if not initialized (custom error)', (done) => {
            EC2.getInstanceByIpAddress()
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.NOT_INITIALIZED);
                    done();
                });
        });

        it('should return error if ip address is empty (custom error)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceByIpAddress('')
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.EMPTY_VALUE);
                    done();
                });
        });

        it('should return error if ip address is invalid (custom error)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceByIpAddress('abc')
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.INVALID_IP);
                    done();
                });
        });

        it('should return an empty object if ip address is 1.2.3.4 (success - empty)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceByIpAddress('1.2.3.4')
                .then((instance) => {
                    expect(instance).to.be.an('object');
                    expect(instance).to.be.empty;
                    done();
                })
                .catch(done);
        });

        it('should return the instance with the correct ip address (success)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceByIpAddress(tmpIpAddress)
                .then((instance) => {
                    expect(instance).to.be.an('object');
                    expect(instance).to.not.be.empty;
                    done();
                })
                .catch(done);
        });
    });

    describe('EC2.getInstanceStatus()', () => {
        beforeEach(() => { EC2.close(); });

        it('should return error if not initialized (custom error)', (done) => {
            EC2.getInstanceStatus()
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.NOT_INITIALIZED);
                    done();
                });
        });

        it('should return error if instance id is empty (custom error)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceStatus('')
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.EMPTY_VALUE);
                    done();
                });
        });

        it('should return error if instance id is invalid (aws error)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceStatus('abc')
                .then((instance) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('code');
                    expect(error.code).to.be.equal('InvalidInstanceID.Malformed');
                    done();
                });
        });

        it('should return the status of the instance (success)', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceStatus(process.env.TEST_INSTANCE_ID_1)
                .then((instanceStatus) => {
                    expect(instanceStatus).to.be.a('string');
                    done();
                })
                .catch(done);
        });
    });

    describe('EC2.launchInstance()', () => {
        beforeEach(() => { EC2.close(); });

        it('should return error if not initialized (custom error)', (done) => {
            EC2.launchInstance()
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.NOT_INITIALIZED);
                    done();
                });
        });

        it('should throw an error on invalid image id (aws error)', (done) => {
            EC2.init('eu-west-1');
            EC2.launchInstance('abc', 't2.micro', process.env.SS_KEY_NAME, process.env.SS_SECURITY_GROUP_ID, 'test')
                .then((instanceId) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('code');
                    expect(error.code).to.be.equal('InvalidAMIID.Malformed');
                    done();
                });
        });

        it('should throw an error on invalid instance type (aws error)', (done) => {
            EC2.init('eu-west-1');
            EC2.launchInstance('ami-785db401', 'abc', process.env.SS_KEY_NAME, process.env.SS_SECURITY_GROUP_ID, 'test')
                .then((instanceId) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('code');
                    expect(error.code).to.be.equal('InvalidParameterValue');
                    done();
                });
        });

        it('should throw an error on invalid key name (aws error)', (done) => {
            EC2.init('eu-west-1');
            EC2.launchInstance('ami-785db401', 't2.micro', 'abc', process.env.SS_SECURITY_GROUP_ID, 'test')
                .then((instanceId) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('code');
                    expect(error.code).to.be.equal('InvalidKeyPair.NotFound');
                    done();
                });
        });

        it('should throw an error on invalid security group id (aws error)', (done) => {
            EC2.init('eu-west-1');
            EC2.launchInstance('ami-785db401', 't2.micro', process.env.SS_KEY_NAME, 'abc', 'test')
                .then((instanceId) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('code');
                    expect(error.code).to.be.equal('InvalidParameterValue');
                    done();
                });
        });

        it('should launch an instance and return its id (success)', (done) => {
            EC2.init('eu-west-1');
            EC2.launchInstance('ami-785db401', 't2.micro', process.env.SS_KEY_NAME, process.env.SS_SECURITY_GROUP_ID, 'test')
                .then((instanceId) => {
                    tmpInstanceId = instanceId;
                    expect(instanceId).to.be.a('string');
                    done();
                })
                .catch(done);
        });
    });

    describe('EC2.stopInstance()', () => {
        beforeEach(() => { EC2.close(); });

        it('should return error if not initialized (custom error)', (done) => {
            EC2.stopInstance()
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.NOT_INITIALIZED);
                    done();
                });
        });

        it('should throw error if instance id is empty (custom error)', (done) => {
            EC2.init('eu-west-1');
            EC2.stopInstance('')
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.EMPTY_VALUE);
                    done();
                });
        });

        it('should throw error if instance id is invalid (aws error)', (done) => {
            EC2.init('eu-west-1');
            EC2.stopInstance('abc')
                .then((instance) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('code');
                    expect(error.code).to.be.equal('InvalidInstanceID.Malformed');
                    done();
                });
        });

        it('should stop the instance and return the status (success)', (done) => {
            EC2.init('eu-west-1');
            EC2.stopInstance(process.env.TEST_INSTANCE_ID_2)
                .then((instanceStatus) => {
                    expect(instanceStatus).to.be.an('object');
                    expect(instanceStatus).to.have.property('previous');
                    expect(instanceStatus.previous).to.be.a('string');
                    expect(instanceStatus).to.have.property('current');
                    expect(instanceStatus.current).to.be.a('string');
                    done();
                })
                .catch(done);
        });
    });

    describe('EC2.startInstance()', () => {
        beforeEach(() => { EC2.close(); });

        it('should return error if not initialized (custom error)', (done) => {
            EC2.startInstance()
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.NOT_INITIALIZED);
                    done();
                });
        });

        it('should throw error if instance id is empty (custom error)', (done) => {
            EC2.init('eu-west-1');
            EC2.startInstance('')
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.EMPTY_VALUE);
                    done();
                });
        });

        it('should throw error if instance id is invalid (aws error)', (done) => {
            EC2.init('eu-west-1');
            EC2.startInstance('abc')
                .then((instance) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('code');
                    expect(error.code).to.be.equal('InvalidInstanceID.Malformed');
                    done();
                });
        });

        it('should start the instance and return the status (success)', (done) => {
            EC2.init('eu-west-1');
            EC2.startInstance(process.env.TEST_INSTANCE_ID_1)
                .then((instanceStatus) => {
                    expect(instanceStatus).to.be.an('object');
                    expect(instanceStatus).to.have.property('previous');
                    expect(instanceStatus.previous).to.be.a('string');
                    expect(instanceStatus).to.have.property('current');
                    expect(instanceStatus.current).to.be.a('string');
                    done();
                })
                .catch(done);
        });
    });

    describe('EC2.terminateInstance()', () => {
        beforeEach(() => { EC2.close(); });

        it('should return error if not initialized (custom error)', (done) => {
            EC2.terminateInstance()
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.NOT_INITIALIZED);
                    done();
                });
        });

        it('should throw error if instance id is empty', (done) => {
            EC2.init('eu-west-1');
            EC2.terminateInstance('')
                .then((res) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('message');
                    expect(error.message).to.be.equal(EC2.errors.EMPTY_VALUE);
                    done();
                });
        });

        it('should throw error if instance id is invalid (aws error)', (done) => {
            EC2.init('eu-west-1');
            EC2.terminateInstance('abc')
                .then((instance) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error).to.be.an('error');
                    expect(error).to.have.property('code');
                    expect(error.code).to.be.equal('InvalidInstanceID.Malformed');
                    done();
                });
        });

        it('should terminate the instance and return the status (success)', (done) => {
            EC2.init('eu-west-1');
            EC2.terminateInstance(tmpInstanceId)
                .then((instanceStatus) => {
                    expect(instanceStatus).to.be.an('object');
                    expect(instanceStatus).to.have.property('previous');
                    expect(instanceStatus.previous).to.be.a('string');
                    expect(instanceStatus).to.have.property('current');
                    expect(instanceStatus.current).to.be.a('string');
                    done();
                })
                .catch(done);
        });
    });

});
