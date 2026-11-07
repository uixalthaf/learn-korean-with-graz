import Link from "next/link";
import { Card } from "@/components/ui/Card/Card";

const PageNotFound = () => {
  return (
    <Card className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-3xl font-bold">404</h1>

        <h2 className="text-xl font-semibold">Page Not Found</h2>

        <p className="text-center text-sm text-muted-foreground">
          The page you are looking for doesn't exist.
        </p>

        <div className="mt-4 flex gap-3">
          <Link
            href="/home"
            className="rounded-lg bg-emerald-800 px-5 py-2 text-sm text-white hover:bg-emerald-900"
          >
            Go Home
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PageNotFound;
