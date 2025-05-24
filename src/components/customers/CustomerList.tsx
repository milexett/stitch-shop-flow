
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomerType, customers } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CustomerForm from './CustomerForm';

type CustomerListProps = {
  customers: CustomerType[];
};

const CustomerList = ({ customers: initialCustomers }: CustomerListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = (customerData: Omit<CustomerType, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: CustomerType = {
      ...customerData,
      id: (Date.now() + Math.random()).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add the new customer to the beginning of the customers array so it appears first
    customers.unshift(newCustomer);
    
    console.log('New customer created:', newCustomer);
    console.log('Total customers now:', customers.length);
    
    toast({
      title: "Customer added successfully",
      description: `${newCustomer.name} has been added and will appear in the customer list.`
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="flex items-center gap-1" onClick={() => setIsFormOpen(true)}>
          <Plus size={16} />
          <span>Add Customer</span>
        </Button>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link 
                      to={`/customers/${customer.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {customer.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {customer.company || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <Mail size={14} className="text-muted-foreground" />
                        <a href={`mailto:${customer.email}`} className="hover:underline">
                          {customer.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Phone size={14} className="text-muted-foreground" />
                        <a href={`tel:${customer.phone}`} className="hover:underline">
                          {customer.phone}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {customer.city && customer.state ? `${customer.city}, ${customer.state}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CustomerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddCustomer}
      />
    </div>
  );
};

export default CustomerList;
