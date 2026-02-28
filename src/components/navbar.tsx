"use client";

import { ReactNode } from "react";
import "../../node_modules/flag-icons/css/flag-icons.min.css";
import Languages from "./languages";
import { useTranslations } from "next-intl";
import { logout } from "@/helpers/logout";
import { useUserContext } from "@/context/UserContext";

interface NavbarProps {
  children?: ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  const t = useTranslations("Logout");
  const account = useUserContext();

  return (
    <nav className="p-3 bg-blue-500 flex flex-row justify-between items-center mb-5">
      <Languages />
      <div className="flex flex-col sm:flex-row items-center">
        {children}
        <button
          onClick={async () => {
            account.setUser(null);
            await logout();
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 border-2 w-full md:w-36 border-white rounded-full m-1 relative justify-center"
        >
          {t("logout")}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
