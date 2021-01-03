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
      maxVUs: 200,
    },
    rps_500: {
      executor: "constant-arrival-rate",
      exec: "getCommentsApi",
      rate: 500,
      timeUnit: "4s",
      duration: "2m",
      startTime: "2m",
      preAllocatedVUs: 500,
      maxVUs: 1000,
    },
    rps_750: {
      executor: "constant-arrival-rate",
      exec: "getCommentsApi",
      rate: 750,
      timeUnit: "4s",
      duration: "2m",
      startTime: "4m",
      preAllocatedVUs: 1000,
      maxVUs: 2000,
    },
    rps_1000: {
      executor: "constant-arrival-rate",
      exec: "getCommentsApi",
      rate: 1000,
      timeUnit: "4s",
      duration: "2m",
      startTime: "6m",
      preAllocatedVUs: 1500,
      maxVUs: 3000,
    },
    rps_1500: {
      executor: "constant-arrival-rate",
      exec: "getCommentsApi",
      rate: 1500,
      timeUnit: "4s",
      duration: "2m",
      startTime: "8m",
      preAllocatedVUs: 2000,
      maxVUs: 5000,
    },
  },
  thresholds: {
    // threshold (custom metric): 2% or less of requests return a 400 response (error / invalid request)
    "failed requests": [{ threshold: "rate<0.02", abortOnFail: true }],
    // threshold broken up by scenarios: 90% of requests must finish within 500ms, 95% within 800, and 99.9% within 1.5s.
    'http_req_duration{scenario:rps_100}': [
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
    'http_req_duration{scenario:rps_500}': [
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
    'http_req_duration{scenario:rps_750}': [
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
    'http_req_duration{scenario:rps_1000}': [
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
    'http_req_duration{scenario:rps_1500}': [
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

export function getCommentsApi() {
  const commentId = Math.ceil(Math.random() * 100000000);
  const resCommentQuery = http.get(
    `http://localhost:8000/api/comments/${commentId}`
  );
  myFailRate.add(resCommentQuery.status !== 200);

  const userId = Math.ceil(Math.random() * 10000000);
  const resUserQuery = http.get(
    `http://localhost:8000/api/comments?user_id=${userId}`
  );
  myFailRate.add(resUserQuery.status !== 200 && resUserQuery.status !== 404);

  const songId = Math.ceil(Math.random() * 10000000);
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