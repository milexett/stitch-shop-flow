import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { CalendarIcon, Plus, Trash, InfoIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { suppliers, supplierProducts } from '@/data/supplierData';
import { calculateMarkupPrice, formatCurrency } from '@/utils/priceUtils';
import { orders, OrderType } from '@/data/mockData';

type ProductItem = {
  id: string;
  product: string;
  supplierId: string;
  productId: string;
  quantity: number;
  price: number;
  decoration: string;
  decorationCost: number;
  image: string;
};

const OrderCreatePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [productItems, setProductItems] = useState<ProductItem[]>([
    { 
      id: Date.now().toString(), 
      product: '', 
      supplierId: '',
      productId: '',
      quantity: 1, 
      price: 0,
      decoration: '',
      decorationCost: 0,
      image: ''
    }
  ]);
  
  // Define default markup ranges
  const defaultMarkupRanges = [
    { id: '1', min: 0, max: 25, markup: 40 },
    { id: '2', min: 25.01, max: 50, markup: 35 },
    { id: '3', min: 50.01, max: 100, markup: 30 },
    { id: '4', min: 100.01, max: null, markup: 25 }
  ];
  
  // State for available suppliers
  const [availableSuppliers, setAvailableSuppliers] = useState(
    suppliers.filter(s => s.status === 'active')
  );
  
  // State to hold supplier-specific products for each product item
  const [supplierProductOptions, setSupplierProductOptions] = useState<Record<string, any[]>>({});
  
  const form = useForm({
    defaultValues: {
      customerName: '',
      serviceType: '',
      dueDate: new Date(),
      notes: ''
    }
  });

  // Update supplier product options when a supplier is selected for any product item
  useEffect(() => {
    const newSupplierProductOptions = { ...supplierProductOptions };
    
    productItems.forEach(item => {
      if (item.supplierId && !newSupplierProductOptions[item.id]) {
        newSupplierProductOptions[item.id] = supplierProducts[item.supplierId] || [];
      }
    });
    
    setSupplierProductOptions(newSupplierProductOptions);
  }, [productItems]);

  const handleAddProduct = () => {
    setProductItems([
      ...productItems,
      { 
        id: Date.now().toString(), 
        product: '', 
        supplierId: '',
        productId: '',
        quantity: 1, 
        price: 0,
        decoration: '',
        decorationCost: 0,
        image: ''
      }
    ]);
  };

  const handleRemoveProduct = (id: string) => {
    if (productItems.length > 1) {
      setProductItems(productItems.filter(item => item.id !== id));
      
      // Also remove supplier product options for this item
      const updatedOptions = { ...supplierProductOptions };
      delete updatedOptions[id];
      setSupplierProductOptions(updatedOptions);
    }
  };

  const handleProductChange = (id: string, field: keyof ProductItem, value: string | number) => {
    setProductItems(
      productItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // If changing supplier, update the product options and reset product selection
          if (field === 'supplierId') {
            const newSupplierProductOptions = { ...supplierProductOptions };
            newSupplierProductOptions[id] = supplierProducts[value as string] || [];
            setSupplierProductOptions(newSupplierProductOptions);
            
            // Reset product selection when supplier changes
            updatedItem.product = '';
            updatedItem.productId = '';
            updatedItem.price = 0;
            updatedItem.image = '';
          }
          
          // If selecting a product, update the price and image
          if (field === 'productId') {
            const selectedProduct = supplierProductOptions[id]?.find(
              p => p.id === value
            );
            if (selectedProduct) {
              updatedItem.product = selectedProduct.name;
              // Use the price property (supplier cost) with markup calculation
              const supplierCost = selectedProduct.price || selectedProduct.cost || 0;
              updatedItem.price = calculateMarkupPrice(supplierCost, defaultMarkupRanges);
              // Get first image for the product
              updatedItem.image = selectedProduct.images && selectedProduct.images.length > 0 
                ? selectedProduct.images[0] 
                : '';
            }
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    return productItems.reduce((total, item) => {
      const productTotal = item.quantity * item.price;
      const decorationTotal = item.quantity * item.decorationCost;
      return total + productTotal + decorationTotal;
    }, 0);
  };

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    
    try {
      // Create the new order data
      const newOrder: OrderType = {
        id: (Date.now() + Math.random()).toString(),
        orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
        customerId: Date.now().toString(),
        customerName: values.customerName,
        serviceType: values.serviceType,
        status: 'pending' as const,
        totalAmount: calculateTotal(),
        depositAmount: 0,
        paidAmount: 0,
        dueDate: values.dueDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: values.notes,
        items: productItems.map(item => ({
          id: item.id,
          name: item.product,
          description: item.decoration || 'No decoration',
          quantity: item.quantity,
          unitPrice: item.price + item.decorationCost,
          colors: 1,
          sizes: { 'standard': item.quantity }
        }))
      };
      
      // Add the new order to the beginning of the orders array so it appears first
      orders.unshift(newOrder);
      
      console.log('New order created:', newOrder);
      console.log('Total orders now:', orders.length);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Order created successfully",
        description: `Order ${newOrder.orderNumber} has been created and will appear on the orders page.`
      });
      
      // Navigate to orders page after successful creation
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "There was a problem creating your order.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Order</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/orders')}
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
                          <FormLabel>Supplier</FormLabel>
                          <Select
                            value={item.supplierId}
                            onValueChange={(value) => 
                              handleProductChange(item.id, 'supplierId', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select supplier" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableSuppliers.map(supplier => (
                                <SelectItem key={supplier.id} value={supplier.id}>
                                  {supplier.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <FormLabel>Product</FormLabel>
                          <Select
                            value={item.productId}
                            onValueChange={(value) => 
                              handleProductChange(item.id, 'productId', value)
                            }
                            disabled={!item.supplierId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={!item.supplierId ? "Select supplier first" : "Select product"} />
                            </SelectTrigger>
                            <SelectContent>
                              {supplierProductOptions[item.id]?.map(product => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} - ${product.price.toFixed(2)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {item.image && (
                          <div className="md:col-span-2">
                            <div className="rounded-md overflow-hidden w-32 h-32 border">
                              <img 
                                src={item.image} 
                                alt={item.product}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        
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
                          <FormLabel className="flex items-center">
                            Price ($)
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoIcon className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Product price with markup included</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            readOnly
                            className="bg-muted"
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
                          Subtotal: {formatCurrency((item.quantity * item.price) + (item.quantity * item.decorationCost))}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between border-t pt-4">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">{formatCurrency(calculateTotal())}</span>
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
                {isLoading ? "Creating..." : "Create Order"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default OrderCreatePage;
