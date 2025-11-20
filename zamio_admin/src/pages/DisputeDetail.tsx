import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  AlertTriangle,
  Building,
  Globe,
  Radio,
  Tv,
  Music,
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
  CheckCircle,
  Clock,
  Eye,
  Download,
  MessageSquare,
  User,
  Flag,
  AlertCircle,
  Check,
  X,
  ArrowRight,
  UserPlus,
} from 'lucide-react';
import { Card } from '@zamio/ui';

// Enhanced mock data for disputes
const mockDisputes = [
  {
    id: 'dispute-attribution-001',
    title: 'Incorrect Artist Attribution for "Ghana Love"',
    description: 'Station reported incorrect artist attribution for track "Ghana Love" played on 2023-12-15 at 14:30. The system shows artist as "Unknown Artist" but station confirms it should be "Kojo Antwi".',
    type: 'station_flagged',
    category: 'attribution',
    status: 'investigating',
    priority: 'high',
    stationId: 'station-radio-1',
    stationName: 'Accra FM',
    stationType: 'radio',
    stationLocation: 'Accra, Ghana',
    flaggedDate: '2023-12-15T10:30:00Z',
    flaggedBy: 'station-user-1',
    lastUpdated: '2023-12-16T14:20:00Z',
    assignedTo: 'admin-user-1',
    assignedDate: '2023-12-15T11:00:00Z',
    estimatedImpact: 250.00,
    evidence: [
      {
        id: 'evidence-audio-001',
        type: 'audio',
        title: 'Station Recording',
        description: 'Audio recording from station showing the track play with DJ announcement',
        fileUrl: '/evidence/audio/accra-fm-ghana-love-20231215.mp3',
        uploadedBy: 'station-user-1',
        uploadedDate: '2023-12-15T10:35:00Z',
        size: 5242880
      },
      {
        id: 'evidence-document-001',
        type: 'document',
        title: 'Playlist Log',
        description: 'Station playlist log showing track details',
        fileUrl: '/evidence/documents/accra-fm-playlist-20231215.pdf',
        uploadedBy: 'station-user-1',
        uploadedDate: '2023-12-15T10:40:00Z',
        size: 1024000
      }
    ],
    timeline: [
      {
        id: 'timeline-001',
        type: 'status_change',
        status: 'open',
        timestamp: '2023-12-15T10:30:00Z',
        user: 'station-user-1',
        userName: 'Station Manager',
        description: 'Dispute flagged by station'
      },
      {
        id: 'timeline-002',
        type: 'assignment',
        status: 'investigating',
        timestamp: '2023-12-15T11:00:00Z',
        user: 'admin-user-1',
        userName: 'Admin User',
        description: 'Assigned to Admin User for investigation'
      },
      {
        id: 'timeline-003',
        type: 'evidence',
        status: 'investigating',
        timestamp: '2023-12-15T10:35:00Z',
        user: 'station-user-1',
        userName: 'Station Manager',
        description: 'Evidence uploaded: Station Recording'
      },
      {
        id: 'timeline-004',
        type: 'note',
        status: 'investigating',
        timestamp: '2023-12-15T11:05:00Z',
        user: 'admin-user-1',
        userName: 'Admin User',
        description: 'Investigating attribution claim. Need to verify track metadata.'
      }
    ],
    notes: [
      {
        id: 'note-001',
        author: 'admin-user-1',
        authorName: 'Admin User',
        content: 'Investigating attribution claim. Need to verify track metadata in database. Contacted content team for verification.',
        timestamp: '2023-12-15T11:05:00Z',
        type: 'investigation'
      },
      {
        id: 'note-002',
        author: 'station-user-1',
        authorName: 'Station Manager',
        content: 'Additional evidence uploaded showing DJ announcement clearly stating "Kojo Antwi - Ghana Love".',
        timestamp: '2023-12-15T15:20:00Z',
        type: 'evidence'
      }
    ],
    relatedTracks: ['track-ghana-love-001']
  },
  {
    id: 'dispute-payment-001',
    title: 'Missing Royalty Payment for Q4 2023',
    description: 'Station has not received expected royalty payment for Q4 2023 performances. Total expected: ₵1,250.00. Last payment received was for Q3 2023.',
    type: 'station_flagged',
    category: 'payment',
    status: 'pending_info',
    priority: 'high',
    stationId: 'station-tv-1',
    stationName: 'Ghana TV',
    stationType: 'tv',
    stationLocation: 'Accra, Ghana',
    flaggedDate: '2023-12-20T09:15:00Z',
    flaggedBy: 'station-user-2',
    lastUpdated: '2023-12-20T16:45:00Z',
    assignedTo: 'admin-user-2',
    assignedDate: '2023-12-20T10:00:00Z',
    estimatedImpact: 1250.00,
    evidence: [
      {
        id: 'evidence-document-002',
        type: 'document',
        title: 'Payment Statement Q3',
        description: 'Previous quarter payment statement for reference',
        fileUrl: '/evidence/documents/ghana-tv-payment-q3-2023.pdf',
        uploadedBy: 'station-user-2',
        uploadedDate: '2023-12-20T09:20:00Z',
        size: 2048000
      }
    ],
    timeline: [
      {
        id: 'timeline-payment-001',
        type: 'status_change',
        status: 'open',
        timestamp: '2023-12-20T09:15:00Z',
        user: 'station-user-2',
        userName: 'Finance Manager',
        description: 'Payment dispute flagged by station'
      },
      {
        id: 'timeline-payment-002',
        type: 'assignment',
        status: 'pending_info',
        timestamp: '2023-12-20T10:00:00Z',
        user: 'admin-user-2',
        userName: 'Finance Admin',
        description: 'Assigned to Finance Admin for investigation'
      }
    ],
    notes: [
      {
        id: 'note-payment-001',
        author: 'admin-user-2',
        authorName: 'Finance Admin',
        content: 'Payment records show Q4 payment was processed on 2023-12-18. Investigating potential bank delay or incorrect account details.',
        timestamp: '2023-12-20T10:15:00Z',
        type: 'investigation'
      }
    ]
  }
];

const DisputeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dispute, setDispute] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Find the dispute by id
    const foundDispute = mockDisputes.find(d => d.id === id);
    setDispute(foundDispute || null);
  }, [id]);

  if (!dispute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dispute Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The requested dispute could not be found.</p>
          <button
            onClick={() => navigate('/disputes')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Disputes
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'pending_info':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'escalated':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'attribution':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'data':
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      case 'technical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStationIcon = (type: string) => {
    switch (type) {
      case 'radio':
        return <Radio className="w-5 h-5 text-blue-600" />;
      case 'tv':
        return <Tv className="w-5 h-5 text-purple-600" />;
      case 'streaming':
        return <Music className="w-5 h-5 text-green-600" />;
      case 'venue':
        return <Building className="w-5 h-5 text-orange-600" />;
      default:
        return <Building className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <main className="w-full px-6 py-8 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate('/disputes')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Disputes</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className={`w-20 h-20 rounded-lg flex items-center justify-center ${dispute.category === 'attribution' ? 'bg-blue-100 dark:bg-blue-900/20' : dispute.category === 'payment' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                {getCategoryIcon(dispute.category)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{dispute.title}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{dispute.description}</p>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(dispute.status)}`}>
                    <span className="capitalize">{dispute.status.replace('_', ' ')}</span>
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(dispute.priority)}`}>
                    <span className="capitalize">{dispute.priority} Priority</span>
                  </span>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    {getStationIcon(dispute.stationType)}
                    <span>{dispute.stationName} ({dispute.stationType})</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Update Status</span>
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>Close Dispute</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
            {[
              { id: 'overview', name: 'Overview', icon: AlertTriangle },
              { id: 'timeline', name: 'Timeline', icon: Calendar },
              { id: 'evidence', name: 'Evidence', icon: FileText },
              { id: 'resolution', name: 'Resolution', icon: CheckCircle },
              { id: 'notes', name: 'Notes', icon: MessageSquare },
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
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Dispute Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dispute Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dispute ID</label>
                      <p className="text-gray-900 dark:text-white font-semibold">{dispute.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(dispute.category)}
                        <p className="text-gray-900 dark:text-white capitalize">{dispute.category}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Station</label>
                      <div className="flex items-center space-x-2">
                        {getStationIcon(dispute.stationType)}
                        <p className="text-gray-900 dark:text-white">{dispute.stationName}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900 dark:text-white">{dispute.stationLocation}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Flagged Date</label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900 dark:text-white">{new Date(dispute.flaggedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Flagged By</label>
                      <p className="text-gray-900 dark:text-white">{dispute.flaggedBy}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned To</label>
                      <p className="text-gray-900 dark:text-white">{dispute.assignedTo || 'Unassigned'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estimated Impact</label>
                      <p className="text-gray-900 dark:text-white font-semibold">₵{dispute.estimatedImpact.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Actions & Stats */}
              <div className="space-y-6">
                <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium flex items-center space-x-2">
                      <UserPlus className="w-4 h-4" />
                      <span>Reassign Dispute</span>
                    </button>
                    <button className="w-full px-4 py-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm font-medium flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Escalate Dispute</span>
                    </button>
                    <button className="w-full px-4 py-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors text-sm font-medium flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark as Resolved</span>
                    </button>
                  </div>
                </Card>

                <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Dispute Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Evidence Files</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{dispute.evidence.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Notes</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{dispute.notes.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Timeline Events</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{dispute.timeline.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Days Open</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {Math.floor((new Date().getTime() - new Date(dispute.flaggedDate).getTime()) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dispute Timeline</h3>
              <div className="space-y-6">
                {dispute.timeline.map((event: any, index: number) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${event.type === 'status_change' ? 'bg-blue-100 dark:bg-blue-900/20' : event.type === 'assignment' ? 'bg-green-100 dark:bg-green-900/20' : event.type === 'evidence' ? 'bg-purple-100 dark:bg-purple-900/20' : 'bg-gray-100 dark:bg-gray-900/20'}`}>
                      {event.type === 'status_change' && <ArrowRight className="w-5 h-5 text-blue-600" />}
                      {event.type === 'assignment' && <User className="w-5 h-5 text-green-600" />}
                      {event.type === 'evidence' && <FileText className="w-5 h-5 text-purple-600" />}
                      {event.type === 'note' && <MessageSquare className="w-5 h-5 text-gray-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900 dark:text-white">{event.description}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        by {event.userName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'evidence' && (
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Evidence Files</h3>
              <div className="space-y-4">
                {dispute.evidence.map((evidence: any) => (
                  <div key={evidence.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-600">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        {evidence.type === 'audio' && <Music className="w-6 h-6 text-gray-600" />}
                        {evidence.type === 'document' && <FileText className="w-6 h-6 text-gray-600" />}
                        {evidence.type === 'screenshot' && <Eye className="w-6 h-6 text-gray-600" />}
                        {evidence.type === 'log' && <FileText className="w-6 h-6 text-gray-600" />}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{evidence.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{evidence.description}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          Uploaded by {evidence.uploadedBy} on {new Date(evidence.uploadedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'resolution' && (
            <div className="space-y-8">
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Resolution Workflow</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg border-2 ${dispute.status === 'investigating' ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20' : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${dispute.status === 'investigating' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <span className="font-semibold text-gray-900 dark:text-white">Investigating</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {dispute.assignedTo ? `Assigned to ${dispute.assignedTo}` : 'Not assigned'}
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg border-2 ${dispute.status === 'pending_info' ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20' : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${dispute.status === 'pending_info' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                        <span className="font-semibold text-gray-900 dark:text-white">Pending Info</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Waiting for additional information
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg border-2 ${dispute.status === 'resolved' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${dispute.status === 'resolved' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="font-semibold text-gray-900 dark:text-white">Resolved</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Issue resolved and closed
                      </div>
                    </div>
                  </div>

                  {/* Assignment Section */}
                  <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assignment Management</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Assignee</label>
                        <select className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400">
                          <option value="">Select Assignee</option>
                          <option value="admin-user-1">Admin User</option>
                          <option value="admin-user-2">Finance Admin</option>
                          <option value="admin-user-3">Senior Admin</option>
                          <option value="admin-user-4">Tech Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Escalation Level</label>
                        <select className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400">
                          <option value="standard">Standard</option>
                          <option value="escalated">Escalated</option>
                          <option value="legal">Legal Review</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Update Assignment
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Escalate Dispute
                      </button>
                    </div>
                  </div>

                  {/* Resolution Actions */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resolution Actions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Mark as Resolved</span>
                      </button>
                      <button className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
                        <X className="w-5 h-5" />
                        <span>Close Dispute</span>
                      </button>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resolution Notes</label>
                      <textarea
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        rows={3}
                        placeholder="Add resolution details and outcome..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Outcome Tracking */}
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Outcome Tracking</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {Math.floor((new Date().getTime() - new Date(dispute.flaggedDate).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Days Open</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {dispute.timeline.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Timeline Events</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      ₵{dispute.estimatedImpact.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Estimated Impact</div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'notes' && (
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Communication Log</h3>
              <div className="space-y-4">
                {dispute.notes.map((note: any) => (
                  <div key={note.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900 dark:text-white">{note.authorName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(note.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{note.content}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-6 p-4 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg">
                  <div className="text-center">
                    <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">Add a note to this dispute</p>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
  );
};

export default DisputeDetail;
