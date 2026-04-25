import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../utils/api';

const MyOrders = () => {
    const { currency, user } = useAppContext();
    const [orderData, setOrderData] = useState([]);

    const fetchOrders = async () => {
        try {
            if (!user) return;
            const { data } = await api.get('/orders/userorders');
            if (data.success) {
                setOrderData(data.orders);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [user]);

    return (
        <div className="pt-16">
            <div className="text-2xl">
                <div className="inline-flex gap-2 items-center mb-3">
                    <p className="text-gray-500">MY <span className="text-gray-700 font-medium">ORDERS</span></p>
                    <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
                </div>
            </div>

            <div>
                {orderData.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        No orders found.
                    </div>
                ) : (
                    orderData.map((order, index) => (
                        <div key={index} className="py-4 border-t border-b border-gray-200 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-start gap-6 text-sm">
                                <div className="flex flex-col gap-1">
                                    {order.items.map((item, i) => (
                                        <p key={i} className="sm:text-base font-medium">{item.name} x {item.quantity}</p>
                                    ))}
                                    <p className="mt-1">Date: <span className="text-gray-400">{new Date(order.date).toDateString()}</span></p>
                                    <p className="mt-1">Payment Method: <span className="text-gray-400">{order.paymentMethod}</span></p>
                                </div>
                            </div>
                            <div className="md:w-1/2 flex justify-between">
                                <div className="flex items-center gap-2">
                                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                    <p className="text-sm md:text-base">{order.status}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{currency}{order.amount}</p>
                                    <button onClick={fetchOrders} className="border px-4 py-2 text-sm font-medium rounded-sm mt-2 hover:bg-gray-50 transition">Track Order</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrders;
