import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Pixel height (width auto-scales with the image's aspect ratio). */
  size?: number;
  /** Wrap the image in a link to the home page. Default true. */
  asLink?: boolean;
  className?: string;
}

/**
 * The Gone Phishin' wordmark. Single source of truth — every place that
 * needs the logo should import this rather than referencing /logo.png
 * directly, so a future swap (SVG, animated, etc.) is one change.
 */
export function Logo({ size = 36, asLink = true, className }: LogoProps) {
  // The artwork is a wide horizontal mark; height = `size`, width derived
  // from the source aspect ratio (~1:1 in this PNG so width matches).
  const img = (
    <Image
      src="/logo.png"
      alt="Gone Phishin'"
      width={size * 3}
      height={size}
      priority
      className={cn("h-auto w-auto", className)}
      style={{ height: size }}
    />
  );

  if (!asLink) return img;
  return (
    <Link href="/" aria-label="Gone Phishin' home" className="inline-block">
      {img}
    </Link>
  );
}
