
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Globe,
  RefreshCw,
  Key,
  Save,
  ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { suppliers } from '@/data/supplierData';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const SupplierDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState(suppliers.find((s) => s.id === id));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    website: supplier?.website || '',
    description: supplier?.description || '',
    apiKey: supplier?.apiKey || '',
    status: supplier?.status || 'inactive'
  });

  useEffect(() => {
    if (id) {
      const foundSupplier = suppliers.find((s) => s.id === id);
      setSupplier(foundSupplier);
      if (foundSupplier) {
        setFormData({
          name: foundSupplier.name,
          website: foundSupplier.website,
          description: foundSupplier.description,
          apiKey: foundSupplier.apiKey || '',
          status: foundSupplier.status
        });
      }
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      status: checked ? 'active' : 'inactive' 
    }));
  };

  const handleSave = () => {
    // In a real app, this would update the supplier via API
    toast({
      title: "Changes saved",
      description: "Supplier details have been updated successfully."
    });
    setIsEditing(false);
  };

  const handleSync = () => {
    // In a real app, this would trigger an API call
    toast({
      title: "Sync started",
      description: `Syncing products from ${supplier?.name}...`,
    });
  };

  if (!supplier) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Supplier not found</h1>
              <Link to="/suppliers" className="text-primary hover:underline flex items-center gap-1">
                <ArrowLeft size={16} />
                Back to suppliers
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6 gap-4">
              <Link to="/suppliers" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-2xl font-bold">Supplier Details</h1>
              <Badge variant={supplier.status === 'active' ? 'secondary' : 'default'} className={supplier.status === 'active' ? "bg-success-500 hover:bg-success-600" : ""}>
                {supplier.status}
              </Badge>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
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
                
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-medium">API Integration</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">API Key</label>
                        <div className="flex">
                          <Input 
                            type="password"
                            name="apiKey"
                            value={formData.apiKey}
                            onChange={handleInputChange}
                            placeholder="Enter API key for automatic syncing"
                            className="flex-1"
                          />
                          <Button variant="outline" className="ml-2">
                            <Key size={16} className="mr-1" />
                            Save Key
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          API key is required to automatically sync products from this supplier.
                        </p>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          variant="default" 
                          className="w-full"
                          disabled={supplier.status !== 'active'}
                          onClick={handleSync}
                        >
                          <RefreshCw size={16} className="mr-1" />
                          Sync Products Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <h2 className="text-xl font-medium">Logo</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 flex items-center justify-center overflow-hidden bg-accent/10 rounded-md">
                      {supplier.logo ? (
                        <img 
                          src={supplier.logo} 
                          alt={`${supplier.name} logo`} 
                          className="max-h-32 max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-muted-foreground">{supplier.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        Change Logo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {supplier.status === 'active' && (
                  <Card>
                    <CardHeader>
                      <h2 className="text-xl font-medium">Quick Actions</h2>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button 
                          variant="secondary" 
                          className="w-full"
                          asChild
                        >
                          <Link to={`/suppliers/${supplier.id}/products`}>Browse Products</Link>
                        </Button>
                        <Button variant="outline" className="w-full">Export Product List</Button>
                        <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
                          Delete Supplier
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupplierDetailPage;
