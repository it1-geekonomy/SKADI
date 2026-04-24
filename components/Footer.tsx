import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(245,240,232,0.06)] bg-obsidian">
      <div className="max-w-[1120px] mx-auto px-6 md:px-14 py-7 flex flex-col md:flex-row justify-between items-center gap-3 flex-wrap">
      <Link
        href="#"
        className="font-bebas text-[20px] text-[rgba(245,240,232,0.25)] no-underline tracking-[0.1em]"
      >
        SKADI
      </Link>
      <p className="text-[12px] text-[rgba(245,240,232,0.2)] font-light">
        © 2025 Skadi. All rights reserved.
      </p>
      <p className="text-[12px] text-[rgba(245,240,232,0.2)] font-light">
        hello@theskadi.com
      </p>
      </div>
    </footer>
  );
}
