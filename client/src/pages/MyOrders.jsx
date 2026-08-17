import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const MyOrders = () => {
    const { currency, user, navigate } = useAppContext();
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            if (!user) return;
            const { data } = await api.get('/orders/userorders');
            if (data.success) {
                setOrderData(data.orders);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Shipped':
            case 'Out for Delivery':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Cancelled':
                return 'bg-rose-100 text-rose-800 border-rose-200';
            default:
                return 'bg-amber-100 text-amber-800 border-amber-200';
        }
    };

    return (
        <div className="py-8 max-w-5xl mx-auto font-sans text-slate-800">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">My Orders & Tracking</h1>
                    <p className="text-slate-500 text-xs mt-0.5">Track your order confirmation, shipping and delivery status</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                    <span>🔄 Refresh Status</span>
                </button>
            </div>

            {loading ? (
                <div className="text-center py-16 text-slate-400 font-medium text-sm">
                    Loading your orders...
                </div>
            ) : orderData.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-xs">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
                        📦
                    </div>
                    <h2 className="text-lg font-extrabold text-slate-800">No orders placed yet</h2>
                    <p className="text-slate-500 text-xs mt-1 mb-6">Start shopping fresh produce and organic groceries today!</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-full shadow-md transition-all cursor-pointer"
                    >
                        Browse Store Catalog →
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orderData.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow"
                        >
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-bold text-slate-900">Order ID: {order._id}</span>
                                        <span className={`text-[10px] font-black uppercase border px-2.5 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Placed on: <span className="font-semibold text-slate-700">{new Date(order.date).toLocaleString()}</span>
                                    </p>
                                </div>

                                <div className="text-left sm:text-right">
                                    <span className="text-xs text-slate-400 font-semibold block">Total Amount</span>
                                    <span className="text-lg font-black text-emerald-600">{currency}{order.amount}.00</span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                                <div className="md:col-span-8 space-y-2">
                                    <p className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px]">Items in Shipment</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                                                <img
                                                    src={item.image?.[0]}
                                                    alt={item.name}
                                                    className="w-10 h-10 object-contain rounded-xl bg-white p-1 border border-slate-200/60"
                                                />
                                                <div>
                                                    <p className="font-extrabold text-slate-900 text-xs line-clamp-1">{item.name}</p>
                                                    <p className="text-[11px] text-slate-500 font-semibold">Qty: {item.quantity} × {currency}{item.offerPrice}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery Address Summary */}
                                <div className="md:col-span-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                                    <p className="font-extrabold text-slate-900 uppercase tracking-wider text-[10px] mb-1">Delivery Address</p>
                                    <p className="font-bold text-slate-800">{order.address?.firstName} {order.address?.lastName}</p>
                                    <p className="text-slate-500">{order.address?.street}, {order.address?.city}</p>
                                    <p className="text-slate-500">{order.address?.state} - {order.address?.zipcode}</p>
                                    <p className="text-slate-500 font-medium">📞 {order.address?.phone}</p>
                                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                                        <span className="text-slate-400 font-bold">Payment:</span>
                                        <span className="font-extrabold text-slate-800 uppercase">{order.paymentMethod}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
