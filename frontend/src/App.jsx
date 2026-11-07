import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/layout/Navbar';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import Login from './pages/Login';


function App() {
  return (
    <Router>
      {/* 
        flex flex-col min-h-screen ensures that the layout takes up at least the full viewport height. 
        This prevents the footer from floating up on pages with very little content.
      */}
      <div className="flex flex-col min-h-screen font-sans bg-neutral-50 text-stone-900">
        
        {/* Global Navbar */}
        <Navbar />

        {/* Dynamic Page Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="bg-stone-900 text-stone-400 text-center py-8 text-sm mt-auto">
          <p>© {new Date().getFullYear()} Pure Pet Canvas. All rights reserved.</p>
        </footer>
        
      </div>
    </Router>
  );
}

export default App;
