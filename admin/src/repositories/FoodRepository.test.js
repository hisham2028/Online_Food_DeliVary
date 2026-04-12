/**
 * FoodRepository tests — Repository Pattern
 *
 * Verifies that FoodRepository:
 *  - Abstracts all food-related API calls behind a stable interface.
 *  - Delegates correctly to the injected ApiService.
 *  - Throws descriptive errors when the server returns a failure response.
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';
import FoodRepository from './FoodRepository.js';

// ─── helpers ─────────────────────────────────────────────────────────────────
const makeMockApi = () => ({
  get:      vi.fn(),
  post:     vi.fn(),
  postForm: vi.fn(),
});

const sampleFood = [
  { _id: '1', name: 'Burger', price: 9.99, category: 'Rolls' },
  { _id: '2', name: 'Salad',  price: 5.49, category: 'Salad' },
];

// ─────────────────────────────────────────────────────────────────────────────
describe('FoodRepository — Repository Pattern', () => {
  let mockApi;
  let repo;

  beforeEach(() => {
    mockApi = makeMockApi();
    repo    = new FoodRepository(mockApi);
  });

  // ── getAll ────────────────────────────────────────────────────────────────
  describe('getAll()', () => {
    test('calls GET /api/food/list and returns the data array', async () => {
      mockApi.get.mockResolvedValue({ success: true, data: sampleFood });

      const result = await repo.getAll();

      expect(mockApi.get).toHaveBeenCalledWith('/api/food/list');
      expect(result).toEqual(sampleFood);
    });

    test('throws when success is false', async () => {
      mockApi.get.mockResolvedValue({ success: false });

      await expect(repo.getAll()).rejects.toThrow('Failed to fetch food list');
    });

    test('throws when the API call itself rejects', async () => {
      mockApi.get.mockRejectedValue(new Error('Network error'));

      await expect(repo.getAll()).rejects.toThrow('Network error');
    });

    test('returns an empty array when there are no food items', async () => {
      mockApi.get.mockResolvedValue({ success: true, data: [] });

      const result = await repo.getAll();
      expect(result).toEqual([]);
    });
  });

  // ── add ───────────────────────────────────────────────────────────────────
  describe('add()', () => {
    test('calls POST /api/food/add with form data and returns the response', async () => {
      const formData = new FormData();
      formData.append('name', 'Pizza');
      const serverResponse = { success: true, message: 'Food added' };
      mockApi.postForm.mockResolvedValue(serverResponse);

      const result = await repo.add(formData);

      expect(mockApi.postForm).toHaveBeenCalledWith('/api/food/add', formData);
      expect(result).toEqual(serverResponse);
    });

    test('throws with server message when success is false', async () => {
      mockApi.postForm.mockResolvedValue({ success: false, message: 'Invalid image' });

      await expect(repo.add(new FormData())).rejects.toThrow('Invalid image');
    });

    test('throws default message when server provides no message', async () => {
      mockApi.postForm.mockResolvedValue({ success: false });

      await expect(repo.add(new FormData())).rejects.toThrow('Failed to add food item');
    });

    test('propagates network errors', async () => {
      mockApi.postForm.mockRejectedValue(new Error('Timeout'));

      await expect(repo.add(new FormData())).rejects.toThrow('Timeout');
    });
  });

  // ── remove ────────────────────────────────────────────────────────────────
  describe('remove()', () => {
    test('calls POST /api/food/remove with the food id and returns the response', async () => {
      const serverResponse = { success: true, message: 'Food removed' };
      mockApi.post.mockResolvedValue(serverResponse);

      const result = await repo.remove('food-id-42');

      expect(mockApi.post).toHaveBeenCalledWith('/api/food/remove', { id: 'food-id-42' });
      expect(result).toEqual(serverResponse);
    });

    test('throws with server message when success is false', async () => {
      mockApi.post.mockResolvedValue({ success: false, message: 'Food not found' });

      await expect(repo.remove('bad-id')).rejects.toThrow('Food not found');
    });

    test('throws default message when server provides no message', async () => {
      mockApi.post.mockResolvedValue({ success: false });

      await expect(repo.remove('bad-id')).rejects.toThrow('Failed to remove food item');
    });

    test('propagates network errors', async () => {
      mockApi.post.mockRejectedValue(new Error('Server unavailable'));

      await expect(repo.remove('some-id')).rejects.toThrow('Server unavailable');
    });
  });

  // ── Dependency injection ──────────────────────────────────────────────────
  describe('Dependency injection', () => {
    test('different repositories are independent (no shared state)', async () => {
      const apiA = makeMockApi();
      const apiB = makeMockApi();
      apiA.get.mockResolvedValue({ success: true, data: [sampleFood[0]] });
      apiB.get.mockResolvedValue({ success: true, data: [sampleFood[1]] });

      const repoA = new FoodRepository(apiA);
      const repoB = new FoodRepository(apiB);

      const [resultA, resultB] = await Promise.all([repoA.getAll(), repoB.getAll()]);

      expect(resultA).toEqual([sampleFood[0]]);
      expect(resultB).toEqual([sampleFood[1]]);
    });
  });
});
