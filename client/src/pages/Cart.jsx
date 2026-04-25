import React from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const Cart = () => {
    const { products, cartItems, removeFromCart, addToCart, updateCartItem, getCartAmount, currency, navigate } = useAppContext();

    const cartData = Object.keys(cartItems).map(id => {
        const product = products.find(p => p._id === id);
        return product ? { ...product, quantity: cartItems[id] } : null;
    }).filter(item => item !== null);

    return (
        <div className="pt-14">
            <div className="text-2xl mb-3">
                <div className="inline-flex gap-2 items-center mb-3">
                    <p className="text-gray-500">YOUR <span className="text-gray-700 font-medium">CART</span></p>
                    <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
                </div>
            </div>

            <div>
                {cartData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <img src={assets.nav_cart_icon} className="w-20 opacity-20 mb-4" alt="" />
                        <p className="text-gray-500 text-lg">Your cart is empty</p>
                        <button onClick={() => navigate('/products')} className="mt-4 px-8 py-2 bg-primary text-white rounded-full">Shop Now</button>
                    </div>
                ) : (
                    cartData.map((item, index) => (
                        <div key={index} className="py-4 border-t border-b border-gray-200 text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4">
                            <div className="flex items-start gap-6">
                                <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
                                <div>
                                    <p className="text-xs sm:text-lg font-medium">{item.name}</p>
                                    <div className="flex items-center gap-5 mt-2">
                                        <p>{currency}{item.offerPrice}</p>
                                    </div>
                                </div>
                            </div>
                            <input
                                onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateCartItem(item._id, Number(e.target.value))}
                                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                                type="number"
                                min={1}
                                defaultValue={item.quantity}
                            />
                            <img
                                onClick={() => updateCartItem(item._id, 0)}
                                className="w-4 sm:w-5 cursor-pointer"
                                src={assets.bin_icon}
                                alt="Remove"
                            />
                        </div>
                    ))
                )}
            </div>

            {cartData.length > 0 && (
                <div className="flex justify-end my-20">
                    <div className="w-full sm:w-[450px]">
                        <div className="text-2xl">
                            <div className="inline-flex gap-2 items-center mb-3">
                                <p className="text-gray-500">CART <span className="text-gray-700 font-medium">TOTALS</span></p>
                                <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-2 text-sm">
                            <div className="flex justify-between">
                                <p>Subtotal</p>
                                <p>{currency}{getCartAmount()}.00</p>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                <p>Shipping Fee</p>
                                <p>{currency}0.00</p>
                            </div>
                            <hr />
                            <div className="flex justify-between text-base font-bold">
                                <b>Total</b>
                                <b>{currency}{getCartAmount()}.00</b>
                            </div>
                        </div>
                        <div className="w-full text-end">
                            <button onClick={() => navigate('/checkout')} className="bg-primary text-white text-sm my-8 px-8 py-3 rounded active:bg-primary-dull transition">PROCEED TO CHECKOUT</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
