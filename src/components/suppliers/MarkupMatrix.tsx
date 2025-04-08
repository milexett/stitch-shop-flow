
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface PriceRange {
  id: string;
  min: number;
  max: number | null;
  markup: number;
}

interface MarkupMatrixProps {
  supplierId: string;
  initialRanges?: PriceRange[];
  onSave?: (ranges: PriceRange[]) => void;
  onRangeUpdate?: (ranges: PriceRange[]) => void;
}

const MarkupMatrix: React.FC<MarkupMatrixProps> = ({ 
  supplierId, 
  initialRanges = [],
  onSave,
  onRangeUpdate
}) => {
  const [ranges, setRanges] = useState<PriceRange[]>(initialRanges.length > 0 ? initialRanges : [
    { id: '1', min: 0, max: 25, markup: 40 },
    { id: '2', min: 25.01, max: 50, markup: 35 },
    { id: '3', min: 50.01, max: 100, markup: 30 },
    { id: '4', min: 100.01, max: null, markup: 25 }
  ]);

  // Effect to update prices whenever ranges change
  useEffect(() => {
    if (onRangeUpdate) {
      onRangeUpdate(ranges);
    }
  }, [ranges, onRangeUpdate]);

  const addRange = () => {
    const newId = String(Date.now());
    const lastRange = ranges[ranges.length - 1];
    const newMin = lastRange && lastRange.max !== null ? lastRange.max + 0.01 : 0;
    
    const newRanges = [...ranges, { id: newId, min: newMin, max: null, markup: 25 }];
    setRanges(newRanges);
  };

  const removeRange = (id: string) => {
    if (ranges.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "You need at least one price range.",
        variant: "destructive"
      });
      return;
    }
    
    setRanges(ranges.filter(range => range.id !== id));
  };

  const updateRange = (id: string, field: keyof PriceRange, value: any) => {
    const updatedRanges = ranges.map(range => {
      if (range.id === id) {
        // For 'max', allow null for "and above" ranges
        if (field === 'max' && (value === '' || value === null)) {
          return { ...range, [field]: null };
        }
        
        // For numeric fields, ensure they're numbers
        if (['min', 'max', 'markup'].includes(field)) {
          const numValue = field === 'markup' 
            ? Math.min(Math.max(0, Number(value)), 100) // Limit markup to 0-100%
            : Number(value);
          
          return { ...range, [field]: numValue };
        }
        
        return { ...range, [field]: value };
      }
      return range;
    });
    
    setRanges(updatedRanges);
  };

  const handleSave = () => {
    // Sort ranges by min value to ensure they're in order
    const sortedRanges = [...ranges].sort((a, b) => a.min - b.min);
    
    // Verify ranges don't overlap and are continuous
    let valid = true;
    let errorMessage = '';
    
    for (let i = 0; i < sortedRanges.length - 1; i++) {
      const current = sortedRanges[i];
      const next = sortedRanges[i + 1];
      
      if (current.max === null) {
        valid = false;
        errorMessage = `Range starting at $${current.min} cannot be "and above" if it's not the last range`;
        break;
      }
      
      if (current.max !== next.min - 0.01 && current.max !== next.min) {
        valid = false;
        errorMessage = `Gap or overlap between $${current.max} and $${next.min}`;
        break;
      }
    }
    
    if (!valid) {
      toast({
        title: "Invalid price ranges",
        description: errorMessage,
        variant: "destructive"
      });
      return;
    }
    
    // If onSave provided, call it with the sorted ranges
    if (onSave) {
      onSave(sortedRanges);
    }
    
    toast({
      title: "Markup matrix saved",
      description: "Your price range markups have been updated."
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-medium">Price Markup Matrix</h2>
        <Button onClick={addRange} size="sm" variant="outline">
          <Plus size={16} className="mr-1" />
          Add Range
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-2 font-medium text-sm">
            <div className="col-span-4">Min Price ($)</div>
            <div className="col-span-4">Max Price ($)</div>
            <div className="col-span-3">Markup (%)</div>
            <div className="col-span-1"></div>
          </div>
          
          {ranges.map((range, index) => (
            <div key={range.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={range.min}
                  onChange={(e) => updateRange(range.id, 'min', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="col-span-4">
                <Input
                  type="number"
                  step="0.01"
                  min={range.min + 0.01}
                  value={range.max === null ? '' : range.max}
                  placeholder="and above"
                  onChange={(e) => updateRange(range.id, 'max', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="col-span-3">
                <div className="flex items-center">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={range.markup}
                    onChange={(e) => updateRange(range.id, 'markup', e.target.value)}
                    className="w-full"
                  />
                  <span className="ml-1">%</span>
                </div>
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRange(range.id)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
          
          <Button onClick={handleSave} className="w-full mt-4">
            <Save size={16} className="mr-1" />
            Save Markup Matrix
          </Button>
          
          <div className="text-xs text-muted-foreground mt-2">
            <p>Set your markup percentages based on product price ranges. The final range can be left open-ended to cover all prices above that threshold.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarkupMatrix;
