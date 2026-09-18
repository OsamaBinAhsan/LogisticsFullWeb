import { type InventoryItem } from "@/types/logistics";

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: "INV-001",
    sku: "MOD-HOODIE-BLK-L",
    name: "Obsidian Heavyweight Hoodie (L)",
    category: "Apparel",
    availableStock: 24,
    reservedStock: 12,
    safetyThreshold: 15,
    channels: {
      facebook: true,
      shopify: true,
      whatsapp: true,
    },
    reorderVelocityDays: 4,
    unitCost: 1100,
    retailPrice: 2250,
  },
  {
    id: "INV-002",
    sku: "SILK-SCARF-EMR",
    name: "Emerald Modal Silk Scarf",
    category: "Accessories",
    availableStock: 8,
    reservedStock: 6,
    safetyThreshold: 12,
    channels: {
      facebook: true,
      shopify: false,
      whatsapp: true,
    },
    reorderVelocityDays: 2,
    unitCost: 380,
    retailPrice: 950,
  },
  {
    id: "INV-003",
    sku: "TACT-CARGO-OD-32",
    name: "Tactical Ripstop Cargo Pant (32)",
    category: "Apparel",
    availableStock: 35,
    reservedStock: 5,
    safetyThreshold: 10,
    channels: {
      facebook: true,
      shopify: true,
      whatsapp: false,
    },
    reorderVelocityDays: 8,
    unitCost: 850,
    retailPrice: 1850,
  },
  {
    id: "INV-004",
    sku: "MIN-WALLET-BLK",
    name: "Full Grain Leather Cardholder",
    category: "Leather Goods",
    availableStock: 3,
    reservedStock: 4,
    safetyThreshold: 8,
    channels: {
      facebook: true,
      shopify: true,
      whatsapp: true,
    },
    reorderVelocityDays: 1,
    unitCost: 450,
    retailPrice: 1200,
  },
  {
    id: "INV-005",
    sku: "SNEAK-RUN-WHT-42",
    name: "Apex Pulse Runner Sneakers (42)",
    category: "Footwear",
    availableStock: 14,
    reservedStock: 9,
    safetyThreshold: 10,
    channels: {
      facebook: false,
      shopify: true,
      whatsapp: true,
    },
    reorderVelocityDays: 5,
    unitCost: 1600,
    retailPrice: 3400,
  },
  {
    id: "INV-006",
    sku: "DENIM-JACK-BLU-M",
    name: "Raw Selvedge Denim Jacket (M)",
    category: "Apparel",
    availableStock: 19,
    reservedStock: 7,
    safetyThreshold: 10,
    channels: {
      facebook: true,
      shopify: true,
      whatsapp: true,
    },
    reorderVelocityDays: 6,
    unitCost: 1450,
    retailPrice: 3100,
  },
];

class LogisticsInventoryService {
  private items: InventoryItem[] = [...INITIAL_INVENTORY];

  async getInventoryItems(): Promise<InventoryItem[]> {
    return [...this.items];
  }

  async getLowStockAlerts(): Promise<InventoryItem[]> {
    return this.items.filter((item) => item.availableStock <= item.safetyThreshold);
  }

  async updateStock(sku: string, adjustment: number): Promise<InventoryItem | null> {
    const item = this.items.find((i) => i.sku === sku);
    if (!item) return null;
    item.availableStock = Math.max(0, item.availableStock + adjustment);
    return { ...item };
  }
}

export const logisticsInventoryService = new LogisticsInventoryService();
