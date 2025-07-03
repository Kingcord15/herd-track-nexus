
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Layout } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  location: string;
  size: string;
  animalCount: number;
  status: 'Active' | 'Inactive';
}

interface BranchManagementProps {
  onSelectBranch: (branchId: string) => void;
}

const BranchManagement = ({ onSelectBranch }: BranchManagementProps) => {
  const [branches, setBranches] = useState<Branch[]>([
    { id: '1', name: 'Green Valley Farm', location: 'North District', size: '50 acres', animalCount: 67, status: 'Active' },
    { id: '2', name: 'Sunset Ranch', location: 'East District', size: '30 acres', animalCount: 45, status: 'Active' },
    { id: '3', name: 'Oak Hill Farm', location: 'South District', size: '25 acres', animalCount: 15, status: 'Inactive' },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBranch) {
      // Update existing branch
      setBranches(branches.map(branch => 
        branch.id === editingBranch.id 
          ? { ...branch, ...formData }
          : branch
      ));
      toast({
        title: "Farm Updated",
        description: "Farm details have been updated successfully.",
      });
    } else {
      // Add new branch
      const newBranch: Branch = {
        id: Date.now().toString(),
        ...formData,
        animalCount: 0,
        status: 'Active'
      };
      setBranches([...branches, newBranch]);
      toast({
        title: "Farm Added",
        description: "New farm has been added successfully.",
      });
    }
    
    setFormData({ name: '', location: '', size: '' });
    setEditingBranch(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      location: branch.location,
      size: branch.size,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (branchId: string) => {
    setBranches(branches.filter(branch => branch.id !== branchId));
    toast({
      title: "Farm Deleted",
      description: "Farm has been removed from your account.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Farms</h2>
          <p className="text-gray-600">Manage your farm branches and locations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Farm
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBranch ? 'Edit Farm' : 'Add New Farm'}</DialogTitle>
              <DialogDescription>
                {editingBranch ? 'Update your farm details' : 'Enter details for your new farm branch'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Farm Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter farm name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter farm location"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Farm Size</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g., 50 acres"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                {editingBranch ? 'Update Farm' : 'Add Farm'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <Card key={branch.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Layout className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{branch.name}</CardTitle>
                    <CardDescription>{branch.location}</CardDescription>
                  </div>
                </div>
                <Badge variant={branch.status === 'Active' ? 'default' : 'secondary'}>
                  {branch.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{branch.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Animals:</span>
                  <span className="font-medium">{branch.animalCount}</span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectBranch(branch.id)}
                    className="flex-1"
                  >
                    View Animals
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(branch)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(branch.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BranchManagement;
