import React, { useState } from 'react';
import { Building2, Users, IndianRupee, TrendingUp, Settings, UserCheck, CreditCard, BarChart3 } from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import { useSupabaseQuery } from '../../hooks/useSupabase';
import { useAuth } from '../../contexts/AuthContext';
import { statsService } from '../../services/supabaseService';
import { BookingCard } from '../common/BookingCard';
import { PropertyCard } from '../common/PropertyCard';
import { UserManagement } from '../admin/UserManagement';
import { ReportsPage } from '../reports/ReportsPage';
import { User } from '../../types';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({});

  const { data: properties } = useSupabaseQuery('properties');
  const { data: bookings } = useSupabaseQuery('bookings');

  // Mock users data
  const [users, setUsers] = useState<User[]>([
    {
      id: 'ADMIN001',
      name: 'Admin User',
      email: 'admin@ecrbeachresorts.com',
      phone: '+91 9876543210',
      role: 'admin',
      kyc_status: 'verified',
      subscription_status: 'active',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'ECO2547001',
      name: 'John Smith',
      email: 'owner@ecrbeachresorts.com',
      phone: '+91 9876543211',
      role: 'owner',
      kyc_status: 'verified',
      subscription_status: 'active',
      created_at: '2024-01-15T00:00:00Z'
    },
    {
      id: 'ECB3547001',
      name: 'Sarah Wilson',
      email: 'broker@ecrbeachresorts.com',
      phone: '+91 9876543212',
      role: 'broker',
      kyc_status: 'verified',
      subscription_status: 'active',
      created_at: '2024-02-01T00:00:00Z'
    },
    {
      id: 'ECC1547001',
      name: 'David Johnson',
      email: 'customer@ecrbeachresorts.com',
      phone: '+91 9876543213',
      role: 'customer',
      kyc_status: 'verified',
      created_at: '2024-02-15T00:00:00Z'
    }
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: CreditCard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  React.useEffect(() => {
    if (user) {
      statsService.getDashboardStats(user.id, user.role).then(setStats);
    }
  }, [user]);

  const recentBookings = bookings?.slice(0, 5) || [];
  const recentProperties = properties?.slice(0, 4) || [];

  // Convert Supabase data to component format
  const convertedBookings = recentBookings.map(booking => ({ ...booking, property_title: booking.properties?.title || '' }));
  const convertedProperties = recentProperties.map(property => ({ ...property, room_types: property.room_types || [] }));
  
  const handleUserUpdate = (updatedUser: User) => {
    setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
  };
  
  const handleUserDelete = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };
  
  const handleUserCreate = (userData: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || 'customer',
      kyc_status: userData.kyc_status || 'pending',
      created_at: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Properties"
          value={stats.total_properties || properties?.length || 0}
          icon={Building2}
          color="blue"
          change={stats.monthly_growth}
        />
        <StatsCard
          title="Total Bookings"
          value={stats.total_bookings || bookings?.length || 0}
          icon={CreditCard}
          color="green"
          change={stats.monthly_growth}
        />
        <StatsCard
          title="Platform Revenue"
          value={stats.total_revenue || 0}
          icon={IndianRupee}
          color="orange"
          change={stats.monthly_growth}
        />
        <StatsCard
          title="Pending Payouts"
          value={stats.pending_payouts || 0}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-4">
            {convertedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking as any} userRole="admin" />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Analytics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Platform Commission (This Month)</p>
                <p className="text-2xl font-bold text-blue-600">₹{((stats.total_revenue || 0) * 0.1).toLocaleString()}</p>
              </div>
              <div className="text-blue-500">
                <IndianRupee className="h-8 w-8" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Broker Commissions Paid</p>
                <p className="text-2xl font-bold text-green-600">₹{((stats.total_revenue || 0) * 0.02).toLocaleString()}</p>
              </div>
              <div className="text-green-500">
                <Users className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProperties = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Properties Management</h2>
        <div className="flex items-center space-x-3">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            <option>All Status</option>
            <option>Active</option>
            <option>Under Review</option>
            <option>Inactive</option>
          </select>
          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
            Add Property
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {convertedProperties.map((property) => (
          <PropertyCard key={property.id} property={property as any} showBookButton={false} />
        ))}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Bookings Management</h2>
        <div className="flex items-center space-x-3">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
            <option>All Status</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Cancelled</option>
            <option>Completed</option>
          </select>
          <input
            type="text"
            placeholder="Search bookings..."
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {convertedBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking as any} showActions userRole="admin" />
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <UserManagement
      users={users}
      onUserUpdate={handleUserUpdate}
      onUserDelete={handleUserDelete}
      onUserCreate={handleUserCreate}
    />
  );
  
  const renderReports = () => (
    <ReportsPage />
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Rates</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Commission (%)
              </label>
              <input
                type="number"
                defaultValue="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Broker Commission (% of Platform Commission)
              </label>
              <input
                type="number"
                defaultValue="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <button className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
              Update Commission Rates
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plans</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Monthly Fee (₹)
              </label>
              <input
                type="number"
                defaultValue="999"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Broker Monthly Fee (₹)
              </label>
              <input
                type="number"
                defaultValue="499"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <button className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
              Update Subscription Plans
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ECR Beach Resorts - Admin</h1>
          <p className="text-gray-600">Manage your ECR Beach Resorts platform</p>
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

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'properties' && renderProperties()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
}