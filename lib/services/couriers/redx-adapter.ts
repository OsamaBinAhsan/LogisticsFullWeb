import {
  type ICourierAdapter,
  type CourierCredentials,
  type TrackingTimeline,
} from "./types";
import {
  type ConsignmentBookingPayload,
  type ConsignmentResponse,
  type CourierName,
} from "@/lib/validations/logistics-order.schema";

export class RedXAdapter implements ICourierAdapter {
  name: CourierName = "redx";
  displayName = "RedX Delivery Logistics";

  private credentials: CourierCredentials = {
    apiKey: "redx_live_tok_9918237190",
    secretKey: "redx_sec_7718290",
    storeId: "REDX-MERCHANT-8102",
    sandboxMode: false,
    webhookSecret: "redx_hook_90123",
  };

  getCredentials(): CourierCredentials {
    return { ...this.credentials };
  }

  updateCredentials(credentials: Partial<CourierCredentials>): void {
    this.credentials = { ...this.credentials, ...credentials };
  }

  async calculateDeliveryCharge(recipientZone: string, weightKg: number): Promise<number> {
    const extraWeight = Math.max(0, Math.ceil(weightKg - 1));
    if (recipientZone === "dhaka_inside") {
      return 60 + extraWeight * 20;
    } else if (recipientZone === "dhaka_sub") {
      return 100 + extraWeight * 25;
    } else {
      return 130 + extraWeight * 30;
    }
  }

  async bookConsignment(payload: ConsignmentBookingPayload): Promise<ConsignmentResponse> {
    await new Promise((resolve) => setTimeout(resolve, 360));

    const charge = await this.calculateDeliveryCharge(payload.recipientZone, payload.weightKg);
    const trackingSuffix = Math.floor(10000000 + Math.random() * 90000000);
    const trackingCode = `RDX-${trackingSuffix}`;
    const consignmentId = `RDX-PK-${Math.floor(100000 + Math.random() * 900000)}`;

    const hubMapping: Record<string, string> = {
      dhaka_inside: "DHK-BANANI-01",
      dhaka_sub: "DHK-NARAYANGANJ-02",
      outside_dhaka: "RAJ-BOALIA-01",
    };

    return {
      success: true,
      consignmentId,
      trackingCode,
      courier: "redx",
      deliveryCharge: charge,
      estimatedDays: payload.recipientZone === "dhaka_inside" ? "24-36 Hours" : "48-72 Hours",
      hubCode: hubMapping[payload.recipientZone] || "DHK-CENTRAL",
      trackingUrl: `https://redx.com.bd/track/${trackingCode}`,
      message: `RedX parcel created. Ready for scheduled daily pickup window.`,
    };
  }

  async cancelConsignment(consignmentId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return Boolean(consignmentId);
  }

  async trackConsignment(trackingCode: string): Promise<TrackingTimeline> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const now = new Date();
    return {
      trackingCode,
      consignmentId: `RDX-PK-${trackingCode.replace("RDX-", "")}`,
      courier: "redx",
      currentStatus: "in_transit",
      recipientZone: "Outside Dhaka (Rajshahi Sadar)",
      estimatedDeliveryDate: new Date(now.getTime() + 36 * 3600 * 1000).toISOString(),
      events: [
        {
          timestamp: new Date(now.getTime() - 16 * 3600 * 1000).toISOString(),
          status: "Pickup Completed",
          location: "Central Warehouse Hub",
          note: "Barcode verified",
        },
        {
          timestamp: new Date(now.getTime() - 6 * 3600 * 1000).toISOString(),
          status: "Linehaul Transport in Progress",
          location: "Dhaka -> Rajshahi Express Route",
          note: "Inter-district transit manifest #9921",
        },
      ],
    };
  }
}
