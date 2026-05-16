const categories = [
  "Laptops",
  "Gaming",
  "Smartphones",
  "Headphones",
  "Smart Watches",
  "Accessories",
];

export default function CategoriesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-black">
            Shop Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((category) => (
            <div
              key={category}
              className="rounded-3xl bg-[#111827] border border-gray-800 p-6 hover:border-cyan-500/40 transition cursor-pointer hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 mb-5" />

              <h3 className="font-semibold text-lg">
                {category}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}