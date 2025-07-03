import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Eye, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';

interface FeedbackItem {
  id: string;
  farmerName: string;
  date: string;
  category: string;
  message: string;
  status: 'Pending' | 'Reviewed' | 'Resolved';
}

const mockFeedbackData: FeedbackItem[] = [
  {
    id: '1',
    farmerName: 'John Doe',
    date: '2024-07-15',
    category: 'Animal Health',
    message: 'Cow showing signs of illness. Need assistance.',
    status: 'Pending',
  },
  {
    id: '2',
    farmerName: 'Alice Smith',
    date: '2024-07-14',
    category: 'Equipment Issue',
    message: 'Milking machine malfunctioning. Requesting repair.',
    status: 'Reviewed',
  },
  {
    id: '3',
    farmerName: 'Bob Johnson',
    date: '2024-07-13',
    category: 'Feed Quality',
    message: 'Concerns about the quality of the latest feed delivery.',
    status: 'Resolved',
  },
  {
    id: '4',
    farmerName: 'Emily White',
    date: '2024-07-12',
    category: 'Infrastructure',
    message: 'Fence damaged due to recent storm. Urgent repair needed.',
    status: 'Pending',
  },
  {
    id: '5',
    farmerName: 'David Brown',
    date: '2024-07-11',
    category: 'Water Supply',
    message: 'Water pump not working. Animals need water.',
    status: 'Resolved',
  },
];

const FeedbackManagement = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>(mockFeedbackData);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredFeedback = statusFilter === 'all'
    ? feedback
    : feedback.filter(item => item.status === statusFilter);

  const pendingCount = feedback.filter(item => item.status === 'Pending').length;
  const reviewedCount = feedback.filter(item => item.status === 'Reviewed').length;
  const resolvedCount = feedback.filter(item => item.status === 'Resolved').length;

  const handleStatusChange = (id: string, newStatus: FeedbackItem['status']) => {
    setFeedback(feedback.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    ));
    toast({
      title: "Status Updated",
      description: `Feedback status updated to ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Feedback Management</h2>
          <p className="text-gray-600">Manage farmer feedback and grievances</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Reviewed">Reviewed</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-yellow-50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span>Pending</span>
            </CardTitle>
            <CardDescription>Awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span>Reviewed</span>
            </CardTitle>
            <CardDescription>Under consideration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{reviewedCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Resolved</span>
            </CardTitle>
            <CardDescription>Issues addressed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{resolvedCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Feedback List</h3>
        <div className="grid grid-cols-1 gap-4">
          {filteredFeedback.map(item => (
            <Card key={item.id} className="border hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{item.farmerName}</CardTitle>
                    <CardDescription>{item.category}</CardDescription>
                  </div>
                  <Badge variant="secondary">{item.date}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>{item.message}</p>
                <div className="flex justify-between items-center">
                  <Badge
                    variant={
                      item.status === 'Pending'
                        ? 'outline'
                        : item.status === 'Reviewed'
                          ? 'secondary'
                          : 'default'
                    }
                  >
                    {item.status}
                  </Badge>
                  <div className="flex space-x-2">
                    {item.status === 'Pending' && (
                      <Button
                        variant="ghost"
                        onClick={() => handleStatusChange(item.id, 'Reviewed')}
                      >
                        Mark as Reviewed
                      </Button>
                    )}
                    {item.status !== 'Resolved' && (
                      <Button
                        variant="ghost"
                        onClick={() => handleStatusChange(item.id, 'Resolved')}
                      >
                        Mark as Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredFeedback.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No feedback found with the selected status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagement;
