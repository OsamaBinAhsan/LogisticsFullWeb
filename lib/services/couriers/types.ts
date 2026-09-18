import {
  type ConsignmentBookingPayload,
  type ConsignmentResponse,
  type CourierName,
} from "@/lib/validations/logistics-order.schema";

export interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  note?: string;
}

export interface TrackingTimeline {
  trackingCode: string;
  consignmentId: string;
  courier: CourierName;
  currentStatus: string;
  estimatedDeliveryDate?: string;
  recipientZone: string;
  events: TrackingEvent[];
}

export interface CourierCredentials {
  apiKey: string;
  secretKey?: string;
  storeId?: string;
  sandboxMode: boolean;
  webhookSecret?: string;
}

export interface ICourierAdapter {
  name: CourierName;
  displayName: string;
  bookConsignment(payload: ConsignmentBookingPayload): Promise<ConsignmentResponse>;
  cancelConsignment(consignmentId: string): Promise<boolean>;
  trackConsignment(trackingCode: string): Promise<TrackingTimeline>;
  calculateDeliveryCharge(recipientZone: string, weightKg: number): Promise<number>;
  getCredentials(): CourierCredentials;
  updateCredentials(credentials: Partial<CourierCredentials>): void;
}
