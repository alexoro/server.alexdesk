/**
 * Created by UAS on 06.05.2014.
 */

"use strict";

var assert = require('chai').assert;
var BigNumber = require('bignumber.js');

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

        assert.property(gen, 'overrideGetTimeMillisFunction', 'overrideGetTimeMillisFunction method is not defined');
        assert.isFunction(gen.overrideGetTimeMillisFunction, 'overrideGetTimeMillisFunction method is not a function');
    });
});


describe('Logic', function() {

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

        var split = function(value) {
            var num = new BigNumber(value);
            var numBinary = num.toString(2);
            for (var i = numBinary.length; i < 64; i++) {
                numBinary = '0' + numBinary;
            }

            return [
                numBinary.substr(0, 42),
                numBinary.substr(42, 4),
                numBinary.substr(46, 8),
                numBinary.substr(54)
            ];
        };

        it('Check result', function(doneTest) {
            var gen = new genDef();
            var nodeId = gen.minNodeId;

            gen.overrideGetTimeMillisFunction(function() {
                return 1;
            });

            gen.init(nodeId, function(errInit) {
                if (errInit) {
                    return doneTest(errInit);
                }
                gen.newBigInt(function(err, result) {
                    if (err) {
                        return doneTest(err);
                    }

                    assert.typeOf(result, 'string', 'The result of #newBigInt must be a string');
                    assert.operator(result.length, '>', 0, 'The length of result for #newBigInt must be a greater than 0');
                    assert.operator(result.length, '<=', 19, 'The length of result for #newBigInt must be a lower or equal 19');

                    var num = new BigNumber(result);
                    assert.ok(num.greaterThanOrEqualTo(0), 'Result exceeds the minimal value of 0');
                    assert.ok(num.lessThanOrEqualTo('9223372036854775807', 10), 'Result exceeds the maximum value of 9223372036854775807');

                    var splitted = split(result);

                    var millisBinary = splitted[0];
                    var reservedBinary = splitted[1];
                    var nodeBinary = splitted[2];

                    assert.ok(new BigNumber(millisBinary, 2).comparedTo(1) === 0, 'Bits for millis are not match');
                    assert.strictEqual(reservedBinary, '0000', 'Reserved bits should be 4-length zeroes');
                    assert.ok(new BigNumber(nodeBinary).comparedTo(nodeId) === 0, 'Bits for node are not match');

                    doneTest();
                });
            });
        });

        it('Check result is not passing with invalid millis', function(doneTest) {
            var gen = new genDef();
            var nodeId = gen.minNodeId;

            gen.overrideGetTimeMillisFunction(function() {
                return 9999999999999;
            });

            gen.init(nodeId, function(errInit) {
                if (errInit) {
                    return doneTest(errInit);
                }
                gen.newBigInt(function(err, result) {
                    if (!err) {
                        assert.fail('ID was generated with very large invalid getTime() value ');
                    }
                    doneTest();
                });
            });
        });

        it('Check result is incrementing', function(doneTest) {
            var gen = new genDef();
            var nodeId = gen.minNodeId;

            gen.overrideGetTimeMillisFunction(function() {
                return 1;
            });

            gen.init(nodeId, function(errInit) {
                if (errInit) {
                    return doneTest(errInit);
                }

                gen.newBigInt(function(errFirst, resultFirst) {
                    if (errFirst) {
                        return doneTest(errFirst);
                    }

                    var first = parseInt(split(resultFirst)[3], 2);

                    gen.newBigInt(function(errSecond, resultSecond) {
                        if (errSecond) {
                            return doneTest(errSecond);
                        }

                        var second = parseInt(split(resultSecond)[3], 2);
                        assert.strictEqual(second - first, 1, 'Difference between increments must be equal to 1');
                        doneTest();
                    });
                });
            });
        });

        it('Check increment is switched to 0 after 1026 calls', function(doneTest) {
            var gen = new genDef();
            var nodeId = gen.minNodeId;

            gen.overrideGetTimeMillisFunction(function() {
                return 1;
            });

            gen.init(nodeId, function(errInit) {
                if (errInit) {
                    return doneTest(errInit);
                }

                var i = 0;
                var end = 1026;

                var iterationsFinishCallback = function(result) {
                    var inc = parseInt(split(result)[3], 2);
                    assert.strictEqual(inc, 2, 'After 1026 iterations it is expected that inc will be equal to 1');
                    doneTest();
                };

                var iteration = function() {
                    gen.newBigInt(function(err, result) {
                        if (err) {
                            return doneTest(err);
                        }

                        i++;
                        if (i === end) {
                            iterationsFinishCallback(result);
                        } else {
                            iteration();
                        }
                    });
                };
                iteration();
            });
        });
    });

    describe('#newGuid', function() {
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