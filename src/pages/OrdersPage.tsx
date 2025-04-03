
import { TooltipProvider } from '@/components/ui/tooltip';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import OrderList from '@/components/orders/OrderList';
import { orders } from '@/data/mockData';

const OrdersPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Orders</h1>
            
            <OrderList orders={orders} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersPage;
