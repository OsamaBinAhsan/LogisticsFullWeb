import {
  type Order,
  type OrderStatus,
  type Channel,
  type CourierName,
  type ConsignmentBookingPayload,
} from "@/lib/validations/logistics-order.schema";
import { type PipelineMetrics, type GeographicRiskZone } from "@/types/logistics";
import { mockCourierService } from "./couriers/mock-courier.service";

// Initial realistic dataset for F-Commerce & Multi-Channel merchants
const INITIAL_ORDERS: Order[] = [
  {
    id: "PP-8401",
    invoiceNumber: "INV-2026-08401",
    channel: "facebook",
    createdAt: "2026-09-13T09:20:00Z",
    customer: {
      id: "CUST-101",
      name: "Tanvir Ahmed",
      phone: "01711928374",
      address: {
        street: "House 42, Road 11, Block D, Banani",
        district: "Dhaka",
        zone: "dhaka_inside",
        hubCode: "DHK-BANANI",
      },
      trustScore: 98,
      totalOrders: 6,
      returnRatePercentage: 0,
    },
    items: [
      {
        sku: "MOD-HOODIE-BLK-L",
        name: "Obsidian Heavyweight Hoodie",
        quantity: 1,
        unitPrice: 2250,
        weightKg: 0.85,
        variation: "Black / L",
      },
    ],
    totalWeightKg: 0.85,
    codReceivable: 2350,
    deliveryFeeChargedToCustomer: 100,
    totalAmount: 2350,
    status: "ready_to_pack",
    notes: "Customer requested evening delivery after 6 PM",
    isHighRiskArea: false,
    tags: ["VIP", "Repeat Buyer"],
  },
  {
    id: "PP-8402",
    invoiceNumber: "INV-2026-08402",
    channel: "instagram",
    createdAt: "2026-09-13T10:14:00Z",
    customer: {
      id: "CUST-102",
      name: "Sumaiya Akhter",
      phone: "01844901234",
      address: {
        street: "Apt 5B, Green Valley, Sector 7, Uttara",
        district: "Dhaka",
        zone: "dhaka_inside",
        hubCode: "DHK-NORTH",
      },
      trustScore: 92,
      totalOrders: 3,
      returnRatePercentage: 4,
    },
    items: [
      {
        sku: "SILK-SCARF-EMR",
        name: "Emerald Modal Silk Scarf",
        quantity: 2,
        unitPrice: 950,
        weightKg: 0.4,
        variation: "Emerald Green",
      },
      {
        sku: "LEATH-PIN-GLD",
        name: "Brass Monogram Brooch",
        quantity: 1,
        unitPrice: 450,
        weightKg: 0.1,
      },
    ],
    totalWeightKg: 0.5,
    codReceivable: 2430,
    deliveryFeeChargedToCustomer: 80,
    totalAmount: 2430,
    status: "ready_to_pack",
    isHighRiskArea: false,
    tags: ["Gift Box"],
  },
  {
    id: "PP-8403",
    invoiceNumber: "INV-2026-08403",
    channel: "whatsapp",
    createdAt: "2026-09-13T11:05:00Z",
    customer: {
      id: "CUST-103",
      name: "Mahfuzur Rahman",
      phone: "01912345678",
      address: {
        street: "Holding 128, Chandana Chowrasta",
        district: "Gazipur",
        zone: "dhaka_sub",
        hubCode: "DHK-GAZIPUR",
      },
      trustScore: 84,
      totalOrders: 2,
      returnRatePercentage: 12,
    },
    items: [
      {
        sku: "TACT-CARGO-OD-32",
        name: "Tactical Ripstop Cargo Pant",
        quantity: 1,
        unitPrice: 1850,
        weightKg: 0.75,
        variation: "Olive Drab / 32",
      },
    ],
    totalWeightKg: 0.75,
    codReceivable: 1970,
    deliveryFeeChargedToCustomer: 120,
    totalAmount: 1970,
    status: "awaiting_pickup",
    consignment: {
      consignmentId: "STDF-991204",
      trackingCode: "STDF-991204",
      courier: "steadfast",
      bookedAt: "2026-09-13T12:00:00Z",
      deliveryCharge: 100,
      codAmount: 1970,
      status: "awaiting_pickup",
      hubRoutingCode: "DHK-SAVAR-HUB",
      trackingUrl: "https://steadfast.com.bd/t/STDF-991204",
    },
    isHighRiskArea: false,
    tags: ["WhatsApp Direct"],
  },
  {
    id: "PP-8404",
    invoiceNumber: "INV-2026-08404",
    channel: "shopify",
    createdAt: "2026-09-13T08:30:00Z",
    customer: {
      id: "CUST-104",
      name: "Nusrat Jahan",
      phone: "01688123987",
      address: {
        street: "GEC Circle, Nasirabad Housing Society, Road 3",
        district: "Chattogram",
        zone: "outside_dhaka",
        hubCode: "CTG-CENTRAL",
      },
      trustScore: 96,
      totalOrders: 5,
      returnRatePercentage: 2,
    },
    items: [
      {
        sku: "MIN-WALLET-BLK",
        name: "Full Grain Leather Cardholder",
        quantity: 1,
        unitPrice: 1200,
        weightKg: 0.25,
      },
      {
        sku: "KEY-CHAIN-BRS",
        name: "Matte Brass Carabiner Keyring",
        quantity: 1,
        unitPrice: 550,
        weightKg: 0.15,
      },
    ],
    totalWeightKg: 0.4,
    codReceivable: 1900,
    deliveryFeeChargedToCustomer: 150,
    totalAmount: 1900,
    status: "in_transit",
    consignment: {
      consignmentId: "PTH-7729104",
      trackingCode: "PTH-7729104",
      courier: "pathao",
      bookedAt: "2026-09-12T16:00:00Z",
      deliveryCharge: 135,
      codAmount: 1900,
      status: "in_transit",
      hubRoutingCode: "CTG-AGRABAD-HUB",
      trackingUrl: "https://pathao.com/courier/tracking/?consignment_id=PTH-7729104",
    },
    isHighRiskArea: false,
    tags: ["Shopify Web"],
  },
  {
    id: "PP-8405",
    invoiceNumber: "INV-2026-08405",
    channel: "facebook",
    createdAt: "2026-09-12T14:10:00Z",
    customer: {
      id: "CUST-105",
      name: "Saiful Islam Babul",
      phone: "01799201928",
      address: {
        street: "Railway Colony Gate 2, Akhaura",
        district: "Brahmanbaria",
        zone: "outside_dhaka",
        hubCode: "BBA-MAIN",
      },
      trustScore: 54,
      totalOrders: 1,
      returnRatePercentage: 35,
    },
    items: [
      {
        sku: "RETRO-JACKET-NVY-XL",
        name: "Vintage Windbreaker Windrunner",
        quantity: 1,
        unitPrice: 2850,
        weightKg: 0.95,
      },
    ],
    totalWeightKg: 0.95,
    codReceivable: 3000,
    deliveryFeeChargedToCustomer: 150,
    totalAmount: 3000,
    status: "rto_risk",
    consignment: {
      consignmentId: "RDX-8819204",
      trackingCode: "RDX-8819204",
      courier: "redx",
      bookedAt: "2026-09-11T11:00:00Z",
      deliveryCharge: 130,
      codAmount: 3000,
      status: "rto_risk",
      hubRoutingCode: "BBA-DIST-01",
      trackingUrl: "https://redx.com.bd/track/RDX-8819204",
    },
    returnRecord: {
      returnId: "RET-019",
      orderId: "PP-8405",
      reasonCategory: "unreachable",
      reasonDetail: "Phone switched off on 2 consecutive rider attempts",
      failureCode: "RIDER_UNREACHABLE_02",
      attemptCount: 2,
      agentNotes: "Sent WhatsApp notification. Customer opened message but did not reply.",
      timestamp: "2026-09-13T10:30:00Z",
      recoveryStatus: "pending_call",
    },
    isHighRiskArea: true,
    tags: ["High Return Risk", "COD Pending"],
  },
  {
    id: "PP-8406",
    invoiceNumber: "INV-2026-08406",
    channel: "custom_web",
    createdAt: "2026-09-11T18:40:00Z",
    customer: {
      id: "CUST-106",
      name: "Tariqul Hasan",
      phone: "01755102938",
      address: {
        street: "House 19, Road 4, Shahi Eidgah",
        district: "Sylhet",
        zone: "outside_dhaka",
        hubCode: "SYL-MAIN",
      },
      trustScore: 68,
      totalOrders: 2,
      returnRatePercentage: 25,
    },
    items: [
      {
        sku: "SNEAK-RUN-WHT-42",
        name: "Apex Pulse Runner Sneakers",
        quantity: 1,
        unitPrice: 3400,
        weightKg: 1.1,
        variation: "White / 42",
      },
    ],
    totalWeightKg: 1.1,
    codReceivable: 3550,
    deliveryFeeChargedToCustomer: 150,
    totalAmount: 3550,
    status: "delivery_failed",
    consignment: {
      consignmentId: "STDF-109283",
      trackingCode: "STDF-109283",
      courier: "steadfast",
      bookedAt: "2026-09-10T12:00:00Z",
      deliveryCharge: 150,
      codAmount: 3550,
      status: "delivery_failed",
      hubRoutingCode: "SYL-KOTWALI-HUB",
      trackingUrl: "https://steadfast.com.bd/t/STDF-109283",
    },
    returnRecord: {
      returnId: "RET-020",
      orderId: "PP-8406",
      reasonCategory: "refused_doorstep",
      reasonDetail: "Customer was out of station, requested delivery next Tuesday",
      failureCode: "DOORSTEP_RESCHEDULE",
      attemptCount: 1,
      agentNotes: "Agreed to receive on Sept 16th after 3 PM.",
      timestamp: "2026-09-13T09:00:00Z",
      recoveryStatus: "pending_call",
    },
    isHighRiskArea: false,
    tags: ["Reschedule Candidate"],
  },
  {
    id: "PP-8407",
    invoiceNumber: "INV-2026-08407",
    channel: "facebook",
    createdAt: "2026-09-13T12:20:00Z",
    customer: {
      id: "CUST-107",
      name: "Dr. Farhana Yasmin",
      phone: "01722883311",
      address: {
        street: "Flat 4A, Concord Tower, Road 27, Dhanmondi",
        district: "Dhaka",
        zone: "dhaka_inside",
        hubCode: "DHK-DHANMONDI",
      },
      trustScore: 99,
      totalOrders: 8,
      returnRatePercentage: 0,
    },
    items: [
      {
        sku: "PREM-TEA-SET-6P",
        name: "Handmade Ceramic Teaware Set",
        quantity: 1,
        unitPrice: 4200,
        weightKg: 1.8,
      },
    ],
    totalWeightKg: 1.8,
    codReceivable: 4300,
    deliveryFeeChargedToCustomer: 100,
    totalAmount: 4300,
    status: "ready_to_pack",
    isHighRiskArea: false,
    tags: ["Fragile", "VIP"],
  },
  {
    id: "PP-8408",
    invoiceNumber: "INV-2026-08408",
    channel: "instagram",
    createdAt: "2026-09-12T09:15:00Z",
    customer: {
      id: "CUST-108",
      name: "Kazi Rayhan",
      phone: "01819283746",
      address: {
        street: "Shop 14, Al-Madina Market, Chashara",
        district: "Narayanganj",
        zone: "dhaka_sub",
        hubCode: "DHK-NARAYANGANJ",
      },
      trustScore: 88,
      totalOrders: 4,
      returnRatePercentage: 8,
    },
    items: [
      {
        sku: "DENIM-JACK-BLU-M",
        name: "Raw Selvedge Denim Jacket",
        quantity: 1,
        unitPrice: 3100,
        weightKg: 0.9,
      },
    ],
    totalWeightKg: 0.9,
    codReceivable: 3200,
    deliveryFeeChargedToCustomer: 100,
    totalAmount: 3200,
    status: "in_transit",
    consignment: {
      consignmentId: "PTH-9012384",
      trackingCode: "PTH-9012384",
      courier: "pathao",
      bookedAt: "2026-09-12T17:30:00Z",
      deliveryCharge: 105,
      codAmount: 3200,
      status: "in_transit",
      hubRoutingCode: "NRG-CHASHARA-HUB",
      trackingUrl: "https://pathao.com/courier/tracking/?consignment_id=PTH-9012384",
    },
    isHighRiskArea: false,
    tags: ["In Route"],
  },
  {
    id: "PP-8409",
    invoiceNumber: "INV-2026-08409",
    channel: "whatsapp",
    createdAt: "2026-09-13T13:40:00Z",
    customer: {
      id: "CUST-109",
      name: "Ashikur Zaman",
      phone: "01552394857",
      address: {
        street: "North South Road, Rampura Bazar",
        district: "Dhaka",
        zone: "dhaka_inside",
        hubCode: "DHK-RAMPURA",
      },
      trustScore: 91,
      totalOrders: 3,
      returnRatePercentage: 5,
    },
    items: [
      {
        sku: "MIN-POLO-WHT-XL",
        name: "Supima Cotton Polo",
        quantity: 2,
        unitPrice: 1100,
        weightKg: 0.5,
      },
    ],
    totalWeightKg: 0.5,
    codReceivable: 2280,
    deliveryFeeChargedToCustomer: 80,
    totalAmount: 2280,
    status: "ready_to_pack",
    isHighRiskArea: false,
    tags: ["Regular"],
  },
  {
    id: "PP-8410",
    invoiceNumber: "INV-2026-08410",
    channel: "shopify",
    createdAt: "2026-09-10T11:00:00Z",
    customer: {
      id: "CUST-110",
      name: "Sabrina Mostofa",
      phone: "01733948572",
      address: {
        street: "Holding 54, Jaleshwaritola",
        district: "Bogura",
        zone: "outside_dhaka",
        hubCode: "BOG-CENTRAL",
      },
      trustScore: 95,
      totalOrders: 7,
      returnRatePercentage: 0,
    },
    items: [
      {
        sku: "CANV-TOTE-NAT",
        name: "Heavy Duck Canvas Tote",
        quantity: 1,
        unitPrice: 850,
        weightKg: 0.35,
      },
      {
        sku: "POUCH-ORG-SML",
        name: "Waxed Canvas Utility Pouch",
        quantity: 1,
        unitPrice: 450,
        weightKg: 0.15,
      },
    ],
    totalWeightKg: 0.5,
    codReceivable: 1450,
    deliveryFeeChargedToCustomer: 150,
    totalAmount: 1450,
    status: "delivered",
    consignment: {
      consignmentId: "RDX-7744192",
      trackingCode: "RDX-7744192",
      courier: "redx",
      bookedAt: "2026-09-10T14:00:00Z",
      deliveryCharge: 130,
      codAmount: 1450,
      status: "delivered",
      hubRoutingCode: "BOG-HUB-01",
      trackingUrl: "https://redx.com.bd/track/RDX-7744192",
    },
    isHighRiskArea: false,
    tags: ["Completed"],
  },
];

class LogisticsOrdersService {
  private orders: Order[] = [...INITIAL_ORDERS];

  async getOrders(filters?: {
    status?: OrderStatus | "all" | "unfulfilled" | "consignment_created";
    search?: string;
    channel?: Channel | "all";
    courier?: CourierName | "all";
  }): Promise<Order[]> {
    let result = [...this.orders];

    if (filters?.status && filters.status !== "all") {
      if (filters.status === "unfulfilled") {
        result = result.filter((o) => o.status === "ready_to_pack");
      } else if (filters.status === "consignment_created") {
        result = result.filter(
          (o) => o.status === "awaiting_pickup" || o.status === "in_transit"
        );
      } else {
        result = result.filter((o) => o.status === filters.status);
      }
    }

    if (filters?.channel && filters.channel !== "all") {
      result = result.filter((o) => o.channel === filters.channel);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter((o) => {
        return (
          o.id.toLowerCase().includes(q) ||
          o.invoiceNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.includes(q) ||
          o.customer.address.district.toLowerCase().includes(q) ||
          (o.consignment?.trackingCode &&
            o.consignment.trackingCode.toLowerCase().includes(q)) ||
          o.items.some(
            (it) =>
              it.sku.toLowerCase().includes(q) ||
              it.name.toLowerCase().includes(q)
          )
        );
      });
    }

    return result;
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orders.find((o) => o.id === id) || null;
  }

