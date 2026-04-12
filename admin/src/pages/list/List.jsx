import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './list.css';
import { toast } from 'react-toastify';
import { useServices } from '../../App';
import { FoodItem } from '../../models';
import EventBus, { EVENTS } from '../../events/EventBus';

// ─── FoodRow ───────────────────────────────────────────────────────────────────
const FoodRow = ({ item, onRemove, onSave, isSaving }) => {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(String(item.price));

  useEffect(() => {
    setName(item.name);
    setPrice(String(item.price));
  }, [item.name, item.price]);

  return (
    <div className="list-table-format">
      <img src={item.image} alt={item.name} loading="lazy" />
      <input
        className="inline-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label={`Edit name for ${item.name}`}
      />
      <p>{item.category}</p>
      <input
        className="inline-input"
        type="number"
        step="0.01"
        min="0"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        aria-label={`Edit price for ${item.name}`}
      />
      <div className="row-actions">
        <button
          className="save-btn"
          onClick={() => onSave(item._id, name, price)}
          disabled={isSaving}
          aria-label={`Save ${item.name}`}
          title="Save name and price"
        >
          {isSaving ? '...' : 'Save'}
        </button>
        <button
          className="remove-btn"
          onClick={() => onRemove(item._id)}
          aria-label={`Remove ${item.name}`}
          title="Remove item"
          disabled={isSaving}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const EmptyState   = () => <p className="state-msg">No food items yet. Add some from "Add Items".</p>;
const LoadingState = () => <p className="state-msg">Loading…</p>;

// ─── List ──────────────────────────────────────────────────────────────────────
const List = () => {
  const navigate = useNavigate();
  const { foodRepo } = useServices();
  const [items,     setItems]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingId,  setSavingId]  = useState('');

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const raw = await foodRepo.getAll();
      setItems(raw.map((r) => new FoodItem(r)));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [foodRepo]);

  const handleRemove = async (foodId) => {
    try {
      const result = await foodRepo.remove(foodId);
      toast.success(result.message ?? 'Item removed.');
      setItems((prev) => prev.filter((i) => i._id !== foodId));
      EventBus.emit(EVENTS.FOOD_REMOVED, { foodId });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSave = async (foodId, name, price) => {
    const cleanName = name.trim();
    const parsedPrice = Number(price);

    if (!cleanName) {
      toast.error('Name is required.');
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      toast.error('Price must be a valid non-negative number.');
      return;
    }

    setSavingId(foodId);
    try {
      const result = await foodRepo.update(foodId, { name: cleanName, price: parsedPrice });
      const updated = new FoodItem(result.data);
      setItems((prev) => prev.map((item) => (item._id === foodId ? updated : item)));
      toast.success(result.message ?? 'Item updated.');
      EventBus.emit(EVENTS.FOOD_UPDATED, { foodId });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingId('');
    }
  };

  useEffect(() => { fetchItems(); }, [fetchItems]);

  useEffect(() => {
    const unsub = EventBus.on(EVENTS.FOOD_ADDED, fetchItems);
    return unsub;
  }, [fetchItems]);

  useEffect(() => {
    const unsub = EventBus.on(EVENTS.FOOD_UPDATED, fetchItems);
    return unsub;
  }, [fetchItems]);

  return (
    <div className="list flex-col">
      <div className="list-header-row">
        <p className="list-title">All Food Items</p>
        <button className="list-add-btn" onClick={() => navigate('/add')}>
          Add Item
        </button>
      </div>
      <div className="list-table">
        <div className="list-table-format list-header">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Actions</b>
        </div>
        {isLoading && <LoadingState />}
        {!isLoading && items.length === 0 && <EmptyState />}
        {!isLoading && items.map((item) => (
          <FoodRow
            key={item._id}
            item={item}
            onRemove={handleRemove}
            onSave={handleSave}
            isSaving={savingId === item._id}
          />
        ))}
      </div>
    </div>
  );
};

export default List;