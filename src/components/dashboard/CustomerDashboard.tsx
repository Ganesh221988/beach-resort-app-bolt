import React, { useState } from 'react';
import { Calendar, MapPin, Heart, Star, Search, Filter } from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import { useAuth } from '../../contexts/AuthContext';

export function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('discover');
  const { user } = useAuth();

  const tabs = [
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'favorites', label: 'Favorites', icon: Heart }
  ];

  const renderDiscover = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 text-white">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Discover Amazing Stays</h2>
          <p className="text-lg mb-6 text-orange-100">
            From luxury beachside villas to cozy mountain retreats, find your perfect getaway
          </p>
          <div className="flex items-center space-x-4 bg-white rounded-lg p-1">
            <div className="flex-1 flex items-center space-x-2 px-3 py-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties or events..."
                className="flex-1 text-gray-900 placeholder-gray-500 focus:outline-none"
              />
            </div>
            <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Trips"
          value={8}
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Money Spent"
          value={45600}
          icon={Star}
          color="green"
        />
        <StatsCard
          title="Cities Visited"
          value="5"
          icon={MapPin}
          color="orange"
        />
        <StatsCard
          title="Favorite Properties"
          value="12"
          icon={Heart}
          color="red"
        />
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Discover Properties</h3>
        <p className="text-gray-600 mb-6">Find amazing properties for your next getaway.</p>
        <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
          Browse Properties
        </button>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="text-center py-12">
      <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
      <p className="text-gray-600 mb-6">Start exploring amazing properties and make your first booking!</p>
      <button 
        onClick={() => setActiveTab('discover')}
        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
      >
        Discover Properties
      </button>
    </div>
  );

  const renderFavorites = () => (
    <div className="text-center py-12">
      <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
      <p className="text-gray-600 mb-6">Save properties you love by clicking the heart icon</p>
      <button 
        onClick={() => setActiveTab('discover')}
        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
      >
        Browse Properties
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Ready for your next adventure?</p>
        </div>

        <div className="flex space-x-1 mb-8 bg-gray-200 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'discover' && renderDiscover()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'favorites' && renderFavorites()}
      </div>
    </div>
  );
}