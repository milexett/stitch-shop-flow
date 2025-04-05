
import { PriceRange } from "@/components/suppliers/MarkupMatrix";

/**
 * Calculate the marked up price based on the supplier price and markup ranges
 */
export const calculateMarkupPrice = (
  supplierPrice: number,
  markupRanges: PriceRange[]
): number => {
  if (!markupRanges || markupRanges.length === 0) {
    return supplierPrice; // Return original price if no markup ranges defined
  }

  // Sort ranges by min value to ensure proper evaluation
  const sortedRanges = [...markupRanges].sort((a, b) => a.min - b.min);
  
  // Find the applicable markup range for this price
  const applicableRange = sortedRanges.find(
    range => 
      supplierPrice >= range.min && 
      (range.max === null || supplierPrice <= range.max)
  );

  if (!applicableRange) {
    return supplierPrice; // Return original price if no matching range
  }

  // Calculate price with markup percentage
  const markupMultiplier = 1 + (applicableRange.markup / 100);
  const markedUpPrice = supplierPrice * markupMultiplier;
  
  // Round to 2 decimal places
  return Math.round(markedUpPrice * 100) / 100;
};

/**
 * Format price as currency string
 */
export const formatCurrency = (price: number): string => {
  return `$${price.toFixed(2)}`;
};
