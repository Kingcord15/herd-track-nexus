
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bell, Plus } from 'lucide-react';

interface Feedback {
  id: string;
  subject: string;
  category: 'Suggestion' | 'Complaint' | 'Question' | 'Bug Report';
  message: string;
  status: 'Pending' | 'Reviewed' | 'Resolved';
  submittedAt: string;
}

const FeedbackForm = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: '1',
      subject: 'Animal health tracking improvements',
      category: 'Suggestion',
      message: 'Would like to see more detailed health tracking features.',
      status: 'Reviewed',
      submittedAt: '2023-12-01'
    },
    {
      id: '2',
      subject: 'Mobile app needed',
      category: 'Suggestion',
      message: 'Please consider developing a mobile app for easier farm management.',
      status: 'Pending',
      submittedAt: '2023-12-03'
    },
  ]);

  const [formData, setFormData] = useState({
    subject: '',
    category: 'Suggestion' as Feedback['category'],
    message: '',
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFeedback: Feedback = {
      id: Date.now().toString(),
      ...formData,
      status: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0],
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setFormData({ subject: '', category: 'Suggestion', message: '' });
    
    toast({
      title: "Feedback Submitted",
      description: "Your feedback has been submitted successfully. We'll review it soon.",
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Feedback & Grievance</h2>
        <p className="text-gray-600">Submit your suggestions, complaints, or questions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Submit New Feedback</span>
            </CardTitle>
            <CardDescription>
              Let us know how we can improve your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief description of your feedback"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value: Feedback['category']) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Suggestion">Suggestion</SelectItem>
                    <SelectItem value="Complaint">Complaint</SelectItem>
                    <SelectItem value="Question">Question</SelectItem>
                    <SelectItem value="Bug Report">Bug Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your feedback in detail..."
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Previous Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Your Previous Feedback</span>
            </CardTitle>
            <CardDescription>
              Track the status of your submitted feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{feedback.subject}</h3>
                    <Badge className={getStatusColor(feedback.status)}>
                      {feedback.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{feedback.message}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{feedback.category}</span>
                    <span>{feedback.submittedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackForm;
