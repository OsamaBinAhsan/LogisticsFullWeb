import { ICourierAdapter } from "./types";
import { SteadfastAdapter } from "./steadfast-adapter";
import { PathaoAdapter } from "./pathao-adapter";
import { RedXAdapter } from "./redx-adapter";
import { CourierName } from "@/lib/validations/logistics-order.schema";

class MockCourierService {
  private adapters: Map<CourierName, ICourierAdapter> = new Map();
  private defaultCourier: CourierName = "steadfast";

  constructor() {
    this.adapters.set("steadfast", new SteadfastAdapter());
    this.adapters.set("pathao", new PathaoAdapter());
    this.adapters.set("redx", new RedXAdapter());
  }

  getAdapter(courierName: CourierName): ICourierAdapter {
    const adapter = this.adapters.get(courierName);
    if (!adapter) {
      // Fallback to steadfast if not found
      return this.adapters.get("steadfast")!;
    }
    return adapter;
  }

  getAllCouriers(): { name: CourierName; displayName: string; adapter: ICourierAdapter }[] {
    return Array.from(this.adapters.entries()).map(([name, adapter]) => ({
      name,
      displayName: adapter.displayName,
      adapter,
    }));
  }

  getDefaultCourier(): CourierName {
    return this.defaultCourier;
  }

  setDefaultCourier(courier: CourierName): void {
    if (this.adapters.has(courier)) {
      this.defaultCourier = courier;
    }
  }

  async calculateAllRates(recipientZone: string, weightKg: number): Promise<{
    courier: CourierName;
    displayName: string;
    rate: number;
    estimatedDays: string;
  }[]> {
    const results = [];
    for (const [name, adapter] of this.adapters.entries()) {
      const rate = await adapter.calculateDeliveryCharge(recipientZone, weightKg);
      let estimatedDays = "24-48 Hours";
      if (name === "pathao") estimatedDays = "Same Day / 24h";
      if (name === "redx") estimatedDays = "36-48 Hours";

      results.push({
        courier: name,
        displayName: adapter.displayName,
        rate,
        estimatedDays,
      });
    }
    return results;
  }
}

export const mockCourierService = new MockCourierService();
export { SteadfastAdapter, PathaoAdapter, RedXAdapter };
