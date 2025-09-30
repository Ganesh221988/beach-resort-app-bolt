import { PropertyCalendar } from '../calendar/PropertyCalendar';
import { BookingFlow } from '../booking/BookingFlow';
import { Property, Booking } from '../../types';
import { SocialMediaMarketing } from './SocialMediaMarketing';

export function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [selectedOtherProperty, setSelectedOtherProperty] = useState<Property | null>(null);
  const [showMarketingModal, setShowMarketingModal] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
    { id: 'marketing', label: 'Social Media Marketing', icon: Camera }
  ];

        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'calendar' && renderCalendar()}
        {activeTab === 'earnings' && renderEarnings()}
        {activeTab === 'marketing' && renderMarketing()}
      </div>