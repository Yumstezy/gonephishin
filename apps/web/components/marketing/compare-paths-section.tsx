import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ComparePathsSection() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-2 text-center text-4xl font-semibold">
          Two ways to use Gone Phishin&apos;
        </h2>
        <p className="mb-12 text-center text-muted-foreground">
          Whichever side you&apos;re on, the protection is the same.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>For yourself</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Sign in directly, see your own dashboard, no one else needs
                to be involved.
              </p>
              <Button asChild className="w-full">
                <Link href="/sign-up">Sign up — it&apos;s free</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>For a family member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create your account, generate a 6-digit code, read it to them
                over the phone. They type it once. You see what dangerous
                links they encounter — without ever reading their email.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-up">Set up a family circle</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
