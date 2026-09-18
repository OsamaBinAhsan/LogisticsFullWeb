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

export class SteadfastAdapter implements ICourierAdapter {
  name: CourierName = "steadfast";
  displayName = "Steadfast Courier Ltd.";

  private credentials: CourierCredentials = {
    apiKey: "stdf_live_sec_9941a884bf03a94821",
    secretKey: "stdf_secret_88192a",
    storeId: "STORE-DHK-902",
    sandboxMode: false,
    webhookSecret: "wh_sec_steadfast_091",
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
    // Simulate real API roundtrip latency
    await new Promise((resolve) => setTimeout(resolve, 350));

    const charge = await this.calculateDeliveryCharge(payload.recipientZone, payload.weightKg);
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const trackingCode = `STDF-${randomSuffix}`;
    const consignmentId = `CID-${randomSuffix}`;

    const hubMapping: Record<string, string> = {
      dhaka_inside: "DHK-NORTH-HUB",
      dhaka_sub: "DHK-SAVAR-HUB",
      outside_dhaka: "CTG-AGRABAD-HUB",
    };

    return {
      success: true,
      consignmentId,
      trackingCode,
      courier: "steadfast",
      deliveryCharge: charge,
      estimatedDays: payload.recipientZone === "dhaka_inside" ? "24-48 Hours" : "48-72 Hours",
      hubCode: hubMapping[payload.recipientZone] || "DHK-CENTRAL",
      trackingUrl: `https://steadfast.com.bd/t/${trackingCode}`,
      message: `Steadfast consignment registered successfully. Tracking: ${trackingCode}`,
    };
  }

  async cancelConsignment(consignmentId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return consignmentId.length > 0;
  }

  async trackConsignment(trackingCode: string): Promise<TrackingTimeline> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const now = new Date();
    return {
      trackingCode,
      consignmentId: `CID-${trackingCode.replace("STDF-", "")}`,
      courier: "steadfast",
      currentStatus: "in_transit",
      recipientZone: "Inside Dhaka (Mirpur DOHS)",
      estimatedDeliveryDate: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
      events: [
        {
          timestamp: new Date(now.getTime() - 14 * 3600 * 1000).toISOString(),
          status: "Parcel Manifested & Booked",
          location: "Merchant Hub (Tejgaon)",
          note: "Barcode scanned by merchant dispatch scanner",
        },
        {
          timestamp: new Date(now.getTime() - 8 * 3600 * 1000).toISOString(),
          status: "Pickup Completed by Rider",
          location: "Tejgaon Sorting Center",
          note: "Rider ID: R-8109 (Kamrul Hasan)",
        },
        {
          timestamp: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
          status: "In Transit to Destination Hub",
          location: "Mirpur Mother Hub",
          note: "Bag ID: BAG-9082",
        },
      ],
    };
  }
}
