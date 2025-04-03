
export type CustomerType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderStatus = 'pending' | 'approved' | 'in_production' | 'completed' | 'cancelled';
export type ServiceType = 'screen_printing' | 'embroidery' | 'digital_printing' | 'vinyl' | 'other';

export type OrderType = {
  id: string;
  customerId: string;
  customerName: string;
  orderNumber: string;
  status: OrderStatus;
  serviceType: ServiceType;
  items: OrderItem[];
  dueDate: Date;
  totalAmount: number;
  depositAmount: number;
  paidAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItem = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  colors: number;
  sizes: Record<string, number>;
  designFile?: string;
};

export type InventoryItemType = {
  id: string;
  name: string;
  sku: string;
  category: 'garment' | 'ink' | 'thread' | 'supply' | 'other';
  stock: number;
  reorderPoint: number;
  unitCost: number;
  supplier?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductionTaskType = {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  taskType: 'design' | 'prepress' | 'printing' | 'embroidery' | 'finishing' | 'quality_check';
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  assignedTo?: string;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  actualStart?: Date;
  actualEnd?: Date;
  notes?: string;
};

// Mock Customers
export const customers: CustomerType[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    company: 'Acme Co',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '90210',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '(555) 987-6543',
    company: 'Johnson & Co',
    address: '456 Oak Ave',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    notes: 'Prefers email communication',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-02-20'),
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    phone: '(555) 567-8901',
    company: 'Wilson Events',
    address: '789 Pine St',
    city: 'Portland',
    state: 'OR',
    zip: '97201',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-10'),
  },
  {
    id: '4',
    name: 'Lisa Brown',
    email: 'lisa@example.com',
    phone: '(555) 234-5678',
    company: 'Brown & Associates',
    address: '101 Elm St',
    city: 'Boston',
    state: 'MA',
    zip: '02110',
    createdAt: new Date('2023-03-25'),
    updatedAt: new Date('2023-03-25'),
  },
  {
    id: '5',
    name: 'David Miller',
    email: 'david@example.com',
    phone: '(555) 876-5432',
    company: 'Local High School',
    address: '202 Maple Ave',
    city: 'Denver',
    state: 'CO',
    zip: '80202',
    notes: 'School account - needs PO',
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2023-04-05'),
  },
];

// Mock Orders
export const orders: OrderType[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'John Smith',
    orderNumber: 'ORD-2023-0001',
    status: 'in_production',
    serviceType: 'screen_printing',
    items: [
      {
        id: '1-1',
        name: 'T-Shirts',
        description: 'Black Gildan Heavy Cotton with 3-color front print',
        quantity: 50,
        unitPrice: 12.95,
        colors: 3,
        sizes: { S: 10, M: 15, L: 15, XL: 10 },
        designFile: 'acme-front-logo.ai',
      },
    ],
    dueDate: new Date('2023-04-30'),
    totalAmount: 647.5,
    depositAmount: 325,
    paidAmount: 325,
    notes: 'Rush order',
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2023-04-11'),
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Sarah Johnson',
    orderNumber: 'ORD-2023-0002',
    status: 'approved',
    serviceType: 'embroidery',
    items: [
      {
        id: '2-1',
        name: 'Polo Shirts',
        description: 'Navy Blue polos with left chest embroidery',
        quantity: 25,
        unitPrice: 18.95,
        colors: 2,
        sizes: { M: 8, L: 10, XL: 7 },
        designFile: 'johnson-logo.pdf',
      },
    ],
    dueDate: new Date('2023-05-15'),
    totalAmount: 473.75,
    depositAmount: 200,
    paidAmount: 200,
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-04-16'),
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Mike Wilson',
    orderNumber: 'ORD-2023-0003',
    status: 'pending',
    serviceType: 'digital_printing',
    items: [
      {
        id: '3-1',
        name: 'Event Banners',
        description: '3x6 foot vinyl banner with grommets',
        quantity: 2,
        unitPrice: 89.95,
        colors: 4,
        sizes: { 'standard': 2 },
      },
      {
        id: '3-2',
        name: 'Yard Signs',
        description: '18x24 inch coroplast signs with stakes',
        quantity: 20,
        unitPrice: 15.95,
        colors: 4,
        sizes: { 'standard': 20 },
      }
    ],
    dueDate: new Date('2023-05-20'),
    totalAmount: 499.80,
    depositAmount: 250,
    paidAmount: 0,
    notes: 'Awaiting design approval',
    createdAt: new Date('2023-04-18'),
    updatedAt: new Date('2023-04-18'),
  },
  {
    id: '4',
    customerId: '5',
    customerName: 'David Miller',
    orderNumber: 'ORD-2023-0004',
    status: 'completed',
    serviceType: 'screen_printing',
    items: [
      {
        id: '4-1',
        name: 'Team T-Shirts',
        description: 'Red Gildan G5000 with 2-color print front and back',
        quantity: 30,
        unitPrice: 14.95,
        colors: 2,
        sizes: { S: 5, M: 10, L: 10, XL: 5 },
        designFile: 'tigers-logo.png',
      },
    ],
    dueDate: new Date('2023-04-25'),
    totalAmount: 448.50,
    depositAmount: 225,
    paidAmount: 448.50,
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2023-04-26'),
  },
  {
    id: '5',
    customerId: '4',
    customerName: 'Lisa Brown',
    orderNumber: 'ORD-2023-0005',
    status: 'cancelled',
    serviceType: 'vinyl',
    items: [
      {
        id: '5-1',
        name: 'Custom Tumblers',
        description: '20oz Stainless Steel Tumblers with vinyl logo',
        quantity: 15,
        unitPrice: 22.95,
        colors: 1,
        sizes: { 'standard': 15 },
      },
    ],
    dueDate: new Date('2023-05-10'),
    totalAmount: 344.25,
    depositAmount: 0,
    paidAmount: 0,
    notes: 'Cancelled due to budget constraints',
    createdAt: new Date('2023-04-12'),
    updatedAt: new Date('2023-04-14'),
  },
];

