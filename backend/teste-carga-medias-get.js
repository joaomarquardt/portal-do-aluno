import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

export let mediasDuration = new Trend('medias_duration');
export let mediasSuccessRate = new Rate('medias_success_rate');
export let mediasFailCount = new Counter('medias_fail_count');

const jwtToken = '';
export let options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '3m', target: 200 },
    { duration: '2m', target: 400 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'],
    medias_success_rate: ['rate>0.90'],
  },
  noConnectionReuse: false,
};

const BASE_URL = 'http://localhost:8080';

export default function () {
  const headers = {
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Accept': 'application/json',
    },
  };

  const url = `${BASE_URL}/turmas/media-geral`;

  const start = Date.now();
  const res = http.get(url, headers);
  const duration = Date.now() - start;

  mediasDuration.add(duration);

  const success = check(res, {
    'status 200 para medias': (r) => r.status === 200,
    'retornou JSON valido para medias': (r) => {
      try {
        r.json();
        return true;
      } catch (e) {
        return false;
      }
    },
  });

  mediasSuccessRate.add(success);
  if (!success) mediasFailCount.add(1);

  sleep(Math.random() * 2);
}