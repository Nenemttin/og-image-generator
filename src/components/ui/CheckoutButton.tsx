"use client";

import { ComponentProps, ReactNode } from "react";
import { CHECKOUT_URL } from "@/config/constants";
import { trackInitiateCheckout } from "@/lib/analytics";

export interface CheckoutButtonProps extends Omit<ComponentProps<"a">, "href"> {
  children: ReactNode;
  source?: string;
}

/**
 * Checkout Button / Link component with Purchase Intent ('Initiate_Checkout') tracking.
 *
 * Emits the 'Initiate_Checkout' event (plan: 'Lifetime_Pro', price: 29) to Vercel Analytics
 * and cleanly handles both Lemon.js modal overlays and standard tab navigation without
 * triggering browser popup blockers.
 */
export function CheckoutButton({
  children,
  className,
  source,
  onClick,
  ...props
}: CheckoutButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 1. Dispatch custom Initiate_Checkout event before navigation
    trackInitiateCheckout(source ? { source } : undefined);

    // 2. If Lemon.js overlay is present on window, open via modal
    if (
      typeof window !== "undefined" &&
      (window as unknown as { LemonSqueezy?: { Url?: { Open?: (url: string) => void } } })
        ?.LemonSqueezy?.Url?.Open
    ) {
      e.preventDefault();
      (
        window as unknown as {
          LemonSqueezy: { Url: { Open: (url: string) => void } };
        }
      ).LemonSqueezy.Url.Open(CHECKOUT_URL);
    }

    // 3. Trigger consumer onClick handler if attached
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={CHECKOUT_URL}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