// Mock Inventory
export const inventory: InventoryItemType[] = [
  {
    id: '1',
    name: 'Gildan 5000 Black T-Shirt',
    sku: 'G5000-BLK',
    category: 'garment',
    stock: 150,
    reorderPoint: 50,
    unitCost: 3.25,
    supplier: 'SanMar',
    location: 'A1',
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-04-15'),
  },
  {
    id: '2',
    name: 'Gildan 5000 White T-Shirt',
    sku: 'G5000-WHT',
    category: 'garment',
    stock: 120,
    reorderPoint: 50,
    unitCost: 3.00,
    supplier: 'SanMar',
    location: 'A2',
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-04-15'),
  },
  {
    id: '3',
    name: 'Black Plastisol Ink - Quart',
    sku: 'INK-BLK-QT',
    category: 'ink',
    stock: 8,
    reorderPoint: 3,
    unitCost: 18.50,
    supplier: 'Ryonet',
    location: 'B1',
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-03-20'),
  },
  {
    id: '4',
    name: 'Red Plastisol Ink - Quart',
    sku: 'INK-RED-QT',
    category: 'ink',
    stock: 5,
    reorderPoint: 3,
    unitCost: 19.75,
    supplier: 'Ryonet',
    location: 'B2',
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-03-20'),
  },
  {
    id: '5',
    name: 'Madeira Polyester Thread - Black',
    sku: 'THR-BLK-5K',
    category: 'thread',
    stock: 12,
    reorderPoint: 4,
    unitCost: 8.95,
    supplier: 'AllStitch',
    location: 'C1',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-04-10'),
  },
  {
    id: '6',
    name: 'Screen Printing Squeegee 14"',
    sku: 'SQG-14',
    category: 'supply',
    stock: 6,
    reorderPoint: 2,
    unitCost: 24.95,
    supplier: 'Ryonet',
    location: 'D3',
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-03-05'),
  },
];

// Mock Production Tasks
export const productionTasks: ProductionTaskType[] = [
  {
    id: '1',
    orderId: '1',
    orderNumber: 'ORD-2023-0001',
    customerName: 'John Smith',
    taskType: 'design',
    status: 'completed',
    assignedTo: 'Mike',
    scheduledStart: new Date('2023-04-11T09:00:00'),
    scheduledEnd: new Date('2023-04-11T12:00:00'),
    actualStart: new Date('2023-04-11T09:15:00'),
    actualEnd: new Date('2023-04-11T11:45:00'),
    notes: 'Design completed and approved by customer',
  },
  {
    id: '2',
    orderId: '1',
    orderNumber: 'ORD-2023-0001',
    customerName: 'John Smith',
    taskType: 'prepress',
    status: 'completed',
    assignedTo: 'Jessica',
    scheduledStart: new Date('2023-04-12T09:00:00'),
    scheduledEnd: new Date('2023-04-12T12:00:00'),
    actualStart: new Date('2023-04-12T09:30:00'),
    actualEnd: new Date('2023-04-12T13:00:00'),
    notes: 'Screens burned and ready',
  },
  {
    id: '3',
    orderId: '1',
    orderNumber: 'ORD-2023-0001',
    customerName: 'John Smith',
    taskType: 'printing',
    status: 'in_progress',
    assignedTo: 'Carlos',
    scheduledStart: new Date('2023-04-13T09:00:00'),
    scheduledEnd: new Date('2023-04-13T17:00:00'),
    actualStart: new Date('2023-04-13T09:15:00'),
    notes: 'Started printing, 20 shirts completed',
  },
  {
    id: '4',
    orderId: '2',
    orderNumber: 'ORD-2023-0002',
    customerName: 'Sarah Johnson',
    taskType: 'design',
    status: 'completed',
    assignedTo: 'Mike',
    scheduledStart: new Date('2023-04-16T13:00:00'),
    scheduledEnd: new Date('2023-04-16T17:00:00'),
    actualStart: new Date('2023-04-16T13:00:00'),
    actualEnd: new Date('2023-04-16T16:30:00'),
    notes: 'Digitized logo for embroidery',
  },
  {
    id: '5',
    orderId: '2',
    orderNumber: 'ORD-2023-0002',
    customerName: 'Sarah Johnson',
    taskType: 'embroidery',
    status: 'pending',
    assignedTo: 'Tina',
    scheduledStart: new Date('2023-04-25T09:00:00'),
    scheduledEnd: new Date('2023-04-26T17:00:00'),
  },
];

// Dashboard Stats
export const dashboardStats = {
  ordersThisMonth: 12,
  revenueThisMonth: 5842.5,
  pendingOrders: 3,
  lowStockItems: 2,
};
