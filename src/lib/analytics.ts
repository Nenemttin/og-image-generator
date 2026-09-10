import { track } from "@vercel/analytics";

export interface CheckoutEventParams {
  plan?: string;
  price?: number;
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Tracks purchase intent when a user clicks the checkout button.
 * Dispatches the 'Initiate_Checkout' custom event to Vercel Web Analytics.
 *
 * Parameters:
 *   - plan: 'Lifetime_Pro'
 *   - price: 29
 */
export function trackInitiateCheckout(customParams?: Partial<CheckoutEventParams>) {
  try {
    track("Initiate_Checkout", {
      plan: "Lifetime_Pro",
      price: 29,
      ...customParams,
    });
  } catch (error) {
    console.warn("[Analytics] Failed to track Initiate_Checkout event:", error);
  }
}
