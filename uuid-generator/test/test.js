/**
 * Created by UAS on 06.05.2014.
 */

"use strict";

var assert = require('chai').assert;

var genDef = require('../');


describe('Interface', function() {
    it('Test module interface', function() {
        assert.isFunction(genDef, 'Module must provide the constructor-function via require');

        var gen = new genDef();

        assert.property(gen, 'minNodeId', 'minNodeId property is not defined');
        assert.isNumber(gen.minNodeId, 'minNodeId must be a number');
        assert.operator(gen.minNodeId, '>=', 0, 'minNodeId must be greater or equal the 0');

        assert.property(gen, 'maxNodeId', 'maxNodeId property is not defined');
        assert.isNumber(gen.maxNodeId, 'maxNodeId must be a number');
        assert.operator(gen.maxNodeId, '>=', 0, 'maxNodeId must be greater or equal the 0');

        assert.operator(gen.maxNodeId, '>=', gen.minNodeId, 'maxNodeId must be >= minNodeId');

        assert.property(gen, 'init', 'init method is not defined');
        assert.isFunction(gen.init, 'init method is not a function');
        assert.lengthOf(gen.init, 2, 'init method must accept 1 argument');

        assert.property(gen, 'newBigInt', 'newBigInt method is not defined');
        assert.isFunction(gen.newBigInt, 'newBigInt method is not a function');

        assert.property(gen, 'newGuid', 'newGuid method is not defined');
        assert.isFunction(gen.newGuid, 'newGuid method is not a function');
    });
});


describe('Logic', function() {

    var nodeId = 1;

    describe('#init', function() {
        it('Should accept only numbers', function(doneTest) {
            var gen = new genDef();
            gen.init({}, function(err) {
                if (!err) {
                    assert.fail('Init must accept only numbers');
                }
                doneTest();
            });
        });

        it('Should not accept ids < minNodeId', function(doneTest) {
            var gen = new genDef();
            gen.init(gen.minNodeId-1, function(err) {
                if (!err) {
                    assert.fail('Init must not process nodeIds which are < minNodeId');
                }
                doneTest();
            });
        });

        it('Should not accept ids > maxNodeId', function(doneTest) {
            var gen = new genDef();
            gen.init(gen.maxNodeId+1, function(err) {
                if (!err) {
                    assert.fail('Init must not process nodeIds which are > maxNodeId');
                }
                doneTest();
            });
        });

        it('Should work', function(doneTest) {
            var gen = new genDef();
            gen.init(gen.minNodeId, function(err) {
                if (err) {
                    assert.fail('Init failed with valid nodeId');
                }
                doneTest();
            });
        });

        it('Must be called only once', function(doneTest) {
            var gen = new genDef();
            gen.init(gen.minNodeId, function(err) {
                if (err) {
                    doneTest(err);
                } else {
                    gen.init(gen.minNodeId, function(err) {
                        if (!err) {
                            assert.fail('Init must not be called twice');
                        }
                        doneTest();
                    });
                }
            });
        });
    });

    describe('#newBigInt', function() {
        it('Should not be working before call of #init', function(doneTest) {
            var gen = new genDef();
            gen.newBigInt(function(err, result) {
                if (!err) {
                    assert.fail('#newBigInt() must not work if #init did not called');
                }
                doneTest();
            });
        });

        it('Check result', function(doneTest) {
            var gen = new genDef();
            gen.init(gen.minNodeId, function(errInit) {
                if (errInit) {
                    return doneTest(errInit);
                }
                gen.newBigInt(function(err, result) {
                    if (err) {
                        return doneTest(err);
                    }
                    assert.typeOf(result, 'string', 'The result of #newBigInt must be a string');
                    assert.operator(result.length, '>', 0, 'The length of result for #newBigInt must be a greater than 0');
                    doneTest();
                });
            });
        });
    });

    describe.only('#newGuid', function() {
        it('Should not be working before call of #init', function(doneTest) {
            var gen = new genDef();
            gen.newGuid(function(err, result) {
                if (!err) {
                    assert.fail('#newBigInt() must not work if #init did not called');
                }
                doneTest();
            });
        });

        it('Check result', function(doneTest) {
            var gen = new genDef();
            gen.init(gen.minNodeId, function(errInit) {
                if (errInit) {
                    return doneTest(errInit);
                }
                gen.newGuid(function(err, result) {
                    if (err) {
                        return doneTest(err);
                    }
                    assert.typeOf(result, 'string', 'The result of #newGuid must be a string');
                    assert.operator(result.length, '>', 0, 'The length of result for #newGuid must be a greater than 0');
                    doneTest();
                });
            });
        });
    });

});