import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
    const { currency, navigate } = useAppContext();
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return (
            <div className="pt-20 text-center">
                <p className="text-xl font-medium">Order details not found.</p>
                <button onClick={() => navigate('/')} className="mt-4 bg-primary text-white px-8 py-2 rounded">Go Home</button>
            </div>
        );
    }

    return (
        <div className="pt-14 pb-20">
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Order Confirmed!</h1>
                <p className="text-gray-500 mt-2">Thank you for your purchase. Your order has been placed successfully.</p>
            </div>

            <div className="max-w-2xl mx-auto border border-gray-200 rounded-lg p-6 sm:p-10 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h2 className="text-xl font-bold">Order Summary (Bill)</h2>
                    <p className="text-sm text-gray-500">Order ID: #{order._id.slice(-6).toUpperCase()}</p>
                </div>

                <div className="space-y-4 mb-8">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-gray-700">
                            <p>{item.name} <span className="text-gray-400 text-sm">x{item.quantity}</span></p>
                            <p>{currency}{item.offerPrice * item.quantity}.00</p>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4 space-y-2 mb-8 text-sm">
                    <div className="flex justify-between">
                        <p>Subtotal</p>
                        <p>{currency}{order.amount}.00</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Shipping</p>
                        <p>{currency}0.00</p>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <p>Total Amount</p>
                        <p>{currency}{order.amount}.00</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-gray-600">
                    <div>
                        <h3 className="font-bold text-gray-800 mb-2 uppercase">Shipping Address</h3>
                        <p>{order.address.firstName} {order.address.lastName}</p>
                        <p>{order.address.street}</p>
                        <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                        <p>{order.address.phone}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-2 uppercase">Payment Method</h3>
                        <p>{order.paymentMethod}</p>
                    </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => navigate('/my-orders')} className="bg-gray-800 text-white px-8 py-3 rounded hover:bg-black transition">View My Orders</button>
                    <button onClick={() => navigate('/products')} className="bg-primary text-white px-8 py-3 rounded hover:bg-primary-dull transition">Continue Shopping</button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
