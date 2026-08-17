import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
    const { currency, navigate } = useAppContext();
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return (
            <div className="py-20 text-center font-sans">
                <p className="text-xl font-bold text-slate-800">Order details not found.</p>
                <button onClick={() => navigate('/')} className="mt-4 bg-emerald-600 text-white font-bold text-xs px-6 py-2.5 rounded-full">
                    Return to Home
                </button>
            </div>
        );
    }

    return (
        <div className="py-12 max-w-2xl mx-auto font-sans text-slate-800">
            {/* Header Checkmark */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Order Confirmed! 🎉</h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    Thank you for your purchase. We are preparing your fresh shipment!
                </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                        <h2 className="text-base font-extrabold text-slate-900">Official Order Bill</h2>
                        <p className="text-xs text-slate-400">Date: {new Date(order.date || Date.now()).toLocaleString()}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        #{order._id?.slice(-8)?.toUpperCase()}
                    </span>
                </div>

                {/* Item List */}
                <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Items</p>
                    {order.items?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-xs">
                            <div>
                                <span className="font-bold text-slate-800">{item.name}</span>
                                <span className="text-slate-400 font-semibold ml-2">x{item.quantity}</span>
                            </div>
                            <span className="font-black text-slate-900">{currency}{item.offerPrice * item.quantity}.00</span>
                        </div>
                    ))}
                </div>

                {/* Summary Calculations */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-semibold">
                    {order.discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                            <span>Coupon Discount ({order.couponCode})</span>
                            <span>-{currency}{order.discountAmount}.00</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="font-bold text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                        <span>Total Paid / Amount</span>
                        <span className="text-lg text-emerald-600">{currency}{order.amount}.00</span>
                    </div>
                </div>

                {/* Shipping & Payment Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-2xl">
                    <div>
                        <h3 className="font-black text-slate-900 uppercase tracking-wider text-[10px] mb-1">Shipping Address</h3>
                        <p className="font-bold text-slate-800">{order.address?.firstName} {order.address?.lastName}</p>
                        <p className="text-slate-500">{order.address?.street}, {order.address?.city}</p>
                        <p className="text-slate-500">{order.address?.state} - {order.address?.zipcode}</p>
                        <p className="text-slate-500">📞 {order.address?.phone}</p>
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 uppercase tracking-wider text-[10px] mb-1">Payment Method</h3>
                        <span className="inline-block px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 uppercase">
                            {order.paymentMethod} {order.payment ? '(Paid ✓)' : '(Pending)'}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-2">Status: <span className="font-extrabold text-emerald-600">{order.status}</span></p>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate('/my-orders')}
                        className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer text-center"
                    >
                        Track Order Status →
                    </button>
                    <button
                        onClick={() => navigate('/products')}
                        className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer text-center shadow-md shadow-emerald-600/20"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
