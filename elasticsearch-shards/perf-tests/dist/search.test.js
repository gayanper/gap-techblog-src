"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teardown = exports.setup = exports.options = void 0;
const http_1 = __importDefault(require("k6/http"));
const k6_1 = require("k6");
exports.options = {
    vus: 10,
    duration: '30s',
};
const lastNamePrefixes = ['Pe', 'Ge', 'Fri'];
const hireDateRanges = ["1980", "1990", "1995"];
function default_1() {
    const req = JSON.stringify({
        "query": {
            "bool": {
                "must": [
                    {
                        "match_phrase_prefix": {
                            "lastName": randomPick(lastNamePrefixes)
                        }
                    },
                    {
                        "range": {
                            "hireDate": {
                                "gte": randomPick(hireDateRanges)
                            }
                        }
                    }
                ]
            }
        }
    });
    const res = http_1.default.post('http://localhost:9200/employees/_search', req, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    (0, k6_1.check)(res, {
        'is status 200': (r) => r.status === 200
    });
}
exports.default = default_1;
function setup() {
    console.log('Start timestamp: ' + new Date().toISOString());
}
exports.setup = setup;
function teardown() {
    console.log('End timestamp: ' + new Date().toISOString());
}
exports.teardown = teardown;
function randomPick(data) {
    return data[Math.floor(Math.random() * data.length)];
}
