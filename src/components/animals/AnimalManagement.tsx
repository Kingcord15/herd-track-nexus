import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users, Map, Grid } from 'lucide-react';
import AnimalMap from './AnimalMap';

interface Animal {
  id: string;
  tagId: string;
  breed: string;
  age: number;
  weight: number;
  healthStatus: 'Healthy' | 'Sick' | 'Under Treatment';
  branchId: string;
  branchName: string;
}

interface AnimalManagementProps {
  selectedBranch: string | null;
}

const AnimalManagement = ({ selectedBranch }: AnimalManagementProps) => {
  const [animals, setAnimals] = useState<Animal[]>([
    { id: '1', tagId: 'COW-001', breed: 'Holstein', age: 3, weight: 450, healthStatus: 'Healthy', branchId: '1', branchName: 'Green Valley Farm' },
    { id: '2', tagId: 'COW-002', breed: 'Jersey', age: 2, weight: 380, healthStatus: 'Healthy', branchId: '1', branchName: 'Green Valley Farm' },
    { id: '3', tagId: 'COW-003', breed: 'Angus', age: 4, weight: 520, healthStatus: 'Under Treatment', branchId: '2', branchName: 'Sunset Ranch' },
    { id: '4', tagId: 'COW-004', breed: 'Brahman', age: 5, weight: 600, healthStatus: 'Healthy', branchId: '2', branchName: 'Sunset Ranch' },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [formData, setFormData] = useState({
    tagId: '',
    breed: '',
    age: '',
    weight: '',
    healthStatus: 'Healthy' as Animal['healthStatus'],
    branchId: selectedBranch || '1'
  });

  const { toast } = useToast();

  const branches = [
    { id: '1', name: 'Green Valley Farm' },
    { id: '2', name: 'Sunset Ranch' },
    { id: '3', name: 'Oak Hill Farm' },
  ];

  const filteredAnimals = selectedBranch 
    ? animals.filter(animal => animal.branchId === selectedBranch)
    : animals;

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const branchName = branches.find(b => b.id === formData.branchId)?.name || '';
    
    if (editingAnimal) {
      // Update existing animal
      setAnimals(animals.map(animal => 
        animal.id === editingAnimal.id 
          ? { 
              ...animal, 
              ...formData, 
              age: parseInt(formData.age),
              weight: parseInt(formData.weight),
              branchName 
            }
          : animal
      ));
      toast({
        title: "Animal Updated",
        description: "Animal record has been updated successfully.",
      });
    } else {
      // Add new animal
      const newAnimal: Animal = {
        id: Date.now().toString(),
        tagId: formData.tagId,
        breed: formData.breed,
        age: parseInt(formData.age),
        weight: parseInt(formData.weight),
        healthStatus: formData.healthStatus,
        branchId: formData.branchId,
        branchName
      };
      setAnimals([...animals, newAnimal]);
      toast({
        title: "Animal Added",
        description: "New animal has been added successfully.",
      });
    }
    
    setFormData({ tagId: '', breed: '', age: '', weight: '', healthStatus: 'Healthy', branchId: selectedBranch || '1' });
    setEditingAnimal(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (animal: Animal) => {
    setEditingAnimal(animal);
    setFormData({
      tagId: animal.tagId,
      breed: animal.breed,
      age: animal.age.toString(),
      weight: animal.weight.toString(),
      healthStatus: animal.healthStatus,
      branchId: animal.branchId
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (animalId: string) => {
    setAnimals(animals.filter(animal => animal.id !== animalId));
    toast({
      title: "Animal Deleted",
      description: "Animal has been removed from the system.",
    });
  };

  const getHealthStatusColor = (status: Animal['healthStatus']) => {
    switch (status) {
      case 'Healthy': return 'bg-green-500';
      case 'Sick': return 'bg-red-500';
      case 'Under Treatment': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Animal Management</h2>
          <p className="text-gray-600">
            {selectedBranch ? `Animals in selected farm` : 'All animals across your farms'}
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
              className="rounded-l-none"
            >
              <Map className="w-4 h-4 mr-2" />
              Map
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Animal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingAnimal ? 'Edit Animal' : 'Add New Animal'}</DialogTitle>
                <DialogDescription>
                  {editingAnimal ? 'Update animal details' : 'Enter details for the new animal'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tagId">Tag ID</Label>
                  <Input
                    id="tagId"
                    value={formData.tagId}
                    onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
                    placeholder="e.g., COW-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    placeholder="e.g., Holstein"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age (years)</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="3"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="450"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="healthStatus">Health Status</Label>
                  <Select value={formData.healthStatus} onValueChange={(value: Animal['healthStatus']) => setFormData({ ...formData, healthStatus: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Healthy">Healthy</SelectItem>
                      <SelectItem value="Sick">Sick</SelectItem>
                      <SelectItem value="Under Treatment">Under Treatment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branchId">Farm</Label>
                  <Select value={formData.branchId} onValueChange={(value) => setFormData({ ...formData, branchId: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  {editingAnimal ? 'Update Animal' : 'Add Animal'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === 'map' ? (
        <AnimalMap animals={filteredAnimals} selectedBranch={selectedBranch} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.map((animal) => (
            <Card key={animal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{animal.tagId}</CardTitle>
                      <CardDescription>{animal.breed}</CardDescription>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getHealthStatusColor(animal.healthStatus)}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{animal.age} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{animal.weight} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Health:</span>
                    <Badge variant={animal.healthStatus === 'Healthy' ? 'default' : 'secondary'}>
                      {animal.healthStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Farm:</span>
                    <span className="font-medium text-xs">{animal.branchName}</span>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(animal)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(animal.id)}
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
      )}
    </div>
  );
};

export default AnimalManagement;
