import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

export let cursosDuration = new Trend('cursos_duration');
export let cursosSuccessRate = new Rate('cursos_success_rate');
export let cursosFailCount = new Counter('cursos_fail_count');

const jwtToken = '<preencher token>';

export let options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '3m', target: 200 },
    { duration: '2m', target: 400 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'],
    cursos_success_rate: ['rate>0.90'],
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

  const url = `${BASE_URL}/cursos`;

  const start = Date.now();
  const res = http.get(url, headers);
  const duration = Date.now() - start;

  cursosDuration.add(duration);

  const success = check(res, {
    'status 200': (r) => r.status === 200,
    'retornou array': (r) => Array.isArray(r.json()),
  });

  cursosSuccessRate.add(success);
  if (!success) cursosFailCount.add(1);

  sleep(Math.random() * 2);
}
