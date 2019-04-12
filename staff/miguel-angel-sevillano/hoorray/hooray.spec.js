'use strict';

describe('hooray', function () {
    describe('constructor', function () {
        true && it('should construct an empty hooray when no arguments', function () {
            var hooray = new Hooray;

            expect(hooray.length).toBe(0);
            expect(Object.keys(hooray).length).toBe(1);
        });

        true && it('should construct a non-empty hooray when existing arguments', function () {
            var hooray = new Hooray(1, 2, 3);

            expect(hooray.length).toBe(3);
            expect(JSON.stringify(hooray)).toBe(JSON.stringify({ 0: 1, 1: 2, 2: 3, length: 3 }));
            expect(Object.keys(hooray).length).toBe(4);
        });

        true && it('should construct an empty hooray with length equal to when only one numeric argument', function () {
            var hooray = new Hooray(1);

            expect(hooray.length).toBe(1);
            expect(Object.keys(hooray).length).toBe(1);
        });

        true && it('should construct a non-empty hooray with only one non-numeric argument', function () {
            var hooray = new Hooray('1');

            expect(hooray.length).toBe(1);
            expect(JSON.stringify(hooray)).toBe(JSON.stringify({ 0: '1', length: 1 }));
            expect(Object.keys(hooray).length).toBe(2);
        });
    });

    describe('push', function () {
        true && it('should add a value at the end of an hooray', function () {
            var hooray = new Hooray(1, 2, 3);

            var length = hooray.push(4);

            expect(hooray.length).toBe(4);
            expect(length).toBe(hooray.length);
            expect(JSON.stringify(hooray)).toBe(JSON.stringify({ 0: 1, 1: 2, 2: 3, 3: 4, length: 4 }));
        });

        true && it('should add multiple values at the end of an hooray in order', function () {
            var hooray = new Hooray(1, 2, 3);

            var length = hooray.push(4, 5);

            expect(hooray.length).toBe(5);
            expect(length).toBe(hooray.length);
            expect(JSON.stringify(hooray)).toBe(JSON.stringify({ 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, length: 5 }));
        });

        true && it('should not add a non-provided value at the end of an hooray', function () {
            var hooray = new Hooray(1, 2, 3);

            var length = hooray.push();

            expect(hooray.length).toBe(3);
            expect(length).toBe(hooray.length);
            expect(JSON.stringify(hooray)).toBe(JSON.stringify({ 0: 1, 1: 2, 2: 3, length: 3 }));
        });
    });

    describe('forEach', function () {
        true && it('should itearate an hooray without altering it', function () {
            var hooray = new Hooray(1, 2, 3);

            var result = new Hooray;

            hooray.forEach(function (v, i) { result.push(v); });
            // 0 1
            // 1 2
            // 2 3

            expect(JSON.stringify(result)).toBe(JSON.stringify(hooray));

            var expected = JSON.stringify({ 0: 1, 1: 2, 2: 3, length: 3 });

            expect(JSON.stringify(hooray)).toBe(expected);
        });

        true && it('should do nothing if hooray has not content', function () {
            var hooray = new Hooray;

            var result = new Hooray;

            hooray.forEach(function (v, i) { result.push(v); });

            expect(result.length).toBe(0);
        });

        true && it('should break on undefined callback', function () {
            var hooray = new Hooray(1, 2, 3);

           expect(function(){hooray.forEach()}).toThrowError();
            
        });
    });
});
