import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Music,
  Radio,
  Building,
  TrendingUp,
  DollarSign,
  Activity,
  Settings,
  Ban,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Shield,
} from 'lucide-react';
import { Card } from '@zamio/ui';

// Mock user data (in a real app, this would come from an API)
const mockUsers = [
  {
    id: 1,
    name: 'Sarkodie',
    email: 'sarkodie@zamio.com',
    type: 'artist',
    status: 'active',
    role: 'Artist',
    lastActivity: '2 hours ago',
    joinDate: 'Jan 2023',
    royaltiesEarned: 45234.8,
    plays: 234567,
    territory: 'Ghana',
    phone: '+233 20 123 4567',
    avatar: 'S',
    bio: 'Ghanaian hip-hop artist and entrepreneur known for his lyrical prowess and business acumen.',
    totalTracks: 150,
    monthlyListeners: 1250000,
    topTracks: [
      { name: 'Adonai', plays: 45000 },
      { name: 'Kanta', plays: 38000 },
      { name: 'Pain Killer', plays: 32000 },
    ],
    recentActivity: [
      { action: 'Uploaded new track', time: '2 hours ago' },
      { action: 'Received royalty payment', time: '1 day ago' },
      { action: 'Updated profile', time: '3 days ago' },
    ],
    // Artist-specific data
    streamingTrends: {
      monthlyGrowth: 12.5,
      topRegions: ['Accra', 'Kumasi', 'Takoradi'],
      collaborations: ['Stonebwoy', 'Shatta Wale', 'Efya'],
    },
    copyrightClaims: [
      { track: 'Adonai', status: 'resolved', date: '2023-06-15' },
      { track: 'Kanta', status: 'pending', date: '2023-07-22' },
    ],
  },
  {
    id: 2,
    name: 'Peace FM',
    email: 'contact@peacefm.com',
    type: 'station',
    status: 'active',
    role: 'Station',
    lastActivity: '1 hour ago',
    joinDate: 'Mar 2022',
    royaltiesEarned: 12890.5,
    plays: 56789,
    territory: 'Accra, Ghana',
    phone: '+233 30 212 3456',
    avatar: 'P',
    bio: 'Leading radio station in Ghana focusing on news, music, and cultural content.',
    totalTracks: 0,
    monthlyListeners: 500000,
    topTracks: [],
    recentActivity: [
      { action: 'Updated playlist', time: '1 hour ago' },
      { action: 'Processed play logs', time: '6 hours ago' },
    ],
    // Station-specific data
    stationType: 'Radio',
    broadcastSchedule: {
      hoursPerDay: 18,
      peakHours: '6:00 AM - 10:00 PM',
      coverage: 'Greater Accra Region',
    },
    complianceStatus: 'Compliant',
    reportingAccuracy: 98.5,
  },
  {
    id: 3,
    name: 'Universal Music Publishing Ghana',
    email: 'admin@umpghana.com',
    type: 'publisher',
    status: 'active',
    role: 'Publisher',
    lastActivity: '30 mins ago',
    joinDate: 'Dec 2022',
    royaltiesEarned: 183204.54,
    plays: 892345,
    territory: 'West Africa',
    phone: '+233 24 345 6789',
    avatar: 'U',
    bio: 'Major music publisher managing rights for artists across West Africa.',
    totalTracks: 0,
    monthlyListeners: 0,
    topTracks: [],
    recentActivity: [
      { action: 'Processed royalty distribution', time: '30 mins ago' },
      { action: 'Updated agreement terms', time: '2 days ago' },
    ],
    // Publisher-specific data
    activeAgreements: 45,
    territories: ['Ghana', 'Nigeria', 'Senegal', 'Ivory Coast'],
    catalogSize: 15000,
    catalogGrowth: 8.3,
    partnerPROs: ['ASCAP', 'BMI', 'PRS for Music'],
  },
];

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Find the user by ID
    const foundUser = mockUsers.find(u => u.id === parseInt(id || '0'));
    setUser(foundUser || null);
  }, [id]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The requested user could not be found.</p>
          <button
            onClick={() => navigate('/user-management')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to User Management
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'suspended':
        return <UserX className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'artist':
        return <Music className="w-5 h-5" />;
      case 'station':
        return <Radio className="w-5 h-5" />;
      case 'publisher':
        return <Building className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  return (
    <main className="w-full px-6 py-8 bg-gray-50/50 dark:bg-slate-900/50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate('/user-management')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Users</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                {user.avatar}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{user.email}</p>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(user.status)}`}>
                    {getStatusIcon(user.status)}
                    <span className="ml-1 capitalize">{user.status}</span>
                  </span>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    {getTypeIcon(user.type)}
                    <span className="capitalize">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit User</span>
              </button>
              {user.status === 'active' ? (
                <button className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                  <UserX className="w-4 h-4" />
                  <span>Suspend</span>
                </button>
              ) : (
                <button className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Activate</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
            {[
              { id: 'profile', name: 'Profile', icon: Users },
              { id: 'activity', name: 'Activity', icon: Activity },
              { id: 'royalties', name: 'Royalties', icon: DollarSign },
              { id: 'settings', name: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                      <p className="text-gray-900 dark:text-white font-semibold">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900 dark:text-white">{user.email}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900 dark:text-white">{user.phone}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Territory</label>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900 dark:text-white">{user.territory}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Member Since</label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900 dark:text-white">{user.joinDate}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Activity</label>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900 dark:text-white">{user.lastActivity}</p>
                      </div>
                    </div>
                  </div>
                  {user.bio && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                      <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
                    </div>
                  )}
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Total Royalties</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₵{user.royaltiesEarned.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Total Plays</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{user.plays.toLocaleString()}</span>
                    </div>
                    {user.type === 'artist' && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Total Tracks</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{user.totalTracks}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Monthly Listeners</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{user.monthlyListeners.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>

              {/* Type-Specific Information */}
              {user.type === 'artist' && (
                <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Artist Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Monthly Growth</span>
                      <span className={`font-semibold ${user.streamingTrends.monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {user.streamingTrends.monthlyGrowth > 0 ? '+' : ''}{user.streamingTrends.monthlyGrowth}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-2">Top Regions</span>
                      <div className="flex flex-wrap gap-2">
                        {user.streamingTrends.topRegions.map((region: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-2">Collaborations</span>
                      <div className="flex flex-wrap gap-2">
                        {user.streamingTrends.collaborations.map((collab: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full text-sm">
                            {collab}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {user.type === 'station' && (
                <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Station Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Station Type</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{user.stationType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-2">Broadcast Schedule</span>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <p><strong>Hours per Day:</strong> {user.broadcastSchedule.hoursPerDay}</p>
                        <p><strong>Peak Hours:</strong> {user.broadcastSchedule.peakHours}</p>
                        <p><strong>Coverage:</strong> {user.broadcastSchedule.coverage}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Compliance Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.complianceStatus === 'Compliant' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.complianceStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Reporting Accuracy</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{user.reportingAccuracy}%</span>
                    </div>
                  </div>
                </Card>
              )}

              {user.type === 'publisher' && (
                <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Publishing Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Active Agreements</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{user.activeAgreements}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-2">Territories</span>
                      <div className="flex flex-wrap gap-2">
                        {user.territories.map((territory: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                            {territory}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Catalog Size</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{user.catalogSize.toLocaleString()} tracks</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Catalog Growth</span>
                      <span className={`font-semibold ${user.catalogGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {user.catalogGrowth > 0 ? '+' : ''}{user.catalogGrowth}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-2">Partner PROs</span>
                      <div className="flex flex-wrap gap-2">
                        {user.partnerPROs.map((pro: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 rounded-full text-sm">
                            {pro}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {user.recentActivity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'royalties' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Royalty Overview</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Earned</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">₵{user.royaltiesEarned.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Music className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Plays</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.plays.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {user.type === 'artist' && user.topTracks.length > 0 && (
                <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Top Tracks</h3>
                  <div className="space-y-4">
                    {user.topTracks.map((track: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{track.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{track.plays.toLocaleString()} plays</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Notification Preferences</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage how you receive notifications</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                    Configure
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-300">Danger Zone</p>
                    <p className="text-sm text-red-700 dark:text-red-400">Irreversible actions for this account</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
  );
};

export default UserDetail;
