
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { CalendarIcon, Plus, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { orders, OrderType } from '@/data/mockData';

type ProductItem = {
  id: string;
  product: string;
  quantity: number;
  unitCost: number;
  decoration: string;
  decorationCost: number;
};

const OrderEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productItems, setProductItems] = useState<ProductItem[]>([
    { 
      id: Date.now().toString(), 
      product: '', 
      quantity: 1, 
      unitCost: 0, 
      decoration: '',
      decorationCost: 0 
    }
  ]);
  
  const form = useForm({
    defaultValues: {
      customerName: '',
      serviceType: '',
      dueDate: new Date(),
      notes: ''
    }
  });

  // Find the order in our mock data
  useEffect(() => {
    const foundOrder = orders.find(o => o.id === id);
    setOrder(foundOrder || null);
    
    if (foundOrder) {
      form.reset({
        customerName: foundOrder.customerName,
        serviceType: foundOrder.serviceType,
        dueDate: new Date(foundOrder.dueDate),
        notes: foundOrder.notes || ''
      });
      
      // Convert order items to product items if they exist
      if (foundOrder.items && foundOrder.items.length > 0) {
        setProductItems(
          foundOrder.items.map(item => ({
            id: item.id,
            product: item.name.toLowerCase().replace(/\s+/g, ''),
            quantity: item.quantity,
            unitCost: item.unitPrice,
            decoration: 'none', // Default, as we don't have this in mock data
            decorationCost: 0    // Default, as we don't have this in mock data
          }))
        );
      }
    }
  }, [id]);

  const handleAddProduct = () => {
    setProductItems([
      ...productItems,
      { 
        id: Date.now().toString(), 
        product: '', 
        quantity: 1, 
        unitCost: 0, 
        decoration: '',
        decorationCost: 0 
      }
    ]);
  };

  const handleRemoveProduct = (id: string) => {
    if (productItems.length > 1) {
      setProductItems(productItems.filter(item => item.id !== id));
    }
  };

  const handleProductChange = (id: string, field: keyof ProductItem, value: string | number) => {
    setProductItems(
      productItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotal = () => {
    return productItems.reduce((total, item) => {
      const productTotal = item.quantity * item.unitCost;
      const decorationTotal = item.quantity * item.decorationCost;
      return total + productTotal + decorationTotal;
    }, 0);
  };

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    
    try {
      // In a real app, you would update the data in your backend
      const orderData = {
        ...values,
        products: productItems,
        totalAmount: calculateTotal()
      };
      
      console.log('Updated order data:', orderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Order updated",
        description: "Your order has been updated successfully."
      });
      
      navigate(`/orders/${id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your order.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!order) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <p>Order not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Order: {order.orderNumber}</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/orders/${id}`)}
          >
            Cancel
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter customer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="printing">Printing</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="packaging">Packaging</SelectItem>
                            <SelectItem value="distribution">Distribution</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Products & Decoration</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddProduct}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Product
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {productItems.map((item, index) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Product {index + 1}</h3>
                        {productItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProduct(item.id)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormLabel>Product</FormLabel>
                          <Select
                            value={item.product}
                            onValueChange={(value) => 
                              handleProductChange(item.id, 'product', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tshirt">T-Shirt</SelectItem>
                              <SelectItem value="mug">Mug</SelectItem>
                              <SelectItem value="hat">Hat</SelectItem>
                              <SelectItem value="poster">Poster</SelectItem>
                              <SelectItem value="sticker">Sticker</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <FormLabel>Quantity</FormLabel>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => 
                              handleProductChange(
                                item.id, 
                                'quantity', 
                                parseInt(e.target.value) || 1
                              )
                            }
                          />
                        </div>
                        
                        <div>
                          <FormLabel>Unit Cost ($)</FormLabel>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitCost}
                            onChange={(e) => 
                              handleProductChange(
                                item.id, 
                                'unitCost', 
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        
                        <div>
                          <FormLabel>Decoration Type</FormLabel>
                          <Select
                            value={item.decoration}
                            onValueChange={(value) => 
                              handleProductChange(item.id, 'decoration', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select decoration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="screen_printing">Screen Printing</SelectItem>
                              <SelectItem value="embroidery">Embroidery</SelectItem>
                              <SelectItem value="digital_print">Digital Print</SelectItem>
                              <SelectItem value="heat_transfer">Heat Transfer</SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <FormLabel>Decoration Cost ($)</FormLabel>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.decorationCost}
                            onChange={(e) => 
                              handleProductChange(
                                item.id, 
                                'decorationCost', 
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                      </div>
                      
                      <div className="border-t mt-2 pt-2">
                        <div className="text-right font-medium">
                          Subtotal: ${((item.quantity * item.unitCost) + (item.quantity * item.decorationCost)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between border-t pt-4">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional notes here"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default OrderEditPage;
