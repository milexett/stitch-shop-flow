
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
  accountNumber?: string;
}

const ApiIntegration = ({ 
  supplierId,
  supplierName,
  supplierStatus,
  apiKey,
  handleInputChange,
  accountNumber = ''
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                API key is required to sync products from this supplier.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Account Number</label>
              <div className="flex">
                <Input 
                  type="text"
                  name="accountNumber"
                  value={accountNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your account number"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Account number is needed for the connection.
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
            >
              <Key size={16} className="mr-1" />
              Save Credentials
            </Button>
            
            <Button 
              variant="default" 
              className="flex-1"
              disabled={supplierStatus !== 'active'}
              onClick={handleSync}
            >
              <RefreshCw size={16} className="mr-1" />
              Sync Products
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiIntegration;
