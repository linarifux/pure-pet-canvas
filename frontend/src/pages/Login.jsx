import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import api from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Pull the current user from Redux to check if already logged in
  const { userInfo } = useSelector((state) => state.auth);

  // If a user was redirected here from another page (like /checkout), capture that URL
  const redirect = location.search ? location.search.split('=')[1] : '/';

  // If the user is already logged in, push them to the redirect page or home
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Axios POST using the configured utility
      const response = await api.post('/users/login', { email, password });

      // 1. Save user to Redux (which updates Navbar and localStorage)
      dispatch(setCredentials(response.data));
      
      // 2. JWT HTTP-only cookie is automatically set by the backend response here
      
      // 3. Navigate back to where they came from
      navigate(redirect);
    } catch (err) {
      // Axios wraps the backend JSON error response inside err.response.data
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans bg-neutral-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 border border-stone-200 shadow-sm">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            Sign in to access your orders and saved details.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-stone-300 px-4 py-3 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors text-stone-900 placeholder:text-stone-400"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-stone-300 px-4 py-3 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors text-stone-900 placeholder:text-stone-400"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-stone-600 hover:text-stone-900 transition-colors">
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-4 px-4 text-sm font-semibold uppercase tracking-widest text-white transition-all ${
              isLoading ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-stone-800'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Register Redirect */}
        <div className="text-center text-sm text-stone-500 mt-6 pt-6 border-t border-stone-100">
          Don't have an account?{' '}
          <Link 
            to={redirect ? `/register?redirect=${redirect}` : '/register'} 
            className="font-medium text-stone-900 hover:underline underline-offset-4"
          >
            Create one
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
