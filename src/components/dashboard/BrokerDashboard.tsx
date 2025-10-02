import React, { useState } from 'react';
import { Users, IndianRupee, TrendingUp, Calendar, Plus, Search, UserPlus } from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import { SubscriptionBadge } from '../common/SubscriptionBadge';
import { useAuth } from '../../contexts/AuthContext';

export function BrokerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'commissions', label: 'Commissions', icon: IndianRupee },
    { id: 'properties', label: 'Browse Properties', icon: Search }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Bookings"
          value={23}
          icon={Calendar}
          color="green"
          change={24.7}
        />
        <StatsCard
          title="Commission Earned"
          value={18750}
          icon={IndianRupee}
          color="orange"
          change={24.7}
        />
        <StatsCard
          title="Success Rate"
          value="92%"
          icon={TrendingUp}
          color="blue"
          change={5.2}
        />
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">My Bookings</h3>
      <p className="text-gray-600">Track your booking history and commissions.</p>
    </div>
  );

  const renderCommissions = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <IndianRupee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Commission Tracking</h3>
      <p className="text-gray-600">Monitor your commission earnings and payouts.</p>
    </div>
  );

  const renderProperties = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Browse Properties</h3>
      <p className="text-gray-600">Find and book properties for your customers.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ECR Beach Resorts - Broker</h1>
              <p className="text-gray-600">Manage bookings and track your commissions</p>
            </div>
            <SubscriptionBadge 
              planName="Broker Plus" 
              expiryDate="2024-05-20T00:00:00Z" 
              userRole="broker" 
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
    </div>
  );
}