import React from "react";
import { ShoppingCart, Leaf, Zap } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const MainBanner = () => {
  const { navigate } = useAppContext();
  return (
    <div className="relative w-full overflow-hidden">
<div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-emerald-50 to-transparent [mask-image:linear-gradient(to_right,black_40%,transparent_100%)] z-10 pointer-events-none"></div>
      <div className="absolute inset-0 md:block">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=700&fit=crop"
          alt="fresh groceries"
          className="w-full h-full object-cover object-right"
        />
      </div>

      <div className="relative z-20 w-full px-4 md:px-8 lg:px-16 py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 w-fit mb-6 px-4 py-2 bg-emerald-100 rounded-full">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
                Fresh & Organic
              </span>
            </div>

            <h1 className="text-2xl md:text-5xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              Farm Fresh to Your Door
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                {" "}
                Instantly
              </span>
            </h1>

            <p className="text-lg md:text-l text-slate-600 mb-8 leading-relaxed max-w-lg">
              Premium quality groceries delivered in minutes. Handpicked
              freshness with guaranteed savings every day.
            </p>

            <div className="flex items-center gap-3 mb-8 flex-nowrap">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 whitespace-nowrap">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-medium text-slate-700">
                  Under 30 mins
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 whitespace-nowrap">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-medium text-slate-700">
                  100% Fresh
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 whitespace-nowrap">
                <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-medium text-slate-700">
                  Best Prices
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => navigate("/products")}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                Start Shopping
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>

              <button
                onClick={() => navigate("/contact-us")}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-1 bg-white text-emerald-600 font-semibold rounded-xl border-2 border-emerald-200 hover:bg-emerald-50 transition-all duration-300 cursor-pointer"
              >
                Get in Touch
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
