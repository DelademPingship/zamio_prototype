import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Building,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  TrendingUp,
  Activity,
  Settings,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
} from 'lucide-react';
import { Card } from '@zamio/ui';

// Enhanced mock data with type-specific information
const mockPartners = [
  // Local Partners
  {
    id: 'local-1',
    name: 'GHAMRO',
    type: 'local',
    reportingStandard: 'CWR',
    adminFee: 15.0,
    contactInfo: {
      email: 'info@ghamro.org',
      phone: '+233 30 297 6156',
      address: 'Accra, Ghana',
      website: 'https://ghamro.org'
    },
    status: 'active',
    joinDate: '2020-01-15',
    description: 'Ghana Music Rights Organization - Primary PRO for Ghanaian musicians',
    localSpecific: {
      registrationNumber: 'GH-PRO-001',
      regulatoryBody: 'Ministry of Tourism, Arts and Culture',
      primaryTerritory: 'Ghana',
      localCompliance: 98.2,
      artistMembers: 15420,
      lastAuditDate: '2023-09-15'
    },
    metrics: {
      totalAgreements: 12,
      activeAgreements: 10,
      totalRoyaltyCollected: 2847293.45,
      lastCollectionDate: '2023-12-15',
      disputeCount: 3,
      collectionEfficiency: 94.5
    },
    agreements: [
      {
        id: 'agr-1',
        territory: 'United States',
        status: 'active',
        startDate: '2020-01-15',
        performance: { collections: 450000, disputes: 2 }
      },
      {
        id: 'agr-2',
        territory: 'United Kingdom',
        status: 'active',
        startDate: '2020-03-01',
        performance: { collections: 320000, disputes: 1 }
      }
    ],
    activityLog: [
      { action: 'Processed monthly royalty distribution', date: '2023-12-15', type: 'collection' },
      { action: 'Updated regulatory compliance status', date: '2023-12-10', type: 'compliance' },
      { action: 'Resolved dispute with international partner', date: '2023-12-05', type: 'dispute' },
    ]
  },
  {
    id: 'local-2',
    name: 'Musiga Rights',
    type: 'local',
    reportingStandard: 'CSV',
    adminFee: 12.5,
    contactInfo: {
      email: 'rights@musiga.org',
      phone: '+233 24 123 4567',
      address: 'Accra, Ghana'
    },
    status: 'active',
    joinDate: '2021-03-20',
    description: 'Musicians Union of Ghana rights management division',
    localSpecific: {
      registrationNumber: 'GH-PRO-002',
      regulatoryBody: 'Musicians Union of Ghana',
      primaryTerritory: 'Ghana',
      localCompliance: 95.8,
      artistMembers: 8750,
      lastAuditDate: '2023-11-20'
    },
    metrics: {
      totalAgreements: 8,
      activeAgreements: 7,
      totalRoyaltyCollected: 1256789.23,
      lastCollectionDate: '2023-12-10',
      disputeCount: 1,
      collectionEfficiency: 92.1
    },
    agreements: [
      {
        id: 'agr-3',
        territory: 'Canada',
        status: 'active',
        startDate: '2021-06-01',
        performance: { collections: 185000, disputes: 0 }
      }
    ],
    activityLog: [
      { action: 'Conducted quarterly compliance review', date: '2023-12-01', type: 'compliance' },
      { action: 'Processed artist registration batch', date: '2023-11-28', type: 'registration' },
    ]
  },
  // International Partners
  {
    id: 'intl-1',
    name: 'ASCAP',
    type: 'international',
    reportingStandard: 'CWR',
    adminFee: 11.5,
    contactInfo: {
      email: 'licensing@ascap.com',
      phone: '+1 212 621 6000',
      address: 'New York, NY, USA',
      website: 'https://www.ascap.com'
    },
    status: 'active',
    joinDate: '2019-06-01',
    description: 'American Society of Composers, Authors and Publishers',
    internationalSpecific: {
      globalHeadquarters: 'New York, USA',
      memberCount: 850000,
      establishedYear: 1914,
      territories: ['United States', 'Canada', 'Mexico'],
      reciprocalPartners: 45,
      lastGlobalReport: '2023-12-01'
    },
    metrics: {
      totalAgreements: 45,
      activeAgreements: 42,
      totalRoyaltyCollected: 15428739.67,
      lastCollectionDate: '2023-12-20',
      disputeCount: 8,
      collectionEfficiency: 96.8
    },
    agreements: [
      {
        id: 'agr-4',
        territory: 'Ghana',
        status: 'active',
        startDate: '2019-06-01',
        performance: { collections: 890000, disputes: 1 }
      },
      {
        id: 'agr-5',
        territory: 'Nigeria',
        status: 'active',
        startDate: '2019-08-01',
        performance: { collections: 675000, disputes: 3 }
      }
    ],
    activityLog: [
      { action: 'Processed international royalty distribution', date: '2023-12-20', type: 'collection' },
      { action: 'Updated reciprocal agreement terms', date: '2023-12-18', type: 'agreement' },
      { action: 'Resolved cross-border dispute', date: '2023-12-15', type: 'dispute' },
    ]
  },
  {
    id: 'intl-2',
    name: 'BMI',
    type: 'international',
    reportingStandard: 'DDEX',
    adminFee: 12.0,
    contactInfo: {
      email: 'info@bmi.com',
      phone: '+1 212 586 2000',
      address: 'New York, NY, USA',
      website: 'https://www.bmi.com'
    },
    status: 'active',
    joinDate: '2019-08-15',
    description: 'Broadcast Music, Inc.',
    internationalSpecific: {
      globalHeadquarters: 'New York, USA',
      memberCount: 1200000,
      establishedYear: 1939,
      territories: ['United States', 'Europe', 'Asia-Pacific'],
      reciprocalPartners: 38,
      lastGlobalReport: '2023-12-01'
    },
    metrics: {
      totalAgreements: 38,
      activeAgreements: 35,
      totalRoyaltyCollected: 12837492.18,
      lastCollectionDate: '2023-12-18',
      disputeCount: 5,
      collectionEfficiency: 95.2
    },
    agreements: [
      {
        id: 'agr-6',
        territory: 'Ghana',
        status: 'active',
        startDate: '2019-08-15',
        performance: { collections: 445000, disputes: 2 }
      }
    ],
    activityLog: [
      { action: 'Conducted annual partner review', date: '2023-12-18', type: 'review' },
      { action: 'Processed African territory collections', date: '2023-12-16', type: 'collection' },
    ]
  }
];

