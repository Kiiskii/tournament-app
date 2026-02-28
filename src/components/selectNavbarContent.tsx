"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useUserContext } from "@/context/UserContext";

export default function SelectNavbarContent() {
  const t = useTranslations("Admin");
  const account = useUserContext();

  if (!account.user || account.user.role !== "admin") {
    return null;
  }

  return (
    <Link
      className="text-white hover:text-blue-900 text-base font-bold py-3 px-5"
      href="/admin"
    >
      {t("admin")}
    </Link>
  );
}
