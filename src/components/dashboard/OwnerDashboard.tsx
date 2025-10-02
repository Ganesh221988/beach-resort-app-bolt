import React, { useState } from 'react';
import { Building2, Calendar, IndianRupee, TrendingUp, Plus, Camera, Settings, CalendarDays, Search, Filter, MapPin, Star } from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import { SubscriptionBadge } from '../common/SubscriptionBadge';
import { useSupabaseQuery } from '../../hooks/useSupabase';
import { useAuth } from '../../contexts/AuthContext';
import { statsService } from '../../services/supabaseService';
import { BookingCard } from '../common/BookingCard';
import { PropertyCard } from '../common/PropertyCard';
import { PropertyForm } from '../property/PropertyForm';
import { PropertyCalendar } from '../calendar/PropertyCalendar';
import { BookingFlow } from '../booking/BookingFlow';
import { Property, Booking } from '../../types';
import { SocialMediaMarketing } from '../owner/SocialMediaMarketing';

export function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({});

  const { data: ownerProperties } = useSupabaseQuery('properties', { filter: user ? { owner_id: user.id } : undefined });
  const { data: ownerBookings } = useSupabaseQuery('bookings', { filter: user ? { owner_id: user.id } : undefined });
  const { data: allProperties } = useSupabaseQuery('properties', { filter: { status: 'active' } });
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [showOtherBookingFlow, setShowOtherBookingFlow] = useState(false);
  const [selectedOtherProperty, setSelectedOtherProperty] = useState<Property | null>(null);
  const [showMarketingModal, setShowMarketingModal] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'properties', label: 'My Properties', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
    { id: 'other-bookings', label: 'Other Property Bookings', icon: Search },
    { id: 'marketing', label: 'Social Media Marketing', icon: Camera }
  ];

  // Mock broker bookings made by this owner
  const ownerBrokerBookings = [
    {
      id: '3',
      property_id: '2',
      property_title: 'Mountain View Resort',
      room_type_ids: ['3'],
      room_types: ['Deluxe Suite'],
      customer_id: 'ECC1547002',
      customer_name: 'Alice Smith',
      broker_id: 'ECO2547001', // Current owner acting as broker
      broker_name: 'John Smith',
      owner_id: 'ECO2547002',
      start_date: '2024-04-20T14:00:00Z',
      end_date: '2024-04-22T12:00:00Z',
      duration_type: 'day' as const,
      guests: 2,
      total_amount: 14400,
      platform_commission: 1440,
      broker_commission: 288,
      net_to_owner: 12672,
      status: 'confirmed' as const,
      payment_status: 'success' as const,
      created_at: '2024-04-01T10:30:00Z'
    }
  ];
  
  React.useEffect(() => {
    if (user) {
      statsService.getDashboardStats(user.id, user.role).then(setStats);
    }
  }, [user]);

  // Other properties (not owned by current owner) for broker bookings
  const otherProperties = allProperties?.filter(p => p.owner_id !== user?.id) || [];

  // Filter other properties based on search and city
  const filteredOtherProperties = otherProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (property.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'all' || property.city === cityFilter;
    return matchesSearch && matchesCity;
  });
  
  // Get unique cities for filter
  const availableCities = ['all', ...new Set(otherProperties.map(p => p.city))];
  
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
  
  const handleOtherPropertySelect = (property: Property) => {
    setSelectedOtherProperty(property);
    setShowOtherBookingFlow(true);
  };
  
  const handleOtherBookingComplete = (bookingData: Partial<Booking>) => {
    console.log('Creating broker booking:', bookingData);
    setShowOtherBookingFlow(false);
    setSelectedOtherProperty(null);
  };
  
  const requestCommissionPayout = () => {
    alert('Commission payout request submitted successfully!');
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="My Properties"
          value={stats.total_properties || ownerProperties?.length || 0}
          icon={Building2}
          color="blue"
          change={stats.monthly_growth}
        />
        <StatsCard
          title="Total Bookings"
          value={stats.total_bookings || ownerBookings?.length || 0}
          icon={Calendar}
          color="green"
          change={stats.monthly_growth}
        />
        <StatsCard
          title="Total Earnings"
          value={stats.total_revenue || 0}
          icon={IndianRupee}
          color="orange"
          change={stats.monthly_growth}
        />
        <StatsCard
          title="Occupancy Rate"
          value={`${stats.occupancy_rate || 0}%`}
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
            {(ownerBookings || []).slice(0, 3).map((booking) => (
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
                <p className="text-2xl font-bold text-green-600">₹{(stats.total_revenue || 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Platform Fees</p>
                <p className="text-xl font-bold text-orange-600">-₹{((stats.total_revenue || 0) * 0.1).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Broker Commissions</p>
                <p className="text-xl font-bold text-blue-600">-₹{((stats.total_revenue || 0) * 0.02).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Net Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{((stats.total_revenue || 0) * 0.88).toLocaleString()}</p>
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
            onClick={() => setShowPropertyForm(true)}
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group"
          >
            <Plus className="h-6 w-6 text-gray-400 group-hover:text-orange-500" />
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
        {(ownerProperties || []).map((property) => (
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
          <button 
            onClick={() => setShowBookingFlow(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Manual Booking</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {(ownerBookings || []).map((booking) => (
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
            const property = ownerProperties?.find(p => p.id === e.target.value);
            setSelectedProperty(property || null);
          }}
        >
          <option value="">Select Property</option>
          {(ownerProperties || []).map(property => (
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
            {(ownerBookings || []).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Booking #{booking.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-600">{booking.properties?.title || 'Property'}</p>
                  <p className="text-xs text-gray-500">{new Date(booking.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+₹{(booking.net_to_owner || 0).toLocaleString()}</p>
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
                <span className="font-semibold text-green-600">₹{((stats.pending_payouts || 0)).toLocaleString()}</span>
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

  const renderOtherBookings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Book Other Properties (As Broker)</h2>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {availableCities.map(city => (
              <option key={city} value={city}>
                {city === 'all' ? 'All Cities' : city}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <strong>Broker Mode:</strong> You can book other properties on behalf of customers and earn commission.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOtherProperties.map((property) => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            onSelect={handleOtherPropertySelect}
          />
        ))}
      </div>
      
      {/* Broker Bookings Made */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Broker Bookings</h3>
        <div className="space-y-4">
          {ownerBrokerBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} userRole="broker" />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ECR Beach Resorts - Owner</h1>
              <p className="text-gray-600">Manage your properties and bookings</p>
            </div>
            <SubscriptionBadge 
              planName="Owner Pro" 
              expiryDate="2024-04-15T00:00:00Z" 
              userRole="owner" 
            />
          </div>
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
        {activeTab === 'other-bookings' && renderOtherBookings()}
        {activeTab === 'marketing' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Social Media Marketing</h2>
              <button
                onClick={() => setShowMarketingModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                <Camera className="h-4 w-4" />
                <span>Setup Marketing</span>
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Automated Social Media Marketing</h3>
              <p className="text-gray-600 mb-6">
                Set up automated posting to Instagram and Facebook to promote your properties.
              </p>
              <button
                onClick={() => setShowMarketingModal(true)}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
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
      {showBookingFlow && (ownerProperties || []).length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <BookingFlow
            property={(ownerProperties || [])[0]}
            properties={ownerProperties || []}
            onComplete={handleBookingComplete}
            onCancel={() => setShowBookingFlow(false)}
            userRole="customer" // Owner creating booking for customer
            isManualBooking={true}
          />
        </div>
      )}
      
      {/* Other Property Booking Flow */}
      {showOtherBookingFlow && selectedOtherProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <BookingFlow
            property={selectedOtherProperty}
            onComplete={handleOtherBookingComplete}
            onCancel={() => {
              setShowOtherBookingFlow(false);
              setSelectedOtherProperty(null);
            }}
            userRole="broker"
          />
        </div>
      )}
      
      {/* Social Media Marketing Modal */}
      {showMarketingModal && (
        <SocialMediaMarketing
          properties={ownerProperties || []}
          onClose={() => setShowMarketingModal(false)}
        />
      )}
    </div>
  );
}