
import { Supplier, SupplierProduct } from "@/types/supplier";

export const suppliers: Supplier[] = [
  {
    id: "1",
    name: "S&S Activewear Canada",
    logo: "https://www.ssactivewear.com/content-hub/wp-content/uploads/2023/05/SS_Logo_FullColor_RGB_Positive-1.png",
    description: "S&S Activewear is a leading wholesaler of apparel and accessories, offering premium brands for the imprintable apparel market.",
    website: "https://www.ssactivewear.ca",
    status: "active",
    lastSync: "2024-03-28T14:30:00Z",
    productCount: 457
  },
  {
    id: "2",
    name: "SanMar Canada",
    logo: "https://cdn11.bigcommerce.com/s-mlk6sv9j8s/product_images/uploaded_images/sanmar.png",
    description: "SanMar is a premier supplier of wholesale imprintable apparel and accessories in North America.",
    website: "https://www.sanmar.com/ca",
    status: "active",
    lastSync: "2024-03-29T09:15:00Z",
    productCount: 389
  },
  {
    id: "3",
    name: "Alphabroder Canada",
    logo: "https://www.alphabroder.ca/media/wysiwyg/alphabroder-canada-logo.png",
    description: "Alphabroder is one of North America's largest distributors of trade, private label and retail apparel brands.",
    website: "https://www.alphabroder.ca",
    status: "inactive",
    productCount: 0
  }
];

export const supplierProducts: Record<string, SupplierProduct[]> = {
  "1": [
    {
      id: "101",
      supplierId: "1",
      sku: "SSC-T100",
      name: "Premium Cotton T-Shirt",
      description: "100% ring-spun cotton t-shirt with ribbed crew neck",
      category: "T-Shirts",
      price: 12.99,
      cost: 7.50,
      images: [
        "https://www.ssactivewear.com/fm/images/New%20Style%20Images/1717_fm.jpg",
        "https://www.ssactivewear.com/fm/images/New%20Style%20Images/1717_b_fm.jpg"
      ],
      colors: ["Black", "White", "Navy", "Red", "Heather Gray"],
      sizes: ["S", "M", "L", "XL", "2XL"],
      inventory: [
        { size: "S", color: "Black", quantity: 120 },
        { size: "M", color: "Black", quantity: 85 },
        { size: "L", color: "Black", quantity: 72 },
        { size: "S", color: "White", quantity: 45 },
        { size: "M", color: "White", quantity: 30 },
        { size: "L", color: "White", quantity: 20 }
      ],
      lastUpdated: "2024-03-28T14:30:00Z"
    },
    {
      id: "102",
      supplierId: "1",
      sku: "SSC-H200",
      name: "Pullover Hoodie",
      description: "50/50 cotton-polyester blend pullover hoodie with front pocket",
      category: "Sweatshirts",
      price: 24.99,
      cost: 14.25,
      images: [
        "https://www.ssactivewear.com/fm/images/New%20Style%20Images/F170_fm.jpg",
        "https://www.ssactivewear.com/fm/images/New%20Style%20Images/F170_b_fm.jpg"
      ],
      colors: ["Black", "Navy", "Heather Gray", "Maroon"],
      sizes: ["S", "M", "L", "XL", "2XL"],
      inventory: [
        { size: "M", color: "Black", quantity: 45 },
        { size: "L", color: "Black", quantity: 38 },
        { size: "XL", color: "Black", quantity: 42 },
        { size: "M", color: "Navy", quantity: 28 },
        { size: "L", color: "Navy", quantity: 24 }
      ],
      lastUpdated: "2024-03-28T14:30:00Z"
    }
  ],
  "2": [
    {
      id: "201",
      supplierId: "2",
      sku: "SM-PC61",
      name: "Essential Tee",
      description: "100% cotton essential t-shirt for everyday wear",
      category: "T-Shirts",
      price: 10.99,
      cost: 6.25,
      images: [
        "https://cdn.sanmar.com/catalog/images/PC61_Black_Model_Front_2019.jpg",
        "https://cdn.sanmar.com/catalog/images/PC61_Black_Model_Back_2019.jpg"
      ],
      colors: ["Black", "White", "Navy", "Red", "Kelly Green"],
      sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
      inventory: [
        { size: "S", color: "Black", quantity: 95 },
        { size: "M", color: "Black", quantity: 78 },
        { size: "L", color: "Black", quantity: 65 },
        { size: "S", color: "White", quantity: 55 },
        { size: "M", color: "White", quantity: 40 }
      ],
      lastUpdated: "2024-03-29T09:15:00Z"
    },
    {
      id: "202",
      supplierId: "2",
      sku: "SM-NKDC1",
      name: "Dri-FIT Performance Polo",
      description: "Nike Dri-FIT moisture-wicking performance polo",
      category: "Polos",
      price: 35.99,
      cost: 21.50,
      images: [
        "https://cdn.sanmar.com/catalog/images/NKDC1_BlackWhite_Model_Front_2022.jpg",
        "https://cdn.sanmar.com/catalog/images/NKDC1_BlackWhite_Model_Side_2022.jpg"
      ],
      colors: ["Black", "Navy", "White", "Red", "Royal"],
      sizes: ["S", "M", "L", "XL", "2XL"],
      inventory: [
        { size: "M", color: "Black", quantity: 32 },
        { size: "L", color: "Black", quantity: 28 },
        { size: "XL", color: "Black", quantity: 25 },
        { size: "M", color: "Navy", quantity: 18 },
        { size: "L", color: "Navy", quantity: 15 }
      ],
      lastUpdated: "2024-03-29T09:15:00Z"
    }
  ]
};
