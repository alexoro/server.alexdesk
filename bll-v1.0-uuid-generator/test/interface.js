/**
 * Created by UAS on 06.05.2014.
 */

"use strict";

var assert = require('chai').assert;

var genDef = require('../');


describe('Interface', function() {
    it('Test interface', function() {
        assert.isFunction(genDef, 'Module must provide the constructor-function via require');

        var gen = new genDef();

        assert.isFunction(gen.getMinNodeId, '#getMinNodeId is not defined');
        assert.operator(gen.getMinNodeId(), '>=', 0, '#getMinNodeId must return number greater or equal the 0');

        assert.isFunction(gen.getMaxNodeId, '#getMaxNodeId is not defined');
        assert.operator(gen.getMaxNodeId(), '>=', 0, '#getMaxNodeId must return number less or equal to the 255');

        assert.operator(gen.getMinNodeId(), '<=', gen.getMaxNodeId(), '#getMinNodeId must be <= #getMaxNodeId');

        assert.isFunction(gen.init, 'init method is not a function');
        assert.lengthOf(gen.init, 3, 'init method must accept 3 arguments');

        assert.property(gen, 'newBigInt', 'newBigInt method is not defined');
        assert.isFunction(gen.newBigInt, 'newBigInt method is not a function');

        assert.property(gen, 'newGuid4', 'newGuid4 method is not defined');
        assert.isFunction(gen.newGuid4, 'newGuid4 method is not a function');
    });
});