import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const { user, setUser, setshowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount } = useAppContext();

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    }

    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate("/products");
        }
    }, [searchQuery])

    return (
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">

                {/* Brand Logo */}
                <NavLink to='/' onClick={() => setOpen(false)} className="flex items-center gap-2 flex-shrink-0">
                    <img className="h-9 w-auto object-contain" src={assets.logo} alt="Naadan Store Logo" />
                </NavLink>

                {/* Search Bar - Center */}
                <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
                    <div className="relative w-full">
                        <input
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                            className="w-full py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                            type="text"
                            placeholder="Search fresh groceries, fruits, spices..."
                        />
                        <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Navigation & Cart Actions */}
                <div className="hidden sm:flex items-center gap-6">
                    <NavLink to='/' className={({ isActive }) => `text-sm font-bold transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-600 hover:text-slate-900'}`}>
                        Home
                    </NavLink>
                    <NavLink to='/products' className={({ isActive }) => `text-sm font-bold transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-600 hover:text-slate-900'}`}>
                        Shop All
                    </NavLink>

                    {/* Cart Button */}
                    <div onClick={() => navigate("/cart")} className="relative cursor-pointer group p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <svg className="w-6 h-6 text-slate-700 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                        </svg>
                        {getCartCount() > 0 && (
                            <span className="absolute top-0 right-0 text-[11px] font-black text-white bg-emerald-600 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-scale">
                                {getCartCount()}
                            </span>
                        )}
                    </div>

                    {/* Auth User */}
                    {!user ? (
                        <button
                            onClick={() => setshowUserLogin(true)}
                            className="cursor-pointer px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-full shadow-sm shadow-emerald-600/20 transition-all"
                        >
                            Sign In
                        </button>
                    ) : (
                        <div className='relative group'>
                            <div className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-50 rounded-full transition-colors">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-xs border border-emerald-200">
                                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <span className="text-xs font-bold text-slate-700 max-w-[80px] truncate">{user.name?.split(' ')[0]}</span>
                            </div>
                            <ul className='hidden group-hover:block absolute top-full right-0 mt-1 bg-white shadow-xl border border-slate-100 py-2 w-44 rounded-2xl text-xs font-semibold text-slate-700 z-50 animate-fadeIn'>
                                <li onClick={() => navigate("/my-orders")} className='px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center gap-2'>
                                    <span>📦 My Orders</span>
                                </li>
                                {user.isAdmin && (
                                    <li onClick={() => navigate("/admin/dashboard")} className='px-4 py-2.5 hover:bg-emerald-50 text-emerald-700 cursor-pointer flex items-center gap-2 font-bold'>
                                        <span>⚙️ Admin Panel</span>
                                    </li>
                                )}
                                <li onClick={logout} className='px-4 py-2.5 hover:bg-rose-50 text-rose-600 cursor-pointer border-t border-slate-100 flex items-center gap-2'>
                                    <span>🚪 Logout</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Icon */}
                <div className='flex items-center gap-4 sm:hidden'>
                    <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                        <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                        </svg>
                        {getCartCount() > 0 && (
                            <span className="absolute -top-1.5 -right-2 text-[10px] font-bold text-white bg-emerald-600 w-4 h-4 rounded-full flex items-center justify-center">
                                {getCartCount()}
                            </span>
                        )}
                    </div>

                    <button onClick={() => setOpen(!open)} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {open ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {open && (
                <div className="sm:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3 shadow-lg">
                    <input
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        className="w-full py-2 px-4 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400"
                        type="text"
                        placeholder="Search products..."
                    />
                    <div className="flex flex-col space-y-2 pt-1 font-semibold text-sm text-slate-700">
                        <NavLink to="/" onClick={() => setOpen(false)} className="py-1">Home</NavLink>
                        <NavLink to="/products" onClick={() => setOpen(false)} className="py-1">Shop All</NavLink>
                        {user && <NavLink to="/my-orders" onClick={() => setOpen(false)} className="py-1">My Orders</NavLink>}
                        {user?.isAdmin && <NavLink to="/admin/dashboard" onClick={() => setOpen(false)} className="py-1 text-emerald-600 font-bold">Admin Dashboard</NavLink>}

                        {!user ? (
                            <button onClick={() => { setOpen(false); setshowUserLogin(true); }} className="w-full py-2.5 mt-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">
                                Sign In
                            </button>
                        ) : (
                            <button onClick={logout} className="w-full py-2.5 mt-2 bg-rose-50 text-rose-700 font-bold rounded-xl text-xs border border-rose-200">
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar