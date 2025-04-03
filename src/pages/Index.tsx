
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import StatCard from '@/components/dashboard/StatCard';
import RecentOrders from '@/components/dashboard/RecentOrders';
import { orders, dashboardStats, inventory } from '@/data/mockData';
import { 
  ClipboardList, 
  CreditCard, 
  Package2, 
  Clock,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const Index = () => {
  const navigate = useNavigate();
  
  // Display only the 5 most recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Get low stock items
  const lowStockItems = inventory
    .filter(item => item.stock <= item.reorderPoint)
    .slice(0, 3);
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard 
                title="Orders This Month" 
                value={dashboardStats.ordersThisMonth} 
                icon={<ClipboardList size={24} />}
                trend={{ direction: 'up', value: '+15% from last month' }}
              />
              <StatCard 
                title="Revenue This Month" 
                value={`$${dashboardStats.revenueThisMonth.toFixed(2)}`} 
                icon={<CreditCard size={24} />}
                trend={{ direction: 'up', value: '+8% from last month' }}
              />
              <StatCard 
                title="Pending Orders" 
                value={dashboardStats.pendingOrders} 
                icon={<Clock size={24} />}
              />
              <StatCard 
                title="Low Stock Items" 
                value={dashboardStats.lowStockItems} 
                icon={<Package2 size={24} />}
                className={dashboardStats.lowStockItems > 0 ? "border-warning-300" : ""}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="col-span-1 lg:col-span-2">
                <RecentOrders orders={recentOrders} />
              </div>
              
              <div className="col-span-1 rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Low Stock Alerts</h3>
                  
                  {lowStockItems.length > 0 ? (
                    <div className="space-y-4">
                      {lowStockItems.map((item) => (
                        <div key={item.id} className="p-3 border rounded-md">
                          <div className="flex justify-between">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-sm text-muted-foreground">{item.sku}</span>
                          </div>
                          <div className="flex items-center mt-2">
                            <span className="text-sm w-10">{item.stock}/{item.reorderPoint}</span>
                            <Progress 
                              value={(item.stock / item.reorderPoint) * 100} 
                              className="h-2 flex-1 mx-2"
                            />
                            <span className="text-xs text-muted-foreground">
                              {Math.round((item.stock / item.reorderPoint) * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => navigate('/inventory')}
                      >
                        View All Inventory
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package2 size={32} className="mx-auto mb-2 opacity-50" />
                      <p>All items have sufficient stock</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Monthly Revenue</h3>
                    <span className="text-sm text-muted-foreground">Last 6 months</span>
                  </div>
                  
                  <div className="h-64 flex items-center justify-center border-b pb-4">
                    {/* Revenue chart would go here - using placeholder for now */}
                    <div className="text-center text-muted-foreground">
                      <TrendingUp size={36} className="mx-auto mb-2" />
                      <p>Revenue trends would appear here</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Order</p>
                      <p className="font-medium">$487</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Orders</p>
                      <p className="font-medium">52</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Customers</p>
                      <p className="font-medium">24</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Production Status</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Design</span>
                        <span className="text-muted-foreground">8/10 tasks completed</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Printing</span>
                        <span className="text-muted-foreground">4/12 tasks completed</span>
                      </div>
                      <Progress value={33} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Embroidery</span>
                        <span className="text-muted-foreground">2/5 tasks completed</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Quality Check</span>
                        <span className="text-muted-foreground">7/7 tasks completed</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => navigate('/production')}
                    >
                      View Production Schedule
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
