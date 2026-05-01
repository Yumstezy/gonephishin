import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { InlineSvg } from "@/components/marketing/inline-svg";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <>
      <header className="app-topbar">
        <div className="inner">
          <Link href="/dashboard" className="brand">
            <span className="mark">
              <InlineSvg src="/fish.svg" />
            </span>
            <span>Gone Phishin&apos;</span>
          </Link>
          <nav>
            <Link href="/dashboard">Overview</Link>
            <Link href="/settings">Settings</Link>
            <Link href="/">Home</Link>
          </nav>
          <div className="spacer" />
          <UserButton
            appearance={{
              variables: { colorPrimary: "#38bdf8" },
            }}
          />
        </div>
      </header>
      <main className="app-main">{children}</main>
    </>
  );
}
