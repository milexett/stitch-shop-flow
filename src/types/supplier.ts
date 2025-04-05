
export interface Supplier {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  apiKey?: string;
  accountNumber?: string;
  status: 'active' | 'inactive';
  lastSync?: string;
  productCount: number;
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  images: string[];
  colors: string[];
  sizes: string[];
  inventory: {
    size: string;
    color: string;
    quantity: number;
  }[];
  lastUpdated: string;
}
