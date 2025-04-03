
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { InventoryItemType } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, AlertCircle } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type InventoryListProps = {
  inventory: InventoryItemType[];
};

const InventoryList = ({ inventory }: InventoryListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const filteredInventory = inventory.filter(item => {
    // Apply search filter
    const searchMatch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Apply category filter
    const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter;
    
    return searchMatch && categoryMatch;
  });
  
  const getStockStatus = (item: InventoryItemType) => {
    return item.stock <= item.reorderPoint ? 'low' : 'ok';
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search inventory..."
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
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="garment">Garments</SelectItem>
              <SelectItem value="ink">Ink</SelectItem>
              <SelectItem value="thread">Thread</SelectItem>
              <SelectItem value="supply">Supplies</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="flex items-center gap-1">
          <Plus size={16} />
          <span>Add Item</span>
        </Button>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Reorder Point</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Unit Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">
                    <Link to={`/inventory/${item.id}`} className="text-primary hover:underline">
                      {item.sku}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm">{item.name}</td>
                  <td className="px-6 py-4 text-sm capitalize">{item.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.stock}</span>
                      <StatusBadge status={getStockStatus(item)} />
                      {item.stock <= item.reorderPoint && (
                        <AlertCircle size={14} className="text-warning-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{item.reorderPoint}</td>
                  <td className="px-6 py-4 text-sm">${item.unitCost.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">{item.location || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
