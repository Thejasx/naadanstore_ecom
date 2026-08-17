import React from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Categories = () => {
    const { navigate, categories, loading } = useAppContext()

    if (loading) {
        return (
            <div className='mt-12'>
                <h2 className='text-2xl font-extrabold text-slate-900 tracking-tight'>Shop by Category</h2>
                <div className='mt-6 text-center py-12'>
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
            </div>
        )
    }

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <div className='mt-12 sm:mt-16'>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h2 className='text-xl sm:text-2xl font-black text-slate-900 tracking-tight'>Explore Departments</h2>
                    <p className="text-slate-500 text-xs mt-0.5">Fresh items delivered straight to your door</p>
                </div>
                <button 
                    onClick={() => navigate('/products')}
                    className='text-emerald-600 font-extrabold text-xs hover:text-emerald-700 transition-colors hidden sm:flex items-center gap-1 cursor-pointer'
                >
                    <span>View Catalog</span>
                    <span>→</span>
                </button>
            </div>
            
            <div className='grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4'>
                {categories.map((category, index) => (
                    <div 
                        key={category._id || index} 
                        className='group bg-white border border-slate-100 rounded-3xl p-4 flex flex-col items-center gap-3 cursor-pointer shadow-xs hover:shadow-xl hover:shadow-slate-200/50 hover:border-emerald-200 transition-all duration-300'
                        onClick={() => {
                            navigate(`/products/${category.path.toLowerCase()}`);
                            window.scrollTo(0, 0);
                        }}
                    >
                        <div 
                            className='w-full aspect-square rounded-2xl flex items-center justify-center p-3 transition-transform duration-500 group-hover:scale-105'
                            style={{ backgroundColor: category.bgColor || '#F8FAFC' }}
                        >
                            <img 
                                src={category.image || assets.upload_area} 
                                alt={category.text} 
                                className='w-full h-full object-contain filter drop-shadow-xs' 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = assets.upload_area;
                                }}
                            />
                        </div>
                        <p className='text-xs font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors text-center line-clamp-1'>
                            {category.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Categories