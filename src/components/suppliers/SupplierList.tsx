
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Supplier } from '@/types/supplier';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

type SupplierListProps = {
  suppliers: Supplier[];
};

const SupplierList = ({ suppliers }: SupplierListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSync = (supplierId: string, supplierName: string) => {
    toast({
      title: "Sync started",
      description: `Syncing products from ${supplierName}...`,
    });
    // In a real app, this would trigger an API call to sync products
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search suppliers..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button className="flex items-center gap-1">
          <Plus size={16} />
          <span>Add Supplier</span>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{supplier.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                      <span>Visit website</span>
                      <ExternalLink className="ml-1" size={14} />
                    </a>
                  </CardDescription>
                </div>
                <Badge variant={supplier.status === 'active' ? 'success' : 'default'}>
                  {supplier.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="h-24 flex items-center justify-center overflow-hidden bg-accent/10 rounded-md">
                {supplier.logo ? (
                  <img 
                    src={supplier.logo} 
                    alt={`${supplier.name} logo`} 
                    className="max-h-20 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-lg font-semibold text-muted-foreground">{supplier.name.charAt(0)}</span>
                )}
              </div>
              <p className="text-sm mt-4 line-clamp-2">
                {supplier.description}
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Products:</span>
                  <span className="font-medium">{supplier.productCount}</span>
                </div>
                {supplier.lastSync && (
                  <div className="flex justify-between mt-1">
                    <span>Last synced:</span>
                    <span className="font-medium">
                      {new Date(supplier.lastSync).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-2">
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  disabled={supplier.status !== 'active'}
                  onClick={() => handleSync(supplier.id, supplier.name)}
                >
                  <RefreshCw size={16} className="mr-1" />
                  Sync Products
                </Button>
                <Button 
                  variant="default"
                  className="flex-1"
                  asChild
                >
                  <Link to={`/suppliers/${supplier.id}`}>View Details</Link>
                </Button>
              </div>
              {supplier.status === 'active' && (
                <Button
                  variant="secondary"
                  className="w-full"
                  asChild
                >
                  <Link to={`/suppliers/${supplier.id}/products`}>Browse Products</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No suppliers found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default SupplierList;
