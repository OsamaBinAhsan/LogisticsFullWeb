export * from '@/lib/validations/logistics-order.schema';
export * from '@/lib/services/couriers/types';

export interface PipelineMetrics {
  readyToPackCount: number;
  awaitingPickupCount: number;
  inTransitCount: number;
  rtoRiskCount: number;
  codSettlementDue: number;
  totalOrdersToday: number;
  avgDeliveryHours: number;
  deliverySuccessRate: number;
}

export interface GeographicRiskZone {
  zoneName: string;
  division: string;
  totalShipments: number;
  deliveredCount: number;
  rtoCount: number;
  successRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  avgAttemptCount: number;
  commonFailureReason: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  availableStock: number;
  reservedStock: number;
  safetyThreshold: number;
  channels: {
    facebook: boolean;
    shopify: boolean;
    whatsapp: boolean;
  };
  reorderVelocityDays: number;
  unitCost: number;
  retailPrice: number;
}
