"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import AdminPlayers from "@/components/adminPlayers";
import AdminUsers from "@/components/adminUsers";

type Tab = "players" | "users";

export default function AdminPage() {
  const t = useTranslations("Admin");
  const [activeTab, setActiveTab] = useState<Tab>("players");

  return (
    <section className="container mx-auto mt-10 p-4 flex flex-col items-center gap-6">
      <div className="border border-gray-900 max-w-2xl p-6 rounded-md shadow-md w-full">
        <h1 className="font-bold text-xl mb-4">{t("title")}</h1>

        <div className="flex border-b border-gray-300 mb-4">
          <button
            onClick={() => setActiveTab("players")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "players"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("players")}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "users"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("users")}
          </button>
        </div>

        {activeTab === "players" ? <AdminPlayers /> : <AdminUsers />}
      </div>
    </section>
  );
}
