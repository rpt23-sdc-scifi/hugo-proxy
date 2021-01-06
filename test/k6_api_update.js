import http from "k6/http";

import { Rate } from "k6/metrics";

const myFailRate = new Rate("failed requests");
const maxSongLength = 480; // in seconds

export let options = {
  discardResponseBodies: true,
  scenarios: {
    rps_50: {
      executor: "constant-arrival-rate",
      exec: "updateCommentsApi",
      rate: 50,
      timeUnit: "1s",
      duration: "2m",
      preAllocatedVUs: 50,
      maxVUs: 10000,
    },
    rps_100: {
      executor: "constant-arrival-rate",
      exec: "updateCommentsApi",
      rate: 100,
      timeUnit: "1s",
      duration: "2m",
      startTime: "2m",
      preAllocatedVUs: 100,
      maxVUs: 10000,
    },
    rps_500: {
      executor: "constant-arrival-rate",
      exec: "updateCommentsApi",
      rate: 500,
      timeUnit: "1s",
      duration: "2m",
      startTime: "4m",
      preAllocatedVUs: 500,
      maxVUs: 10000,
    },
    rps_750: {
      executor: "constant-arrival-rate",
      exec: "updateCommentsApi",
      rate: 750,
      timeUnit: "1s",
      duration: "2m",
      startTime: "6m",
      preAllocatedVUs: 1000,
      maxVUs: 10000,
    },
    rps_1000: {
      executor: "constant-arrival-rate",
      exec: "updateCommentsApi",
      rate: 1000,
      timeUnit: "1s",
      duration: "2m",
      startTime: "8m",
      preAllocatedVUs: 1500,
      maxVUs: 10000,
    },
    rps_1500: {
      executor: "constant-arrival-rate",
      exec: "updateCommentsApi",
      rate: 1500,
      timeUnit: "1s",
      duration: "2m",
      startTime: "10m",
      preAllocatedVUs: 2000,
      maxVUs: 10000,
    },
  },
  thresholds: {
    // threshold (custom metric): 1% or less of requests return a 400 response (error / invalid request)
    "failed requests": [{ threshold: "rate<0.1", abortOnFail: true }],
    // requests must finish within 2 seconds on average
    "http_req_duration{scenario:rps_50}": [
      {
        threshold: "avg < 2000",
        abortOnFail: true,
        delayAbortEval: "15s",
      },
    ],
    "http_req_duration{scenario:rps_100}": [
      {
        threshold: "avg < 2000",
        abortOnFail: true,
        delayAbortEval: "15s",
      },
    ],
    "http_req_duration{scenario:rps_500}": [
      {
        threshold: "avg < 2000",
        abortOnFail: true,
        delayAbortEval: "15s",
      },
    ],
    "http_req_duration{scenario:rps_750}": [
      {
        threshold: "avg < 2000",
        abortOnFail: true,
        delayAbortEval: "15s",
      },
    ],
    "http_req_duration{scenario:rps_1000}": [
      {
        threshold: "avg < 2000",
        abortOnFail: true,
        delayAbortEval: "15s",
      },
    ],
    "http_req_duration{scenario:rps_1500}": [
      {
        threshold: "avg < 2000",
        abortOnFail: true,
        delayAbortEval: "15s",
      },
    ],
  },
};

export function updateCommentsApi() {
  const commentId = Math.ceil(Math.random() * 100000000);
  const url = `http://localhost:8000/api/comments/${commentId}`;
  let headers = { "Content-Type": "application/json" };
  let data = {
    user_id: Math.ceil(Math.random() * 10000000),
    song_id: Math.ceil(Math.random() * 10000000),
    content: "k6 placeholder text",
    time_stamp: Math.floor(Math.random() * maxSongLength),
  };

  let res = http.patch(url, JSON.stringify(data), { headers: headers });
  myFailRate.add(res.status !== 200);
}
