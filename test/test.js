'use strict';

const expect = require('chai').expect;

const EC2 = require('../');

describe('AWS EC2 Wrapper', () => {

    describe('EC2 connection and EC2.getRegion()', () => {
        it('should return error if EC2 connection hasn\'t been initialized', () => {
            expect(() => { EC2.getRegion(); }).to.throw(EC2.errors.NOT_INITIALIZED);
        });

        it('should return error if trying to set an invalid EC2 region', () => {
            expect(() => { EC2.init('abc'); }).to.throw(EC2.errors.INVALID_REGION);
        });

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
        it('should return error if ip address is invalid', () => {
            EC2.init('eu-west-1');
            expect(() => { EC2.getInstanceByIpAddress('1.2.3'); }).to.throw(EC2.errors.INVALID_IP);
        });

        it('should return an empty object', (done) => {
            EC2.init('eu-west-1');

            EC2.getInstanceByIpAddress('1.2.3.4')
                .then((instance) => {
                    expect(instance).to.be.an('object');
                    expect(instance).to.be.empty;
                    done();
                })
                .catch(done);
        });

        it('should return the instance', (done) => {
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

    describe('EC2.getInstanceByInstanceId()', () => {
        it('should return the instance', (done) => {
            EC2.init('eu-west-1');

            EC2.getInstanceByInstanceId('')
                .then((instance) => {
                    expect(instance).to.be.an('object');
                    expect(instance).to.be.empty;
                    done();
                })
                .catch(done);
        });

        it('should return the instance', (done) => {
            EC2.init('eu-west-1');

            EC2.getInstanceByInstanceId(process.env.INSTANCE_ID)
                .then((instance) => {
                    expect(instance).to.be.an('object');
                    expect(instance).to.not.be.empty;
                    done();
                })
                .catch(done);
        });
    });

});
