/**
 * FoodFormFactory tests — Factory Pattern
 *
 * Verifies that:
 *  - FoodFormData has sensible default values.
 *  - FoodFormData.toFormData() serialises all fields correctly.
 *  - FoodFormFactory.create() builds instances with and without overrides.
 *  - FoodFormFactory.withField() returns a new immutable copy (pure update).
 *  - FoodFormData.createEmpty() returns a blank form.
 */
import { describe, test, expect } from 'vitest';
import FoodFormFactory, { FoodFormData } from './FoodFormFactory.js';

// ─────────────────────────────────────────────────────────────────────────────
describe('FoodFormData — value object', () => {
  // ── Default values ────────────────────────────────────────────────────────
  describe('constructor defaults', () => {
    test('name defaults to empty string', () => {
      expect(new FoodFormData().name).toBe('');
    });

    test('description defaults to empty string', () => {
      expect(new FoodFormData().description).toBe('');
    });

    test('price defaults to empty string', () => {
      expect(new FoodFormData().price).toBe('');
    });

    test('category defaults to "Salad"', () => {
      expect(new FoodFormData().category).toBe('Salad');
    });

    test('image defaults to null', () => {
      expect(new FoodFormData().image).toBeNull();
    });
  });

  // ── Constructor overrides ─────────────────────────────────────────────────
  describe('constructor overrides', () => {
    test('accepts all fields as constructor arguments', () => {
      const mockFile = new File([''], 'pizza.jpg', { type: 'image/jpeg' });
      const data = new FoodFormData({
        name:        'Pizza',
        description: 'Cheesy',
        price:       '12.99',
        category:    'Pasta',
        image:       mockFile,
      });

      expect(data.name).toBe('Pizza');
      expect(data.description).toBe('Cheesy');
      expect(data.price).toBe('12.99');
      expect(data.category).toBe('Pasta');
      expect(data.image).toBe(mockFile);
    });

    test('partial override keeps unspecified defaults', () => {
      const data = new FoodFormData({ name: 'Burger' });

      expect(data.name).toBe('Burger');
      expect(data.description).toBe('');
      expect(data.category).toBe('Salad');
    });
  });

  // ── toFormData ────────────────────────────────────────────────────────────
  describe('toFormData()', () => {
    test('returns a FormData instance', () => {
      const data = new FoodFormData({ name: 'Salad', price: '5.00' });
      expect(data.toFormData()).toBeInstanceOf(FormData);
    });

    test('includes name field', () => {
      const fd = new FoodFormData({ name: 'Caesar Salad' }).toFormData();
      expect(fd.get('name')).toBe('Caesar Salad');
    });

    test('includes description field', () => {
      const fd = new FoodFormData({ description: 'Fresh greens' }).toFormData();
      expect(fd.get('description')).toBe('Fresh greens');
    });

    test('coerces price to a number', () => {
      const fd = new FoodFormData({ price: '9.99' }).toFormData();
      expect(Number(fd.get('price'))).toBe(9.99);
    });

    test('includes category field', () => {
      const fd = new FoodFormData({ category: 'Rolls' }).toFormData();
      expect(fd.get('category')).toBe('Rolls');
    });

    test('includes image when provided', () => {
      const mockFile = new File(['img'], 'food.jpg', { type: 'image/jpeg' });
      const fd = new FoodFormData({ image: mockFile }).toFormData();
      expect(fd.get('image')).toBe(mockFile);
    });

    test('omits image field when image is null', () => {
      const fd = new FoodFormData({ image: null }).toFormData();
      expect(fd.get('image')).toBeNull();
    });
  });

  // ── createEmpty ───────────────────────────────────────────────────────────
  describe('createEmpty()', () => {
    test('returns a FoodFormData instance', () => {
      expect(FoodFormData.createEmpty()).toBeInstanceOf(FoodFormData);
    });

    test('returns a form with all default (blank) values', () => {
      const data = FoodFormData.createEmpty();
      expect(data.name).toBe('');
      expect(data.description).toBe('');
      expect(data.price).toBe('');
      expect(data.category).toBe('Salad');
      expect(data.image).toBeNull();
    });

    test('each call returns a distinct object', () => {
      const a = FoodFormData.createEmpty();
      const b = FoodFormData.createEmpty();
      expect(a).not.toBe(b);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('FoodFormFactory — Factory Pattern', () => {
  // ── create ────────────────────────────────────────────────────────────────
  describe('create()', () => {
    test('returns a FoodFormData instance', () => {
      expect(FoodFormFactory.create()).toBeInstanceOf(FoodFormData);
    });

    test('applies defaults when called with no arguments', () => {
      const data = FoodFormFactory.create();
      expect(data.name).toBe('');
      expect(data.category).toBe('Salad');
    });

    test('applies supplied overrides', () => {
      const data = FoodFormFactory.create({ name: 'Noodles', price: '8.50' });
      expect(data.name).toBe('Noodles');
      expect(data.price).toBe('8.50');
    });

    test('each call produces a new object', () => {
      const a = FoodFormFactory.create({ name: 'A' });
      const b = FoodFormFactory.create({ name: 'B' });
      expect(a).not.toBe(b);
    });
  });

  // ── withField ─────────────────────────────────────────────────────────────
  describe('withField()', () => {
    test('returns a new FoodFormData instance (immutable update)', () => {
      const original = FoodFormFactory.create({ name: 'Burger' });
      const updated  = FoodFormFactory.withField(original, 'name', 'Pizza');
      expect(updated).toBeInstanceOf(FoodFormData);
      expect(updated).not.toBe(original);
    });

    test('updates only the specified field', () => {
      const original = FoodFormFactory.create({ name: 'Burger', price: '9.00', category: 'Rolls' });
      const updated  = FoodFormFactory.withField(original, 'price', '11.00');

      expect(updated.price).toBe('11.00');
      expect(updated.name).toBe('Burger');
      expect(updated.category).toBe('Rolls');
    });

    test('does not mutate the original object', () => {
      const original = FoodFormFactory.create({ name: 'Burger' });
      FoodFormFactory.withField(original, 'name', 'Pizza');

      expect(original.name).toBe('Burger');
    });

    test('can update all supported fields', () => {
      const mockFile = new File([''], 'img.jpg');
      const base = FoodFormFactory.create();
      const fields = [
        ['name',        'Cake'],
        ['description', 'Sweet'],
        ['price',       '4.00'],
        ['category',    'Cake'],
        ['image',       mockFile],
      ];

      for (const [field, value] of fields) {
        const updated = FoodFormFactory.withField(base, field, value);
        expect(updated[field]).toBe(value);
      }
    });
  });
});
