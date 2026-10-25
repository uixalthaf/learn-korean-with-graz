"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { TUTOR_NAME } from "@/config/tutorInfo";
import { loginUser } from "@/features/auth/login/api/login.api";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const resetForm = () => {
    setEmail("");
    setPassword("");
  };
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // TODO: Connect to the login API.
    console.log({ email, password });
    const loginPayload = { email, password };
    try {
      const reponse = await loginUser(loginPayload);
      await Swal.fire({
        title: "Welcome to Graz!",
        text: "Logged in Successfully",
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#426B45",
      });
      resetForm();
      reponse.user.role == "TUTOR"
        ? router.push("/dashboard/tutor")
        : router.push("/dashboard/student");
    } catch (error) {
      await Swal.fire({
        title: "Invalid credentials",
        text: "Please retry",
        icon: "error",
        confirmButtonText: "Okay",
        confirmButtonColor: "#426B45",
      });
      console.log(error);
    } finally {
      setIsLoading(true);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium text-primary">안녕하세요 · Welcome back</p>

        <h1 className="font-heading text-3xl font-semibold">Welcome back</h1>

        <p className="mt-3 text-sm text-muted">
          Sign in to continue learning Korean with {TUTOR_NAME}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="block font-medium text-heading">
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="password" className="font-medium text-heading">
              Password
            </label>

            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-muted">
        New to the platform?{" "}
        <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>

      <p className="mt-8 text-center font-heading text-sm italic text-muted">
        One step at a time, one word at a time.
      </p>
    </div>
  );
}
