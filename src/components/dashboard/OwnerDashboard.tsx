import React, { useState } from 'react';
import { Building2, Calendar, IndianRupee, TrendingUp, Plus, Camera, Settings, CalendarDays } from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import { SubscriptionBadge } from '../common/SubscriptionBadge';
import { useAuth } from '../../contexts/AuthContext';

export function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'properties', label: 'My Properties', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
    { id: 'marketing', label: 'Social Media Marketing', icon: Camera }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="My Properties"
          value={2}
          icon={Building2}
          color="blue"
          change={12.8}
        />
        <StatsCard
          title="Total Bookings"
          value={47}
          icon={Calendar}
          color="green"
          change={15.3}
        />
        <StatsCard
          title="Total Earnings"
          value={189750}
          icon={IndianRupee}
          color="orange"
          change={18.7}
        />
        <StatsCard
          title="Occupancy Rate"
          value="78.5%"
          icon={TrendingUp}
          color="purple"
          change={2.3}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group">
            <Plus className="h-6 w-6 text-gray-400 group-hover:text-orange-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 group-hover:text-orange-600">Add New Property</p>
              <p className="text-sm text-gray-500">List a new villa or resort</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
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
        <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Property</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Yet</h3>
        <p className="text-gray-600 mb-6">Start by adding your first property to the platform.</p>
        <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
          Add Your First Property
        </button>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Yet</h3>
        <p className="text-gray-600">Bookings will appear here once customers start booking your properties.</p>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Property Calendar</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar Management</h3>
        <p className="text-gray-600">Add properties to manage their availability calendar.</p>
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Earnings & Payouts</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <IndianRupee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Earnings Dashboard</h3>
        <p className="text-gray-600">Track your earnings and payout history here.</p>
      </div>
    </div>
  );

  const renderMarketing = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Social Media Marketing</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Automated Social Media Marketing</h3>
        <p className="text-gray-600 mb-6">
          Set up automated posting to Instagram and Facebook to promote your properties.
        </p>
        <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">
          Get Started
        </button>
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
        {activeTab === 'marketing' && renderMarketing()}
      </div>
    </div>
  );
}