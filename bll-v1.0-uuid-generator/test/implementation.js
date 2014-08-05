/**
 * Created by UAS on 06.05.2014.
 */

"use strict";

var assert = require('chai').assert;
var async = require('async');
var BigNumber = require('bignumber.js');

var genDef = require('../');


describe('Implementation', function() {

    describe('#init', function() {
        it('Should accept only numbers as nodeId', function(doneTest) {
            var gen = new genDef();
            gen.init({}, null, function(err) {
                if (!err) {
                    assert.fail('Init must accept only numbers in nodeId');
                }
                doneTest();
            });
        });

        it('Should not accept node ids < minNodeId', function(doneTest) {
            var gen = new genDef();
            gen.init(gen.getMinNodeId()-1, null, function(err) {
                if (!err) {
                    assert.fail('Init must not process nodeIds which are < minNodeId');
                }
                doneTest();
            });
        });

        it('Should not accept node ids > maxNodeId', function(doneTest) {
            var gen = new genDef();
            gen.init(gen.getMaxNodeId()+1, null, function(err) {
                if (!err) {
                    assert.fail('Init must not process nodeIds which are > maxNodeId');
                }
                doneTest();
            });
        });

        it('Must be called only once', function(doneTest) {
            var gen = new genDef();
            gen.init(gen.getMinNodeId(), null, function(err) {
                if (err) {
                    doneTest(err);
                } else {
                    gen.init(gen.getMinNodeId(), null, function(err) {
                        if (!err) {
                            assert.fail('Init must not be called twice');
                        }
                        doneTest();
                    });
                }
            });
        });

        it('Must pass the call', function(doneTest) {
            var gen = new genDef();
            gen.init(gen.getMinNodeId(), null, function(err) {
                if (err) {
                    assert.fail('Init failed with valid nodeId');
                }
                doneTest();
            });
        });
    });

    describe('#newBigInt', function() {
        it('Should not work before call of #init', function(doneTest) {
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

        it('Must produce valid result', function(doneTest) {
            var gen = new genDef();
            var nodeId = gen.getMinNodeId();
            var fnGetMillisSinceEpoch = function(done) {
                done(null, 1);
            };

            gen.init(nodeId, fnGetMillisSinceEpoch, function(errInit) {
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

        it('Must not pass with invalid/very big millis', function(doneTest) {
            var gen = new genDef();
            var nodeId = gen.getMinNodeId();
            var fnGetMillisSinceEpoch = function(done) {
                done(null, 99999999999999999999);
            };

            gen.init(nodeId, fnGetMillisSinceEpoch, function(errInit) {
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

        it('Result must increment', function(doneTest) {
            var gen = new genDef();
            var nodeId = gen.getMinNodeId();
            var fnGetMillisSinceEpoch = function(done) {
                done(null, 1);
            };

            gen.init(nodeId, fnGetMillisSinceEpoch, function(errInit) {
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

        it('Increment must switch to 0 after 1024 calls', function(doneTest) {
            var gen = new genDef();
            var nodeId = gen.getMinNodeId();
            var fnGetMillisSinceEpoch = function(done) {
                done(null, 1);
            };

            gen.init(nodeId, fnGetMillisSinceEpoch, function(errInit) {
                if (errInit) {
                    return doneTest(errInit);
                }

                var i = 0;
                var end = 1026;

                var iterationsFinishCallback = function(result) {
                    var inc = parseInt(split(result)[3], 2);
                    assert.strictEqual(inc, 2, 'After 1026 iterations it is expected that inc will be equal to 2');
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

        it('Increment must works well with many sequential calls', function(doneTest) {
            var gen = new genDef();
            var nodeId = gen.getMinNodeId();
            var fnGetMillisSinceEpoch = function(done) {
                done(null, 1);
            };

            gen.init(nodeId, fnGetMillisSinceEpoch, function(errInit) {
                if (errInit) {
                    return doneTest(errInit);
                }

                var fnStack = [];
                for (var i = 1; i <= 8192; i++) {
                    fnStack.push(function(cb) {
                        gen.newBigInt(cb);
                    });
                }

                async.parallel(
                    fnStack,
                    function(errAsync) {
                        if (errAsync) {
                            assert.fail('Error was raised during many calls of method #newBigInt: ' + errAsync);
                            return doneTest();
                        }

                        // 8193 call
                        gen.newBigInt(function(err, result) {
                            if (err) {
                                return doneTest(err);
                            }
                            var inc = parseInt(split(result)[3], 2);
                            assert.strictEqual(inc, 1, 'After 8193 iterations it is expected that inc will be equal to 1');
                            doneTest();
                        });
                    }
                );
            });
        });

        it('Optional: check #newBigInt for collisions on 1kk calls', function(doneTest) {
            var gen = new genDef();
            var nodeId = gen.getMinNodeId();

            gen.init(nodeId, null, function(errInit) {
                if (errInit) {
                    return doneTest(errInit);
                }

                var e = {};

                var fnStack = [];
                for (var i = 1; i <= 1000000; i++) {
                    fnStack.push(function(cb) {
                        gen.newBigInt(function (err, result) {
                            if (!e[result]) {
                                e[result] = 0;
                            } else {
                                e[result]++;
                            }
                            cb(err);
                        });
                    });
                }

                async.parallel(
                    fnStack,
                    function(errAsync) {
                        if (errAsync) {
                            return doneTest(errAsync);
                        }
                        for (var i in e) {
                            if (e[i] && e[i] > 0) {
                                assert.fail('Collision found for value: ' + i + ' (' + e[i] + ' times)');
                            }
                        }
                        doneTest();
                    }
                );
            });
        });
    });

    describe('#newGuid4', function() {
        it('Must not work before call of #init', function(doneTest) {
            var gen = new genDef();
            gen.newGuid4(function(err, result) {
                if (!err) {
                    assert.fail('#newGuid4() must not work if #init did not called');
                }
                doneTest();
            });
        });

        it('Must return valid result', function(doneTest) {
            var gen = new genDef();
            var nodeId = gen.getMinNodeId();

            gen.init(nodeId, null, function(errInit) {
                if (errInit) {
                    return doneTest(errInit);
                }
                gen.newGuid4(function(err, result) {
                    if (err) {
                        return doneTest(err);
                    }
                    var pattern = new RegExp("^[a-fA-F0-9]{8}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{4}\\-[a-fA-F0-9]{12}$");
                    assert.typeOf(result, 'string', 'The guid4 must be a string');
                    assert.match(result, pattern, 'The guid4 must match the format');
                    doneTest();
                });
            });
        });

        it('Must work well with many sequential calls', function(doneTest) {
            var gen = new genDef();
            var nodeId = gen.getMinNodeId();

            gen.init(nodeId, null, function(errInit) {
                if (errInit) {
                    return doneTest(errInit);
                }

                var fnStack = [];
                for (var i = 1; i <= 8192; i++) {
                    fnStack.push(function(cb) {
                        gen.newGuid4(cb);
                    });
                }

                async.parallel(
                    fnStack,
                    function(errAsync) {
                        if (errAsync) {
                            assert.fail('Error was raised during many calls of method #newGuid4: ' + errAsync);
                        }
                        doneTest();
                    }
                );
            });
        });

        it('Optional: check #newGuid4 for collisions on 1kk calls', function(doneTest) {
            var gen = new genDef();
            var nodeId = gen.getMinNodeId();

            gen.init(nodeId, null, function(errInit) {
                if (errInit) {
                    return doneTest(errInit);
                }

                var e = {};

                var fnStack = [];
                for (var i = 1; i <= 1000000; i++) {
                    fnStack.push(function(cb) {
                        gen.newGuid4(function (err, result) {
                            if (!e[result]) {
                                e[result] = 0;
                            } else {
                                e[result]++;
                            }
                            cb(err);
                        });
                    });
                }

                async.parallel(
                    fnStack,
                    function(errAsync) {
                        if (errAsync) {
                            return doneTest(errAsync);
                        }
                        for (var i in e) {
                            if (e[i] && e[i] > 0) {
                                assert.fail('Collision found for value: ' + i + ' (' + e[i] + ' times)');
                            }
                        }
                        doneTest();
                    }
                );
            });
        });
    });

});