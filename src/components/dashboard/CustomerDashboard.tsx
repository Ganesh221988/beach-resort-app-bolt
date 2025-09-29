import React, { useState } from 'react';
import { Calendar, MapPin, Heart, Star, Search, Filter } from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import { useSupabaseQuery } from '../../hooks/useSupabase';
import { useAuth } from '../../contexts/AuthContext';
import { statsService } from '../../services/supabaseService';
import { BookingCard } from '../common/BookingCard';
import { PropertyCard } from '../common/PropertyCard';
import { BookingFlow } from '../booking/BookingFlow';
import { Property, Booking } from '../../types';

export function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('discover');
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({});

  const { data: customerBookings } = useSupabaseQuery('bookings', { filter: user ? { customer_id: user.id } : undefined });
  const { data: allProperties } = useSupabaseQuery('properties', { filter: { status: 'active' } });
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const tabs = [
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'favorites', label: 'Favorites', icon: Heart }
  ];

  React.useEffect(() => {
    if (user) {
      statsService.getDashboardStats(user.id, user.role).then(setStats);
    }
  }, [user]);
  
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setShowBookingFlow(true);
  };
  
  const handleBookingComplete = (bookingData: Partial<Booking>) => {
    console.log('Creating customer booking:', bookingData);
    setShowBookingFlow(false);
    setSelectedProperty(null);
  };

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
          value={stats.total_bookings || customerBookings?.length || 0}
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Money Spent"
          value={stats.total_revenue || 0}
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

      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Featured Properties</h3>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            <option>Sort by Price</option>
            <option>Sort by Rating</option>
            <option>Sort by Distance</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(allProperties || []).map((property) => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            onSelect={handlePropertySelect}
          />
        ))}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
        <div className="flex items-center space-x-3">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            <option>All Bookings</option>
            <option>Upcoming</option>
            <option>Past</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {(customerBookings || []).length > 0 ? (
        <div className="space-y-4">
          {(customerBookings || []).map((booking) => (
            <BookingCard key={booking.id} booking={booking} showActions userRole="customer" />
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Favorites</h2>
      
      {favoriteProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProperties.map((property) => (
            <div key={property.id} className="relative">
              <PropertyCard 
                property={property} 
                onSelect={handlePropertySelect}
              />
              <button
                onClick={() => handleRemoveFromFavorites(property.id)}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <Heart className="h-4 w-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      ) : (
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
      )}
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
      
      {/* Booking Flow Modal */}
      {showBookingFlow && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <BookingFlow
            property={selectedProperty}
            onComplete={handleBookingComplete}
            onCancel={() => {
              setShowBookingFlow(false);
              setSelectedProperty(null);
            }}
            userRole="customer"
          />
        </div>
      )}
    </div>
  );
}