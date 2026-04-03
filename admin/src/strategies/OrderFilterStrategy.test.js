/**
 * OrderFilterStrategy tests — Strategy Pattern
 *
 * Verifies that:
 *  - Each strategy is independently interchangeable (Open/Closed Principle).
 *  - OrderFilterContext correctly selects and applies strategies by key.
 *  - Filtering by time period returns only the expected orders.
 *  - An unknown key falls back to the AllTime strategy.
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { OrderFilterContext } from './OrderFilterStrategy.js';
import { Order } from '../models/index.js';

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Build an Order whose date is `offsetDays` before now (negative = past). */
function makeOrder(offsetDays = 0, status = 'Food Processing') {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return new Order({
    _id:     `order-${Math.random().toString(36).slice(2)}`,
    amount:  10,
    status,
    date:    date.toISOString(),
    items:   [],
    address: {},
  });
}

// Fixed reference point for deterministic time tests
const NOW = new Date('2025-06-15T12:00:00.000Z');

// ─────────────────────────────────────────────────────────────────────────────
describe('OrderFilterContext — Strategy Pattern', () => {

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Strategy registry ─────────────────────────────────────────────────────
  describe('getAll()', () => {
    test('returns an array of available strategies', () => {
      const strategies = OrderFilterContext.getAll();
      expect(Array.isArray(strategies)).toBe(true);
      expect(strategies.length).toBeGreaterThan(0);
    });

    test('each strategy exposes a unique key string', () => {
      const keys = OrderFilterContext.getAll().map((s) => s.key);
      expect(new Set(keys).size).toBe(keys.length);
    });

    test('each strategy exposes a non-empty label string', () => {
      for (const s of OrderFilterContext.getAll()) {
        expect(typeof s.label).toBe('string');
        expect(s.label.length).toBeGreaterThan(0);
      }
    });

    test('includes strategies for all, day, week, month, year', () => {
      const keys = OrderFilterContext.getAll().map((s) => s.key);
      expect(keys).toContain('all');
      expect(keys).toContain('day');
      expect(keys).toContain('week');
      expect(keys).toContain('month');
      expect(keys).toContain('year');
    });
  });

  // ── getByKey ──────────────────────────────────────────────────────────────
  describe('getByKey()', () => {
    test('returns the strategy whose key matches', () => {
      expect(OrderFilterContext.getByKey('all').key).toBe('all');
      expect(OrderFilterContext.getByKey('day').key).toBe('day');
      expect(OrderFilterContext.getByKey('week').key).toBe('week');
      expect(OrderFilterContext.getByKey('month').key).toBe('month');
      expect(OrderFilterContext.getByKey('year').key).toBe('year');
    });

    test('falls back to AllTime strategy for an unknown key', () => {
      const fallback = OrderFilterContext.getByKey('unknown-key');
      expect(fallback.key).toBe('all');
    });

    test('falls back to AllTime strategy for an empty string', () => {
      const fallback = OrderFilterContext.getByKey('');
      expect(fallback.key).toBe('all');
    });
  });

  // ── AllTime strategy ──────────────────────────────────────────────────────
  describe('filter — "all"', () => {
    test('returns every order regardless of date', () => {
      const orders = [makeOrder(0), makeOrder(-10), makeOrder(-400)];
      expect(OrderFilterContext.filter(orders, 'all')).toHaveLength(3);
    });

    test('returns an empty array for an empty input', () => {
      expect(OrderFilterContext.filter([], 'all')).toHaveLength(0);
    });
  });

  // ── Today strategy ────────────────────────────────────────────────────────
  describe('filter — "day"', () => {
    test('returns only orders placed today', () => {
      const todayOrder     = makeOrder(0);
      const yesterdayOrder = makeOrder(-1);
      const oldOrder       = makeOrder(-30);

      const result = OrderFilterContext.filter([todayOrder, yesterdayOrder, oldOrder], 'day');
      expect(result).toContain(todayOrder);
      expect(result).not.toContain(yesterdayOrder);
      expect(result).not.toContain(oldOrder);
    });

    test('returns an empty array when no orders were placed today', () => {
      const orders = [makeOrder(-1), makeOrder(-2)];
      expect(OrderFilterContext.filter(orders, 'day')).toHaveLength(0);
    });
  });

  // ── Week strategy ─────────────────────────────────────────────────────────
  describe('filter — "week"', () => {
    test('returns orders placed within the last 7 days', () => {
      const recentOrder = makeOrder(-3);
      const oldOrder    = makeOrder(-8);

      const result = OrderFilterContext.filter([recentOrder, oldOrder], 'week');
      expect(result).toContain(recentOrder);
      expect(result).not.toContain(oldOrder);
    });

    test('includes an order placed exactly today', () => {
      const todayOrder = makeOrder(0);
      const result = OrderFilterContext.filter([todayOrder], 'week');
      expect(result).toContain(todayOrder);
    });

    test('returns empty array when all orders are older than 7 days', () => {
      const orders = [makeOrder(-8), makeOrder(-30)];
      expect(OrderFilterContext.filter(orders, 'week')).toHaveLength(0);
    });
  });

  // ── Month strategy ────────────────────────────────────────────────────────
  describe('filter — "month"', () => {
    test('returns orders placed in the current calendar month and year', () => {
      // NOW = 2025-06-15, so "this month" = June 2025
      const thisMonthOrder  = makeOrder(0);   // June 15
      const lastMonthOrder  = makeOrder(-20); // May 26 (roughly)
      const lastYearOrder   = new Order({
        _id: 'y', amount: 0, status: 'Delivered',
        date: '2024-06-10T00:00:00.000Z', items: [], address: {},
      });

      const result = OrderFilterContext.filter(
        [thisMonthOrder, lastMonthOrder, lastYearOrder], 'month'
      );

      expect(result).toContain(thisMonthOrder);
      expect(result).not.toContain(lastYearOrder);
    });
  });

  // ── Year strategy ─────────────────────────────────────────────────────────
  describe('filter — "year"', () => {
    test('returns orders placed in the current calendar year', () => {
      const thisYearOrder = makeOrder(0);       // 2025
      const lastYearOrder = new Order({
        _id: 'ly', amount: 0, status: 'Delivered',
        date: '2024-01-01T00:00:00.000Z', items: [], address: {},
      });

      const result = OrderFilterContext.filter([thisYearOrder, lastYearOrder], 'year');
      expect(result).toContain(thisYearOrder);
      expect(result).not.toContain(lastYearOrder);
    });

    test('returns empty array when all orders are from previous years', () => {
      const orders = [new Order({
        _id: 'old', amount: 0, status: 'Delivered',
        date: '2020-06-01T00:00:00.000Z', items: [], address: {},
      })];
      expect(OrderFilterContext.filter(orders, 'year')).toHaveLength(0);
    });
  });

  // ── Open/Closed Principle ─────────────────────────────────────────────────
  describe('Open/Closed Principle', () => {
    test('existing strategies are unaffected when checking strategy count', () => {
      // Verifies that the strategy list is stable and not mutated externally.
      const before = OrderFilterContext.getAll().map((s) => s.key);
      // Calling filter many times should not alter the list of strategies
      OrderFilterContext.filter([], 'all');
      OrderFilterContext.filter([], 'week');
      const after = OrderFilterContext.getAll().map((s) => s.key);
      expect(after).toEqual(before);
    });

    test('strategies are interchangeable — applying each to the same data is consistent', () => {
      const orders = [makeOrder(0), makeOrder(-3), makeOrder(-10)];
      const allResult  = OrderFilterContext.filter(orders, 'all');
      const weekResult = OrderFilterContext.filter(orders, 'week');

      // "all" should be a superset of "week"
      for (const o of weekResult) {
        expect(allResult).toContain(o);
      }
    });
  });
});