const PartnerDetail = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Find the partner by type and id
    const foundPartner = mockPartners.find(p => p.type === type && p.id === id);
    setPartner(foundPartner || null);
  }, [type, id]);

  if (!partner) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Partner Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The requested partner could not be found.</p>
          <button
            onClick={() => navigate('/partners')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Partners
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'local' ?
      <Building className="w-5 h-5 text-blue-600" /> :
      <Globe className="w-5 h-5 text-purple-600" />;
  };

  return (
    <main className="w-full px-6 py-8 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate('/partners')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Partners</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className={`w-20 h-20 rounded-lg flex items-center justify-center ${partner.type === 'local' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-purple-100 dark:bg-purple-900/20'}`}>
                {getTypeIcon(partner.type)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{partner.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{partner.contactInfo.email}</p>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(partner.status)}`}>
                    <span className="capitalize">{partner.status}</span>
                  </span>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    {getTypeIcon(partner.type)}
                    <span className={`capitalize ${partner.type === 'local' ? 'text-blue-600' : 'text-purple-600'}`}>
                      {partner.type} Partner
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit Partner</span>
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
            {[
              { id: 'profile', name: 'Profile', icon: Building },
              { id: 'agreements', name: 'Agreements', icon: FileText },
              { id: 'performance', name: 'Performance', icon: TrendingUp },
              { id: 'activity', name: 'Activity', icon: Activity },
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
              {/* Partner Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Partner Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization Name</label>
                      <p className="text-gray-900 dark:text-white font-semibold">{partner.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900 dark:text-white">{partner.contactInfo.email}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900 dark:text-white">{partner.contactInfo.phone}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900 dark:text-white">{partner.contactInfo.address}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reporting Standard</label>
                      <p className="text-gray-900 dark:text-white font-semibold">{partner.reportingStandard}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admin Fee</label>
                      <p className="text-gray-900 dark:text-white font-semibold">{partner.adminFee}%</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                      <p className="text-gray-700 dark:text-gray-300">{partner.description}</p>
                    </div>
                  </div>
                </Card>

                {/* Type-Specific Information */}
                {partner.type === 'local' && partner.localSpecific && (
                  <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Local Partner Information</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Registration Number</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{partner.localSpecific.registrationNumber}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Regulatory Body</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{partner.localSpecific.regulatoryBody}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Primary Territory</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{partner.localSpecific.primaryTerritory}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Local Compliance</span>
                        <span className="font-semibold text-green-600">{partner.localSpecific.localCompliance}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Artist Members</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{partner.localSpecific.artistMembers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Last Audit</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{partner.localSpecific.lastAuditDate}</span>
                      </div>
                    </div>
                  </Card>
                )}

                {partner.type === 'international' && partner.internationalSpecific && (
                  <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">International Partner Information</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Global Headquarters</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{partner.internationalSpecific.globalHeadquarters}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Member Count</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{partner.internationalSpecific.memberCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Established</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{partner.internationalSpecific.establishedYear}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400 block mb-2">Active Territories</span>
                        <div className="flex flex-wrap gap-2">
                          {partner.internationalSpecific.territories.map((territory: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                              {territory}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Reciprocal Partners</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{partner.internationalSpecific.reciprocalPartners}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Last Global Report</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{partner.internationalSpecific.lastGlobalReport}</span>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Total Agreements</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{partner.metrics.totalAgreements}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Active Agreements</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{partner.metrics.activeAgreements}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Total Collected</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₵{partner.metrics.totalRoyaltyCollected.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Collection Efficiency</span>
                      <span className="font-semibold text-green-600">{partner.metrics.collectionEfficiency}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Active Disputes</span>
                      <span className={`font-semibold ${partner.metrics.disputeCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {partner.metrics.disputeCount}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'agreements' && (
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Active Agreements</h3>
                <Link
                  to="/agreements"
                  className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/30 transition-colors text-sm font-medium"
                >
                  View All Agreements →
                </Link>
              </div>
              <div className="space-y-4">
                {partner.agreements.map((agreement: any) => (
                  <div key={agreement.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-800/70 transition-colors">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">{agreement.territory}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Started: {agreement.startDate}</div>
                    </div>
                    <div className="text-right mr-4">
                      <div className="text-gray-900 dark:text-white font-semibold">₵{agreement.performance.collections.toLocaleString()}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{agreement.performance.disputes} disputes</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${agreement.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {agreement.status}
                      </span>
                      <Link
                        to={`/agreements`}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        title="View in Agreements"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Performance Metrics</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Collection Efficiency</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{partner.metrics.collectionEfficiency}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Collected</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">₵{partner.metrics.totalRoyaltyCollected.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center justify-between p-4 rounded-lg ${partner.metrics.disputeCount > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className={`w-8 h-8 ${partner.metrics.disputeCount > 0 ? 'text-red-600' : 'text-green-600'}`} />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Disputes</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{partner.metrics.disputeCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Agreement Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total Agreements</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{partner.metrics.totalAgreements}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Active Agreements</span>
                    <span className="font-semibold text-green-600">{partner.metrics.activeAgreements}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Last Collection</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{partner.metrics.lastCollectionDate}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'activity' && (
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {partner.activityLog.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${activity.type === 'collection' ? 'bg-green-500' : activity.type === 'dispute' ? 'bg-red-500' : activity.type === 'compliance' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </main>
  );
};

export default PartnerDetail;
