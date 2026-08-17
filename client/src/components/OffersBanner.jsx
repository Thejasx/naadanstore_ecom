import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const OffersBanner = () => {
    const [offers, setOffers] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [copiedCode, setCopiedCode] = useState('');

    useEffect(() => {
        fetchOffersAndCoupons();
    }, []);

    const fetchOffersAndCoupons = async () => {
        try {
            const [offerRes, couponRes] = await Promise.all([
                api.get('/offers'),
                api.get('/coupons')
            ]);
            if (offerRes.data.success) setOffers(offerRes.data.offers);
            if (couponRes.data.success) setCoupons(couponRes.data.coupons);
        } catch (error) {
            console.error('Error loading deals:', error);
        }
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success(`Coupon "${code}" copied to clipboard!`);
        setTimeout(() => setCopiedCode(''), 3000);
    };

    return (
        <div className="space-y-6 my-4">
            {/* Top Deal Ticker Bar */}
            {coupons.length > 0 && (
                <div className="bg-slate-900 text-white py-2 px-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-md overflow-hidden">
                    <div className="flex items-center gap-2 animate-pulse">
                        <span className="bg-rose-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                            DEAL TICKER
                        </span>
                        <span className="truncate">
                            🔥 Use Coupon <span className="text-amber-300 font-extrabold">{coupons[0]?.code}</span> for {coupons[0]?.discountPercentage}% OFF! (Min order ₹{coupons[0]?.minOrderAmount})
                        </span>
                    </div>
                    <button
                        onClick={() => handleCopyCode(coupons[0]?.code)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-xl text-[11px] font-extrabold transition-all flex-shrink-0 cursor-pointer ml-2"
                    >
                        {copiedCode === coupons[0]?.code ? 'COPIED! ✓' : 'COPY CODE'}
                    </button>
                </div>
            )}

            {/* Featured Promotional Banners Carousel / Cards */}
            {offers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {offers.map((offer) => (
                        <div
                            key={offer._id}
                            className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r ${offer.bgGradient || 'from-emerald-600 to-teal-800'} text-white shadow-xl shadow-emerald-700/15 flex flex-col justify-between group`}
                        >
                            <div className="relative z-10 max-w-sm space-y-2">
                                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                                    {offer.badge || 'PROMO DEAL'}
                                </span>
                                <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                                    {offer.title}
                                </h2>
                                <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                                    {offer.subtitle}
                                </p>
                                {offer.code && (
                                    <div className="pt-2">
                                        <button
                                            onClick={() => handleCopyCode(offer.code)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-black hover:bg-slate-100 transition-all cursor-pointer shadow-md"
                                        >
                                            <span>USE CODE: <span className="text-emerald-700">{offer.code}</span></span>
                                            <span className="text-emerald-600">{copiedCode === offer.code ? '✓ Copied' : '📋 Copy'}</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Background Image / Decoration */}
                            {offer.image && (
                                <img
                                    src={offer.image}
                                    alt={offer.title}
                                    className="absolute right-0 bottom-0 max-h-36 sm:max-h-44 object-contain opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Coupons Strip */}
            {coupons.length > 0 && (
                <div className="bg-emerald-50/80 border border-emerald-100 rounded-3xl p-4 sm:p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🎟️</span>
                            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Active Store Coupons</h3>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700">Click to copy discount codes</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {coupons.map((coupon) => (
                            <div
                                key={coupon._id}
                                onClick={() => handleCopyCode(coupon.code)}
                                className="bg-white border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all group"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-slate-900 text-sm tracking-wider">{coupon.code}</span>
                                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                                            {coupon.discountPercentage}% OFF
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                                        Min Order ₹{coupon.minOrderAmount} • {coupon.description || 'Instant Discount'}
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-emerald-600 group-hover:scale-110 transition-transform pl-2">
                                    {copiedCode === coupon.code ? '✓ Copied' : 'Copy'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OffersBanner;
