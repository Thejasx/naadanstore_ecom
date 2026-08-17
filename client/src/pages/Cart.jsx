import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Cart = () => {
    const { products, cartItems, removeFromCart, addToCart, updateCartItem, getCartAmount, currency, navigate } = useAppContext();
    const [couponCode, setCouponCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    const cartData = Object.keys(cartItems).map(id => {
        const product = products.find(p => p._id === id);
        return product ? { ...product, quantity: cartItems[id] } : null;
    }).filter(item => item !== null);

    const subtotal = getCartAmount();
    const finalTotal = Math.max(0, subtotal - appliedDiscount);

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        if (!couponCode.trim()) return;

        setValidatingCoupon(true);
        try {
            const { data } = await api.post('/coupons/apply', {
                code: couponCode,
                orderAmount: subtotal
            });

            if (data.success) {
                setAppliedDiscount(data.discount);
                setAppliedCoupon(data.coupon);
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid coupon');
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedDiscount(0);
        setAppliedCoupon(null);
        setCouponCode('');
        toast.success('Coupon removed');
    };

    const handleProceedToCheckout = () => {
        navigate('/checkout', {
            state: {
                appliedCouponCode: appliedCoupon?.code || '',
                discountAmount: appliedDiscount
            }
        });
    };

    return (
        <div className="py-8 max-w-6xl mx-auto font-sans text-slate-800">
            <div className="flex items-center gap-3 mb-8">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Your Shopping Cart</h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    {cartData.length} Items
                </span>
            </div>

            {cartData.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-xs">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-3xl">
                        🛒
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-800">Your cart is empty</h2>
                    <p className="text-slate-500 text-sm mt-1 mb-6">Looks like you haven't added any fresh items to your cart yet.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-full shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                        Explore Catalog & Shop Now →
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-4">
                        {cartData.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                                        <img
                                            src={item.image[0]}
                                            alt={item.name}
                                            className="max-h-full max-w-full object-contain"
                                            onError={(e) => { e.target.src = assets.upload_area; }}
                                        />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">{item.category}</span>
                                        <h3 className="font-extrabold text-slate-900 text-sm line-clamp-1">{item.name}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Price: <span className="font-extrabold text-slate-800">{currency}{item.offerPrice}</span></p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                        <button
                                            onClick={() => updateCartItem(item._id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                                        <button
                                            onClick={() => updateCartItem(item._id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="text-right min-w-[70px]">
                                        <p className="text-sm font-black text-emerald-600">{currency}{item.offerPrice * item.quantity}</p>
                                    </div>

                                    <button
                                        onClick={() => updateCartItem(item._id, 0)}
                                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                        title="Remove item"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary & Coupon Box */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Coupon Box */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Apply Coupon Code</h3>

                            {appliedCoupon ? (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">Code: {appliedCoupon.code}</span>
                                        <p className="text-[11px] text-emerald-600 font-semibold">{appliedCoupon.discountPercentage}% Discount Applied (-{currency}{appliedDiscount})</p>
                                    </div>
                                    <button
                                        onClick={handleRemoveCoupon}
                                        className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="Try NAADAN20"
                                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                    <button
                                        type="submit"
                                        disabled={validatingCoupon}
                                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
                                    >
                                        {validatingCoupon ? 'Checking...' : 'Apply'}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Totals Summary */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Order Summary</h3>

                            <div className="space-y-3 text-xs font-semibold text-slate-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-slate-900">{currency}{subtotal}.00</span>
                                </div>

                                {appliedDiscount > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-bold">
                                        <span>Coupon Discount ({appliedCoupon?.code})</span>
                                        <span>-{currency}{appliedDiscount}.00</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="font-bold text-emerald-600">FREE</span>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-base font-black text-slate-900">
                                    <span>Total Payable</span>
                                    <span className="text-xl text-emerald-600">{currency}{finalTotal}.00</span>
                                </div>
                            </div>

                            <button
                                onClick={handleProceedToCheckout}
                                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                            >
                                Proceed to Checkout →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
