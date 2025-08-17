import React, { useState } from 'react';
import { Building2, Calendar, IndianRupee, TrendingUp, Plus, Camera, Settings, CalendarDays } from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import { mockDashboardStats, mockBookings, mockProperties } from '../../data/mockData';
import { BookingCard } from '../common/BookingCard';
import { PropertyCard } from '../common/PropertyCard';
import { PropertyForm } from '../property/PropertyForm';
import { PropertyCalendar } from '../calendar/PropertyCalendar';
import { BookingFlow } from '../booking/BookingFlow';
import { Property, Booking } from '../../types';

export function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const stats = mockDashboardStats.owner;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'properties', label: 'My Properties', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee }
  ];

  const ownerBookings = mockBookings.filter(b => b.owner_id === 'ECO2547001');
  const ownerProperties = mockProperties.filter(p => p.owner_id === 'ECO2547001');
  
  const handlePropertySave = (propertyData: Partial<Property>) => {
    console.log('Saving property:', propertyData);
    setShowPropertyForm(false);
    setEditingProperty(null);
  };
  
  const handleBookingComplete = (bookingData: Partial<Booking>) => {
    console.log('Creating booking:', bookingData);
    setShowBookingFlow(false);
    setSelectedProperty(null);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="My Properties"
          value={stats.total_properties || 0}
          icon={Building2}
          color="blue"
          change={stats.monthly_growth}
        />
        <StatsCard
          title="Total Bookings"
          value={stats.total_bookings}
          icon={Calendar}
          color="green"
          change={stats.monthly_growth}
        />
        <StatsCard
          title="Total Earnings"
          value={stats.total_revenue}
          icon={IndianRupee}
          color="orange"
          change={stats.monthly_growth}
        />
        <StatsCard
          title="Occupancy Rate"
          value={`${stats.occupancy_rate}%`}
          icon={TrendingUp}
          color="purple"
          change={2.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <button className="px-3 py-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {ownerBookings.slice(0, 3).map((booking) => (
              <BookingCard key={booking.id} booking={booking} userRole="owner" />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Gross Earnings</p>
                <p className="text-2xl font-bold text-green-600">₹{stats.total_revenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Platform Fees</p>
                <p className="text-xl font-bold text-orange-600">-₹{(stats.total_revenue * 0.1).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Broker Commissions</p>
                <p className="text-xl font-bold text-blue-600">-₹{(stats.total_revenue * 0.02).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Net Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{(stats.total_revenue * 0.88).toLocaleString()}</p>
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
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group">
            <Plus 
              className="h-6 w-6 text-gray-400 group-hover:text-orange-500" 
              onClick={() => setShowPropertyForm(true)}
            />
            <div className="text-left">
              <p className="font-medium text-gray-900 group-hover:text-orange-600">Add New Property</p>
              <p className="text-sm text-gray-500">List a new villa or resort</p>
            </div>
          </button>
          <button 
            onClick={() => setShowBookingFlow(true)}
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <Calendar className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 group-hover:text-blue-600">Manual Booking</p>
              <p className="text-sm text-gray-500">Create offline booking</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group">
            <Settings className="h-6 w-6 text-gray-400 group-hover:text-green-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 group-hover:text-green-600">Manage Offers</p>
              <p className="text-sm text-gray-500">Create promotional offers</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderProperties = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
        <button 
          onClick={() => setShowPropertyForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Property</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ownerProperties.map((property) => (
          <div key={property.id} className="relative">
            <PropertyCard property={property} showBookButton={false} />
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => {
                  setEditingProperty(property);
                  setShowPropertyForm(true);
                }}
                className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <Settings className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
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
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Completed</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
            <span>Manual Booking</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {ownerBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} showActions userRole="owner" />
        ))}
      </div>
    </div>
  );
  
  const renderCalendar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Property Calendar</h2>
        <select 
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          onChange={(e) => {
            const property = ownerProperties.find(p => p.id === e.target.value);
            setSelectedProperty(property || null);
          }}
        >
          <option value="">Select Property</option>
          {ownerProperties.map(property => (
            <option key={property.id} value={property.id}>{property.title}</option>
          ))}
        </select>
      </div>
      
      {selectedProperty ? (
        <PropertyCalendar 
          property={selectedProperty} 
          showControls={true}
          onDateSelect={(date) => console.log('Selected date:', date)}
          onSlotBlock={(date, hours) => console.log('Blocked:', date, hours)}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Property</h3>
          <p className="text-gray-600">Choose a property from the dropdown to view its calendar.</p>
        </div>
      )}
    </div>
  );

  const renderEarnings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Earnings & Payouts</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
          <div className="space-y-4">
            {ownerBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Booking #{booking.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-600">{booking.property_title}</p>
                  <p className="text-xs text-gray-500">{new Date(booking.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+₹{booking.net_to_owner.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    {booking.payment_status === 'success' ? 'Received' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Available Balance</span>
                <span className="font-semibold text-green-600">₹{(stats.pending_payouts || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Clearance</span>
                <span className="font-semibold text-orange-600">₹8,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Next Payout</span>
                <span className="font-semibold text-gray-900">Mar 15, 2024</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
              Request Payout
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Account</span>
                <span className="font-medium">****1234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bank</span>
                <span className="font-medium">HDFC Bank</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IFSC</span>
                <span className="font-medium">HDFC0001234</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
              Update Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ECR Beach Resorts - Owner</h1>
          <p className="text-gray-600">Manage your properties and bookings</p>
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
                    ? 'bg-white text-blue-600 shadow-sm'
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
        {activeTab === 'properties' && renderProperties()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'calendar' && renderCalendar()}
        {activeTab === 'earnings' && renderEarnings()}
      </div>
      
      {/* Property Form Modal */}
      {showPropertyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <PropertyForm
            property={editingProperty || undefined}
            onSave={handlePropertySave}
            onCancel={() => {
              setShowPropertyForm(false);
              setEditingProperty(null);
            }}
          />
        </div>
      )}
      
      {/* Manual Booking Flow */}
      {showBookingFlow && ownerProperties.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <BookingFlow
            property={ownerProperties[0]} // Default to first property
            onComplete={handleBookingComplete}
            onCancel={() => setShowBookingFlow(false)}
            userRole="customer" // Owner creating booking for customer
          />
        </div>
      )}
    </div>
  );
}