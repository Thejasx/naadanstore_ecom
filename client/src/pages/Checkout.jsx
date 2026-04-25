import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { getCartAmount, currency, navigate, setcartItems, products, cartItems } = useAppContext();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            let orderItems = [];

            for (const id in cartItems) {
                if (cartItems[id] > 0) {
                    const itemInfo = structuredClone(products.find(product => product._id === id));
                    if (itemInfo) {
                        itemInfo.quantity = cartItems[id];
                        orderItems.push(itemInfo);
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount()
            }

            const { data } = await api.post('/orders/place', orderData);

            if (data.success) {
                setcartItems({});
                navigate('/order-confirmation', { state: { order: data.order } });
                toast.success("Order Placed Successfully!");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t border-gray-200">
            {/* Left Side: Delivery Information */}
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3">
                    <div className="inline-flex gap-2 items-center mb-3">
                        <p className="text-gray-500">DELIVERY <span className="text-gray-700 font-medium">INFORMATION</span></p>
                        <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="First name" />
                    <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last name" />
                </div>
                <input required onChange={onChangeHandler} name="email" value={formData.email} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Email address" />
                <input required onChange={onChangeHandler} name="street" value={formData.street} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street" />
                <div className="flex gap-3">
                    <input required onChange={onChangeHandler} name="city" value={formData.city} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="City" />
                    <input required onChange={onChangeHandler} name="state" value={formData.state} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="State" />
                </div>
                <div className="flex gap-3">
                    <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Zipcode" />
                    <input required onChange={onChangeHandler} name="country" value={formData.country} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Country" />
                </div>
                <input required onChange={onChangeHandler} name="phone" value={formData.phone} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Phone" />
            </div>

            {/* Right Side: Order Summary */}
            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <div className="text-2xl">
                        <div className="inline-flex gap-2 items-center mb-3">
                            <p className="text-gray-500">CART <span className="text-gray-700 font-medium">TOTALS</span></p>
                            <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-2 text-sm">
                        <div className="flex justify-between">
                            <p>Subtotal</p>
                            <p>{currency}{getCartAmount()}.00</p>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <p>Shipping Fee</p>
                            <p>{currency}0.00</p>
                        </div>
                        <hr />
                        <div className="flex justify-between text-base font-bold">
                            <b>Total</b>
                            <b>{currency}{getCartAmount()}.00</b>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <div className="text-xl sm:text-2xl my-3">
                        <div className="inline-flex gap-2 items-center mb-3">
                            <p className="text-gray-500">PAYMENT <span className="text-gray-700 font-medium">METHOD</span></p>
                            <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
                        </div>
                    </div>
                    {/* Payment Method Selection (Simplified) */}
                    <div className="flex gap-3 flex-col lg:flex-row">
                        <div className="flex items-center gap-3 border border-gray-300 p-2 px-3 cursor-pointer rounded bg-gray-50">
                            <p className="min-w-3.5 h-3.5 border rounded-full bg-primary"></p>
                            <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
                        </div>
                    </div>

                    <div className="w-full text-end mt-8">
                        <button type="submit" className="bg-primary text-white px-16 py-3 text-sm rounded active:bg-primary-dull transition">PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Checkout;
