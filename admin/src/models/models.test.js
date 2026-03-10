/**
 * Models tests — Domain Models
 *
 * Verifies the correctness of:
 *  - OrderItem: construction and toString()
 *  - Address: construction and computed property strings
 *  - Order: construction, computed properties, and isWithin() date logic
 *  - FoodItem: construction and formattedPrice
 *  - DashboardStats: revenue and status aggregation
 *  - Constants: ORDER_STATUSES and FOOD_CATEGORIES
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  OrderItem,
  Address,
  Order,
  FoodItem,
  DashboardStats,
  ORDER_STATUSES,
  FOOD_CATEGORIES,
} from './index.js';

// ─── Fixed reference point ────────────────────────────────────────────────────
const NOW = new Date('2025-06-15T12:00:00.000Z');

// ─────────────────────────────────────────────────────────────────────────────
describe('OrderItem', () => {
  test('stores name and quantity from constructor', () => {
    const item = new OrderItem({ name: 'Burger', quantity: 2 });
    expect(item.name).toBe('Burger');
    expect(item.quantity).toBe(2);
  });

  test('toString() returns "name x quantity"', () => {
    const item = new OrderItem({ name: 'Pizza', quantity: 3 });
    expect(item.toString()).toBe('Pizza x 3');
  });

  test('toString() works for quantity of 1', () => {
    const item = new OrderItem({ name: 'Salad', quantity: 1 });
    expect(item.toString()).toBe('Salad x 1');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Address', () => {
  const fullAddressData = {
    firstName: 'John',
    lastName:  'Doe',
    street:    '123 Main St',
    city:      'Springfield',
    state:     'IL',
    country:   'USA',
    zipcode:   '62701',
    phone:     '555-1234',
  };

  test('stores all fields from constructor', () => {
    const addr = new Address(fullAddressData);
    expect(addr.firstName).toBe('John');
    expect(addr.lastName).toBe('Doe');
    expect(addr.street).toBe('123 Main St');
    expect(addr.city).toBe('Springfield');
    expect(addr.state).toBe('IL');
    expect(addr.country).toBe('USA');
    expect(addr.zipcode).toBe('62701');
    expect(addr.phone).toBe('555-1234');
  });

  test('has sensible defaults for all fields when none are supplied', () => {
    const addr = new Address();
    expect(addr.firstName).toBe('');
    expect(addr.lastName).toBe('');
    expect(addr.street).toBe('');
    expect(addr.city).toBe('');
    expect(addr.state).toBe('');
    expect(addr.country).toBe('');
    expect(addr.zipcode).toBe('');
    expect(addr.phone).toBe('');
  });

  test('fullName combines first and last name with a space', () => {
    const addr = new Address({ firstName: 'Jane', lastName: 'Smith' });
    expect(addr.fullName).toBe('Jane Smith');
  });

  test('fullName trims leading/trailing whitespace when one part is empty', () => {
    const addr = new Address({ firstName: 'Jane', lastName: '' });
    expect(addr.fullName).toBe('Jane');
  });

  test('cityLine combines city, state, country, and zipcode', () => {
    const addr = new Address(fullAddressData);
    expect(addr.cityLine).toBe('Springfield, IL, USA 62701');
  });

  test('singleLine places street before cityLine separated by a comma', () => {
    const addr = new Address(fullAddressData);
    expect(addr.singleLine).toBe('123 Main St, Springfield, IL, USA 62701');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Order', () => {
  const rawOrder = {
    _id:     'abc123456789',
    amount:  45.5,
    status:  'Food Processing',
    date:    NOW.toISOString(),
    items:   [{ name: 'Burger', quantity: 2 }, { name: 'Fries', quantity: 1 }],
    address: { firstName: 'Alice', lastName: 'Wonder', street: '1 Lane', city: 'City', state: 'ST', country: 'Country', zipcode: '00001' },
  };

  test('stores _id from raw data', () => {
    const order = new Order(rawOrder);
    expect(order._id).toBe('abc123456789');
  });

  test('converts amount to a Number', () => {
    const order = new Order({ ...rawOrder, amount: '20.5' });
    expect(order.amount).toBe(20.5);
  });

  test('defaults amount to 0 when missing', () => {
    const order = new Order({ _id: 'x', status: 'Delivered', items: [], address: {} });
    expect(order.amount).toBe(0);
  });

  test('defaults status to "Food Processing" when missing', () => {
    const order = new Order({ _id: 'x', items: [], address: {} });
    expect(order.status).toBe(ORDER_STATUSES.FOOD_PROCESSING);
  });

  test('parses date string into a Date object', () => {
    const order = new Order(rawOrder);
    expect(order.date).toBeInstanceOf(Date);
    expect(order.date.toISOString()).toBe(NOW.toISOString());
  });

  test('date is null when not provided', () => {
    const order = new Order({ _id: 'x', items: [], address: {} });
    expect(order.date).toBeNull();
  });

  test('maps items array into OrderItem instances', () => {
    const order = new Order(rawOrder);
    expect(order.items).toHaveLength(2);
    expect(order.items[0]).toBeInstanceOf(OrderItem);
  });

  test('wraps address in an Address instance', () => {
    const order = new Order(rawOrder);
    expect(order.address).toBeInstanceOf(Address);
  });

  // ── Computed properties ───────────────────────────────────────────────────
  describe('shortId', () => {
    test('returns "#" followed by the last 6 characters uppercased', () => {
      const order = new Order(rawOrder);
      expect(order.shortId).toBe('#456789');
    });
  });

  describe('formattedAmount', () => {
    test('formats amount as a dollar string with two decimal places', () => {
      const order = new Order(rawOrder);
      expect(order.formattedAmount).toBe('$45.50');
    });

    test('formats zero as "$0.00"', () => {
      const order = new Order({ _id: 'x', amount: 0, items: [], address: {} });
      expect(order.formattedAmount).toBe('$0.00');
    });
  });

  describe('formattedDate', () => {
    test('returns a locale date string when date is set', () => {
      const order = new Order(rawOrder);
      expect(typeof order.formattedDate).toBe('string');
      expect(order.formattedDate).not.toBe('—');
    });

    test('returns "—" when date is null', () => {
      const order = new Order({ _id: 'x', items: [], address: {} });
      expect(order.formattedDate).toBe('—');
    });
  });

  describe('itemSummary', () => {
    test('joins item toString representations with ", "', () => {
      const order = new Order(rawOrder);
      expect(order.itemSummary).toBe('Burger x 2, Fries x 1');
    });

    test('returns an empty string when there are no items', () => {
      const order = new Order({ _id: 'x', items: [], address: {} });
      expect(order.itemSummary).toBe('');
    });
  });

  describe('statusClass', () => {
    test('lowercases status and replaces spaces with hyphens', () => {
      const order = new Order({ ...rawOrder, status: 'Out for Delivery' });
      expect(order.statusClass).toBe('out-for-delivery');
    });

    test('"Food Processing" becomes "food-processing"', () => {
      const order = new Order({ ...rawOrder, status: 'Food Processing' });
      expect(order.statusClass).toBe('food-processing');
    });

    test('"Delivered" becomes "delivered"', () => {
      const order = new Order({ ...rawOrder, status: 'Delivered' });
      expect(order.statusClass).toBe('delivered');
    });
  });

  // ── isWithin ──────────────────────────────────────────────────────────────
  describe('isWithin()', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(NOW); // 2025-06-15T12:00:00Z
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test('"all" always returns true', () => {
      const order = new Order(rawOrder);
      expect(order.isWithin('all')).toBe(true);
    });

    test('returns true for "all" even with a null date', () => {
      const order = new Order({ _id: 'x', items: [], address: {} });
      expect(order.isWithin('all')).toBe(true);
    });

    test('"day" returns true for an order placed today', () => {
      const order = new Order({ ...rawOrder, date: NOW.toISOString() });
      expect(order.isWithin('day')).toBe(true);
    });

    test('"day" returns false for an order placed yesterday', () => {
      const yesterday = new Date(NOW);
      yesterday.setDate(yesterday.getDate() - 1);
      const order = new Order({ ...rawOrder, date: yesterday.toISOString() });
      expect(order.isWithin('day')).toBe(false);
    });

    test('"week" returns true for an order placed 3 days ago', () => {
      const threeDaysAgo = new Date(NOW.getTime() - 3 * 86_400_000);
      const order = new Order({ ...rawOrder, date: threeDaysAgo.toISOString() });
      expect(order.isWithin('week')).toBe(true);
    });

    test('"week" returns false for an order placed 8 days ago', () => {
      const eightDaysAgo = new Date(NOW.getTime() - 8 * 86_400_000);
      const order = new Order({ ...rawOrder, date: eightDaysAgo.toISOString() });
      expect(order.isWithin('week')).toBe(false);
    });

    test('"month" returns true for an order placed this month', () => {
      const order = new Order({ ...rawOrder, date: NOW.toISOString() });
      expect(order.isWithin('month')).toBe(true);
    });

    test('"month" returns false for an order from last month', () => {
      const lastMonth = new Date('2025-05-15T12:00:00.000Z');
      const order = new Order({ ...rawOrder, date: lastMonth.toISOString() });
      expect(order.isWithin('month')).toBe(false);
    });

    test('"year" returns true for an order placed this year', () => {
      const order = new Order({ ...rawOrder, date: NOW.toISOString() });
      expect(order.isWithin('year')).toBe(true);
    });

    test('"year" returns false for an order from last year', () => {
      const lastYear = new Date('2024-06-15T12:00:00.000Z');
      const order = new Order({ ...rawOrder, date: lastYear.toISOString() });
      expect(order.isWithin('year')).toBe(false);
    });

    test('unknown period defaults to true', () => {
      const order = new Order(rawOrder);
      expect(order.isWithin('unknown')).toBe(true);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('FoodItem', () => {
  const rawFood = {
    _id:         'food-1',
    name:        'Margherita Pizza',
    description: 'Classic Italian pizza',
    price:       12.5,
    category:    'Pasta',
    image:       'pizza.jpg',
  };

  test('stores all fields from raw data', () => {
    const item = new FoodItem(rawFood);
    expect(item._id).toBe('food-1');
    expect(item.name).toBe('Margherita Pizza');
    expect(item.description).toBe('Classic Italian pizza');
    expect(item.price).toBe(12.5);
    expect(item.category).toBe('Pasta');
    expect(item.image).toBe('pizza.jpg');
  });

  test('converts price string to a Number', () => {
    const item = new FoodItem({ ...rawFood, price: '9.99' });
    expect(item.price).toBe(9.99);
  });

  test('defaults description to empty string when missing', () => {
    const item = new FoodItem({ _id: 'x', name: 'Salad', price: 5, category: 'Salad' });
    expect(item.description).toBe('');
  });

  test('defaults price to 0 when missing', () => {
    const item = new FoodItem({ _id: 'x', name: 'Salad', category: 'Salad' });
    expect(item.price).toBe(0);
  });

  test('formattedPrice returns dollar string with two decimal places', () => {
    const item = new FoodItem(rawFood);
    expect(item.formattedPrice).toBe('$12.50');
  });

  test('formattedPrice handles whole numbers', () => {
    const item = new FoodItem({ ...rawFood, price: 10 });
    expect(item.formattedPrice).toBe('$10.00');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('DashboardStats', () => {
  const makeOrder = (status, amount) => new Order({
    _id:     Math.random().toString(36).slice(2),
    amount,
    status,
    items:   [],
    address: {},
  });

  test('totalOrders equals the number of orders passed in', () => {
    const stats = new DashboardStats([makeOrder('Food Processing', 10), makeOrder('Delivered', 20)]);
    expect(stats.totalOrders).toBe(2);
  });

  test('totalRevenue sums all order amounts', () => {
    const stats = new DashboardStats([makeOrder('Delivered', 10), makeOrder('Delivered', 20.5)]);
    expect(stats.totalRevenue).toBeCloseTo(30.5);
  });

  test('foodProcessing counts only "Food Processing" orders', () => {
    const stats = new DashboardStats([
      makeOrder('Food Processing', 5),
      makeOrder('Food Processing', 5),
      makeOrder('Delivered', 5),
    ]);
    expect(stats.foodProcessing).toBe(2);
  });

  test('outForDelivery counts only "Out for Delivery" orders', () => {
    const stats = new DashboardStats([
      makeOrder('Out for Delivery', 5),
      makeOrder('Delivered', 5),
    ]);
    expect(stats.outForDelivery).toBe(1);
  });

  test('delivered counts only "Delivered" orders', () => {
    const stats = new DashboardStats([
      makeOrder('Delivered', 5),
      makeOrder('Delivered', 5),
      makeOrder('Food Processing', 5),
    ]);
    expect(stats.delivered).toBe(2);
  });

  test('formattedRevenue formats total revenue as a dollar string', () => {
    const stats = new DashboardStats([makeOrder('Delivered', 99.99)]);
    expect(stats.formattedRevenue).toBe('$99.99');
  });

  test('all counts are zero for an empty orders array', () => {
    const stats = new DashboardStats([]);
    expect(stats.totalOrders).toBe(0);
    expect(stats.totalRevenue).toBe(0);
    expect(stats.foodProcessing).toBe(0);
    expect(stats.outForDelivery).toBe(0);
    expect(stats.delivered).toBe(0);
  });

  test('defaults to empty array when no argument is supplied', () => {
    const stats = new DashboardStats();
    expect(stats.totalOrders).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('Constants', () => {
  test('ORDER_STATUSES contains the three expected status strings', () => {
    expect(ORDER_STATUSES.FOOD_PROCESSING).toBe('Food Processing');
    expect(ORDER_STATUSES.OUT_FOR_DELIVERY).toBe('Out for Delivery');
    expect(ORDER_STATUSES.DELIVERED).toBe('Delivered');
  });

  test('FOOD_CATEGORIES is a non-empty array of strings', () => {
    expect(Array.isArray(FOOD_CATEGORIES)).toBe(true);
    expect(FOOD_CATEGORIES.length).toBeGreaterThan(0);
    for (const cat of FOOD_CATEGORIES) {
      expect(typeof cat).toBe('string');
    }
  });

  test('FOOD_CATEGORIES contains "Salad"', () => {
    expect(FOOD_CATEGORIES).toContain('Salad');
  });
});
