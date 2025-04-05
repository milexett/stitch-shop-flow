
import { useState } from 'react';
import { Supplier } from '@/types/supplier';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Globe, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface BasicInformationProps {
  supplier: Supplier;
  formData: {
    name: string;
    website: string;
    description: string;
    status: string;
  };
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (checked: boolean) => void;
  handleSave: () => void;
}

const BasicInformation = ({ 
  supplier,
  formData,
  isEditing,
  setIsEditing,
  handleInputChange,
  handleStatusChange,
  handleSave 
}: BasicInformationProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Basic Information</h2>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                  <Globe size={16} />
                </span>
                <Input 
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="rounded-l-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="flex items-center gap-4">
              <Switch
                id="supplier-status"
                checked={formData.status === 'active'}
                onCheckedChange={handleStatusChange}
              />
              <label htmlFor="supplier-status" className="text-sm">
                {formData.status === 'active' ? 'Active' : 'Inactive'}
              </label>
            </div>
            <div className="pt-4 flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save size={16} className="mr-1" />
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium text-muted-foreground">Name:</span>
              <span className="col-span-2">{supplier.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium text-muted-foreground">Website:</span>
              <a 
                href={supplier.website}
                target="_blank"
                rel="noopener noreferrer" 
                className="col-span-2 text-primary hover:underline flex items-center"
              >
                {supplier.website}
                <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium text-muted-foreground">Description:</span>
              <p className="col-span-2">{supplier.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm font-medium text-muted-foreground">Product Count:</span>
              <span className="col-span-2">{supplier.productCount}</span>
            </div>
            {supplier.lastSync && (
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-medium text-muted-foreground">Last Synced:</span>
                <span className="col-span-2">{new Date(supplier.lastSync).toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BasicInformation;
