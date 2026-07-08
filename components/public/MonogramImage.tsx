"use client";

import Image, { type ImageProps } from "next/image";

/**
 * next/image with an onError fallback needs to be a Client Component —
 * passing an event handler prop from a Server Component (e.g. Footer,
 * which has no other reason to be client-side) throws at runtime
 * ("Event handlers cannot be passed to Client Component props").
 */
export default function MonogramImage({ alt, ...props }: ImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  );
}
