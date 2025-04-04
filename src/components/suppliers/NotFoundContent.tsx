
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const NotFoundContent = () => {
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
};

export default NotFoundContent;
