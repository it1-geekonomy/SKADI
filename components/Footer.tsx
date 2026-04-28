import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
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
        © {currentYear} Skadi. All rights reserved.
      </p>
      <a href="mailto:connect@geekonomy.in" className="text-[12px] text-[rgba(245,240,232,0.2)] font-light no-underline">
        connect@geekonomy.in
      </a>
      </div>
    </footer>
  );
}
