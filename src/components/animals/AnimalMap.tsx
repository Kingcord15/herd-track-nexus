
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Settings } from 'lucide-react';

interface Animal {
  id: string;
  tagId: string;
  breed: string;
  age: number;
  weight: number;
  healthStatus: 'Healthy' | 'Sick' | 'Under Treatment';
  branchId: string;
  branchName: string;
  latitude?: number;
  longitude?: number;
}

interface AnimalMapProps {
  animals: Animal[];
  selectedBranch: string | null;
}

const AnimalMap = ({ animals, selectedBranch }: AnimalMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const { toast } = useToast();

  // Sample animal data with coordinates (you can modify this)
  const animalsWithCoordinates = animals.map(animal => ({
    ...animal,
    latitude: animal.latitude || -1.2921 + (Math.random() - 0.5) * 0.01, // Nairobi area with random offset
    longitude: animal.longitude || 36.8219 + (Math.random() - 0.5) * 0.01,
  }));

  const filteredAnimals = selectedBranch 
    ? animalsWithCoordinates.filter(animal => animal.branchId === selectedBranch)
    : animalsWithCoordinates;

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [36.8219, -1.2921], // Nairobi, Kenya
      zoom: 14,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for animals
    const newMarkers: mapboxgl.Marker[] = [];
    
    filteredAnimals.forEach(animal => {
      const markerColor = getHealthStatusColor(animal.healthStatus);
      
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: ${markerColor};
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
      `;

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([animal.longitude!, animal.latitude!])
        .addTo(map.current!);

      // Add popup with animal information
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${animal.tagId}</h3>
            <p class="text-xs text-gray-600">${animal.breed}</p>
            <p class="text-xs">Age: ${animal.age} years</p>
            <p class="text-xs">Weight: ${animal.weight} kg</p>
            <p class="text-xs">Status: <span class="font-medium">${animal.healthStatus}</span></p>
            <p class="text-xs text-gray-500">${animal.branchName}</p>
          </div>
        `);

      markerElement.addEventListener('click', () => {
        popup.addTo(map.current!);
        marker.setPopup(popup);
        marker.togglePopup();
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
    setShowTokenInput(false);
    
    toast({
      title: "Map Loaded",
      description: `Showing ${filteredAnimals.length} animals on the map.`,
    });
  };

  const getHealthStatusColor = (status: Animal['healthStatus']) => {
    switch (status) {
      case 'Healthy': return '#10B981'; // Green
      case 'Sick': return '#EF4444'; // Red
      case 'Under Treatment': return '#F59E0B'; // Yellow
      default: return '#6B7280'; // Gray
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapboxToken.trim()) {
      toast({
        title: "Token Required",
        description: "Please enter your Mapbox public token.",
        variant: "destructive",
      });
      return;
    }
    initializeMap();
  };

  useEffect(() => {
    return () => {
      // Cleanup markers
      markers.forEach(marker => marker.remove());
      // Cleanup map
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (map.current && mapboxToken) {
      // Clear existing markers
      markers.forEach(marker => marker.remove());
      
      // Add new markers for filtered animals
      const newMarkers: mapboxgl.Marker[] = [];
      
      filteredAnimals.forEach(animal => {
        const markerColor = getHealthStatusColor(animal.healthStatus);
        
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.cssText = `
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: ${markerColor};
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        `;

        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([animal.longitude!, animal.latitude!])
          .addTo(map.current!);

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-sm">${animal.tagId}</h3>
              <p class="text-xs text-gray-600">${animal.breed}</p>
              <p class="text-xs">Age: ${animal.age} years</p>
              <p class="text-xs">Weight: ${animal.weight} kg</p>
              <p class="text-xs">Status: <span class="font-medium">${animal.healthStatus}</span></p>
              <p class="text-xs text-gray-500">${animal.branchName}</p>
            </div>
          `);

        markerElement.addEventListener('click', () => {
          popup.addTo(map.current!);
          marker.setPopup(popup);
          marker.togglePopup();
        });

        newMarkers.push(marker);
      });

      setMarkers(newMarkers);
    }
  }, [filteredAnimals, mapboxToken]);

  if (showTokenInput) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Mapbox Setup Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
              <Input
                id="mapbox-token"
                type="text"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSI..."
                required
              />
              <p className="text-xs text-gray-600">
                Get your token from{' '}
                <a 
                  href="https://mapbox.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://mapbox.com/
                </a>
              </p>
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Initialize Map
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Animal Location Map</h3>
          <p className="text-sm text-gray-600">
            {selectedBranch ? `Animals in selected farm` : 'All animals across your farms'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Healthy</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Under Treatment</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Sick</span>
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div 
            ref={mapContainer} 
            className="w-full h-96 rounded-lg"
            style={{ minHeight: '400px' }}
          />
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-gray-600">
        <MapPin className="w-4 h-4 inline mr-1" />
        Click on markers to view animal details
      </div>
    </div>
  );
};

export default AnimalMap;
