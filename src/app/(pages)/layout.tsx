import MobileNavbar from "@/components/layouts/mobile-navbar";
import SiteHeader from "@/components/layouts/site-header";
import { getUserEmail } from "@/lib/utils";
import { db } from "@/server/db";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface PagesLayoutProps {
  children: React.ReactNode;
}

export default async function PagesLayout({ children }: PagesLayoutProps) {
  const user = await currentUser();

  if (!user) redirect("/login");

  const dbUser = await db.user.findUnique({
    where: {
      id: user?.id,
      email: getUserEmail(user),
    },
  });

  if (!dbUser) redirect("/account?origin=/");

  return (
    <>
      <SiteHeader />
      <main className="container max-w-[620px] px-4 sm:px-6">{children}</main>
      <MobileNavbar />
    </>
  );
}
