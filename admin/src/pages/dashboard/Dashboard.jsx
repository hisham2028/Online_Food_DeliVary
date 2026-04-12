/**
 * Dashboard — Page Component
 *
 * Patterns:
 *   Strategy        – OrderFilterContext applies swappable filter strategies
 *   Repository      – orderRepo.getAll() for data access
 *   Model           – Order[] and DashboardStats encapsulate domain logic
 *   Observer        – subscribes to ORDER_STATUS_CHANGED to refresh live
 *   Dependency Inj. – orderRepo from useServices()
 *   Configuration   – STAT_CARDS array drives stat cards; add a card = one entry
 *   Sub-components  – StatCard, FilterBar, OrdersTable
 */
import React, { useEffect, useState, useCallback } from 'react';
import './dashboard.css';
import { toast } from 'react-toastify';
import { useServices } from '../../App';
import { Order, DashboardStats, FoodItem } from '../../models';
import { OrderFilterContext } from '../../strategies/OrderFilterStrategy';
import EventBus, { EVENTS } from '../../events/EventBus';

// ─── StatCard ──────────────────────────────────────────────────────────────────
const StatCard = ({ icon, title, value, variant }) => (
  <div className={`stat-card stat-card--${variant}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-details">
      <span className="stat-title">{title}</span>
      <span className="stat-value">{value}</span>
    </div>
  </div>
);

// Configuration Object: add a new stat = one array entry
const STAT_CARDS = [
  { icon: '💰', title: 'Total Revenue',    variant: 'revenue',    key: 'formattedRevenue' },
  { icon: '📦', title: 'Total Orders',     variant: 'orders',     key: 'totalOrders'      },
  { icon: '👨‍🍳', title: 'Processing',     variant: 'processing', key: 'foodProcessing'   },
  { icon: '🚚', title: 'Out for Delivery', variant: 'delivery',   key: 'outForDelivery'   },
  { icon: '✅', title: 'Delivered',        variant: 'delivered',  key: 'delivered'        },
];

// ─── FilterBar ─────────────────────────────────────────────────────────────────
const FilterBar = ({ activePeriod, onSelect }) => (
  <div className="filter-bar">
    {OrderFilterContext.getAll().map((strategy) => (
      <button
        key={strategy.key}
        className={`filter-btn${activePeriod === strategy.key ? ' filter-btn--active' : ''}`}
        onClick={() => onSelect(strategy.key)}
      >
        {strategy.label}
      </button>
    ))}
  </div>
);

// ─── OrdersTable ───────────────────────────────────────────────────────────────
const OrdersTable = ({ orders }) => (
  <div className="orders-table">
    <div className="table-row table-header">
      <span>Order ID</span>
      <span>Customer</span>
      <span>Items</span>
      <span>Amount</span>
      <span>Status</span>
      <span>Date</span>
    </div>
    {orders.length === 0 && (
      <p className="table-empty">No orders for this period.</p>
    )}
    {orders.slice(0, 10).map((order) => (
      <div key={order._id} className="table-row">
        <span className="order-id">{order.shortId}</span>
        <span>{order.address.fullName}</span>
        <span>{order.items.length} items</span>
        <span className="amount">{order.formattedAmount}</span>
        <span className={`badge badge--${order.statusClass}`}>{order.status}</span>
        <span>{order.formattedDate}</span>
      </div>
    ))}
  </div>
);

const EditableFoodRow = ({ item, onSave, isSaving }) => {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(String(item.price));

  useEffect(() => {
    setName(item.name);
    setPrice(String(item.price));
  }, [item.name, item.price]);

  return (
    <div className="food-quick-row">
      <span className="food-quick-id">{item._id.slice(-6).toUpperCase()}</span>
      <input
        className="food-quick-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label={`Edit name for ${item.name}`}
      />
      <input
        className="food-quick-input"
        type="number"
        step="0.01"
        min="0"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        aria-label={`Edit price for ${item.name}`}
      />
      <button
        className="food-quick-save"
        onClick={() => onSave(item._id, name, price)}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

// ─── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { orderRepo, foodRepo } = useServices();
  const [allOrders,    setAllOrders]    = useState([]);
  const [foods,        setFoods]        = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading,    setIsLoading]    = useState(true);
  const [isFoodLoading, setIsFoodLoading] = useState(true);
  const [savingFoodId, setSavingFoodId] = useState('');

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const raw = await orderRepo.getAll();
      setAllOrders(raw.map((r) => new Order(r)));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [orderRepo]);

  const fetchFoods = useCallback(async () => {
    setIsFoodLoading(true);
    try {
      const raw = await foodRepo.getAll();
      setFoods(raw.map((r) => new FoodItem(r)).slice(0, 8));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsFoodLoading(false);
    }
  }, [foodRepo]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { fetchFoods(); }, [fetchFoods]);

  // Observer: refresh when an order status changes on the Orders page
  useEffect(() => {
    const unsub = EventBus.on(EVENTS.ORDER_STATUS_CHANGED, fetchOrders);
    return unsub;
  }, [fetchOrders]);

  useEffect(() => {
    const unsubs = [
      EventBus.on(EVENTS.FOOD_ADDED, fetchFoods),
      EventBus.on(EVENTS.FOOD_REMOVED, fetchFoods),
      EventBus.on(EVENTS.FOOD_UPDATED, fetchFoods),
    ];
    return () => unsubs.forEach((u) => u());
  }, [fetchFoods]);

  const handleFoodSave = async (foodId, name, price) => {
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

    setSavingFoodId(foodId);
    try {
      const result = await foodRepo.update(foodId, { name: cleanName, price: parsedPrice });
      const updated = new FoodItem(result.data);
      setFoods((prev) => prev.map((item) => (item._id === foodId ? updated : item)));
      toast.success(result.message ?? 'Item updated.');
      EventBus.emit(EVENTS.FOOD_UPDATED, { foodId });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingFoodId('');
    }
  };

  // Strategy pattern: apply selected filter, then compute stats
  const filtered = OrderFilterContext.filter(allOrders, activeFilter);
  const stats    = new DashboardStats(filtered);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <FilterBar activePeriod={activeFilter} onSelect={setActiveFilter} />
      </div>

      {isLoading ? (
        <p className="state-msg">Loading dashboard…</p>
      ) : (
        <>
          <div className="stats-grid">
            {STAT_CARDS.map(({ icon, title, variant, key }) => (
              <StatCard
                key={key}
                icon={icon}
                title={title}
                value={stats[key]}
                variant={variant}
              />
            ))}
          </div>

          <div className="recent-orders">
            <h3>Recent Orders ({filtered.length})</h3>
            <OrdersTable orders={filtered} />
          </div>

          <div className="quick-food-edit">
            <h3>Quick Food Edit (Name & Price)</h3>
            {isFoodLoading ? (
              <p className="table-empty">Loading food items...</p>
            ) : foods.length === 0 ? (
              <p className="table-empty">No food items available.</p>
            ) : (
              <>
                <div className="food-quick-row food-quick-header">
                  <span>ID</span>
                  <span>Name</span>
                  <span>Price</span>
                  <span>Action</span>
                </div>
                {foods.map((item) => (
                  <EditableFoodRow
                    key={item._id}
                    item={item}
                    onSave={handleFoodSave}
                    isSaving={savingFoodId === item._id}
                  />
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
