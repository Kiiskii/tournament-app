"use client";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { userLogin } from "../database/userLogin";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { getSession } from "@/helpers/getsession";
import { removeCookie } from "@/helpers/removeCookie";
import { hasUsers } from "@/database/hasUsers";

export default function Login() {
  const account = useUserContext();
  const [loading, setLoading] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [checkingUsers, setCheckingUsers] = useState(true);
  const [error, setError] = useState("");
  const t = useTranslations("Login");
  const tSetup = useTranslations("Setup");
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const session = await getSession();
      if (session.success) {
        router.push("/select");
        return;
      }
      await removeCookie("token");

      const users = await hasUsers();
      if (users.success && !users.value) {
        setSetupMode(true);
      }
      setCheckingUsers(false);
    }
    init();
  }, [router]);

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    setError("");
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim();
    const password = formData.get("password")?.toString().trim();
    if (!name || !password) {
      setError(t("userorpasswordempty"));
      setLoading(false);
      return;
    }

    const status = await userLogin(name, password);

    if (!status.success) {
      console.log("Error: " + status.error);
      setLoading(false);
      setError(t("wronguserorpassword"));
      return;
    }

    account.setUser(status.value);
    router.push("/select");
  };

  const submitSetup = async (event: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    setError("");
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim();
    const password = formData.get("password")?.toString().trim();
    if (!name || !password) {
      setError(t("userorpasswordempty"));
      setLoading(false);
      return;
    }

    const res = await fetch("/api/setup", {
      method: "POST",
      body: JSON.stringify({ username: name, password }),
    });

    if (!res.ok) {
      const text = await res.text();
      setError(text || tSetup("error"));
      setLoading(false);
      return;
    }

    // Log in with the newly created account
    const status = await userLogin(name, password);
    if (!status.success) {
      setSetupMode(false);
      setLoading(false);
      return;
    }

    account.setUser(status.value);
    router.push("/select");
  };

  if (checkingUsers) {
    return null;
  }

  if (setupMode) {
    return (
      <form className="space-y-6" onSubmit={submitSetup}>
        <h2 className="text-center text-xl font-bold leading-9 tracking-tight text-gray-900">
          {tSetup("title")}
        </h2>
        <p className="text-sm text-gray-600 text-center">
          {tSetup("description")}
        </p>
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {t("name")}
          </label>
          <div className="mt-2">
            <input
              id="name"
              name="name"
              type="text"
              required
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              autoFocus
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {t("password")}
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <button
            disabled={loading}
            type="submit"
            className="disabled:bg-blue-300 bg-blue-500 w-full py-2 px-3 text-white rounded-md shadow-sm"
          >
            {tSetup("submit")}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className="space-y-6" onSubmit={submitForm}>
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {t("name")}
        </label>
        <div className="mt-2">
          <input
            id="name"
            name="name"
            type="text"
            required
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
            autoFocus
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {t("password")}
          </label>
        </div>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            required
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <button
          disabled={loading}
          type="submit"
          className="disabled:bg-blue-300 bg-blue-500 w-full py-2 px-3 text-white rounded-md shadow-sm"
        >
          {t("submit")}
        </button>
      </div>
    </form>
  );
}
