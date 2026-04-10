import React, { useEffect, useState } from 'react';
import './myorders.css';
import { useStore } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const formatPrices = (value) => {
    const amount = Number(value ?? 0).toFixed(2);
    return `৳${amount}`;
};

const ORDER_STEPS = ['Food Processing', 'Preparing', 'Out for Delivery', 'Delivered'];

const OrderTracker = ({ status }) => {
    const currentStep = ORDER_STEPS.indexOf(status);
    const isCancelled = status === 'Cancelled';

    if (isCancelled) {
        return <div className="order-tracker-cancelled">Order Cancelled</div>;
    }

    return (
        <div className="order-tracker">
            {ORDER_STEPS.map((step, index) => (
                <div key={step} className={`tracker-step ${index <= currentStep ? 'active' : ''}`}>
                    <div className="step-circle">
                        {index < currentStep ? '✓' : index + 1}
                    </div>
                    <div className="step-line-wrapper">
                        {index < ORDER_STEPS.length - 1 && (
                            <div className={`step-line ${index < currentStep ? 'active' : ''}`}></div>
                        )}
                    </div>
                    <p>{step}</p>
                </div>
            ))}
        </div>
    );
};

const MyOrders = () => {
    const { url, token } = useStore();
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            setError(null);
            setLoading(true);
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            setData(response.data.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders. Please try again.');
            setData([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [token]);

    const toggleTracker = (index) => {
        setExpandedOrder(expandedOrder === index ? null : index);
    };

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            {error && <p className="error-message" style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}
            <div className="container">
                {loading ? (
                    <div className="orders-loading">
                        <div className="spinner"></div>
                        <p>Loading your orders...</p>
                    </div>
                ) : data.length === 0 && !error ? (
                    <div className="orders-empty">
                        <p>📦 No orders yet. Start ordering delicious food!</p>
                    </div>
                ) : (
                    data.map((order, index) => {
                        return (
                            <div key={index} className='my-orders-order'>
                                <img src={assets.parcel_icon} alt="Parcel Icon" />
                                <p>{order.items.map((item, index) => {
                                    if (index === order.items.length - 1) {
                                        return item.name + " x " + item.quantity;
                                    } else {
                                        return item.name + " x " + item.quantity + ", ";
                                    }
                                })}</p>
                                <p>{formatPrices(order.amount)}</p>
                                <p>Items: {order.items.length}</p>
                                <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                                <button onClick={() => { fetchOrders(); toggleTracker(index); }}>
                                    {expandedOrder === index ? 'Hide Tracking' : 'Track Order'}
                                </button>
                                {expandedOrder === index && (
                                    <div className="order-tracker-wrapper">
                                        <OrderTracker status={order.status} />
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
}

export default MyOrders;
