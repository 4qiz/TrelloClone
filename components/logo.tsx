import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";

const headingFont = localFont({
  src: "../public/fonts/font.woff2",
});

export const Logo = () => {
  return (
    <Link href="/" data-testid="logo">
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image
          src="/logo.svg"
          alt="Logo"
          height={20}
          width={20}
          className="pb-1"
        />
        <p className={cn("text-lg font-bold")}>Tasker</p>
      </div>
    </Link>
  );
};
