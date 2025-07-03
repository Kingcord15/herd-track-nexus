
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Bell, Users, Edit } from 'lucide-react';

interface Feedback {
  id: string;
  subject: string;
  category: 'Suggestion' | 'Complaint' | 'Question' | 'Bug Report';
  message: string;
  status: 'Pending' | 'Reviewed' | 'Resolved';
  submittedAt: string;
  farmerName: string;
  farmName: string;
}

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: '1',
      subject: 'Animal health tracking improvements',
      category: 'Suggestion',
      message: 'Would like to see more detailed health tracking features for better monitoring of animal wellness.',
      status: 'Reviewed',
      submittedAt: '2023-12-01',
      farmerName: 'John Smith',
      farmName: 'Green Valley Farm'
    },
    {
      id: '2',
      subject: 'Mobile app needed',
      category: 'Suggestion',
      message: 'Please consider developing a mobile app for easier farm management on the go.',
      status: 'Pending',
      submittedAt: '2023-12-03',
      farmerName: 'Mary Johnson',
      farmName: 'Sunset Ranch'
    },
    {
      id: '3',
      subject: 'System loading slowly',
      category: 'Bug Report',
      message: 'The animal management page takes too long to load when there are many animals.',
      status: 'Pending',
      submittedAt: '2023-12-05',
      farmerName: 'Robert Wilson',
      farmName: 'Oak Hill Farm'
    },
    {
      id: '4',
      subject: 'Export feature request',
      category: 'Question',
      message: 'How can I export my animal data to CSV format for external analysis?',
      status: 'Resolved',
      submittedAt: '2023-11-28',
      farmerName: 'Sarah Davis',
      farmName: 'Meadow Brook Farm'
    },
  ]);

  const { toast } = useToast();

  const updateFeedbackStatus = (feedbackId: string, newStatus: Feedback['status']) => {
    setFeedbacks(feedbacks.map(feedback => 
      feedback.id === feedbackId 
        ? { ...feedback, status: newStatus }
        : feedback
    ));
    
    toast({
      title: "Status Updated",
      description: `Feedback status has been updated to ${newStatus}`,
    });
  };

  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Reviewed': return 'bg-blue-500';
      case 'Resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: Feedback['category']) => {
    switch (category) {
      case 'Suggestion': return 'bg-blue-100 text-blue-800';
      case 'Complaint': return 'bg-red-100 text-red-800';
      case 'Question': return 'bg-green-100 text-green-800';
      case 'Bug Report': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = feedbacks.filter(f => f.status === 'Pending').length;
  const reviewedCount = feedbacks.filter(f => f.status === 'Reviewed').length;
  const resolvedCount = feedbacks.filter(f => f.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Feedback Management</h2>
        <p className="text-gray-600">Manage and respond to farmer feedback and grievances</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reviewed</p>
                <p className="text-2xl font-bold text-blue-600">{reviewedCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>All Feedback</CardTitle>
          <CardDescription>Review and manage feedback from farmers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900">{feedback.subject}</h3>
                      <Badge className={getCategoryColor(feedback.category)}>
                        {feedback.category}
                      </Badge>
                      <Badge className={getStatusColor(feedback.status)}>
                        {feedback.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{feedback.message}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>From: {feedback.farmerName} ({feedback.farmName})</span>
                      <span>Submitted: {feedback.submittedAt}</span>
                    </div>
                  </div>
                  <div className="ml-4 min-w-32">
                    <Select
                      value={feedback.status}
                      onValueChange={(value: Feedback['status']) => updateFeedbackStatus(feedback.id, value)}
                    >
                      <SelectTrigger size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Reviewed">Reviewed</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackManagement;
