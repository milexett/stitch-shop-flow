
import { Key, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface ApiIntegrationProps {
  supplierId: string;
  supplierName: string;
  supplierStatus: string;
  apiKey: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ApiIntegration = ({ 
  supplierId,
  supplierName,
  supplierStatus,
  apiKey,
  handleInputChange 
}: ApiIntegrationProps) => {
  
  const handleSync = () => {
    // In a real app, this would trigger an API call
    toast({
      title: "Sync started",
      description: `Syncing products from ${supplierName}...`,
    });
  };

  return (
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
                value={apiKey}
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
              disabled={supplierStatus !== 'active'}
              onClick={handleSync}
            >
              <RefreshCw size={16} className="mr-1" />
              Sync Products Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiIntegration;