  async getOrdersByIds(ids: string[]): Promise<Order[]> {
    return this.orders.filter((o) => ids.includes(o.id));
  }

  async getPipelineMetrics(): Promise<PipelineMetrics> {
    const readyToPackCount = this.orders.filter((o) => o.status === "ready_to_pack").length;
    const awaitingPickupCount = this.orders.filter((o) => o.status === "awaiting_pickup").length;
    const inTransitCount = this.orders.filter((o) => o.status === "in_transit").length;
    const rtoRiskCount = this.orders.filter((o) => o.status === "rto_risk" || o.status === "delivery_failed").length;

    // Sum COD of all active shipments waiting for settlement
    const codSettlementDue = this.orders
      .filter((o) => ["awaiting_pickup", "in_transit", "delivered"].includes(o.status))
      .reduce((sum, o) => sum + o.codReceivable, 0);

    return {
      readyToPackCount,
      awaitingPickupCount,
      inTransitCount,
      rtoRiskCount,
      codSettlementDue,
      totalOrdersToday: 48,
      avgDeliveryHours: 28.5,
      deliverySuccessRate: 94.2,
    };
  }

  async bookConsignment(orderId: string, courierName: CourierName): Promise<Order> {
    const orderIndex = this.orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) {
      throw new Error(`Order ${orderId} not found`);
    }

