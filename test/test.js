'use strict';

const expect = require('chai').expect;

const EC2 = require('../');

describe('Testing AWS EC2 Wrapper', () => {

    describe('Testing EC2.getRegion()', () => {

        it('should return error if EC2 connection hasn\'t been initialized', () => {
            expect(() => { EC2.getRegion() }).to.throw(EC2.errors.NOT_INITIALIZED);
        });

        it('should return the correct region', () => {
            EC2.init('us-west-1');
            let res = EC2.getRegion();
            expect(res).to.be.equal('us-west-1');
        });

    });

});
