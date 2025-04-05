
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { suppliers } from '@/data/supplierData';
import { supplierProducts } from '@/data/supplierData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MarkupMatrix, { PriceRange } from '@/components/suppliers/MarkupMatrix';
import {
  ArrowLeft,
  Search,
  Filter,
  ShoppingCart,
  Plus,
  Check
} from 'lucide-react';
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Define a type for markup ranges by supplier
interface SupplierMarkups {
  [supplierId: string]: PriceRange[];
}

// Mock saved markups (in a real app this would be stored in a database)
const savedMarkups: SupplierMarkups = {};

const SupplierProductsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState(suppliers.find((s) => s.id === id));
  const [products, setProducts] = useState(supplierProducts[id || ''] || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [markupRanges, setMarkupRanges] = useState<PriceRange[]>(
    savedMarkups[id || ''] || []
  );
  
  // Get unique categories from products
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products.filter(product => {
    // Apply search filter
    const searchMatch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Apply category filter
    const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter;
    
    return searchMatch && categoryMatch;
  });
  
  const handleAddToOrder = (productId: string) => {
    // In a real app, this would add the product to a current order or cart
    const product = products.find(p => p.id === productId);
    toast({
      title: "Product added",
      description: `${product?.name} has been added to your current order.`,
    });
  };
  
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };
  
  const handleAddSelectedToOrder = () => {
    if (selectedProducts.length === 0) return;
    
    // In a real app, this would add all selected products to an order or cart
    toast({
      title: "Products added",
      description: `${selectedProducts.length} products have been added to your current order.`,
    });
    
    setSelectedProducts([]);
  };

  const handleSaveMarkups = (ranges: PriceRange[]) => {
    if (id) {
      // In a real app, this would save to a database
      savedMarkups[id] = ranges;
      setMarkupRanges(ranges);
    }
  };
  
  if (!supplier) {
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
  }
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Link to={`/suppliers/${supplier.id}`} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft size={18} />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">{supplier.name} Products</h1>
                  <p className="text-sm text-muted-foreground">
                    Browse and add products to your orders
                  </p>
                </div>
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

            {/* Add Markup Matrix component */}
            <MarkupMatrix 
              supplierId={supplier.id} 
              initialRanges={markupRanges}
              onSave={handleSaveMarkups}
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
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
              </div>
              
              {selectedProducts.length > 0 && (
                <Button 
                  variant="default"
                  onClick={handleAddSelectedToOrder}
                  className="whitespace-nowrap"
                >
                  <ShoppingCart size={16} className="mr-1" />
                  Add {selectedProducts.length} to Order
                </Button>
              )}
            </div>

            {viewMode === 'grid' ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className={`overflow-hidden ${
                    selectedProducts.includes(product.id) ? 'ring-2 ring-primary' : ''
                  }`}>
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
                      <button 
                        onClick={() => toggleProductSelection(product.id)}
                        className={`absolute top-2 right-2 h-6 w-6 rounded-full flex items-center justify-center ${
                          selectedProducts.includes(product.id) 
                            ? 'bg-primary text-white' 
                            : 'bg-background/80 text-foreground hover:bg-background'
                        }`}
                      >
                        {selectedProducts.includes(product.id) ? (
                          <Check size={14} />
                        ) : (
                          <Plus size={14} />
                        )}
                      </button>
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
                        <span className="font-bold">${product.price.toFixed(2)}</span>
                        <div className="text-xs text-muted-foreground">
                          {product.sizes.length} sizes
                        </div>
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
                      <TableHead className="w-12 text-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts(filteredProducts.map(p => p.id));
                            } else {
                              setSelectedProducts([]);
                            }
                          }}
                          checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        />
                      </TableHead>
                      <TableHead className="w-16">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Colors</TableHead>
                      <TableHead>Sizes</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="text-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                          />
                        </TableCell>
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
                          ${product.price.toFixed(2)}
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
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No products found matching your search.</p>
              </div>
            )}
            
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupplierProductsPage;
