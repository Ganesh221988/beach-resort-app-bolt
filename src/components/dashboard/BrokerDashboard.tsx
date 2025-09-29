import React, { useState } from 'react';
import { Users, IndianRupee, TrendingUp, Calendar, Plus, Search, UserPlus } from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import { mockDashboardStats, mockBookings, mockCommissions, mockProperties } from '../../data/mockData';
import { BookingCard } from '../common/BookingCard';
import { PropertyCard } from '../common/PropertyCard';
import { BookingFlow } from '../booking/BookingFlow';
import { Property, Booking } from '../../types';

export function BrokerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const stats = mockDashboardStats.broker;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'commissions', label: 'Commissions', icon: IndianRupee },
    { id: 'properties', label: 'Browse Properties', icon: Search }
  ];

  const brokerBookings = mockBookings.filter(b => b.broker_id === 'ECB3547001');
  
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setShowBookingFlow(true);
  };
  
  const handleBookingComplete = (bookingData: Partial<Booking>) => {
    console.log('Creating broker booking:', bookingData);
    setShowBookingFlow(false);
    setSelectedProperty(null);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Bookings"
          value={stats.total_bookings}
          icon={Calendar}
          color="green"
          change={stats.monthly_growth}
        />
        <StatsCard
          title="Commission Earned"
          value={stats.commission_earned || 0}
          icon={IndianRupee}
          color="orange"
          change={stats.monthly_growth}
        />
        <StatsCard
          title="Success Rate"
          value="92%"
          icon={TrendingUp}
          color="blue"
          change={5.2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <button className="px-3 py-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {brokerBookings.slice(0, 3).map((booking) => (
              <BookingCard key={booking.id} booking={booking} userRole="broker" />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-green-600">₹{(stats.commission_earned || 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Pending Payouts</p>
                <p className="text-xl font-bold text-blue-600">₹12,450</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Average Commission</p>
                <p className="text-xl font-bold text-orange-600">₹815</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setShowBookingFlow(true)}
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
          >
            <Plus className="h-6 w-6 text-gray-400 group-hover:text-green-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 group-hover:text-green-600">Create Booking</p>
              <p className="text-sm text-gray-500">Book for a customer</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
            <UserPlus className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 group-hover:text-blue-600">Add Customer</p>
              <p className="text-sm text-gray-500">Register new customer</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group">
            <Search className="h-6 w-6 text-gray-400 group-hover:text-orange-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 group-hover:text-orange-600">Browse Properties</p>
              <p className="text-sm text-gray-500">Find perfect stays</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
        <button 
          onClick={() => setShowBookingFlow(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Booking</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {brokerBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} showActions userRole="broker" />
        ))}
      </div>
    </div>
  );

  const renderCommissions = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Commission Tracking</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission History</h3>
          <div className="space-y-4">
            {mockCommissions.map((commission) => (
              <div key={commission.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Booking #{commission.booking_id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-600">Booking Amount: ₹{commission.booking_amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{new Date(commission.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+₹{commission.broker_commission.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded-full ${
                      commission.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {commission.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Earned This Month</span>
                <span className="font-semibold text-green-600">₹{(stats.commission_earned || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Payout</span>
                <span className="font-semibold text-orange-600">₹12,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Next Payout Date</span>
                <span className="font-semibold text-gray-900">Mar 15, 2024</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
              Request Early Payout
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Rate</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-2">20%</p>
              <p className="text-sm text-gray-600">of platform commission</p>
              <p className="text-xs text-gray-500 mt-2">On booking amounts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProperties = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Browse Properties</h2>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search properties..."
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
            <option>All Cities</option>
            <option>Goa</option>
            <option>Manali</option>
            <option>Udaipur</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockProperties.map((property) => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            onSelect={handlePropertySelect}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ECR Beach Resorts - Broker</h1>
          <p className="text-gray-600">Manage bookings and track your commissions</p>
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
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'commissions' && renderCommissions()}
        {activeTab === 'properties' && renderProperties()}
      </div>
      
      {/* Booking Flow Modal */}
      {showBookingFlow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <BookingFlow
            property={selectedProperty || mockProperties[0]}
            properties={mockProperties}
            onComplete={handleBookingComplete}
            onCancel={() => {
              setShowBookingFlow(false);
              setSelectedProperty(null);
            }}
            userRole="broker"
            isManualBooking={!selectedProperty}
          />
        </div>
      )}
    </div>
  );
}