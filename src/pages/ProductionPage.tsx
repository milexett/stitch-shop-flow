
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ProductionCalendar from '@/components/production/ProductionCalendar';
import { productionTasks } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Filter } from 'lucide-react';

const ProductionPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h1 className="text-2xl font-bold">Production</h1>
              
              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="prepress">Prepress</SelectItem>
                    <SelectItem value="printing">Printing</SelectItem>
                    <SelectItem value="embroidery">Embroidery</SelectItem>
                    <SelectItem value="finishing">Finishing</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button>
                  <Plus size={16} className="mr-1" />
                  Add Task
                </Button>
              </div>
            </div>
            
            <ProductionCalendar tasks={productionTasks} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductionPage;
