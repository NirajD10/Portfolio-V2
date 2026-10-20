import Image from "next/image";
import type { AssetId } from "@/content/assets";
import { asset } from "@/lib/assets";
import { cn } from "@/lib/cn";
import { PlaceholderTag } from "./PlaceholderTag";

type AssetImageProps = {
  id: Extract<AssetId, `work.${string}` | `life.${string}`>;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
};

/** next/image for a manifest slot (docs/plan/13). Shows the PLACEHOLDER tag in dev/preview. */
export function AssetImage({ id, alt, sizes, priority, className, imgClassName }: AssetImageProps) {
  const img = asset(id);
  return (
    <span className={cn("relative block", className)}>
      <Image
        src={img.src}
        width={img.width}
        height={img.height}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={cn("h-auto w-full", imgClassName)}
      />
      {img.placeholder && <PlaceholderTag />}
    </span>
  );
}
