
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import SupplierList from '@/components/suppliers/SupplierList';
import { suppliers } from '@/data/supplierData';

const SuppliersPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Suppliers</h1>
            
            <SupplierList suppliers={suppliers} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuppliersPage;
