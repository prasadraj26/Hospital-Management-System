import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function PurpleThemeDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [analytics, setAnalytics] = useState(null);
  const [realtimeMetrics, setRealtimeMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiInsights, setAiInsights] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchRealtimeMetrics();
    fetchAIInsights();
    
    // Update real-time metrics every 30 seconds
    const interval = setInterval(fetchRealtimeMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:4451/api/analytics/dashboard');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeMetrics = async () => {
    try {
      const response = await axios.get('http://localhost:4451/api/analytics/realtime');
      setRealtimeMetrics(response.data);
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
    }
  };

  const fetchAIInsights = async () => {
    // Mock AI insights for demonstration
    const mockInsights = [
      {
        id: 1,
        type: 'prediction',
        title: 'High Readmission Risk Detected',
        description: '3 patients show 85%+ readmission probability',
        severity: 'high',
        action: 'Schedule follow-up calls'
      },
      {
        id: 2,
        type: 'optimization',
        title: 'Staff Scheduling Optimization',
        description: 'AI suggests 15% efficiency improvement',
        severity: 'medium',
        action: 'Review schedule recommendations'
      },
      {
        id: 3,
        type: 'inventory',
        title: 'Smart Inventory Alert',
        description: 'Paracetamol stock will deplete in 2 days',
        severity: 'medium',
        action: 'Place reorder request'
      }
    ];
    setAiInsights(mockInsights);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-purple-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-purple-100';
      case 'warning': return 'bg-yellow-100';
      case 'error': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600 text-lg font-medium">Loading AI-Powered Dashboard...</p>
        </div>
      </div>
    );
  }

  const appointmentTrendsData = {
    labels: analytics?.appointmentTrends?.map(trend => trend._id) || [],
    datasets: [
      {
        label: 'Total Appointments',
        data: analytics?.appointmentTrends?.map(trend => trend.count) || [],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Completed',
        data: analytics?.appointmentTrends?.map(trend => trend.completed) || [],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const departmentData = {
    labels: analytics?.departmentStats?.map(dept => dept._id || 'Unknown') || [],
    datasets: [
      {
        label: 'Appointments',
        data: analytics?.departmentStats?.map(dept => dept.appointments) || [],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(79, 70, 229, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(124, 58, 237, 0.8)',
          'rgba(109, 40, 217, 0.8)',
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(79, 70, 229, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(124, 58, 237, 1)',
          'rgba(109, 40, 217, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const doctorPerformanceData = {
    labels: analytics?.doctorStats?.map(doctor => doctor.doctorName || 'Unknown') || [],
    datasets: [
      {
        label: 'Appointments',
        data: analytics?.doctorStats?.map(doctor => doctor.appointments) || [],
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI-Powered Hospital Dashboard
              </h1>
              <p className="text-purple-600 mt-2 text-lg">
                Welcome back, {currentUser?.name || 'User'}! Here's your intelligent hospital overview.
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-lg">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">AI Active</span>
            </div>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="mb-6 bg-white rounded-xl shadow-lg border border-purple-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-purple-800 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Insights & Recommendations
              </h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {aiInsights.length} Active
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight) => (
                <div key={insight.id} className={`p-4 rounded-lg border-2 ${getSeverityColor(insight.severity)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{insight.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                      {insight.type}
                    </span>
                  </div>
                  <p className="text-sm mb-3">{insight.description}</p>
                  <button className="text-xs font-medium underline hover:no-underline">
                    {insight.action} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        {realtimeMetrics && (
          <div className="mb-6 p-6 bg-white rounded-xl shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`px-4 py-2 rounded-full ${getStatusBgColor(realtimeMetrics.systemStatus)}`}>
                  <span className={`text-sm font-medium ${getStatusColor(realtimeMetrics.systemStatus)}`}>
                    System {realtimeMetrics.systemStatus}
                  </span>
                </div>
                <span className="text-sm text-purple-600">
                  Last updated: {new Date(realtimeMetrics.currentTime).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex space-x-6 text-sm">
                <span className="text-purple-600 font-medium">
                  Active: {realtimeMetrics.activeAppointments}
                </span>
                <span className="text-yellow-600 font-medium">
                  Waiting: {realtimeMetrics.waitingPatients}
                </span>
                <span className="text-green-600 font-medium">
                  Completed Today: {realtimeMetrics.completedToday}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8 bg-white rounded-lg p-1 shadow-lg">
            {['overview', 'analytics', 'ai-insights', 'predictions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-6 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Patients</p>
                    <p className="text-3xl font-bold mt-1">
                      {analytics?.overview?.totalPatients || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-medium">Total Appointments</p>
                    <p className="text-3xl font-bold mt-1">
                      {analytics?.overview?.totalAppointments || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-6 4h3m-2-5h3" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-500 to-violet-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-violet-100 text-sm font-medium">Revenue</p>
                    <p className="text-3xl font-bold mt-1">
                      ${analytics?.overview?.totalRevenue || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-fuchsia-100 text-sm font-medium">Emergency Cases</p>
                    <p className="text-3xl font-bold mt-1">
                      {analytics?.overview?.emergencyCases || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
                <h3 className="text-lg font-bold text-purple-800 mb-4">Appointment Trends</h3>
                <Line data={appointmentTrendsData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(147, 51, 234, 0.1)'
                      }
                    },
                    x: {
                      grid: {
                        color: 'rgba(147, 51, 234, 0.1)'
                      }
                    }
                  }
                }} />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
                <h3 className="text-lg font-bold text-purple-800 mb-4">Department Distribution</h3>
                <Doughnut data={departmentData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }} />
              </div>
            </div>

            {/* Doctor Performance */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
              <h3 className="text-lg font-bold text-purple-800 mb-4">Doctor Performance</h3>
              <Bar data={doctorPerformanceData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(147, 51, 234, 0.1)'
                    }
                  },
                  x: {
                    grid: {
                      color: 'rgba(147, 51, 234, 0.1)'
                    }
                  }
                }
              }} />
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'ai-insights' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
                <h3 className="text-lg font-bold text-purple-800 mb-4">Patient Satisfaction</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {analytics?.patientSatisfaction || 0}/5
                  </div>
                  <p className="text-purple-600">AI-Predicted Rating</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
                <h3 className="text-lg font-bold text-purple-800 mb-4">Average Wait Time</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    {analytics?.averageWaitTime || 0} min
                  </div>
                  <p className="text-purple-600">AI-Optimized</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
                <h3 className="text-lg font-bold text-purple-800 mb-4">AI Accuracy</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-violet-600 mb-2">
                    94.2%
                  </div>
                  <p className="text-purple-600">Diagnosis Accuracy</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Predictions Tab */}
        {activeTab === 'predictions' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
              <h3 className="text-lg font-bold text-purple-800 mb-4">Predictive Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800">Readmission Risk</h4>
                  <p className="text-2xl font-bold text-purple-600 mt-2">12%</p>
                  <p className="text-sm text-purple-600">↓ 3% from last week</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                  <h4 className="font-semibold text-indigo-800">Staff Efficiency</h4>
                  <p className="text-2xl font-bold text-indigo-600 mt-2">87%</p>
                  <p className="text-sm text-indigo-600">↑ 5% from last month</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-violet-50 to-violet-100 rounded-lg border border-violet-200">
                  <h4 className="font-semibold text-violet-800">Resource Utilization</h4>
                  <p className="text-2xl font-bold text-violet-600 mt-2">92%</p>
                  <p className="text-sm text-violet-600">Optimal range</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 rounded-lg border border-fuchsia-200">
                  <h4 className="font-semibold text-fuchsia-800">Cost Optimization</h4>
                  <p className="text-2xl font-bold text-fuchsia-600 mt-2">15%</p>
                  <p className="text-sm text-fuchsia-600">Savings potential</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PurpleThemeDashboard;

