import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';

const Shop = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Pull product state from Redux
  const { products, isLoading, error } = useSelector((state) => state.products);

  // Extract the ?category= parameter from the URL
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    // Dispatch the thunk to fetch products on mount
    dispatch(fetchProducts());
  }, [dispatch]);

  // Efficiently filter the global products array based on the URL parameter
  const displayedProducts = useMemo(() => {
    if (!categoryFilter || !products) return products || [];
    
    return products.filter((product) => 
      product.tags && product.tags.includes(categoryFilter.toLowerCase())
    );
  }, [products, categoryFilter]);

  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-neutral-50 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-lg w-full">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 uppercase">
            {categoryFilter ? `${categoryFilter} Collection` : 'Shop All'}
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            {displayedProducts.length} {displayedProducts.length === 1 ? 'product' : 'products'} available
          </p>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-stone-200">
            <h3 className="text-lg font-medium text-stone-900">No products found</h3>
            <p className="mt-1 text-sm text-stone-500">Try removing the category filter or check back later.</p>
            <Link to="/shop" className="mt-4 inline-block text-sm font-semibold text-stone-900 hover:underline">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-x-6 lg:gap-x-8">
            {displayedProducts.map((product) => {
              // Printify stores price in cents on the variant level
              const lowestPrice = Math.min(...product.variants.map(v => v.price)) / 100;
              const productImage = product.images[0]?.src || 'https://placehold.co/600x600?text=No+Image';

              return (
                <Link key={product.id} to={`/product/${product.id}`} className="group block">
                  <div className="relative w-full h-80 bg-white rounded-none overflow-hidden border border-stone-200 group-hover:border-stone-400 transition-colors">
                    <img
                      src={productImage}
                      alt={product.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-4 flex flex-col items-center text-center">
                    <h3 className="text-sm font-medium text-stone-900 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-stone-500">
                      ${lowestPrice.toFixed(2)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Shop;
