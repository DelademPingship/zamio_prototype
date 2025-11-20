import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { Card } from '@zamio/ui';

// Mock data for disputes
const mockDisputes = [
  {
    id: 'dispute-attribution-001',
    title: 'Incorrect Artist Attribution for "Ghana Love"',
    description: 'Station reported incorrect artist attribution for track played on 2023-12-15',
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
    evidenceCount: 2,
    notesCount: 2
  },
  {
    id: 'dispute-payment-001',
    title: 'Missing Royalty Payment for Q4 2023',
    description: 'Station has not received expected royalty payment for Q4 2023 performances',
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
    evidenceCount: 1,
    notesCount: 1
  },
  {
    id: 'dispute-cross-station-001',
    title: 'Conflicting Attribution Across Multiple Stations',
    description: 'Multiple stations reporting the same track with different artist attributions',
    type: 'cross_station',
    category: 'attribution',
    status: 'escalated',
    priority: 'critical',
    stationId: 'multiple',
    stationName: 'Multiple Stations',
    stationType: 'various',
    stationLocation: 'Various Locations',
    flaggedDate: '2023-12-18T14:00:00Z',
    flaggedBy: 'admin-user-1',
    lastUpdated: '2023-12-19T11:30:00Z',
    assignedTo: 'admin-user-3',
    assignedDate: '2023-12-18T15:00:00Z',
    estimatedImpact: 500.00,
    evidenceCount: 1,
    notesCount: 1
  },
  {
    id: 'dispute-technical-001',
    title: 'API Connectivity Issues with Attribution System',
    description: 'Streaming station experiencing intermittent API failures',
    type: 'station_flagged',
    category: 'technical',
    status: 'investigating',
    priority: 'medium',
    stationId: 'station-streaming-1',
    stationName: 'AfroStream',
    stationType: 'streaming',
    stationLocation: 'Kumasi, Ghana',
    flaggedDate: '2023-12-14T16:45:00Z',
    flaggedBy: 'station-user-3',
    lastUpdated: '2023-12-17T10:15:00Z',
    assignedTo: 'admin-user-4',
    assignedDate: '2023-12-15T09:00:00Z',
    estimatedImpact: 0.00,
    evidenceCount: 1,
    notesCount: 1
  },
  {
    id: 'dispute-data-001',
    title: 'Play Count Discrepancy for "Kumasi Vibes"',
    description: 'Venue reports 15 plays but system shows 12 plays',
    type: 'station_flagged',
    category: 'data',
    status: 'resolved',
    priority: 'medium',
    stationId: 'station-venue-1',
    stationName: 'National Theatre',
    stationType: 'venue',
    stationLocation: 'Accra, Ghana',
    flaggedDate: '2023-12-10T13:20:00Z',
    flaggedBy: 'station-user-4',
    lastUpdated: '2023-12-12T16:30:00Z',
    assignedTo: 'admin-user-2',
    assignedDate: '2023-12-10T14:00:00Z',
    resolvedDate: '2023-12-12T16:30:00Z',
    estimatedImpact: 75.00,
    evidenceCount: 1,
    notesCount: 1
  }
];

