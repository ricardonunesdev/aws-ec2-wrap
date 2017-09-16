'use strict';

const expect = require('chai').expect;

const EC2 = require('../');

describe('Testing AWS EC2 Wrapper', () => {

    describe('Testing EC2.getRegion()', () => {

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

    describe('Testing EC2.getAllInstances()', () => {

        it('should return a list of instances', (done) => {
            EC2.init('eu-west-1');

            EC2.getAllInstances()
                .then((instances) => {
                    expect(instances).to.be.an('array');
                    done();
                })
                .catch(done);
        });

    });

});
