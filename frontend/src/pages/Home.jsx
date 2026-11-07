import { Link } from 'react-router-dom';

const Home = () => {
  // Temporary mock data until we connect the Printify /api/products endpoint
  const featuredProducts = [
    { id: '1', name: 'The Minimalist Calico Hoodie', price: 45.00, image: 'https://images.unsplash.com/photo-1578587018452-892bace03524?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: '2', name: 'Embroidered Paw Classic Tee', price: 28.00, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: '3', name: 'Companion Heavyweight Crewneck', price: 55.00, image: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: '4', name: 'Feline Motif Canvas Tote', price: 22.00, image: 'https://images.unsplash.com/photo-1597348989645-46b190ce4918?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-stone-900 text-white h-[70vh] flex items-center justify-center">
        {/* Optional: Add a dark overlay background image here */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Wear Your Loyalty.
          </h1>
          <p className="text-lg md:text-xl text-stone-300 mb-10">
            Premium, print-on-demand apparel and accessories designed for the modern pet owner. 
          </p>
          <Link 
            to="/shop" 
            className="bg-white text-stone-900 px-8 py-4 text-sm font-semibold uppercase tracking-widest hover:bg-stone-200 transition-colors"
          >
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-semibold text-stone-900 mb-10 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <Link to="/shop?category=dogs" className="group relative h-80 overflow-hidden bg-stone-200 flex items-end justify-center">
            {/* Replace with actual category images */}
            <div className="absolute inset-0 bg-stone-300 group-hover:scale-105 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h3 className="relative z-10 text-white text-xl font-medium mb-8 tracking-wide">For Dog Owners</h3>
          </Link>

          <Link to="/shop?category=cats" className="group relative h-80 overflow-hidden bg-stone-200 flex items-end justify-center">
            <div className="absolute inset-0 bg-stone-400 group-hover:scale-105 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h3 className="relative z-10 text-white text-xl font-medium mb-8 tracking-wide">For Cat Owners</h3>
          </Link>

          <Link to="/shop?category=accessories" className="group relative h-80 overflow-hidden bg-stone-200 flex items-end justify-center">
            <div className="absolute inset-0 bg-stone-500 group-hover:scale-105 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h3 className="relative z-10 text-white text-xl font-medium mb-8 tracking-wide">Accessories</h3>
          </Link>

        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-2xl font-semibold text-stone-900">Featured Releases</h2>
            <Link to="/shop" className="text-sm font-medium text-stone-500 hover:text-stone-900 underline underline-offset-4">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="group">
                <div className="aspect-[4/5] bg-stone-100 mb-4 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center group-hover:opacity-80 transition-opacity"
                  />
                </div>
                <h3 className="text-sm font-medium text-stone-900">{product.name}</h3>
                <p className="text-sm text-stone-500 mt-1">${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
