import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems } = useAppContext();
  const navigate = useNavigate();

  return product && (
    <div 
        onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); window.scrollTo(0, 0) }} 
        className="group bg-white border border-slate-100 rounded-3xl p-4 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:border-slate-200 transition-all duration-300 flex flex-col h-full cursor-pointer relative"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center p-4 mb-3 group-hover:bg-emerald-50/30 transition-colors">
        <img
          className="group-hover:scale-105 transition-transform duration-500 max-h-full max-w-full object-contain filter drop-shadow-sm"
          src={product.image && product.image.length > 0 ? product.image[0] : assets.upload_area}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = assets.upload_area;
          }}
        />

        {/* Discount Badge */}
        {product.price > product.offerPrice && (
            <div className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
            </div>
        )}
      </div>
      
      {/* Info Section */}
      <div className="flex flex-col flex-grow">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{product.category}</span>
        <h3 className="text-slate-900 font-extrabold text-sm line-clamp-2 mb-2 leading-snug group-hover:text-emerald-600 transition-colors">
            {product.name}
        </h3>
        
        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-3">
          {Array(5).fill('').map((_, i) => (
            <svg key={i} className={`w-3 h-3 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          ))}
          <span className="text-[11px] font-semibold text-slate-400 ml-1">4.2</span>
        </div>
        
        {/* Pricing & Add Button */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100/80">
          <div className="flex flex-col">
            {product.price > product.offerPrice && (
              <span className="text-slate-400 text-xs line-through font-semibold">{currency}{product.price}</span>
            )}
            <span className="text-emerald-600 font-black text-lg leading-tight">{currency}{product.offerPrice}</span>
          </div>
          
          <div onClick={(e) => { e.stopPropagation(); }} className="relative">
            {!cartItems[product._id] ? (
              <button
                className="flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3.5 py-1.5 rounded-xl text-xs font-extrabold hover:bg-emerald-600 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
                onClick={() => addToCart(product._id)}
              >
                <span>+ ADD</span>
              </button>
            ) : (
              <div className="flex items-center justify-between gap-2.5 bg-emerald-600 text-white px-2.5 py-1.5 rounded-xl select-none shadow-md shadow-emerald-600/20">
                <button
                  onClick={() => { removeFromCart(product._id) }}
                  className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded-md transition-colors font-black text-xs cursor-pointer"
                >
                  -
                </button>
                <span className="text-xs font-black min-w-[1ch] text-center">{cartItems[product._id]}</span>
                <button
                  onClick={() => { addToCart(product._id) }}
                  className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded-md transition-colors font-black text-xs cursor-pointer"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
