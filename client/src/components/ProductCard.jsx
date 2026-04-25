import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";



const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems } = useAppContext();
  const navigate = useNavigate();


  return product && (
    <div 
        onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0) }} 
        className="group border border-gray-100 rounded-2xl p-4 bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center p-4 mb-4">
        <img
          className="group-hover:scale-110 transition-transform duration-500 max-h-full max-w-full object-contain"
          src={product.image && product.image.length > 0 ? product.image[0] : assets.upload_area}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = assets.upload_area;
          }}
        />
        {product.price > product.offerPrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
            </div>
        )}
      </div>
      
      <div className="flex flex-col flex-grow">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="text-gray-800 font-semibold text-base line-clamp-2 mb-2 h-12 leading-tight">
            {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-3">
          {Array(5).fill('').map((_, i) => (
            <img
              key={i}
              className="w-3"
              src={i < 4 ? assets.star_icon : assets.star_dull_icon}
              alt="star"
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">(4.0)</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs line-through">{currency}{product.price}</span>
            <span className="text-primary font-bold text-lg leading-tight">{currency}{product.offerPrice}</span>
          </div>
          
          <div onClick={(e) => { e.stopPropagation(); }} className="relative">
            {!cartItems[product._id] ? (
              <button
                className="flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl font-bold hover:bg-primary hover:text-white transition-all duration-300 active:scale-95"
                onClick={() => addToCart(product._id)}
              >
                <img src={assets.add_icon} alt="add" className="w-3 brightness-0 invert group-hover:invert-0" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-between gap-3 bg-primary text-white px-2 py-2 rounded-xl select-none shadow-lg shadow-primary/20">
                <button
                  onClick={() => { removeFromCart(product._id) }}
                  className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors font-bold"
                >
                  -
                </button>
                <span className="text-sm font-bold min-w-[1ch] text-center">{cartItems[product._id]}</span>
                <button
                  onClick={() => { addToCart(product._id) }}
                  className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors font-bold"
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
