'use strict';

const expect = require('chai').expect;

const EC2 = require('../');

let tmpInstanceId = null;

describe('AWS EC2 Wrapper', () => {

    describe('EC2.init()', () => {
        it('should return error if not initialized', () => {
            expect(() => { EC2.getRegion(); }).to.throw(EC2.errors.NOT_INITIALIZED);
        });

        it('should return error if empty', () => {
            expect(() => { EC2.init(''); }).to.throw(EC2.errors.EMPTY_VALUE);
        });

        it('should return error if undefined', () => {
            expect(() => { EC2.init(); }).to.throw(EC2.errors.EMPTY_VALUE);
        });

        it('should return error if empty array', () => {
            expect(() => { EC2.init([]); }).to.throw(EC2.errors.EMPTY_VALUE);
        });

        it('should return error if empty object', () => {
            expect(() => { EC2.init({}); }).to.throw(EC2.errors.EMPTY_VALUE);
        });

        it('should return error if invalid region', () => {
            expect(() => { EC2.init('abc'); }).to.throw(EC2.errors.INVALID_REGION);
        });
    });

    describe('EC2.getRegion()', () => {
        it('should return the correct region', () => {
            EC2.init('eu-west-1');
            let res = EC2.getRegion();
            expect(res).to.be.equal('eu-west-1');
        });
    });

    describe('EC2.getAllInstances()', () => {
        it('should return an array of instances', (done) => {
            EC2.init('eu-west-1');
            EC2.getAllInstances()
                .then((instances) => {
                    expect(instances).to.be.an('array');
                    done();
                })
                .catch(done);
        });
    });

    describe('EC2.getInstanceByIpAddress()', () => {
        it('should return error if ip address is empty', () => {
            EC2.init('eu-west-1');
            expect(() => { EC2.getInstanceByIpAddress(''); }).to.throw(EC2.errors.EMPTY_VALUE);
        });

        it('should return error if ip address is invalid', () => {
            EC2.init('eu-west-1');
            expect(() => { EC2.getInstanceByIpAddress('abc'); }).to.throw(EC2.errors.INVALID_IP);
        });

        it('should return an empty object if ip address is 1.2.3.4', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceByIpAddress('1.2.3.4')
                .then((instance) => {
                    expect(instance).to.be.an('object');
                    expect(instance).to.be.empty;
                    done();
                })
                .catch(done);
        });

        it('should return the instance with the correct ip address', (done) => {
            EC2.init('eu-west-1');

            EC2.getInstanceByIpAddress(process.env.IP_ADDRESS)
                .then((instance) => {
                    expect(instance).to.be.an('object');
                    expect(instance).to.not.be.empty;
                    done();
                })
                .catch(done);
        });
    });

    describe('EC2.getInstanceById()', () => {
        it('should return error if instance id is empty', () => {
            EC2.init('eu-west-1');
            expect(() => { EC2.getInstanceById(''); }).to.throw(EC2.errors.EMPTY_VALUE);
        });

        it('should return error if instance id is invalid', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceById('abc')
                .then((instance) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error.code).to.be.equal('InvalidInstanceID.Malformed');
                    done();
                });
        });

        it('should return the instance with a valid instance id', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceById(process.env.INSTANCE_ID)
                .then((instance) => {
                    expect(instance).to.be.an('object');
                    expect(instance).to.not.be.empty;
                    done();
                })
                .catch(done);
        });
    });

    describe('EC2.getInstancesByState()', () => {
        it('should return error if state is empty', () => {
            EC2.init('eu-west-1');
            expect(() => { EC2.getInstancesByState(''); }).to.throw(EC2.errors.EMPTY_VALUE);
        });

        it('should return error if state is invalid', () => {
            EC2.init('eu-west-1');
            expect(() => { EC2.getInstancesByState('abc'); }).to.throw(EC2.errors.INVALID_STATE);
        });

        it('should return an array of running instances', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstancesByState('running')
                .then((instances) => {
                    expect(instances).to.be.an('array');
                    done();
                })
                .catch(done);
        });
    });

    describe('EC2.getInstanceStatus()', () => {
        it('should return error if instance id is empty', () => {
            EC2.init('eu-west-1');
            expect(() => { EC2.getInstanceStatus(''); }).to.throw(EC2.errors.EMPTY_VALUE);
        });

        it('should return error if instance id is invalid', (done) => {
            EC2.init('eu-west-1');
            EC2.getInstanceStatus('abc')
                .then((instance) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error.code).to.be.equal('InvalidInstanceID.Malformed');
                    done();
                });
        });

        it('should return the status of the instance', (done) => {
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

        beforeEach(() => {
            EC2.init('eu-west-1');
        });

        it('should throw an error on invalid image id', (done) => {
            EC2.launchInstance('abc', 't2.micro', process.env.SS_KEY_NAME, process.env.SS_SECURITY_GROUP_ID, 'test')
                .then((instanceId) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error.code).to.be.equal('InvalidAMIID.Malformed');
                    done();
                });
        });

        it('should throw an error on invalid instance type', (done) => {
            EC2.launchInstance('ami-785db401', 'abc', process.env.SS_KEY_NAME, process.env.SS_SECURITY_GROUP_ID, 'test')
                .then((instanceId) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error.code).to.be.equal('InvalidParameterValue');
                    done();
                });
        });

        it('should throw an error on invalid key name', (done) => {
            EC2.launchInstance('ami-785db401', 't2.micro', 'abc', process.env.SS_SECURITY_GROUP_ID, 'test')
                .then((instanceId) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error.code).to.be.equal('InvalidKeyPair.NotFound');
                    done();
                });
        });

        it('should throw an error on invalid security group id', (done) => {
            EC2.launchInstance('ami-785db401', 't2.micro', process.env.SS_KEY_NAME, 'abc', 'test')
                .then((instanceId) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error.code).to.be.equal('InvalidParameterValue');
                    done();
                });
        });

        // it('should launch an instance and return its id', (done) => {
        //     EC2.launchInstance('ami-785db401', 't2.micro', process.env.SS_KEY_NAME, process.env.SS_SECURITY_GROUP_ID, 'test')
        //         .then((instanceId) => {
        //             tmpInstanceId = instanceId;
        //             expect(instanceId).to.be.a('string');
        //             done();
        //         })
        //         .catch(done);
        // });

    });

    describe('EC2.stopInstance()', () => {

        before(() => {
            EC2.init('eu-west-1');
        });

        it('should throw error if instance id is empty', () => {
            expect(() => { EC2.stopInstance(''); }).to.throw(EC2.errors.EMPTY_VALUE);
        });

        it('should throw error if instance id is invalid', (done) => {
            EC2.stopInstance('abc')
                .then((instance) => {
                    done('Expected to fail');
                })
                .catch((error) => {
                    expect(error.code).to.be.equal('InvalidInstanceID.Malformed');
                    done();
                });
        });

        it('should stop the instance and return the status', (done) => {
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

            before(() => {
                EC2.init('eu-west-1');
            });

            it('should throw error if instance id is empty', () => {
                expect(() => { EC2.startInstance(''); }).to.throw(EC2.errors.EMPTY_VALUE);
            });

            it('should throw error if instance id is invalid', (done) => {
                EC2.startInstance('abc')
                    .then((instance) => {
                        done('Expected to fail');
                    })
                    .catch((error) => {
                        expect(error.code).to.be.equal('InvalidInstanceID.Malformed');
                        done();
                    });
            });

            it('should start the instance and return the status', (done) => {
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

});
