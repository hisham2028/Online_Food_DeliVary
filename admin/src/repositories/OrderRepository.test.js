/**
 * OrderRepository tests — Repository Pattern
 *
 * Verifies that OrderRepository:
 *  - Abstracts all order-related API calls behind a stable interface.
 *  - Delegates correctly to the injected ApiService.
 *  - Throws descriptive errors when the server returns a failure response.
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';
import OrderRepository from './OrderRepository.js';

// ─── helpers ─────────────────────────────────────────────────────────────────
const makeMockApi = () => ({
  get:  vi.fn(),
  post: vi.fn(),
});

const sampleOrders = [
  { _id: 'order-1', amount: 25.00, status: 'Food Processing', items: [] },
  { _id: 'order-2', amount: 42.50, status: 'Delivered',       items: [] },
];

// ─────────────────────────────────────────────────────────────────────────────
describe('OrderRepository — Repository Pattern', () => {
  let mockApi;
  let repo;

  beforeEach(() => {
    mockApi = makeMockApi();
    repo    = new OrderRepository(mockApi);
  });

  // ── getAll ────────────────────────────────────────────────────────────────
  describe('getAll()', () => {
    test('calls GET /api/order/list and returns the data array', async () => {
      mockApi.get.mockResolvedValue({ success: true, data: sampleOrders });

      const result = await repo.getAll();

      expect(mockApi.get).toHaveBeenCalledWith('/api/order/list');
      expect(result).toEqual(sampleOrders);
    });

    test('throws when the server returns success: false', async () => {
      mockApi.get.mockResolvedValue({ success: false });

      await expect(repo.getAll()).rejects.toThrow('Failed to fetch orders');
    });

    test('throws when the API call itself rejects', async () => {
      mockApi.get.mockRejectedValue(new Error('Connection refused'));

      await expect(repo.getAll()).rejects.toThrow('Connection refused');
    });

    test('returns an empty array when there are no orders', async () => {
      mockApi.get.mockResolvedValue({ success: true, data: [] });

      const result = await repo.getAll();
      expect(result).toEqual([]);
    });
  });

  // ── updateStatus ──────────────────────────────────────────────────────────
  describe('updateStatus()', () => {
    test('calls POST /api/order/status with orderId and status', async () => {
      mockApi.post.mockResolvedValue({ success: true });

      await repo.updateStatus('order-1', 'Delivered');

      expect(mockApi.post).toHaveBeenCalledWith('/api/order/status', {
        orderId: 'order-1',
        status:  'Delivered',
      });
    });

    test('returns the server response on success', async () => {
      const serverResponse = { success: true };
      mockApi.post.mockResolvedValue(serverResponse);

      const result = await repo.updateStatus('order-1', 'Out for Delivery');
      expect(result).toEqual(serverResponse);
    });

    test('throws when the server returns success: false', async () => {
      mockApi.post.mockResolvedValue({ success: false });

      await expect(repo.updateStatus('order-1', 'Delivered')).rejects.toThrow(
        'Failed to update order status'
      );
    });

    test('propagates network errors', async () => {
      mockApi.post.mockRejectedValue(new Error('Timeout'));

      await expect(repo.updateStatus('order-1', 'Delivered')).rejects.toThrow('Timeout');
    });

    test('accepts all valid order status strings', async () => {
      const statuses = ['Food Processing', 'Out for Delivery', 'Delivered'];
      mockApi.post.mockResolvedValue({ success: true });

      for (const status of statuses) {
        await expect(repo.updateStatus('order-1', status)).resolves.not.toThrow();
      }
    });
  });

  // ── Dependency injection ──────────────────────────────────────────────────
  describe('Dependency injection', () => {
    test('different repositories use their own injected API service', async () => {
      const apiA = makeMockApi();
      const apiB = makeMockApi();
      apiA.get.mockResolvedValue({ success: true, data: [sampleOrders[0]] });
      apiB.get.mockResolvedValue({ success: true, data: [sampleOrders[1]] });

      const repoA = new OrderRepository(apiA);
      const repoB = new OrderRepository(apiB);

      const [resultA, resultB] = await Promise.all([repoA.getAll(), repoB.getAll()]);

      expect(resultA).toEqual([sampleOrders[0]]);
      expect(resultB).toEqual([sampleOrders[1]]);
      expect(apiA.get).toHaveBeenCalledOnce();
      expect(apiB.get).toHaveBeenCalledOnce();
    });
  });
});
