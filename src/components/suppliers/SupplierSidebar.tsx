
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface SupplierSidebarProps {
  supplier: {
    id: string;
    name: string;
    logo?: string;
    status: string;
  };
}

const SupplierSidebar = ({ supplier }: SupplierSidebarProps) => {
  return (
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
  );
};

export default SupplierSidebar;