const Disputes = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stationFilter, setStationFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisputes, setSelectedDisputes] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Filter disputes based on criteria
  const filteredDisputes = mockDisputes.filter(dispute => {
    const matchesSearch = dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispute.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispute.stationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || dispute.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || dispute.category === categoryFilter;
    const matchesStation = stationFilter === 'all' || dispute.stationId === stationFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesStation;
  });

  // Calculate summary stats
  const stats = {
    totalDisputes: mockDisputes.length,
    openDisputes: mockDisputes.filter(d => d.status === 'open' || d.status === 'investigating' || d.status === 'pending_info').length,
    resolvedDisputes: mockDisputes.filter(d => d.status === 'resolved').length,
    escalatedDisputes: mockDisputes.filter(d => d.status === 'escalated').length,
    totalImpact: mockDisputes.reduce((sum, d) => sum + d.estimatedImpact, 0),
    avgResolutionTime: 48, // hours (mock data)
  };

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

  return (
    <main className="w-full px-6 py-8 min-h-screen">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 dark:from-red-400 dark:to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Disputes Management
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                    Manage station-flagged disputes and resolution workflows
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/disputes/analytics"
                className="px-5 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>View Analytics</span>
              </Link>
              <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Dispute</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-50/90 via-cyan-50/80 to-indigo-50/90 dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200/50 dark:border-slate-600/60 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-700/70 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-normal text-gray-700 dark:text-slate-300 leading-relaxed">Total Disputes</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {stats.totalDisputes}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/60 dark:to-cyan-900/60 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50/90 via-yellow-50/80 to-amber-50/90 dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95 backdrop-blur-sm rounded-xl shadow-lg border border-orange-200/50 dark:border-slate-600/60 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-700/70 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-normal text-gray-700 dark:text-slate-300 leading-relaxed">Open Disputes</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100 leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  {stats.openDisputes}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/60 dark:to-yellow-900/60 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50/90 via-emerald-50/80 to-teal-50/90 dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95 backdrop-blur-sm rounded-xl shadow-lg border border-green-200/50 dark:border-slate-600/60 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:border-green-300 dark:hover:border-green-700/70 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-normal text-gray-700 dark:text-slate-300 leading-relaxed">Resolved</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100 leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  {stats.resolvedDisputes}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/60 dark:to-emerald-900/60 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-50/90 via-rose-50/80 to-pink-50/90 dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95 backdrop-blur-sm rounded-xl shadow-lg border border-red-200/50 dark:border-slate-600/60 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:border-red-300 dark:hover:border-red-700/70 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-normal text-gray-700 dark:text-slate-300 leading-relaxed">Escalated</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100 leading-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                  {stats.escalatedDisputes}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/60 dark:to-rose-900/60 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search disputes by title, description, or station..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="pending_info">Pending Info</option>
                  <option value="escalated">Escalated</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  className="px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  className="px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="attribution">Attribution</option>
                  <option value="payment">Payment</option>
                  <option value="data">Data</option>
                  <option value="technical">Technical</option>
                  <option value="policy">Policy</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-slate-600"
                      checked={selectedDisputes.length === filteredDisputes.length && filteredDisputes.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDisputes(filteredDisputes.map(d => d.id));
                        } else {
                          setSelectedDisputes([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Dispute</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Station</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Priority</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Impact</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Last Updated</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDisputes.map((dispute) => (
                  <tr key={dispute.id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-slate-600"
                        checked={selectedDisputes.includes(dispute.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDisputes([...selectedDisputes, dispute.id]);
                          } else {
                            setSelectedDisputes(selectedDisputes.filter(id => id !== dispute.id));
                          }
                        }}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dispute.category === 'attribution' ? 'bg-blue-100 dark:bg-blue-900/20' : dispute.category === 'payment' ? 'bg-green-100 dark:bg-green-900/20' : dispute.category === 'data' ? 'bg-purple-100 dark:bg-purple-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                          {getCategoryIcon(dispute.category)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{dispute.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{dispute.category} • {dispute.evidenceCount} evidence</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{dispute.stationName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{dispute.stationType} • {dispute.stationLocation}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(dispute.status)}`}>
                        <span className="capitalize">{dispute.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(dispute.priority)}`}>
                        <span className="capitalize">{dispute.priority}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-900 dark:text-white font-semibold">₵{dispute.estimatedImpact.toLocaleString()}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{dispute.notesCount} notes</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-900 dark:text-white font-semibold">
                        {new Date(dispute.lastUpdated).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(dispute.lastUpdated).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/disputes/${dispute.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredDisputes.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No disputes found matching your criteria.</p>
            </div>
          )}
        </Card>
      </main>
  );
};

export default Disputes;
