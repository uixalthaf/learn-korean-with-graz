import Link from "next/link";
import { Card } from "@/components/ui/Card/Card";

type ForbiddenAccessProps = {
  dashboardHref: string;
};

const ForbiddenAccess = ({ dashboardHref }: ForbiddenAccessProps) => {
  return (
    <Card className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-3xl font-bold">403</h1>

        <h2 className="text-xl font-semibold">Access Forbidden</h2>

        <p className="text-center text-sm text-muted">
          You don't have permission to access this page.
        </p>

        <div className="mt-4 flex gap-3">
          <Link
            href={dashboardHref}
            className="rounded-lg bg-emerald-800 px-5 py-2 text-sm text-white transition-colors hover:bg-emerald-900"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/home"
            className="rounded-lg border border-stone-300 px-5 py-2 text-sm transition-colors hover:bg-stone-100"
          >
            Go Home
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ForbiddenAccess;
