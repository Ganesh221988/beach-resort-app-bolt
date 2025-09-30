import React, { useState, useEffect } from 'react';
import { Instagram, Facebook, Calendar, Image, Settings, Play, Pause, Eye, CreditCard as Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userIntegrationService } from '../../services/integrationService';
import { Property } from '../../types';

interface SocialMediaMarketingProps {
  properties: Property[];
  onClose: () => void;
}

interface MarketingCampaign {
  id: string;
  property_id: string;
  property_title: string;
  frequency: 'every_2_days' | 'weekly' | 'monthly';
  is_active: boolean;
  instagram_enabled: boolean;
  facebook_enabled: boolean;
  last_posted: string | null;
  next_post: string | null;
  created_at: string;
}

export function SocialMediaMarketing({ properties, onClose }: SocialMediaMarketingProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('setup');
  const [loading, setLoading] = useState(false);
  
  const [instagramConfig, setInstagramConfig] = useState({
    username: '',
    access_token: '',
    enabled: false
  });
  
  const [facebookConfig, setFacebookConfig] = useState({
    page_id: '',
    access_token: '',
    page_name: '',
    enabled: false
  });
  
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [previewPost, setPreviewPost] = useState<any>(null);

  const tabs = [
    { id: 'setup', label: 'Social Media Setup', icon: Settings },
    { id: 'campaigns', label: 'Marketing Campaigns', icon: Calendar },
    { id: 'preview', label: 'Post Preview', icon: Eye }
  ];

  const frequencyOptions = [
    { value: 'every_2_days', label: 'Every 2 Days', description: 'Post every 2 days' },
    { value: 'weekly', label: 'Weekly', description: 'Post once a week' },
    { value: 'monthly', label: 'Monthly', description: 'Post once a month' }
  ];

  useEffect(() => {
    loadIntegrations();
    loadCampaigns();
  }, [user]);

  const loadIntegrations = async () => {
    if (!user) return;
    
    try {
      const integrations = await userIntegrationService.getUserIntegrations(user.id);
      
      const instagram = integrations.find(i => i.integration_type === 'instagram');
      const facebook = integrations.find(i => i.integration_type === 'facebook');
      
      if (instagram) {
        setInstagramConfig({
          username: instagram.integration_data.username || '',
          access_token: instagram.integration_data.access_token || '',
          enabled: instagram.is_enabled
        });
      }
      
      if (facebook) {
        setFacebookConfig({
          page_id: facebook.integration_data.page_id || '',
          access_token: facebook.integration_data.access_token || '',
          page_name: facebook.integration_data.page_name || '',
          enabled: facebook.is_enabled
        });
      }
    } catch (error) {
      console.error('Error loading integrations:', error);
    }
  };

  const loadCampaigns = () => {
    // Mock campaigns data - in real app, this would come from database
    const mockCampaigns: MarketingCampaign[] = properties.map(property => ({
      id: `campaign_${property.id}`,
      property_id: property.id,
      property_title: property.title,
      frequency: 'weekly',
      is_active: false,
      instagram_enabled: false,
      facebook_enabled: false,
      last_posted: null,
      next_post: null,
      created_at: new Date().toISOString()
    }));
    setCampaigns(mockCampaigns);
  };

  const saveInstagramIntegration = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await userIntegrationService.upsertUserIntegration(
        user.id,
        'instagram',
        {
          username: instagramConfig.username,
          access_token: instagramConfig.access_token
        },
        instagramConfig.enabled
      );
      alert('Instagram integration saved successfully!');
    } catch (error) {
      console.error('Error saving Instagram integration:', error);
      alert('Error saving Instagram integration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveFacebookIntegration = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await userIntegrationService.upsertUserIntegration(
        user.id,
        'facebook',
        {
          page_id: facebookConfig.page_id,
          access_token: facebookConfig.access_token,
          page_name: facebookConfig.page_name
        },
        facebookConfig.enabled
      );
      alert('Facebook integration saved successfully!');
    } catch (error) {
      console.error('Error saving Facebook integration:', error);
      alert('Error saving Facebook integration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateCampaign = (campaignId: string, updates: Partial<MarketingCampaign>) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId ? { ...campaign, ...updates } : campaign
    ));
  };

  const generatePostContent = (property: Property) => {
    const contactPerson = user?.name || 'Contact Person';
    const contactNumber = user?.phone || '+91 98765 43210';
    const minPrice = Math.min(...property.room_types.map(r => r.price_per_night));
    
    return {
      caption: `🏖️ Discover ${property.title} in ${property.city}! ✨

🌟 ${property.description.slice(0, 100)}...

🏡 Features:
${property.amenities.slice(0, 5).map(amenity => `• ${amenity}`).join('\n')}

💰 Starting from ₹${minPrice.toLocaleString()}/night

📞 Book now: ${contactPerson}
📱 ${contactNumber}

#ECRBeachResorts #${property.city.replace(/\s+/g, '')} #Vacation #Travel #BookNow #${property.title.replace(/\s+/g, '')}`,
      
      images: property.images.slice(0, 10), // Max 10 images
      hashtags: [
        '#ECRBeachResorts',
        `#${property.city.replace(/\s+/g, '')}`,
        '#Vacation',
        '#Travel',
        '#BookNow',
        `#${property.title.replace(/\s+/g, '')}`
      ]
    };
  };

  const previewPostForProperty = (property: Property) => {
    const postContent = generatePostContent(property);
    setPreviewPost({ property, content: postContent });
    setActiveTab('preview');
  };

  const toggleCampaign = (campaignId: string, isActive: boolean) => {
    updateCampaign(campaignId, { 
      is_active: isActive,
      next_post: isActive ? getNextPostDate('weekly') : null
    });
    
    if (isActive) {
      alert('Marketing campaign activated! Posts will be published automatically.');
    } else {
      alert('Marketing campaign paused.');
    }
  };

  const getNextPostDate = (frequency: string) => {
    const now = new Date();
    switch (frequency) {
      case 'every_2_days':
        now.setDate(now.getDate() + 2);
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        break;
    }
    return now.toISOString();
  };

  const renderSetup = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Social Media Integration</h3>
        <p className="text-gray-600">Connect your Instagram and Facebook accounts to start automated marketing</p>
      </div>

      {/* Instagram Integration */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Instagram className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">Instagram Business Account</h4>
            <p className="text-gray-600">Automatically post property photos to your Instagram</p>
          </div>
          <div className="ml-auto">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={instagramConfig.enabled}
                onChange={(e) => setInstagramConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Username</label>
            <input
              type="text"
              value={instagramConfig.username}
              onChange={(e) => setInstagramConfig(prev => ({ ...prev, username: e.target.value }))}
              placeholder="@your_property_handle"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={!instagramConfig.enabled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Access Token</label>
            <input
              type="password"
              value={instagramConfig.access_token}
              onChange={(e) => setInstagramConfig(prev => ({ ...prev, access_token: e.target.value }))}
              placeholder="Instagram API access token"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={!instagramConfig.enabled}
            />
          </div>
        </div>

        <div className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded-lg">
          <h5 className="font-medium text-pink-900 mb-2">📱 Instagram Marketing Benefits:</h5>
          <ul className="text-sm text-pink-700 space-y-1">
            <li>• Automated property photo posts with captions</li>
            <li>• Consistent brand presence and engagement</li>
            <li>• Reach potential customers organically</li>
            <li>• Include contact details and booking information</li>
          </ul>
        </div>

        <button
          onClick={saveInstagramIntegration}
          disabled={loading || !instagramConfig.enabled}
          className="mt-4 px-6 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
        >
          Save Instagram Settings
        </button>
      </div>

      {/* Facebook Integration */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Facebook className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">Facebook Business Page</h4>
            <p className="text-gray-600">Share property updates on your Facebook page</p>
          </div>
          <div className="ml-auto">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={facebookConfig.enabled}
                onChange={(e) => setFacebookConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Name</label>
            <input
              type="text"
              value={facebookConfig.page_name}
              onChange={(e) => setFacebookConfig(prev => ({ ...prev, page_name: e.target.value }))}
              placeholder="Your Facebook page name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!facebookConfig.enabled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page ID</label>
            <input
              type="text"
              value={facebookConfig.page_id}
              onChange={(e) => setFacebookConfig(prev => ({ ...prev, page_id: e.target.value }))}
              placeholder="Facebook page ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!facebookConfig.enabled}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Access Token</label>
            <input
              type="password"
              value={facebookConfig.access_token}
              onChange={(e) => setFacebookConfig(prev => ({ ...prev, access_token: e.target.value }))}
              placeholder="Facebook API access token"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!facebookConfig.enabled}
            />
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">📘 Facebook Marketing Benefits:</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Reach wider audience through Facebook's network</li>
            <li>• Share property updates and special offers</li>
            <li>• Build community around your properties</li>
            <li>• Drive direct bookings from social media</li>
          </ul>
        </div>

        <button
          onClick={saveFacebookIntegration}
          disabled={loading || !facebookConfig.enabled}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
        >
          Save Facebook Settings
        </button>
      </div>

      {/* Integration Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Integration Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg border-2 ${
            instagramConfig.enabled && instagramConfig.username && instagramConfig.access_token
              ? 'bg-green-50 border-green-200'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <Instagram className={`h-6 w-6 ${
                instagramConfig.enabled ? 'text-pink-500' : 'text-gray-400'
              }`} />
              <div>
                <p className="font-medium text-gray-900">Instagram</p>
                <p className="text-sm text-gray-600">
                  {instagramConfig.enabled && instagramConfig.username 
                    ? `Connected: @${instagramConfig.username}`
                    : 'Not connected'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border-2 ${
            facebookConfig.enabled && facebookConfig.page_id && facebookConfig.access_token
              ? 'bg-green-50 border-green-200'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <Facebook className={`h-6 w-6 ${
                facebookConfig.enabled ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div>
                <p className="font-medium text-gray-900">Facebook</p>
                <p className="text-sm text-gray-600">
                  {facebookConfig.enabled && facebookConfig.page_name 
                    ? `Connected: ${facebookConfig.page_name}`
                    : 'Not connected'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Marketing Campaigns</h3>
        <p className="text-gray-600">Set up automated posting for your properties</p>
      </div>

      <div className="space-y-6">
        {campaigns.map((campaign) => {
          const property = properties.find(p => p.id === campaign.property_id);
          if (!property) return null;

          return (
            <div key={campaign.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{property.title}</h4>
                    <p className="text-sm text-gray-600">{property.city}, {property.state}</p>
                    <p className="text-xs text-gray-500">{property.images.length} photos available</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => previewPostForProperty(property)}
                    className="flex items-center space-x-2 px-3 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </button>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={campaign.is_active}
                      onChange={(e) => toggleCampaign(campaign.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Posting Frequency</label>
                  <select
                    value={campaign.frequency}
                    onChange={(e) => updateCampaign(campaign.id, { 
                      frequency: e.target.value as any,
                      next_post: campaign.is_active ? getNextPostDate(e.target.value) : null
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {frequencyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Posts</label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={campaign.instagram_enabled}
                      onChange={(e) => updateCampaign(campaign.id, { instagram_enabled: e.target.checked })}
                      disabled={!instagramConfig.enabled}
                      className="text-pink-500 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">Enable Instagram posting</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Posts</label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={campaign.facebook_enabled}
                      onChange={(e) => updateCampaign(campaign.id, { facebook_enabled: e.target.checked })}
                      disabled={!facebookConfig.enabled}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Enable Facebook posting</span>
                  </label>
                </div>
              </div>

              {campaign.is_active && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-700 font-medium">Status:</span>
                      <span className="text-green-600 ml-2">Active Campaign</span>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium">Next Post:</span>
                      <span className="text-green-600 ml-2">
                        {campaign.next_post ? new Date(campaign.next_post).toLocaleDateString() : 'Calculating...'}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium">Frequency:</span>
                      <span className="text-green-600 ml-2">
                        {frequencyOptions.find(f => f.value === campaign.frequency)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium">Platforms:</span>
                      <span className="text-green-600 ml-2">
                        {[
                          campaign.instagram_enabled && 'Instagram',
                          campaign.facebook_enabled && 'Facebook'
                        ].filter(Boolean).join(', ') || 'None selected'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!instagramConfig.enabled && !facebookConfig.enabled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <Calendar className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-gray-900 mb-2">Setup Required</h4>
          <p className="text-gray-600 mb-4">
            Connect your Instagram or Facebook account to start automated marketing campaigns.
          </p>
          <button
            onClick={() => setActiveTab('setup')}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
          >
            Setup Social Media
          </button>
        </div>
      )}
    </div>
  );

  const renderPreview = () => {
    if (!previewPost) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Preview Selected</h3>
          <p className="text-gray-600">Go to Campaigns tab and click "Preview" on any property to see how the post will look.</p>
        </div>
      );
    }

    const { property, content } = previewPost;

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Post Preview</h3>
          <p className="text-gray-600">Preview how your automated posts will appear on social media</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Instagram Preview */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4">
              <div className="flex items-center space-x-3">
                <Instagram className="h-6 w-6 text-white" />
                <h4 className="text-lg font-bold text-white">Instagram Post Preview</h4>
              </div>
            </div>
            
            <div className="p-6">
              {/* Instagram Post Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ECR</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">@{instagramConfig.username || 'your_handle'}</p>
                  <p className="text-xs text-gray-500">ECR Beach Resorts</p>
                </div>
              </div>

              {/* Post Image */}
              <div className="mb-4">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Post Caption */}
              <div className="space-y-2">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <button className="flex items-center space-x-1">
                    <span>❤️</span>
                    <span>234 likes</span>
                  </button>
                  <button>💬 12 comments</button>
                  <button>📤 Share</button>
                </div>
                
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">@{instagramConfig.username || 'your_handle'}</span>
                  <p className="mt-1 text-gray-700 whitespace-pre-line">{content.caption}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Facebook Preview */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-blue-600 p-4">
              <div className="flex items-center space-x-3">
                <Facebook className="h-6 w-6 text-white" />
                <h4 className="text-lg font-bold text-white">Facebook Post Preview</h4>
              </div>
            </div>
            
            <div className="p-6">
              {/* Facebook Post Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ECR</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{facebookConfig.page_name || 'Your Page Name'}</p>
                  <p className="text-xs text-gray-500">2 hours ago • 🌍</p>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-700 whitespace-pre-line text-sm">{content.caption}</p>
              </div>

              {/* Post Image */}
              <div className="mb-4">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Facebook Engagement */}
              <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1">
                    <span>👍</span>
                    <span>89 likes</span>
                  </button>
                  <button>💬 15 comments</button>
                  <button>🔄 8 shares</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Post Details */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Post Content Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Property Information</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property:</span>
                  <span className="font-medium">{property.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{property.city}, {property.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Starting Price:</span>
                  <span className="font-medium">₹{Math.min(...property.room_types.map(r => r.price_per_night)).toLocaleString()}/night</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Images:</span>
                  <span className="font-medium">{property.images.length} photos</span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact Person:</span>
                  <span className="font-medium">{user?.name || 'Owner Name'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{user?.phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium">ECR Beach Resorts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h5 className="font-medium text-gray-900 mb-2">Hashtags</h5>
            <div className="flex flex-wrap gap-2">
              {content.hashtags.map((hashtag: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {hashtag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Automated Marketing</h2>
            <p className="text-gray-600">Promote your properties automatically on social media</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex h-[calc(95vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            {activeTab === 'setup' && renderSetup()}
            {activeTab === 'campaigns' && renderCampaigns()}
            {activeTab === 'preview' && renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}