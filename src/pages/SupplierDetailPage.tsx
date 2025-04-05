
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { suppliers } from '@/data/supplierData';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import BasicInformation from '@/components/suppliers/BasicInformation';
import ApiIntegration from '@/components/suppliers/ApiIntegration';
import SupplierSidebar from '@/components/suppliers/SupplierSidebar';
import NotFoundContent from '@/components/suppliers/NotFoundContent';
import { toast } from '@/hooks/use-toast';

const SupplierDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState(suppliers.find((s) => s.id === id));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    website: supplier?.website || '',
    description: supplier?.description || '',
    apiKey: supplier?.apiKey || '',
    accountNumber: supplier?.accountNumber || '',
    apiUrl: supplier?.apiUrl || '',
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
          accountNumber: foundSupplier.accountNumber || '',
          apiUrl: foundSupplier.apiUrl || '',
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
    // Find the index of the supplier in the suppliers array
    const supplierIndex = suppliers.findIndex(s => s.id === id);
    
    if (supplierIndex !== -1) {
      // Update the supplier in the suppliers array
      suppliers[supplierIndex] = {
        ...suppliers[supplierIndex],
        name: formData.name,
        website: formData.website,
        description: formData.description,
        apiKey: formData.apiKey,
        accountNumber: formData.accountNumber,
        apiUrl: formData.apiUrl,
        status: formData.status
      };

      // Update the local state
      setSupplier(suppliers[supplierIndex]);
      
      // Show success toast
      toast({
        title: "Changes saved",
        description: "Supplier details have been updated successfully."
      });

      // Exit editing mode
      setIsEditing(false);
    }
  };

  if (!supplier) {
    return <NotFoundContent />;
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
                <BasicInformation
                  supplier={supplier}
                  formData={formData}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  handleInputChange={handleInputChange}
                  handleStatusChange={handleStatusChange}
                  handleSave={handleSave}
                />
                
                <ApiIntegration
                  supplierId={supplier.id}
                  supplierName={supplier.name}
                  supplierStatus={supplier.status}
                  apiKey={formData.apiKey}
                  accountNumber={formData.accountNumber}
                  apiUrl={formData.apiUrl}
                  handleInputChange={handleInputChange}
                />
              </div>
              
              <div>
                <SupplierSidebar supplier={supplier} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupplierDetailPage;
