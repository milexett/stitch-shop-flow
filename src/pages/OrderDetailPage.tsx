
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import { orders, OrderType } from '@/data/mockData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Find the order in our mock data
    const foundOrder = orders.find(o => o.id === id);
    setOrder(foundOrder || null);
    setLoading(false);
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <p>Loading...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
                    <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or was deleted.</p>
                    <Button variant="default" onClick={() => window.history.back()}>
                      Go Back
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  // Calculate totals
  const totalPaid = order.paidAmount || 0;
  const balanceDue = order.totalAmount - totalPaid;
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
              <div className="flex gap-2">
                <Button variant="outline">Edit Order</Button>
                <Button>Generate Invoice</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatusBadge status={order.status} className="text-sm" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Customer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{order.customerName}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Due Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{new Date(order.dueDate).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {order.items.length > 0 && (
                      <div className="mt-6 space-y-2 text-right">
                        <div className="flex justify-end">
                          <span className="text-muted-foreground w-32">Subtotal:</span>
                          <span className="font-medium w-24">${order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-end">
                          <span className="text-muted-foreground w-32">Paid:</span>
                          <span className="font-medium w-24">${totalPaid.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-end border-t pt-2 mt-2">
                          <span className="text-muted-foreground font-medium w-32">Balance Due:</span>
                          <span className="font-bold w-24">${balanceDue.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {order.notes && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{order.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Service Type</h4>
                        <p className="capitalize">{order.serviceType.replace('_', ' ')}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Created Date</h4>
                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      
                      {order.updatedAt && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h4>
                          <p>{new Date(order.updatedAt).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderDetailPage;
