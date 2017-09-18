'use strict';

const expect = require('chai').expect;

const EC2 = require('../');

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

    describe('EC2.getInstanceStatus(instanceId)', () => {
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
            EC2.getInstanceStatus(process.env.INSTANCE_ID)
                .then((instanceStatus) => {
                    expect(instanceStatus).to.be.equal('running');
                    done();
                })
                .catch(done);
        });
    });

});
