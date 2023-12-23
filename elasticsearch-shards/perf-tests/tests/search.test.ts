import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

const lastNamePrefixes = ['Pe', 'Ge', 'Fri']
const hireDateRanges = ["1980", "1990", "1995"]

export default function () {


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

  const res = http.post('http://localhost:9200/employees/_search', req, {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  check(res, {
    'is status 200': (r) => r.status === 200
  });
}

export function setup() {
  console.log('Start timestamp: ' + new Date().toISOString());
}

export function teardown() {
  console.log('End timestamp: ' + new Date().toISOString());
}

function randomPick(data: string[]) {
  return data[Math.floor(Math.random() * data.length)];
}