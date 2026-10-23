import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TUTOR_NAME } from "@/config/tutorInfo";
import { Button } from "@/components/ui/Button/Button";

function Navbar() {
  return (
    <header className="w-full bg-background">
      <nav className="flex w-full items-center justify-between py-5 flex-wrap">
        {/* Brand */}
        <Link href="/" className="text-xl font-semibold text-heading">
          <span className=""> Learn Korean </span>

          <div className="text-primary text-xs uppercase">with {TUTOR_NAME}</div>
        </Link>

        {/* Navigation links */}
        <div className="flex gap-8 flex-wrap">
          <Link href="/" className="text-sm text-foreground hover:text-primary">
            About
          </Link>

          <Link href="#courses" className="text-sm text-foreground hover:text-primary">
            Courses
          </Link>

          <Link href="#about" className="text-sm text-foreground hover:text-primary">
            How it works
          </Link>
          <Link href="#about" className="text-sm text-foreground hover:text-primary">
            Reviews
          </Link>
          <Link href="#about" className="text-sm text-foreground hover:text-primary">
            FAQ
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <Button variant="secondary">Sign In</Button>

          <Link
            href="#courses"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover rounded-xl"
          >
            Get Started
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
