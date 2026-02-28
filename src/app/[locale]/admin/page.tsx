import { getSession } from "@/helpers/getsession";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import AdminPage from "@/components/adminPage";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const session = await getSession();
  if (!session.success) {
    redirect("/");
  }

  if (session.value.role !== "admin") {
    redirect("/select");
  }

  const t = await getTranslations({ locale, namespace: "Admin" });

  return (
    <>
      <Navbar>
        <Link
          className="text-white hover:text-blue-900 text-base font-bold py-3 px-5"
          href="/select"
        >
          {t("tournaments")}
        </Link>
      </Navbar>
      <AdminPage />
    </>
  );
}
