"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Modal from "@/components/modal";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function AdminPlayers() {
  const t = useTranslations("Admin");
  const [players, setPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    const res = await fetch("/api/admin/players");
    if (res.ok) {
      const data = await res.json();
      setPlayers(data);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setActionLoading(true);

    const res = await fetch("/api/admin/players", {
      method: "DELETE",
      body: JSON.stringify({ name: deleteTarget }),
    });

    if (res.ok) {
      setPlayers(players.filter((p) => p !== deleteTarget));
      setMessage(t("playerDeleted"));
    } else {
      setMessage(t("error"));
    }

    setDeleteTarget(null);
    setActionLoading(false);
    setTimeout(() => setMessage(""), 3000);
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
          {message}
        </div>
      )}

      {players.length === 0 ? (
        <p className="text-gray-500">{t("noPlayers")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 font-semibold">#</th>
                <th className="text-left p-3 font-semibold">
                  {t("players")}
                </th>
                <th className="text-right p-3 font-semibold">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={player} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-500">{index + 1}</td>
                  <td className="p-3">{player}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setDeleteTarget(player)}
                      className="bg-red-400 p-1 rounded-full hover:bg-red-500"
                      title={t("deletePlayer")}
                    >
                      <TrashIcon className="h-5 w-5 text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={deleteTarget !== null}
        closeModal={() => setDeleteTarget(null)}
      >
        <div className="space-y-4">
          <p className="text-lg font-semibold">{t("deletePlayer")}</p>
          <p>
            {t("deletePlayerConfirm", { name: deleteTarget })}
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              {t("deletePlayer")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center gap-2">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  );
}
