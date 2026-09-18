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

export class PathaoAdapter implements ICourierAdapter {
  name: CourierName = "pathao";
  displayName = "Pathao Courier & Logistics";

  private credentials: CourierCredentials = {
    apiKey: "pth_api_prod_77192830182",
    secretKey: "pth_sec_01928374",
    storeId: "PTH-STORE-DHAKA-1",
    sandboxMode: false,
    webhookSecret: "pth_wh_882910",
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
      return 70 + extraWeight * 20;
    } else if (recipientZone === "dhaka_sub") {
      return 105 + extraWeight * 25;
    } else {
      return 135 + extraWeight * 30;
    }
  }

  async bookConsignment(payload: ConsignmentBookingPayload): Promise<ConsignmentResponse> {
    await new Promise((resolve) => setTimeout(resolve, 380));

    const charge = await this.calculateDeliveryCharge(payload.recipientZone, payload.weightKg);
    const trackingSuffix = Math.floor(2000000 + Math.random() * 8000000);
    const trackingCode = `PTH-${trackingSuffix}`;
    const consignmentId = `PTH-CNS-${Math.floor(100000 + Math.random() * 900000)}`;

    const hubMapping: Record<string, string> = {
      dhaka_inside: "DHK-GULSHAN-HUB",
      dhaka_sub: "DHK-GAZIPUR-HUB",
      outside_dhaka: "SYL-KOTWALI-HUB",
    };

    return {
      success: true,
      consignmentId,
      trackingCode,
      courier: "pathao",
      deliveryCharge: charge,
      estimatedDays: payload.recipientZone === "dhaka_inside" ? "Same Day / Next Day" : "48 Hours",
      hubCode: hubMapping[payload.recipientZone] || "DHK-CENTRAL",
      trackingUrl: `https://pathao.com/courier/tracking/?consignment_id=${consignmentId}`,
      message: `Pathao consignment dispatched successfully. Order linked to merchant store.`,
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
      consignmentId: `PTH-CNS-${trackingCode.replace("PTH-", "")}`,
      courier: "pathao",
      currentStatus: "in_transit",
      recipientZone: "Sub-Dhaka (Gazipur Sadar)",
      estimatedDeliveryDate: new Date(now.getTime() + 18 * 3600 * 1000).toISOString(),
      events: [
        {
          timestamp: new Date(now.getTime() - 10 * 3600 * 1000).toISOString(),
          status: "Order Received at Central Sort Facility",
          location: "Pathao Sorting Hub (Tejgaon)",
          note: "Dimension and scale verified: 0.85kg",
        },
        {
          timestamp: new Date(now.getTime() - 4 * 3600 * 1000).toISOString(),
          status: "Dispatched to Linehaul Feeder",
          location: "Tejgaon -> Gazipur Feeder Route",
          note: "Vehicle No: DHK-METRO-TA-4491",
        },
      ],
    };
  }
}
