
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Layout, Bell, Plus, Crown } from 'lucide-react';
import BranchManagement from '../branches/BranchManagement';
import AnimalManagement from '../animals/AnimalManagement';
import FeedbackForm from '../feedback/FeedbackForm';
import SubscriptionPage from '../subscription/SubscriptionPage';

interface FarmerDashboardProps {
  onLogout: () => void;
}

const FarmerDashboard = ({ onLogout }: FarmerDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  // Mock subscription status - this would come from your backend/Supabase
  const subscriptionStatus = {
    isSubscribed: false,
    plan: null,
    expiresAt: null
  };

  const stats = [
    { title: 'My Farms', value: '3', icon: Layout, color: 'bg-green-500' },
    { title: 'Total Animals', value: '127', icon: Users, color: 'bg-blue-500' },
    { title: 'Health Alerts', value: '2', icon: Bell, color: 'bg-red-500' },
    { title: 'Recent Activities', value: '8', icon: Plus, color: 'bg-purple-500' },
  ];

  const recentActivities = [
    { action: 'Added new animal', farm: 'Green Valley Farm', time: '2 hours ago' },
    { action: 'Updated health record', farm: 'Sunset Ranch', time: '1 day ago' },
    { action: 'Submitted feedback', farm: 'Oak Hill Farm', time: '3 days ago' },
  ];

  if (activeTab === 'subscription') {
    return <SubscriptionPage onBack={() => setActiveTab('overview')} />;
  }

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
              <Badge variant="secondary">Farmer Panel</Badge>
            </div>
            <div className="flex items-center space-x-4">
              {!subscriptionStatus.isSubscribed && (
                <Button 
                  variant="outline" 
                  className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                  onClick={() => setActiveTab('subscription')}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              )}
              <Button variant="outline" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'farms', label: 'My Farms' },
              { id: 'animals', label: 'Animals' },
              { id: 'feedback', label: 'Feedback' },
              { id: 'subscription', label: 'Subscription' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.id === 'subscription' && !subscriptionStatus.isSubscribed && (
                  <Crown className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Subscription Banner */}
            {!subscriptionStatus.isSubscribed && (
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Crown className="w-8 h-8 text-yellow-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Upgrade to Premium</h3>
                        <p className="text-gray-600">Unlock unlimited farms, advanced analytics, and GPS tracking</p>
                      </div>
                    </div>
                    <Button 
                      className="bg-yellow-600 hover:bg-yellow-700"
                      onClick={() => setActiveTab('subscription')}
                    >
                      View Plans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

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

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest farm management activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{activity.action}</h3>
                        <p className="text-sm text-gray-600">{activity.farm}</p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'farms' && <BranchManagement onSelectBranch={setSelectedBranch} />}
        {activeTab === 'animals' && <AnimalManagement selectedBranch={selectedBranch} />}
        {activeTab === 'feedback' && <FeedbackForm />}
      </main>
    </div>
  );
};

export default FarmerDashboard;
