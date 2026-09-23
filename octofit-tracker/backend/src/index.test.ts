import assert from 'node:assert/strict';
import test from 'node:test';

import { app, getApiBaseUrl } from './index.js';

test('API exposes the configured resource routes', async () => {
  const server = app.listen(0);

  await new Promise((resolve) => server.once('listening', resolve));

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Expected an address object from the test server');
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;

  const usersResponse = await fetch(`${baseUrl}/api/users/`);
  assert.equal(usersResponse.status, 200);

  const configResponse = await fetch(`${baseUrl}/api/config`);
  assert.equal(configResponse.status, 200);

  const configBody = await configResponse.json();
  assert.equal(configBody.apiBaseUrl, getApiBaseUrl());

  server.close();
});
