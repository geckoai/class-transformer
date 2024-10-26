"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
var Utils = (function () {
    function Utils() {
    }
    Utils.objectKeys = function (obj) {
        var keys = [];
        return keys.concat(Object.getOwnPropertyNames(obj), Object.getOwnPropertySymbols(obj));
    };
    Utils.toJSON = function (value) {
        if (Array.isArray(value)) {
            return JSON.stringify(value);
        }
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
        }
        return undefined;
    };
    Utils.toRegexp = function (value) {
        if (value instanceof RegExp) {
            return value;
        }
        if (typeof value === 'string' ||
            typeof value === 'number' ||
            value instanceof String ||
            value instanceof Number) {
            return new RegExp(value.toString());
        }
    };
    Utils.toSymbol = function (value) {
        if (typeof value === 'string' ||
            typeof value === 'undefined' ||
            typeof value === 'number') {
            return Symbol(value);
        }
    };
    Utils.objectToMap = function (value) {
        var map = new Map();
        Object.keys(value).forEach(function (key) {
            map.set(key, value[key]);
        });
        return map;
    };
    Utils.arrayToSet = function (values) {
        return new Set(values);
    };
    Utils.setToArray = function (values) {
        return Array.from(values);
    };
    Utils.stringToNumber = function (values) {
        return Number(values);
    };
    Utils.numberToString = function (values) {
        return String(values);
    };
    Utils.stringToDate = function (values) {
        return new Date(values);
    };
    Utils.numberToDate = function (values) {
        return new Date(values);
    };
    Utils.where = function (wheres, value) {
        return (typeof value === 'object' &&
            value !== null &&
            wheres.some(function (where) {
                return Utils.objectKeys(where).every(function (key) {
                    return value[key] === where[key];
                });
            }));
    };
    Utils.toNumber = function (value, strict) {
        if (strict === void 0) { strict = false; }
        if (typeof value === 'number') {
            return value;
        }
        if (value instanceof Number) {
            return Number(value);
        }
        if (/^[0-9]+(\.?[0-9]+)?$/.test(value) ||
            /^0x[a-fA-F0-9]+?$/i.test(value)) {
            return Number(value);
        }
        if (value === undefined || value === null) {
            if (strict) {
                return NaN;
            }
            return value;
        }
    };
    Utils.toBoolean = function (value, strict) {
        if (strict === void 0) { strict = false; }
        if (/^true$/.test(value)) {
            return true;
        }
        if (/^false$/.test(value)) {
            return false;
        }
        if (value === null || value === undefined) {
            if (!strict) {
                return value;
            }
        }
        return Boolean(value);
    };
    Utils.toString = function (value, strict) {
        if (strict === void 0) { strict = false; }
        if (typeof value === 'string') {
            return value;
        }
        if (value instanceof String) {
            return value.toString();
        }
        if (value === null || value === undefined) {
            if (strict) {
                return '';
            }
            return value;
        }
        return String(value);
    };
    Utils.toDate = function (value, strict) {
        if (strict === void 0) { strict = false; }
        if (typeof value === 'string' ||
            typeof value === 'number' ||
            value instanceof String ||
            value instanceof Number) {
            return new Date(value.toString());
        }
        if (value === undefined || value === null) {
            if (strict) {
                return new Date('');
            }
            return value;
        }
    };
    Utils.toFunction = function (value) {
        if (typeof value === 'function') {
            return value;
        }
    };
    Utils.toURL = function (value) {
        if (typeof value === 'string') {
            return new URL(value);
        }
        else if (value instanceof URL) {
            return value;
        }
    };
    Utils.isPromise = function (value) {
        if (value instanceof Promise) {
            return true;
        }
        return (typeof value === 'object' &&
            typeof value.then === 'function' &&
            typeof value.catch === 'function' &&
            typeof value.finally === 'function');
    };
    return Utils;
}());
exports.Utils = Utils;
