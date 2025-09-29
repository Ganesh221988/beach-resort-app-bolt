import React from 'react';
import { Crown, Calendar, AlertCircle } from 'lucide-react';

interface SubscriptionBadgeProps {
  planName: string;
  expiryDate: string;
  userRole: 'owner' | 'broker';
}

export function SubscriptionBadge({ planName, expiryDate, userRole }: SubscriptionBadgeProps) {
  const isExpiringSoon = new Date(expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const isExpired = new Date(expiryDate) <= new Date();
  
  const getBadgeColor = () => {
    if (isExpired) return 'bg-red-100 text-red-800 border-red-200';
    if (isExpiringSoon) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (planName === 'Free') return 'bg-gray-100 text-gray-800 border-gray-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getIcon = () => {
    if (isExpired || isExpiringSoon) return AlertCircle;
    if (planName === 'Free') return Calendar;
    return Crown;
  };

  const Icon = getIcon();

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium ${getBadgeColor()}`}>
      <Icon className="h-4 w-4" />
      <div>
        <span className="font-semibold">{planName}</span>
        {planName !== 'Free' && (
          <div className="text-xs opacity-75">
            {isExpired ? 'Expired' : `Expires ${new Date(expiryDate).toLocaleDateString()}`}
          </div>
        )}
      </div>
    </div>
  );
}