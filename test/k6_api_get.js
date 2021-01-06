import http from "k6/http";

import { Rate } from "k6/metrics";

const myFailRate = new Rate("failed requests");

export let options = {
  discardResponseBodies: true,
  scenarios: {
    rps_100: {
      executor: "constant-arrival-rate",
      exec: "getCommentsApi",
      rate: 100,
      timeUnit: "4s",
      duration: "2m",
      preAllocatedVUs: 100,
      maxVUs: 10000,
    },
    rps_500: {
      executor: "constant-arrival-rate",
      exec: "getCommentsApi",
      rate: 500,
      timeUnit: "4s",
      duration: "2m",
      startTime: "2m",
      preAllocatedVUs: 500,
      maxVUs: 10000,
    },
    rps_750: {
      executor: "constant-arrival-rate",
      exec: "getCommentsApi",
      rate: 750,
      timeUnit: "4s",
      duration: "2m",
      startTime: "4m",
      preAllocatedVUs: 750,
      maxVUs: 10000,
    },
    rps_1000: {
      executor: "constant-arrival-rate",
      exec: "getCommentsApi",
      rate: 1000,
      timeUnit: "4s",
      duration: "2m",
      startTime: "6m",
      preAllocatedVUs: 1000,
      maxVUs: 10000,
    },
    rps_1500: {
      executor: "constant-arrival-rate",
      exec: "getCommentsApi",
      rate: 1500,
      timeUnit: "4s",
      duration: "2m",
      startTime: "8m",
      preAllocatedVUs: 1500,
      maxVUs: 10000,
    },
    rps_2000: {
      executor: "constant-arrival-rate",
      exec: "getCommentsApi",
      rate: 2000,
      timeUnit: "4s",
      duration: "2m",
      startTime: "10m",
      preAllocatedVUs: 2000,
      maxVUs: 10000,
    },
    rps_2500: {
      executor: "constant-arrival-rate",
      exec: "getCommentsApi",
      rate: 2500,
      timeUnit: "4s",
      duration: "2m",
      startTime: "12m",
      preAllocatedVUs: 2500,
      maxVUs: 10000,
    },
    rps_3000: {
      executor: "constant-arrival-rate",
      exec: "getCommentsApi",
      rate: 3000,
      timeUnit: "4s",
      duration: "2m",
      startTime: "14m",
      preAllocatedVUs: 3000,
      maxVUs: 10000,
    },
  },
  thresholds: {
    // threshold (custom metric): 1% or less of requests return a 400 response (error / invalid request)
    "failed requests": [{ threshold: "rate<0.1", abortOnFail: true }],
    // requests must finish within 2 seconds on average
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
        threshold: "p(90) < 500",
        abortOnFail: true,
        delayAbortEval: "15s",
      },
      {
        threshold: "p(95) < 800",
        abortOnFail: true,
        delayAbortEval: "15s",
      },
      {
        threshold: "p(99.9) < 2000",
        abortOnFail: true,
        delayAbortEval: "15s",
      },
      {
        threshold: "avg < 700",
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
    "http_req_duration{scenario:rps_2000}": [
      {
        threshold: "avg < 2000",
        abortOnFail: true,
        delayAbortEval: "15s",
      },
    ],
    "http_req_duration{scenario:rps_2500}": [
      {
        threshold: "avg < 2000",
        abortOnFail: true,
        delayAbortEval: "15s",
      },
    ],
    "http_req_duration{scenario:rps_3000}": [
      {
        threshold: "avg < 2000",
        abortOnFail: true,
        delayAbortEval: "15s",
      },
    ],
  },
};

export function getCommentsApi() {
  const commentId = Math.ceil(Math.random() * 1000000) + 99000000;
  const resCommentQuery = http.get(
    `http://localhost:8000/api/comments/${commentId}`
  );
  myFailRate.add(resCommentQuery.status !== 200);

  const userId = Math.ceil(Math.random() * 1000000) + 9000000;
  const resUserQuery = http.get(
    `http://localhost:8000/api/comments?user_id=${userId}`
  );
  myFailRate.add(resUserQuery.status !== 200 && resUserQuery.status !== 404);

  const songId = Math.ceil(Math.random() * 1000000) + 9000000;
  const resSongQuery = http.get(
    `http://localhost:8000/api/comments?song_id=${songId}`
  );
  myFailRate.add(resSongQuery.status !== 200 && resSongQuery.status !== 404);

  const content = encodeURIComponent("Lorem ad aliquip et minim.");
  const resContentQuery = http.get(
    `http://localhost:8000/api/comments?content=${content}`
  );
  myFailRate.add(resContentQuery.status !== 200);
}
