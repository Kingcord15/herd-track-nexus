
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Layout, Bell, Plus } from 'lucide-react';
import FeedbackManagement from '../feedback/FeedbackManagement';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Total Farmers', value: '156', icon: Users, color: 'bg-blue-500' },
    { title: 'Total Farms', value: '89', icon: Layout, color: 'bg-green-500' },
    { title: 'Total Animals', value: '2,347', icon: Users, color: 'bg-purple-500' },
    { title: 'Pending Feedback', value: '12', icon: Bell, color: 'bg-orange-500' },
  ];

  const recentFarmers = [
    { name: 'John Smith', farm: 'Green Valley Farm', animals: 45, status: 'Active' },
    { name: 'Mary Johnson', farm: 'Sunset Ranch', animals: 67, status: 'Active' },
    { name: 'Robert Wilson', farm: 'Oak Hill Farm', animals: 23, status: 'Inactive' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">HERD TRACK SYSTEM</h1>
              <Badge variant="secondary">Admin Panel</Badge>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'farmers', label: 'Farmers' },
              { id: 'feedback', label: 'Feedback' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Farmers */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Farmers</CardTitle>
                <CardDescription>Latest registered farmers and their farm status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentFarmers.map((farmer, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{farmer.name}</h3>
                        <p className="text-sm text-gray-600">{farmer.farm}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{farmer.animals} animals</span>
                        <Badge variant={farmer.status === 'Active' ? 'default' : 'secondary'}>
                          {farmer.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'feedback' && <FeedbackManagement />}
        
        {activeTab === 'farmers' && (
          <Card>
            <CardHeader>
              <CardTitle>Farmer Management</CardTitle>
              <CardDescription>Manage all registered farmers and their farms</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Farmer management interface coming soon...</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
