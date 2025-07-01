import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

export let loginDuration = new Trend('login_duration');
export let loginSuccessRate = new Rate('login_success_rate');

export let options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 100 },
    { duration: '5m', target: 150 },
    { duration: '2m', target: 200 },
    { duration: '3m', target: 0 },
  ],
  thresholds: {
    login_success_rate: ['rate>0.95'],
    login_duration: ['p(95)<500'],
  },
  noConnectionReuse: false,
};

function generateLoginPayload() {
  const userId = Math.floor(Math.random() * 10000);
  return JSON.stringify({
    cpf: '00000000000',
    senha: '123'
  });
}

export default function () {
  let url = 'http://localhost:8080/auth/login';
  let payload = generateLoginPayload();

  let params = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  let start = Date.now();
  let res = http.post(url, payload, params);
  let duration = Date.now() - start;

  loginDuration.add(duration);

  let success = check(res, {
    'login status 200': (r) => r.status === 200,
    'login token present': (r) => r.json('token') !== undefined,
  });

  loginSuccessRate.add(success);

  sleep(Math.random() * 2 + 1);
}
