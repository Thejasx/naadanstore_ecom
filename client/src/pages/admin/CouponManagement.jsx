import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';

const CouponManagement = () => {
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('coupons'); // 'coupons' | 'offers'
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Coupon Form Data
    const [couponForm, setCouponForm] = useState({
        code: '',
        discountPercentage: '',
        minOrderAmount: '',
        maxDiscount: '',
        description: '',
    });

    // Offer Banner Form Data
    const [offerForm, setOfferForm] = useState({
        title: '',
        subtitle: '',
        code: '',
        badge: 'SPECIAL DEAL',
        image: '',
        bgGradient: 'from-emerald-600 to-teal-800',
    });

    useEffect(() => {
        checkAuth();
        fetchData();
    }, []);

    const checkAuth = () => {
        const userData = localStorage.getItem('user');
        if (!userData) { navigate('/admin/login'); return; }
        const parsedUser = JSON.parse(userData);
        if (!parsedUser.isAdmin) navigate('/');
    };

    const fetchData = async () => {
        try {
            const [cRes, oRes] = await Promise.all([
                api.get('/coupons'),
                api.get('/offers')
            ]);
            if (cRes.data.success) setCoupons(cRes.data.coupons);
            if (oRes.data.success) setOffers(oRes.data.offers);
        } catch (error) {
            toast.error('Failed to load coupons or offers');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/coupons', couponForm);
            if (data.success) {
                toast.success('Coupon created successfully!');
                setCouponForm({ code: '', discountPercentage: '', minOrderAmount: '', maxDiscount: '', description: '' });
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create coupon');
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (!window.confirm('Delete this coupon?')) return;
        try {
            const { data } = await api.delete(`/coupons/${id}`);
            if (data.success) {
                toast.success('Coupon deleted');
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const handleCreateOffer = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/offers', offerForm);
            if (data.success) {
                toast.success('Offer banner published!');
                setOfferForm({ title: '', subtitle: '', code: '', badge: 'SPECIAL DEAL', image: '', bgGradient: 'from-emerald-600 to-teal-800' });
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create offer');
        }
    };

    const handleDeleteOffer = async (id) => {
        if (!window.confirm('Delete this offer banner?')) return;
        try {
            const { data } = await api.delete(`/offers/${id}`);
            if (data.success) {
                toast.success('Offer banner deleted');
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const navItems = [
        { label: 'Dashboard', icon: HomeIcon, path: '/admin/dashboard' },
        { label: 'Categories', icon: GridIcon, path: '/admin/categories' },
        { label: 'Products', icon: BoxIcon, path: '/admin/products' },
        { label: 'Offers & Coupons', icon: TicketIcon, path: '/admin/coupons', active: true },
        { label: 'View Storefront', icon: StoreIcon, path: '/' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <Link to="/admin/dashboard" className="flex items-center gap-3">
                        <img src={assets.logo} alt="Logo" className="h-8 object-contain" />
                    </Link>
                    <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Management</div>
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${item.active
                                ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${item.active ? 'text-emerald-600' : 'text-slate-400'}`} />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h1 className="text-lg font-bold text-slate-800">Coupons & Offer Banners</h1>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
                        <button
                            onClick={() => setActiveTab('coupons')}
                            className={`pb-3 border-b-2 transition-all cursor-pointer ${activeTab === 'coupons' ? 'border-emerald-600 text-emerald-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            Discount Coupons ({coupons.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('offers')}
                            className={`pb-3 border-b-2 transition-all cursor-pointer ${activeTab === 'offers' ? 'border-emerald-600 text-emerald-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            Promotional Deal Banners ({offers.length})
                        </button>
                    </div>

                    {/* Coupons Tab */}
                    {activeTab === 'coupons' && (
                        <div className="space-y-6">
                            {/* Create Coupon Form */}
                            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
                                <h2 className="text-lg font-extrabold text-slate-900 mb-4">Create New Discount Coupon</h2>
                                <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Coupon Code</label>
                                        <input
                                            type="text" required value={couponForm.code}
                                            onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                                            placeholder="e.g. NAADAN20"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Discount (% Off)</label>
                                        <input
                                            type="number" required min="1" max="100" value={couponForm.discountPercentage}
                                            onChange={(e) => setCouponForm({ ...couponForm, discountPercentage: e.target.value })}
                                            placeholder="e.g. 20"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Min Order Amount (₹)</label>
                                        <input
                                            type="number" min="0" value={couponForm.minOrderAmount}
                                            onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: e.target.value })}
                                            placeholder="e.g. 200"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Max Discount Cap (₹)</label>
                                        <input
                                            type="number" min="0" value={couponForm.maxDiscount}
                                            onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })}
                                            placeholder="e.g. 150"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <div className="sm:col-span-3">
                                        <input
                                            type="text" value={couponForm.description}
                                            onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                                            placeholder="Description: e.g. 20% discount on orders above ₹200"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                                    >
                                        + Publish Coupon
                                    </button>
                                </form>
                            </div>

                            {/* Active Coupons List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {coupons.map((coupon) => (
                                    <div key={coupon._id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-black text-slate-900 text-base">{coupon.code}</span>
                                                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                                    {coupon.discountPercentage}% OFF
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-2">{coupon.description || 'Valid on store items'}</p>
                                            <p className="text-[11px] font-semibold text-slate-400 mt-2">
                                                Min Order: ₹{coupon.minOrderAmount} | Max Cap: ₹{coupon.maxDiscount}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCoupon(coupon._id)}
                                            className="mt-4 w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                                        >
                                            Delete Coupon
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Offers Tab */}
                    {activeTab === 'offers' && (
                        <div className="space-y-6">
                            {/* Create Offer Form */}
                            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
                                <h2 className="text-lg font-extrabold text-slate-900 mb-4">Add Homepage Banner Offer</h2>
                                <form onSubmit={handleCreateOffer} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Headline Title</label>
                                        <input
                                            type="text" required value={offerForm.title}
                                            onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                                            placeholder="e.g. Fresh Harvest Sale! 🌾"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subtitle / Details</label>
                                        <input
                                            type="text" value={offerForm.subtitle}
                                            onChange={(e) => setOfferForm({ ...offerForm, subtitle: e.target.value })}
                                            placeholder="e.g. Up to 30% off on organic fruits"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Linked Coupon Code (Optional)</label>
                                        <input
                                            type="text" value={offerForm.code}
                                            onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value.toUpperCase() })}
                                            placeholder="e.g. NAADAN20"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Badge Text</label>
                                        <input
                                            type="text" value={offerForm.badge}
                                            onChange={(e) => setOfferForm({ ...offerForm, badge: e.target.value })}
                                            placeholder="e.g. HOT DEAL 🔥"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Image URL (Optional)</label>
                                        <input
                                            type="url" value={offerForm.image}
                                            onChange={(e) => setOfferForm({ ...offerForm, image: e.target.value })}
                                            placeholder="https://images.unsplash.com/..."
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="sm:col-span-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                                    >
                                        + Publish Offer Banner
                                    </button>
                                </form>
                            </div>

                            {/* Active Offers List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {offers.map((offer) => (
                                    <div key={offer._id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                                        <div>
                                            <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase tracking-wider mb-2">
                                                {offer.badge}
                                            </span>
                                            <h3 className="font-extrabold text-slate-900 text-base">{offer.title}</h3>
                                            <p className="text-xs text-slate-500 mt-1">{offer.subtitle}</p>
                                            {offer.code && (
                                                <p className="text-xs font-bold text-emerald-600 mt-2">Code: {offer.code}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteOffer(offer._id)}
                                            className="mt-4 w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                                        >
                                            Delete Offer Banner
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const HomeIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const GridIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const BoxIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const TicketIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>;
const StoreIcon = (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" /></svg>;

export default CouponManagement;
