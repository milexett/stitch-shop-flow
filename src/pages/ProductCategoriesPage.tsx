import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { suppliers, supplierProducts } from '@/data/supplierData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, Package } from 'lucide-react';
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
import { formatCurrency } from '@/utils/priceUtils';
import { SupplierProduct } from '@/types/supplier';

interface CategoryData {
  name: string;
  products: (SupplierProduct & { supplierName: string })[];
  productCount: number;
  priceRange: { min: number; max: number };
}

const ProductCategoriesPage = () => {
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

  // Group products by category
  const categoriesData: CategoryData[] = [];
  const categoryMap = new Map<string, (SupplierProduct & { supplierName: string })[]>();

  allProducts.forEach(product => {
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, []);
    }
    categoryMap.get(product.category)!.push(product);
  });

  categoryMap.forEach((products, categoryName) => {
    const prices = products.map(p => p.price);
    categoriesData.push({
      name: categoryName,
      products,
      productCount: products.length,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    });
  });

  const [categories] = useState(categoriesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedCategories, setDisplayedCategories] = useState(categories);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  // Filter categories based on search
  useEffect(() => {
    const filtered = categories.filter(category => {
      const searchMatch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.products.some(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return searchMatch;
    });
    
    setDisplayedCategories(filtered);
  }, [categories, searchTerm]);
  
  const handleAddToOrder = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      toast({
        title: "Product added",
        description: `${product.name} has been added to your order at ${formatCurrency(product.price)}.`,
      });
    }
  };

  const toggleCategoryExpanded = (categoryName: string) => {
    setExpandedCategory(prev => prev === categoryName ? null : categoryName);
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
                <h1 className="text-2xl font-bold">Product Categories</h1>
                <p className="text-sm text-muted-foreground">
                  Browse products organized by category ({displayedCategories.length} categories)
                </p>
              </div>
              
              <div className="flex gap-2">
                <Link to="/products">
                  <Button variant="outline" size="sm">
                    <Package size={16} className="mr-2" />
                    View All Products
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedCategory(expandedCategory ? null : displayedCategories[0]?.name || null)}
                >
                  {expandedCategory ? 'Collapse All' : 'Expand First'}
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search categories or products..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {displayedCategories.map((category) => (
                <Card key={category.name} className="overflow-hidden">
                  <CardHeader 
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => toggleCategoryExpanded(category.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold">{category.name}</h2>
                        <Badge variant="secondary">{category.productCount} products</Badge>
                        <Badge variant="outline" className="text-xs">
                          {formatCurrency(category.priceRange.min)} - {formatCurrency(category.priceRange.max)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          {category.products.length > 0 && `${new Set(category.products.map(p => p.supplierName)).size} suppliers`}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategoryExpanded(category.name);
                          }}
                        >
                          {expandedCategory === category.name ? 'Hide Products' : 'Show Products'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {expandedCategory === category.name && (
                    <CardContent className="pt-0">
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {category.products.map((product) => (
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
                                <Badge variant="outline">{product.category}</Badge>
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
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
            
            {displayedCategories.length === 0 && (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">No categories found matching your search.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductCategoriesPage;