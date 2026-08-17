import React from 'react'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-800 text-white shadow-xl shadow-emerald-700/15 my-4 sm:my-6 p-6 sm:p-12 md:p-16'>
      {/* Background Decorative Blur circles */}
      <div className='absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute right-1/3 -top-10 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none' />

      <div className='relative z-10 max-w-xl'>
        <span className='inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider'>
          <span>⚡ Fast Delivery</span>
          <span>•</span>
          <span>100% Farm Fresh</span>
        </span>

        <h1 className='text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight sm:leading-tight'>
          Freshness You Trust, <span className='text-emerald-200'>Savings You Love</span>
        </h1>
        
        <p className='text-emerald-100 text-sm sm:text-base mt-3 leading-relaxed max-w-md'>
          Get handpicked organic fruits, farm-fresh vegetables, dairy & spices delivered to your doorstep in minutes.
        </p>

        <div className='flex items-center gap-3 mt-6 sm:mt-8'>
          <Link 
            to="/products" 
            className='px-6 sm:px-8 py-3 bg-white hover:bg-slate-100 active:bg-slate-200 text-emerald-800 font-extrabold text-sm rounded-full shadow-lg shadow-black/10 transition-all cursor-pointer inline-flex items-center gap-2'
          >
            <span>Shop Now</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MainBanner
