"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TUTOR_NAME } from "@/config/tutorInfo";
import { Button } from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";

function Navbar() {
  const navigate = useRouter();
  const goToSignInPage = () => {
    navigate.push("/auth/login");
  };
  const goToSignUpPage = () => {
    navigate.push("/auth/signup");
  };
  return (
    <header className="w-full bg-background">
      <nav className="landing-navbar flex w-full items-center justify-between gap-4 py-4">
        {/* Brand */}
        <Link href="/home" className="text-xl font-semibold text-heading">
          <span className=""> Learn Korean </span>

          <div className="text-primary text-xs uppercase">with {TUTOR_NAME}</div>
        </Link>

        {/* Navigation links */}
        <div className="landing-nav-links flex gap-5 lg:gap-8">
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
        <div className="landing-nav-actions flex items-center gap-3 sm:gap-5">
          <Button variant="secondary" onClick={goToSignInPage}>
            Sign In
          </Button>

          <Button variant="primary" onClick={goToSignUpPage}>
            Get Started
            <ArrowUpRight size={16} />
          </Button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
