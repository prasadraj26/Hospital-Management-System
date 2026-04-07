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

function HospitalDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [analytics, setAnalytics] = useState(null);
  const [realtimeMetrics, setRealtimeMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
    fetchRealtimeMetrics();
    
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-100';
      case 'warning': return 'bg-yellow-100';
      case 'error': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{borderBottomColor: 'rgb(71, 119, 181)'}}></div>
          <p className="text-lg font-medium" style={{color: 'rgb(71, 119, 181)'}}>Loading Dashboard...</p>
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
        borderColor: 'rgb(71, 119, 181)',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Completed',
        data: analytics?.appointmentTrends?.map(trend => trend.completed) || [],
        borderColor: 'rgb(71, 119, 181)',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
          'rgba(71, 119, 181, 0.8)',
          'rgba(71, 119, 181, 0.7)',
          'rgba(71, 119, 181, 0.6)',
          'rgba(71, 119, 181, 0.5)',
          'rgba(71, 119, 181, 0.4)',
        ],
        borderColor: [
          'rgb(71, 119, 181)',
          'rgb(71, 119, 181)',
          'rgb(71, 119, 181)',
          'rgb(71, 119, 181)',
          'rgb(71, 119, 181)',
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
        backgroundColor: 'rgba(71, 119, 181, 0.8)',
        borderColor: 'rgb(71, 119, 181)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold" style={{color: 'rgb(71, 119, 181)'}}>
            Hospital Dashboard
          </h1>
          <p className="mt-2 text-lg" style={{color: 'rgb(71, 119, 181)'}}>
            Welcome back, {currentUser?.name || 'User'}! Here's your hospital overview.
          </p>
        </div>

        {/* Real-time Status */}
        {realtimeMetrics && (
          <div className="mb-6 p-6 bg-white rounded-xl shadow-lg border" style={{borderColor: 'rgb(71, 119, 181)'}}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="px-4 py-2 rounded-full" style={{backgroundColor: 'rgba(71, 119, 181, 0.1)'}}>
                  <span className="text-sm font-medium" style={{color: 'rgb(71, 119, 181)'}}>
                    System {realtimeMetrics.systemStatus}
                  </span>
                </div>
                <span className="text-sm" style={{color: 'rgb(71, 119, 181)'}}>
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
            {['overview', 'analytics', 'realtime', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-6 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === tab
                    ? 'text-white'
                    : ''
                }`}
                style={{
                  backgroundColor: activeTab === tab ? 'rgb(71, 119, 181)' : 'transparent',
                  color: activeTab === tab ? 'white' : 'rgb(71, 119, 181)'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}  
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg text-white" style={{backgroundColor: 'rgb(71, 119, 181)'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: 'rgba(255, 255, 255, 0.9)'}}>Total Patients</p>
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

              <div className="bg-white p-6 rounded-xl shadow-lg text-white" style={{backgroundColor: 'rgb(71, 119, 181)'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: 'rgba(255, 255, 255, 0.9)'}}>Total Appointments</p>
                    <p className="text-3xl font-bold mt-1">
                      {analytics?.overview?.totalAppointments || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg text-white" style={{backgroundColor: 'rgb(71, 119, 181)'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: 'rgba(255, 255, 255, 0.9)'}}>Revenue</p>
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

              <div className="bg-white p-6 rounded-xl shadow-lg text-white" style={{backgroundColor: 'rgb(71, 119, 181)'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{color: 'rgba(255, 255, 255, 0.9)'}}>Emergency Cases</p>
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
              <div className="bg-white p-6 rounded-xl shadow-lg" style={{borderColor: 'rgb(71, 119, 181)', borderWidth: '1px'}}>
                <h3 className="text-lg font-bold mb-4" style={{color: 'rgb(71, 119, 181)'}}>Appointment Trends</h3>
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
                        color: 'rgba(71, 119, 181, 0.1)'
                      }
                    },
                    x: {
                      grid: {
                        color: 'rgba(71, 119, 181, 0.1)'
                      }
                    }
                  }
                }} />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg" style={{borderColor: 'rgb(71, 119, 181)', borderWidth: '1px'}}>
                <h3 className="text-lg font-bold mb-4" style={{color: 'rgb(71, 119, 181)'}}>Department Distribution</h3>
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
            <div className="bg-white p-6 rounded-xl shadow-lg" style={{borderColor: 'rgb(71, 119, 181)', borderWidth: '1px'}}>
              <h3 className="text-lg font-bold mb-4" style={{color: 'rgb(71, 119, 181)'}}>Doctor Performance</h3>
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
                      color: 'rgba(71, 119, 181, 0.1)'
                    }
                  },
                  x: {
                    grid: {
                      color: 'rgba(71, 119, 181, 0.1)'
                    }
                  }
                }
              }} />
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Satisfaction</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {analytics?.patientSatisfaction || 0}/5
                  </div>
                  <p className="text-gray-600">Average Rating</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Average Wait Time</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {analytics?.averageWaitTime || 0} min
                  </div>
                  <p className="text-gray-600">Current Average</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Completion Rate</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{color: 'rgb(71, 119, 181)'}}>
                    {analytics?.overview ? 
                      Math.round((analytics.overview.completedAppointments / analytics.overview.totalAppointments) * 100) : 0}%
                  </div>
                  <p className="text-gray-600">Appointments Completed</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Tab */}
        {activeTab === 'realtime' && realtimeMetrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Appointments</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {realtimeMetrics.activeAppointments}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Waiting Patients</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {realtimeMetrics.waitingPatients}
                    </p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {realtimeMetrics.inProgressAppointments}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow" style={{borderLeftColor: 'rgb(71, 119, 181)', borderLeftWidth: '4px'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Today</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {realtimeMetrics.completedToday}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg" style={{backgroundColor: 'rgba(71, 119, 181, 0.1)'}}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: 'rgb(71, 119, 181)'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg transition-colors" style={{"--hover-border-color": 'rgb(71, 119, 181)'}}>
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900">Daily Report</p>
                    <p className="text-xs text-gray-500">Generate daily summary</p>
                  </div>
                </button>

                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900">Financial Report</p>
                    <p className="text-xs text-gray-500">Revenue and billing</p>
                  </div>
                </button>

                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900">Patient Report</p>
                    <p className="text-xs text-gray-500">Patient statistics</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HospitalDashboard;
