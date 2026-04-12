/**
 * ApiService tests — Singleton Pattern
 *
 * Verifies that:
 *  - Only one instance is ever created (Singleton guarantee).
 *  - HTTP helpers delegate correctly to the underlying Axios client.
 *  - Auth-token and error-normalisation interceptors behave as specified.
 *
 * Design note: The singleton is constructed once when getInstance() is first
 * called.  We capture the interceptor callbacks in `captured` (via vi.hoisted)
 * so that their behaviour can be tested independently of call-count tracking,
 * which would be disrupted by vi.clearAllMocks().
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';

// ── Capture state (must be created before mock factories run) ─────────────────
const captured = vi.hoisted(() => ({
  requestInterceptor:    null,
  responseSuccessHandler: null,
  responseErrorHandler:  null,
  mockGet:  vi.fn(),
  mockPost: vi.fn(),
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request:  {
          use: (fn) => { captured.requestInterceptor = fn; },
        },
        response: {
          use: (ok, err) => {
            captured.responseSuccessHandler = ok;
            captured.responseErrorHandler   = err;
          },
        },
      },
      get:  captured.mockGet,
      post: captured.mockPost,
    })),
  },
}));

import ApiService from './ApiService.js';

// ─────────────────────────────────────────────────────────────────────────────
describe('ApiService — Singleton Pattern', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // ── Singleton guarantee ───────────────────────────────────────────────────
  describe('Singleton guarantee', () => {
    test('getInstance() returns an ApiService instance', () => {
      const instance = ApiService.getInstance('http://localhost:4000');
      expect(instance).toBeInstanceOf(ApiService);
    });

    test('getInstance() returns the same object on repeated calls', () => {
      const a = ApiService.getInstance('http://localhost:4000');
      const b = ApiService.getInstance('http://localhost:4000');
      expect(a).toBe(b);
    });

    test('direct new ApiService() throws when instance already exists', () => {
      ApiService.getInstance('http://localhost:4000');
      expect(() => new ApiService('http://localhost:4000')).toThrow(
        'Use ApiService.getInstance()'
      );
    });
  });

  // ── Configuration ─────────────────────────────────────────────────────────
  describe('Configuration', () => {
    test('getBaseUrl() returns the URL supplied to getInstance()', () => {
      const instance = ApiService.getInstance('http://localhost:4000');
      expect(instance.getBaseUrl()).toBe('http://localhost:4000');
    });
  });

  // ── HTTP helpers ──────────────────────────────────────────────────────────
  describe('HTTP helpers', () => {
    test('get() delegates to the Axios client and unwraps .data', async () => {
      const payload = { success: true, data: [] };
      captured.mockGet.mockResolvedValue({ data: payload });

      const instance = ApiService.getInstance('http://localhost:4000');
      const result   = await instance.get('/api/food/list');

      expect(captured.mockGet).toHaveBeenCalledWith('/api/food/list');
      expect(result).toEqual(payload);
    });

    test('post() delegates to the Axios client and unwraps .data', async () => {
      const payload = { success: true };
      captured.mockPost.mockResolvedValue({ data: payload });

      const instance = ApiService.getInstance('http://localhost:4000');
      const result   = await instance.post('/api/food/remove', { id: '123' });

      expect(captured.mockPost).toHaveBeenCalledWith('/api/food/remove', { id: '123' });
      expect(result).toEqual(payload);
    });

    test('postForm() sends multipart/form-data content-type and unwraps .data', async () => {
      const payload = { success: true };
      captured.mockPost.mockResolvedValue({ data: payload });

      const instance = ApiService.getInstance('http://localhost:4000');
      const fd       = new FormData();
      fd.append('name', 'Pizza');

      const result = await instance.postForm('/api/food/add', fd);

      expect(captured.mockPost).toHaveBeenCalledWith(
        '/api/food/add',
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      expect(result).toEqual(payload);
    });
  });

  // ── Auth-token request interceptor ───────────────────────────────────────
  describe('Auth-token interceptor', () => {
    test('registers a request interceptor (captured.requestInterceptor is set)', () => {
      ApiService.getInstance('http://localhost:4000');
      expect(captured.requestInterceptor).toBeTypeOf('function');
    });

    test('interceptor attaches the stored token to request headers', () => {
      ApiService.getInstance('http://localhost:4000');
      localStorage.setItem('token', 'test-jwt-token');

      const config = { headers: {} };
      const result = captured.requestInterceptor(config);

      expect(result.headers.token).toBe('test-jwt-token');
    });

    test('interceptor leaves headers unchanged when no token is stored', () => {
      ApiService.getInstance('http://localhost:4000');
      // localStorage is cleared in beforeEach, so no token is present.

      const config = { headers: {} };
      const result = captured.requestInterceptor(config);

      expect(result.headers.token).toBeUndefined();
    });

    test('interceptor passes the config object through unchanged (except token)', () => {
      ApiService.getInstance('http://localhost:4000');
      const config = { headers: { 'Content-Type': 'application/json' }, timeout: 5000 };
      const result = captured.requestInterceptor(config);

      expect(result.timeout).toBe(5000);
      expect(result.headers['Content-Type']).toBe('application/json');
    });
  });

  // ── Response error-normalisation interceptor ──────────────────────────────
  describe('Error-normalisation interceptor', () => {
    test('registers a response error handler (captured.responseErrorHandler is set)', () => {
      ApiService.getInstance('http://localhost:4000');
      expect(captured.responseErrorHandler).toBeTypeOf('function');
    });

    test('error handler rejects with the API-provided message', async () => {
      ApiService.getInstance('http://localhost:4000');
      const axiosError = { response: { data: { message: 'Not found' } } };

      await expect(captured.responseErrorHandler(axiosError)).rejects.toThrow('Not found');
    });

    test('error handler falls back to err.message when no response body', async () => {
      ApiService.getInstance('http://localhost:4000');
      const axiosError = { message: 'Network Error' };

      await expect(captured.responseErrorHandler(axiosError)).rejects.toThrow('Network Error');
    });

    test('error handler uses "Network error" when no message is available', async () => {
      ApiService.getInstance('http://localhost:4000');

      await expect(captured.responseErrorHandler({})).rejects.toThrow('Network error');
    });

    test('success handler returns the response unchanged', () => {
      ApiService.getInstance('http://localhost:4000');
      const response = { data: { success: true }, status: 200 };

      expect(captured.responseSuccessHandler(response)).toBe(response);
    });
  });
});
