import React from "react";
import { assets, footerLinks } from "../assets/assets";

const Footer = () => {
    return (
        <footer className="mt-20 bg-slate-900 text-slate-300 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
                    {/* Brand Info */}
                    <div className="md:col-span-5 space-y-4">
                        <img className="h-9 w-auto brightness-0 invert" src={assets.logo} alt="Naadan Store Logo"/>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            We deliver fresh groceries, organic produce, and daily essentials straight to your door. Trusted by thousands for quality and fast delivery.
                        </p>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {footerLinks.map((section, index) => (
                            <div key={index}>
                                <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4">{section.title}</h3>
                                <ul className="space-y-2 text-xs font-semibold text-slate-400">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <a href={link.url} className="hover:text-emerald-400 transition-colors">{link.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                    <p>© {new Date().getFullYear()} Naadan Store. All rights reserved.</p>
                    <p className="text-emerald-400 font-semibold">Freshness Guaranteed 🌿</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;