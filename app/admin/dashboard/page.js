'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Reservation Management Component
const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState({});

  // Load reservations
  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin-token');
      const response = await fetch('/api/reservations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setReservations(result.data.reservations || []);
      }
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReservationAction = async (reservationId, action, adminNotes = '') => {
    try {
      setActionLoading(prev => ({ ...prev, [reservationId]: true }));
      
      const token = localStorage.getItem('admin-token');
      const adminKey = prompt('Please enter the admin key to proceed:');
      
      if (!adminKey) {
        return;
      }

      const response = await fetch(`/api/reservations`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reservationId,
          status: action,
          adminKey: adminKey.trim(),
          adminNotes
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(result.message);
        loadReservations(); // Reload reservations
      } else {
        alert(result.message || 'Failed to update reservation');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Error updating reservation');
    } finally {
      setActionLoading(prev => ({ ...prev, [reservationId]: false }));
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    return reservation.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="ml-2 text-gray-600">Loading reservations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Manage Reservations</h2>
          <div className="flex space-x-4">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Reservations</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={loadReservations}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No reservations found for the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <div key={reservation._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{reservation.name}</h3>
                      <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(reservation.status)}`}>
                        {reservation.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">📅 Date:</span><br />
                        {new Date(reservation.date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">⏰ Time:</span><br />
                        {reservation.time}
                      </div>
                      <div>
                        <span className="font-medium">👥 Guests:</span><br />
                        {reservation.guests}
                      </div>
                      <div>
                        <span className="font-medium">📱 Phone:</span><br />
                        {reservation.phone}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">📧 Email:</span> {reservation.email}
                    </div>

                    {reservation.specialRequests && (
                      <div className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">📝 Special Requests:</span><br />
                        <span className="text-gray-800">{reservation.specialRequests}</span>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      <span>ID: {reservation._id}</span> | 
                      <span> Created: {new Date(reservation.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {reservation.status === 'pending' && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleReservationAction(reservation._id, 'confirmed')}
                        disabled={actionLoading[reservation._id]}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        {actionLoading[reservation._id] ? 'Processing...' : '✅ Approve'}
                      </button>
                      <button
                        onClick={() => {
                          const notes = prompt('Optional reason for rejection:');
                          handleReservationAction(reservation._id, 'cancelled', notes);
                        }}
                        disabled={actionLoading[reservation._id]}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        {actionLoading[reservation._id] ? 'Processing...' : '❌ Reject'}
                      </button>
                    </div>
                  )}

                  {reservation.status === 'confirmed' && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => {
                          const notes = prompt('Optional reason for cancellation:');
                          handleReservationAction(reservation._id, 'cancelled', notes);
                        }}
                        disabled={actionLoading[reservation._id]}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  // Check authentication and load data
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const token = localStorage.getItem('admin-token');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        // Verify authentication
        const authResponse = await fetch('/api/admin/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!authResponse.ok) {
          localStorage.removeItem('admin-token');
          router.push('/admin/login');
          return;
        }

        const authResult = await authResponse.json();
        setAdminData(authResult.data.admin);
        setIsAuthenticated(true);

        // Load dashboard data
        const dashResponse = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (dashResponse.ok) {
          const dashResult = await dashResponse.json();
          setDashboardData(dashResult.data);
        }

      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      localStorage.removeItem('admin-token');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout anyway
      localStorage.removeItem('admin-token');
      router.push('/admin/login');
    }
  };

  // Handle CSV export
  const handleExport = async (type) => {
    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch(`/api/admin/export/csv?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Export failed. Please try again.');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-8 w-8 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Restaurant Admin</h1>
              <span className="text-sm text-gray-500">
                Welcome, {adminData?.firstName} {adminData?.lastName}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{adminData?.role}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'reservations', label: 'Reservations' },
              { id: 'contacts', label: 'Contact Messages' },
              { id: 'export', label: 'Export Data' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'overview' && dashboardData && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Reservations</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardData.reservations.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Messages</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardData.contacts.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardData.summary.pendingReservations}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5l-5-5h5v-12h5v12z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">New Messages</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardData.summary.newContacts}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Reservations */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Reservations</h3>
                </div>
                <div className="p-6">
                  {dashboardData.reservations.recent.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.reservations.recent.map((reservation) => (
                        <div key={reservation._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{reservation.name}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {reservation.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent reservations</p>
                  )}
                </div>
              </div>

              {/* Recent Messages */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
                </div>
                <div className="p-6">
                  {dashboardData.contacts.recent.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.contacts.recent.map((contact) => (
                        <div key={contact._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-600">{contact.subject}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            contact.status === 'responded' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {contact.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent messages</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Export Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Export Reservations</h3>
                  <p className="text-gray-600 mb-4">Download all reservation data as CSV file</p>
                  <button
                    onClick={() => handleExport('reservations')}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Download Reservations CSV
                  </button>
                </div>
                <div className="p-6 border rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Export Contact Messages</h3>
                  <p className="text-gray-600 mb-4">Download all contact messages as CSV file</p>
                  <button
                    onClick={() => handleExport('contacts')}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Download Contacts CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reservation Management */}
        {activeTab === 'reservations' && (
          <ReservationManagement />
        )}

        {/* Contact Management */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Contact Messages</h2>
            <p className="text-gray-600">
              This section will show detailed management for contact messages. 
              For now, you can use the existing API endpoints directly or implement detailed tables here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
