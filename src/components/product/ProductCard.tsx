import { Heart, ShoppingCart, Star } from "lucide-react";

interface Props {
  title: string;
  image: string;
  price: number;
  oldPrice?: number;
}

export default function ProductCard({
  title,
  image,
  price,
  oldPrice,
}: Props) {
  return (
    <div className="group rounded-3xl bg-[#111827] border border-gray-800 overflow-hidden hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10">
      
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-cyan-500 transition">
          <Heart className="w-5 h-5 text-white" />
        </button>

        {/* Sale Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-bold">
          SALE
        </div>
      </div>

      {/* Product Content */}
      <div className="p-6">
        
        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-400 mb-3">
          <Star className="w-4 h-4 fill-yellow-400" />
          <span className="text-sm font-medium">4.8</span>

          <span className="text-gray-500 text-sm">
            (120 Reviews)
          </span>
        </div>

        {/* Product Title */}
        <h3 className="font-semibold text-lg leading-7 text-white line-clamp-2 min-h-[56px]">
          {title}
        </h3>

        {/* Price + Cart */}
        <div className="mt-5 flex items-center justify-between">
          
          {/* Price */}
          <div>
            <div className="text-2xl font-black text-white">
              ${price}
            </div>

            {oldPrice && (
              <div className="text-gray-500 line-through text-sm">
                ${oldPrice}
              </div>
            )}
          </div>

          {/* Add To Cart */}
          <button className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center hover:scale-105 transition duration-300 shadow-lg shadow-cyan-500/20">
            <ShoppingCart className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}