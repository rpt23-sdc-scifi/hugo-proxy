import http from "k6/http";

import { Rate } from "k6/metrics";

const myFailRate = new Rate("failed requests");
const maxSongLength = 480; // in seconds

export let options = {
  discardResponseBodies: true,
  scenarios: {
    rps_100: {
      executor: "constant-arrival-rate",
      exec: "postCommentsApi",
      rate: 100,
      timeUnit: "1s",
      duration: "30s",
      preAllocatedVUs: 200,
      maxVUs: 500,
    },
    rps_500: {
      executor: "constant-arrival-rate",
      exec: "postCommentsApi",
      rate: 500,
      timeUnit: "1s",
      duration: "30s",
      startTime: "30s",
      preAllocatedVUs: 1000,
      maxVUs: 2000,
    },
    rps_750: {
      executor: "constant-arrival-rate",
      exec: "postCommentsApi",
      rate: 750,
      timeUnit: "1s",
      duration: "30s",
      startTime: "1m",
      preAllocatedVUs: 1500,
      maxVUs: 3000,
    },
    rps_1000: {
      executor: "constant-arrival-rate",
      exec: "postCommentsApi",
      rate: 1000,
      timeUnit: "1s",
      duration: "30s",
      startTime: "1m30s",
      preAllocatedVUs: 2000,
      maxVUs: 4000,
    },
    rps_1500: {
      executor: "constant-arrival-rate",
      exec: "postCommentsApi",
      rate: 1500,
      timeUnit: "1s",
      duration: "30s",
      startTime: "2m",
      preAllocatedVUs: 3000,
      maxVUs: 5000,
    },
  },
  thresholds: {
    // threshold (custom metric): 2% or less of requests return a 400 response (error / invalid request)
    "failed requests": [{ threshold: "rate<0.02", abortOnFail: true }],
    // threshold broken up by scenarios: 90% of requests must finish within 500ms, 95% within 800, and 99.9% within 1.5s.
    "http_req_duration{scenario:rps_100}": [
      {
        threshold: "p(90) < 500",
        // abortOnFail: true,
      },
      {
        threshold: "p(95) < 800",
        // abortOnFail: true,
      },
      {
        threshold: "p(99.9) < 2000",
        // abortOnFail: true,
      },
      {
        threshold: "avg < 700",
        // abortOnFail: true,
      },
    ],
    "http_req_duration{scenario:rps_500}": [
      {
        threshold: "p(90) < 500",
        // abortOnFail: true,
      },
      {
        threshold: "p(95) < 800",
        // abortOnFail: true,
      },
      {
        threshold: "p(99.9) < 2000",
        // abortOnFail: true,
      },
      {
        threshold: "avg < 700",
        // abortOnFail: true,
      },
    ],
    "http_req_duration{scenario:rps_750}": [
      {
        threshold: "p(90) < 500",
        // abortOnFail: true,
      },
      {
        threshold: "p(95) < 800",
        // abortOnFail: true,
      },
      {
        threshold: "p(99.9) < 2000",
        // abortOnFail: true,
      },
      {
        threshold: "avg < 700",
        // abortOnFail: true,
      },
    ],
    "http_req_duration{scenario:rps_1000}": [
      {
        threshold: "p(90) < 500",
        // abortOnFail: true,
      },
      {
        threshold: "p(95) < 800",
        // abortOnFail: true,
      },
      {
        threshold: "p(99.9) < 2000",
        // abortOnFail: true,
      },
      {
        threshold: "avg < 700",
        // abortOnFail: true,
      },
    ],
    "http_req_duration{scenario:rps_1500}": [
      {
        threshold: "p(90) < 500",
        // abortOnFail: true,
      },
      {
        threshold: "p(95) < 800",
        // abortOnFail: true,
      },
      {
        threshold: "p(99.9) < 2000",
        // abortOnFail: true,
      },
      {
        threshold: "avg < 700",
        // abortOnFail: true,
      },
    ],
  },
};

export function postCommentsApi() {
  const url = "http://localhost:8000/api/comments";
  let headers = { "Content-Type": "application/json" };
  let data = {
    user_id: Math.ceil(Math.random() * 10000000),
    song_id: Math.ceil(Math.random() * 10000000),
    content: "k6 placeholder text",
    time_stamp: Math.floor(Math.random() * maxSongLength),
  };

  let res = http.post(url, JSON.stringify(data), { headers: headers });
  myFailRate.add(res.status !== 201);
}
