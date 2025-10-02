import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Simple Landing Page Component
function SimpleLandingPage({ onLogin, onSignup }: { onLogin: () => void; onSignup: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">ECR</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ECR Beach Resorts</h1>
                <p className="text-xs text-gray-600">Your Perfect Getaway</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={onLogin}
                className="text-gray-700 hover:text-orange-600 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={onSignup}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"> Getaway</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing hotels, resorts, and vacation rentals for your next adventure. 
              From luxury beachside villas to cozy mountain retreats.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <input
                    type="date"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <input
                    type="number"
                    defaultValue="2"
                    min="1"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                  Search Properties
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600">Handpicked accommodations for unforgettable experiences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Luxury Beachside Villa',
                location: 'Goa, India',
                image: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800',
                price: 8500,
                rating: 4.8
              },
              {
                name: 'Mountain View Resort',
                location: 'Manali, Himachal Pradesh',
                image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
                price: 7200,
                rating: 4.9
              },
              {
                name: 'Royal Heritage Hotel',
                location: 'Udaipur, Rajasthan',
                image: 'https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg?auto=compress&cs=tinysrgb&w=800',
                price: 12500,
                rating: 4.7
              }
            ].map((property, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{property.name}</h3>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-900">₹{property.price.toLocaleString()}</span>
                      <span className="text-gray-600"> /night</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium">{property.rating}</span>
                    </div>
                  </div>
                  <button 
                    onClick={onLogin}
                    className="w-full mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Simple Login Page
function SimpleLoginPage({ onBack, onSwitchToSignup }: { onBack: () => void; onSwitchToSignup: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (!success) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-white font-bold text-lg">ECR</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={onSwitchToSignup} className="text-orange-600 hover:underline">
            Don't have an account? Sign up
          </button>
          <br />
          <button onClick={onBack} className="text-gray-600 hover:underline mt-2">
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple Signup Page
function SimpleSignupPage({ onBack, onSwitchToLogin }: { onBack: () => void; onSwitchToLogin: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer' as 'customer' | 'owner' | 'broker'
  });
  const { signup, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signup(formData);
    if (!success) {
      alert('Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-white font-bold text-lg">ECR</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600">Join ECR Beach Resorts</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="customer">Customer</option>
              <option value="owner">Property Owner</option>
              <option value="broker">Travel Broker</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={onSwitchToLogin} className="text-orange-600 hover:underline">
            Already have an account? Sign in
          </button>
          <br />
          <button onClick={onBack} className="text-gray-600 hover:underline mt-2">
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple Dashboard
function SimpleDashboard() {
  const { user, logout } = useAuth();

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'Admin Dashboard',
          subtitle: 'Manage the ECR Beach Resorts platform',
          color: 'from-purple-500 to-indigo-500'
        };
      case 'owner':
        return {
          title: 'Owner Dashboard',
          subtitle: 'Manage your properties and bookings',
          color: 'from-blue-500 to-cyan-500'
        };
      case 'broker':
        return {
          title: 'Broker Dashboard',
          subtitle: 'Help customers find perfect stays',
          color: 'from-green-500 to-emerald-500'
        };
      default:
        return {
          title: 'Customer Dashboard',
          subtitle: 'Discover and book amazing properties',
          color: 'from-orange-500 to-red-500'
        };
    }
  };

  const content = getDashboardContent();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ECR</span>
              </div>
              <span className="font-bold text-xl text-gray-900">ECR Beach Resorts</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button 
                onClick={logout}
                className="px-4 py-2 text-gray-600 hover:text-red-600 border border-gray-300 rounded-lg hover:border-red-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`bg-gradient-to-r ${content.color} rounded-2xl p-8 text-white mb-8`}>
          <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
          <p className="text-lg opacity-90">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Bookings</span>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue</span>
                <span className="font-semibold">₹1,89,750</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Properties</span>
                <span className="font-semibold">2</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">New booking received</p>
                <p className="text-gray-600">Luxury Villa - 3 nights</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Payment processed</p>
                <p className="text-gray-600">₹25,500 received</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Property approved</p>
                <p className="text-gray-600">Mountain View Resort</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                Add Property
              </button>
              <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                View Bookings
              </button>
              <button className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                Check Earnings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Content
function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'signup'>('landing');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
            <span className="text-white font-bold text-lg">ECR</span>
          </div>
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentView === 'login') {
      return (
        <SimpleLoginPage 
          onBack={() => setCurrentView('landing')}
          onSwitchToSignup={() => setCurrentView('signup')}
        />
      );
    }
    
    if (currentView === 'signup') {
      return (
        <SimpleSignupPage
          onBack={() => setCurrentView('landing')}
          onSwitchToLogin={() => setCurrentView('login')}
        />
      );
    }
    
    return (
      <SimpleLandingPage
        onLogin={() => setCurrentView('login')}
        onSignup={() => setCurrentView('signup')}
      />
    );
  }

  return <SimpleDashboard />;
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;