    const order = this.orders[orderIndex];
    const adapter = mockCourierService.getAdapter(courierName);

    const payload: ConsignmentBookingPayload = {
      orderId: order.id,
      courier: courierName,
      recipientName: order.customer.name,
      recipientPhone: order.customer.phone,
      recipientAddress: order.customer.address.street,
      recipientDistrict: order.customer.address.district,
      recipientZone: order.customer.address.zone,
      codAmount: order.codReceivable,
      weightKg: order.totalWeightKg,
      itemDescription: order.items.map((it) => `${it.name} (${it.quantity})`).join(", "),
    };

    const res = await adapter.bookConsignment(payload);

    const updatedOrder: Order = {
      ...order,
      status: "awaiting_pickup",
      consignment: {
        consignmentId: res.consignmentId,
        trackingCode: res.trackingCode,
        courier: courierName,
        bookedAt: new Date().toISOString(),
        deliveryCharge: res.deliveryCharge,
        codAmount: order.codReceivable,
        status: "awaiting_pickup",
        hubRoutingCode: res.hubCode,
        trackingUrl: res.trackingUrl,
      },
    };

    this.orders[orderIndex] = updatedOrder;
    return updatedOrder;
  }

  async batchBookConsignments(
    orderIds: string[],
    courierName: CourierName
  ): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    for (const id of orderIds) {
      try {
        await this.bookConsignment(id, courierName);
        success.push(id);
      } catch {
        failed.push(id);
      }
    }

    return { success, failed };
  }

  async markAsShipped(orderIds: string[]): Promise<void> {
    this.orders = this.orders.map((o) => {
      if (orderIds.includes(o.id)) {
        return {
          ...o,
          status: "in_transit",
          consignment: o.consignment
            ? { ...o.consignment, status: "in_transit" }
            : undefined,
        };
      }
      return o;
    });
  }

  async scheduleSecondAttempt(orderId: string, notes: string): Promise<Order> {
    const orderIndex = this.orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) throw new Error("Order not found");

    const order = this.orders[orderIndex];
    const updatedOrder: Order = {
      ...order,
      status: "in_transit",
      notes: notes || order.notes,
      returnRecord: order.returnRecord
        ? {
            ...order.returnRecord,
            recoveryStatus: "rescheduled",
            attemptCount: order.returnRecord.attemptCount + 1,
            agentNotes: notes,
          }
        : undefined,
    };

    this.orders[orderIndex] = updatedOrder;
    return updatedOrder;
  }

  async getGeographicRiskZones(): Promise<GeographicRiskZone[]> {
    return [
      {
        zoneName: "Dhaka North (Uttara, Mirpur)",
        division: "Dhaka",
        totalShipments: 412,
        deliveredCount: 395,
        rtoCount: 17,
        successRate: 95.8,
        riskLevel: "low",
        avgAttemptCount: 1.2,
        commonFailureReason: "Customer Unreachable (1st attempt)",
      },
      {
        zoneName: "Dhaka South (Dhanmondi, Gulshan)",
        division: "Dhaka",
        totalShipments: 520,
        deliveredCount: 508,
        rtoCount: 12,
        successRate: 97.6,
        riskLevel: "low",
        avgAttemptCount: 1.1,
        commonFailureReason: "Gate Security Lock",
      },
      {
        zoneName: "Chattogram Metropolitan",
        division: "Chattogram",
        totalShipments: 230,
        deliveredCount: 216,
        rtoCount: 14,
        successRate: 93.9,
        riskLevel: "low",
        avgAttemptCount: 1.3,
        commonFailureReason: "Traffic Delay / Rescheduled",
      },
      {
        zoneName: "Gazipur & Tongi Industrial Hub",
        division: "Dhaka Sub",
        totalShipments: 148,
        deliveredCount: 124,
        rtoCount: 24,
        successRate: 83.7,
        riskLevel: "medium",
        avgAttemptCount: 1.8,
        commonFailureReason: "Customer Overtime / Switched Off",
      },
      {
        zoneName: "Brahmanbaria Rural Feeder",
        division: "Chattogram",
        totalShipments: 89,
        deliveredCount: 68,
        rtoCount: 21,
        successRate: 76.4,
        riskLevel: "high",
        avgAttemptCount: 2.3,
        commonFailureReason: "Doorstep Refusal / COD Shortage",
      },
      {
        zoneName: "Bogura Sadar & Rural",
        division: "Rajshahi",
        totalShipments: 94,
        deliveredCount: 86,
        rtoCount: 8,
        successRate: 91.4,
        riskLevel: "medium",
        avgAttemptCount: 1.4,
        commonFailureReason: "Incorrect Village Address",
      },
    ];
  }

  async getReturnReasonsSummary(): Promise<{
    reason: string;
    key: string;
    percentage: number;
    count: number;
    color: string;
  }[]> {
    return [
      {
        reason: "Customer Unreachable / Switched Off",
        key: "unreachable",
        percentage: 42,
        count: 36,
        color: "#FF3366", // Razor Crimson
      },
      {
        reason: "Refused at Doorstep (No Cash / Mind Changed)",
        key: "refused_doorstep",
        percentage: 26,
        count: 22,
        color: "#FF9900", // Hazard Amber
      },
      {
        reason: "Delayed Delivery (Customer Cancelled)",
        key: "delayed",
        percentage: 16,
        count: 14,
        color: "#A855F7", // Terminal Violet
      },
      {
        reason: "Wrong Size / Variation Sent",
        key: "wrong_item_sent",
        percentage: 11,
        count: 9,
        color: "#00F0FF", // Hyper-Teal
      },
      {
        reason: "Damaged in Transit / Seal Broken",
        key: "damaged_in_transit",
        percentage: 5,
        count: 4,
        color: "#64748B", // Slate
      },
    ];
  }
}

export const logisticsOrdersService = new LogisticsOrdersService();
