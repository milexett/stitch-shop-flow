import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { suppliers, supplierProducts } from '@/data/supplierData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/utils/priceUtils';
import { SupplierProduct } from '@/types/supplier';

const ProductsPage = () => {
  // Combine all products from all suppliers
  const allProducts: (SupplierProduct & { supplierName: string })[] = [];
  
  Object.entries(supplierProducts).forEach(([supplierId, products]) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      products.forEach(product => {
        allProducts.push({
          ...product,
          supplierName: supplier.name
        });
      });
    }
  });

  const [products] = useState(allProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [displayedProducts, setDisplayedProducts] = useState(products);
  
  // Get unique categories and suppliers
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const supplierNames = ['all', ...Array.from(new Set(products.map(p => p.supplierName)))];
  
  // Filter products based on search, category, and supplier
  useEffect(() => {
    const filtered = products.filter(product => {
      // Apply search filter
      const searchMatch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
        
      // Apply category filter
      const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter;
      
      // Apply supplier filter
      const supplierMatch = supplierFilter === 'all' || product.supplierName === supplierFilter;
      
      return searchMatch && categoryMatch && supplierMatch;
    });
    
    setDisplayedProducts(filtered);
  }, [products, searchTerm, categoryFilter, supplierFilter]);
  
  const handleAddToOrder = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      toast({
        title: "Product added",
        description: `${product.name} has been added to your order at ${formatCurrency(product.price)}.`,
      });
    }
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">All Products</h1>
                <p className="text-sm text-muted-foreground">
                  Browse products from all suppliers ({displayedProducts.length} of {products.length} products)
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  Table
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select 
                  value={categoryFilter} 
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={supplierFilter} 
                  onValueChange={setSupplierFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {supplierNames.map(supplier => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier === 'all' ? 'All Suppliers' : supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {displayedProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square relative overflow-hidden bg-accent/10">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {product.colors.length > 0 && (
                        <div className="absolute bottom-2 right-2 flex gap-1">
                          {product.colors.slice(0, 3).map((color, i) => (
                            <TooltipProvider key={i}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div 
                                    className="h-4 w-4 rounded-full border shadow-sm"
                                    style={{ 
                                      backgroundColor: color.toLowerCase(), 
                                      borderColor: ['white', '#ffffff', '#fff'].includes(color.toLowerCase()) ? '#e5e5e5' : undefined
                                    }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{color}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                          {product.colors.length > 3 && (
                            <Badge variant="outline" className="h-4 px-1 text-[10px]">
                              +{product.colors.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-medium line-clamp-1">{product.name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-muted-foreground">{product.sku}</span>
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>
                      <p className="text-sm line-clamp-2 mt-2 h-10 text-muted-foreground">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold">{formatCurrency(product.price)}</span>
                        <div className="text-xs text-muted-foreground">
                          {product.sizes.length} sizes
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <Link 
                          to={`/suppliers/${product.supplierId}/products`}
                          className="text-primary hover:underline"
                        >
                          {product.supplierName}
                        </Link>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        className="w-full"
                        onClick={() => handleAddToOrder(product.id)}
                      >
                        <ShoppingCart size={16} className="mr-1" />
                        Add to Order
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Colors</TableHead>
                      <TableHead>Sizes</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="h-10 w-10 bg-accent/10 rounded overflow-hidden">
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <Link 
                            to={`/suppliers/${product.supplierId}/products`}
                            className="text-primary hover:underline text-sm"
                          >
                            {product.supplierName}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {product.colors.slice(0, 2).map((color, i) => (
                              <TooltipProvider key={i}>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div 
                                      className="h-3 w-3 rounded-full border"
                                      style={{ 
                                        backgroundColor: color.toLowerCase(), 
                                        borderColor: ['white', '#ffffff', '#fff'].includes(color.toLowerCase()) ? '#e5e5e5' : undefined
                                      }}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{color}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                            {product.colors.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{product.colors.length - 2} more
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {product.sizes.slice(0, 3).map((size, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {size}
                              </Badge>
                            ))}
                            {product.sizes.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{product.sizes.length - 3}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(product.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddToOrder(product.id)}
                          >
                            <ShoppingCart size={14} className="mr-1" />
                            Add to Order
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
            
            {displayedProducts.length === 0 && (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No products found matching your search.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;