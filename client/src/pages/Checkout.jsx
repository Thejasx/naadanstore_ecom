import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { getCartAmount, currency, navigate, setcartItems, products, cartItems } = useAppContext();
    const location = useLocation();

    // Discount state passed from Cart page
    const appliedCouponCode = location.state?.appliedCouponCode || '';
    const discountAmount = location.state?.discountAmount || 0;

    const subtotal = getCartAmount();
    const finalAmount = Math.max(0, subtotal - discountAmount);

    const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'Razorpay'
    const [loading, setLoading] = useState(false);
    const [showTestModal, setShowTestModal] = useState(false);
    const [pendingOrder, setPendingOrder] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: 'India',
        phone: ''
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    };

    // Helper to load Razorpay SDK dynamically
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleVerifyPayment = async (orderId) => {
        try {
            const verifyRes = await api.post('/orders/verify-razorpay', { orderId });
            if (verifyRes.data.success) {
                setcartItems({});
                setShowTestModal(false);
                navigate('/order-confirmation', { state: { order: verifyRes.data.order } });
                toast.success("Razorpay Payment Successful & Order Confirmed! 🎉");
            }
        } catch (err) {
            toast.error('Payment Verification Failed');
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

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
                amount: finalAmount,
                couponCode: appliedCouponCode,
                discountAmount: discountAmount
            };

            if (paymentMethod === 'COD') {
                const { data } = await api.post('/orders/place', orderData);
                if (data.success) {
                    setcartItems({});
                    navigate('/order-confirmation', { state: { order: data.order } });
                    toast.success("Order Placed Successfully via Cash on Delivery!");
                } else {
                    toast.error(data.message);
                }
            } else if (paymentMethod === 'Razorpay') {
                const { data } = await api.post('/orders/razorpay', orderData);

                if (data.success) {
                    setPendingOrder(data.order);
                    const loaded = await loadRazorpayScript();

                    // If Razorpay SDK loaded and real order ID exists
                    if (loaded && data.isRealOrder && data.razorpayOrder?.id) {
                        const options = {
                            key: data.keyId || "rzp_test_TQkIRDHecjsihe",
                            amount: Math.round(finalAmount * 100),
                            currency: "INR",
                            name: "Naadan Store",
                            description: "Grocery & Produce Order",
                            order_id: data.razorpayOrder.id,
                            handler: async function (response) {
                                await handleVerifyPayment(data.order._id);
                            },
                            prefill: {
                                name: `${formData.firstName} ${formData.lastName}`,
                                email: formData.email,
                                contact: formData.phone
                            },
                            theme: {
                                color: "#059669"
                            }
                        };

                        try {
                            const rzp1 = new window.Razorpay(options);
                            rzp1.on('payment.failed', function () {
                                // Fallback to test modal if Razorpay modal fails locally
                                setShowTestModal(true);
                            });
                            rzp1.open();
                        } catch (err) {
                            setShowTestModal(true);
                        }
                    } else {
                        // Open sleek Razorpay Test Checkout Modal directly
                        setShowTestModal(true);
                    }
                } else {
                    toast.error(data.message);
                }
            }

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="py-8 max-w-6xl mx-auto font-sans text-slate-800 relative">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-8">Checkout & Shipping</h1>

            {/* Razorpay Test Payment Modal Dialog */}
            {showTestModal && pendingOrder && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-100 animate-scale">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl font-black flex items-center justify-center text-xs">
                                    RZP
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-900 text-sm">Razorpay Checkout</h3>
                                    <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-full">Test Mode Active</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowTestModal(false)}
                                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs">
                            <div className="flex justify-between font-bold text-slate-700">
                                <span>Merchant:</span>
                                <span>Naadan Store</span>
                            </div>
                            <div className="flex justify-between font-bold text-slate-700">
                                <span>Key ID:</span>
                                <span className="font-mono text-[11px] text-blue-600">rzp_test_TQkIRDHecjsihe</span>
                            </div>
                            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                                <span>Total Amount:</span>
                                <span className="text-base text-emerald-600">{currency}{finalAmount}.00</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Test Method</p>
                            <button
                                type="button"
                                onClick={() => handleVerifyPayment(pendingOrder._id)}
                                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-between cursor-pointer"
                            >
                                <span>Pay via GPay / PhonePe (Test Success)</span>
                                <span>✓</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleVerifyPayment(pendingOrder._id)}
                                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-between cursor-pointer"
                            >
                                <span>Pay via Credit / Debit Card (Test Success)</span>
                                <span>💳</span>
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowTestModal(false)}
                            className="w-full py-2.5 text-slate-500 hover:text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
                        >
                            Cancel Payment
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Address Info */}
                <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Delivery Address</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">First Name</label>
                            <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" type="text" placeholder="John" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Last Name</label>
                            <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" type="text" placeholder="Doe" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                        <input required onChange={onChangeHandler} name="email" value={formData.email} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" type="email" placeholder="john@example.com" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Street Address</label>
                        <input required onChange={onChangeHandler} name="street" value={formData.street} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" type="text" placeholder="Flat No., House Name, Street" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">City</label>
                            <input required onChange={onChangeHandler} name="city" value={formData.city} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" type="text" placeholder="Kochi" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">State</label>
                            <input required onChange={onChangeHandler} name="state" value={formData.state} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" type="text" placeholder="Kerala" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Zipcode</label>
                            <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" type="number" placeholder="682001" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
                            <input required onChange={onChangeHandler} name="phone" value={formData.phone} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" type="tel" placeholder="+91 9876543210" />
                        </div>
                    </div>
                </div>

                {/* Right Side: Order Summary & Payment Mode */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Order Items & Totals */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Payment Overview</h2>

                        <div className="space-y-2 text-xs font-semibold text-slate-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-bold text-slate-900">{currency}{subtotal}.00</span>
                            </div>

                            {discountAmount > 0 && (
                                <div className="flex justify-between text-emerald-600 font-bold">
                                    <span>Coupon Discount ({appliedCouponCode})</span>
                                    <span>-{currency}{discountAmount}.00</span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span className="font-bold text-emerald-600">FREE</span>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-base font-black text-slate-900">
                                <span>Total Payable</span>
                                <span className="text-xl text-emerald-600">{currency}{finalAmount}.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Select Payment Option</h2>

                        <div className="space-y-3">
                            {/* Cash on Delivery */}
                            <div
                                onClick={() => setPaymentMethod('COD')}
                                className={`p-4 border rounded-2xl cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'COD'
                                        ? 'border-emerald-500 bg-emerald-50/60 shadow-xs'
                                        : 'border-slate-200 bg-white hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'}`}>
                                        {paymentMethod === 'COD' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900">Cash on Delivery (COD)</p>
                                        <p className="text-[11px] text-slate-500">Pay cash upon delivery at your door</p>
                                    </div>
                                </div>
                                <span className="text-lg">💵</span>
                            </div>

                            {/* Razorpay Option */}
                            <div
                                onClick={() => setPaymentMethod('Razorpay')}
                                className={`p-4 border rounded-2xl cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'Razorpay'
                                        ? 'border-emerald-500 bg-emerald-50/60 shadow-xs'
                                        : 'border-slate-200 bg-white hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Razorpay' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'}`}>
                                        {paymentMethod === 'Razorpay' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-black text-slate-900">Razorpay (UPI / Card / Netbanking)</p>
                                            <span className="bg-blue-100 text-blue-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full">TEST MODE</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500">Instant online checkout via GPay, PhonePe, Cards</p>
                                    </div>
                                </div>
                                <span className="text-lg">💳</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-60 mt-4 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Processing Order...</span>
                                </>
                            ) : (
                                <span>{paymentMethod === 'Razorpay' ? 'Proceed to Razorpay Payment →' : 'Confirm Order (COD) →'}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Checkout;
