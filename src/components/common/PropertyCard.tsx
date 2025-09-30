import React from 'react';
import { MapPin, Users, Wifi, Car, Star, IndianRupee } from 'lucide-react';
import { Property } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
  showBookButton?: boolean;
}

export function PropertyCard({ property, onSelect, showBookButton = true }: PropertyCardProps) {
  const getMinPrice = () => {
    const prices = property.room_types.map(room => room.price_per_night);
    return Math.min(...prices);
  };

  const amenityIcons = {
    'WiFi': Wifi,
    'Parking': Car,
    'AC': null,
    'Pool': null,
    'Kitchen': null
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
         onClick={() => onSelect?.(property)}>
      <div className="relative">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full shadow-md">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {property.status === 'active' ? 'Available' : 'Under Review'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{property.title}</h3>
          <div className="flex items-center space-x-1 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{property.city}, {property.state}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>Up to {Math.max(...property.room_types.map(r => r.capacity))} guests</span>
          </div>
          <span>•</span>
          <span>{property.room_types.length} room types</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {property.amenities.slice(0, 4).map((amenity, idx) => {
            const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
            return (
              <span key={idx} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {Icon && <Icon className="h-3 w-3" />}
                <span>{amenity}</span>
              </span>
            );
          })}
          {property.amenities.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              +{property.amenities.length - 4} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <IndianRupee className="h-5 w-5 text-gray-600" />
            <span className="text-xl font-bold text-gray-900">
              {getMinPrice().toLocaleString()}
            </span>
            <span className="text-gray-600 text-sm">/ night</span>
          </div>
          
          {showBookButton && (
            <button 
              onClick={() => {
                if (!user) {
                 onLogin?.();
                  return;
                }
                
                if (user.role !== 'customer' && user.role !== 'broker') {
                  alert('Only customers and brokers can make bookings.');
                  return;
                }
                
                onSelect?.(property);
              }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}