import http from "k6/http";
import { sleep, check } from "k6";
import reviewsRoute from "./reviewsRoute.js";
import metaRoute from "./metaRoute.js";

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 500,
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 1000,
      maxVUs: 10000,
    },
  },
};

export default function() {
    reviewsRoute();
    metaRoute();

};