import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = async () => {
  if (!stripePromise) {
    try {
      stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ?? 
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? 
        ""
      );
    } catch (error) {
      console.error("Failed to load Stripe:", error);
      return null; // Return null or handle it based on your needs
    }
  }

  return stripePromise;
};
