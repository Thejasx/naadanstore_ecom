import React from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Categories = () => {

    const { navigate, categories, loading } = useAppContext()

    if (loading) {
        return (
            <div className='mt-16'>
                <p className='text-2xl md:text-3xl font-medium'>Categories</p>
                <div className='mt-6 text-center py-12'>
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        )
    }

    if (!categories || categories.length === 0) {
        return (
            <div className='mt-16'>
                <p className='text-2xl md:text-3xl font-medium'>Categories</p>
                <div className='mt-6 text-center py-12'>
                    <p className='text-gray-600'>No categories available</p>
                </div>
            </div>
        )
    }

    return (
        <div className='mt-20'>
            <div className='flex items-center justify-between mb-8'>
                <h2 className='text-2xl md:text-3xl font-bold text-gray-800 tracking-tight'>Browse Categories</h2>
                <button 
                    onClick={() => navigate('/products')}
                    className='text-primary font-semibold hover:underline transition-all hidden sm:block'
                >
                    View All Categories &rarr;
                </button>
            </div>
            
            <div className='grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-8'>
                {categories.map((category, index) => (
                    <div 
                        key={category._id || index} 
                        className='group flex flex-col items-center gap-3 cursor-pointer'
                        onClick={() => {
                            navigate(`/products/${category.path.toLowerCase()}`);
                            scrollTo(0, 0)
                        }}
                    >
                        <div 
                            className='w-full aspect-square rounded-3xl flex items-center justify-center p-6 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl'
                            style={{ 
                                backgroundColor: category.bgColor,
                                boxShadow: `0 10px 30px -10px ${category.bgColor}aa`
                            }}
                        >
                            <img 
                                src={category.image || assets.upload_area} 
                                alt={category.text} 
                                className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-500' 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = assets.upload_area;
                                }}
                            />
                        </div>
                        <p className='text-sm md:text-base font-bold text-gray-700 group-hover:text-primary transition-colors text-center px-1'>
                            {category.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Categories