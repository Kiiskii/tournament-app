"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Modal from "@/components/modal";
import { TrashIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useUserContext } from "@/context/UserContext";

type User = {
  username: string;
  role: string;
};

export default function AdminUsers() {
  const t = useTranslations("Admin");
  const account = useUserContext();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [resetTarget, setResetTarget] = useState<string | null>(null);

  // Form states
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [resetPassword, setResetPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
    setLoading(false);
  }

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setActionLoading(true);

    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      body: JSON.stringify({ username: deleteTarget }),
    });

    if (res.ok) {
      setUsers(users.filter((u) => u.username !== deleteTarget));
      showMessage(t("userDeleted"));
    } else {
      const text = await res.text();
      showMessage(text || t("error"));
    }

    setDeleteTarget(null);
    setActionLoading(false);
  }

  async function handleCreate() {
    if (!newUsername || !newPassword || !newRole) {
      showMessage(t("fieldsRequired"));
      return;
    }

    setActionLoading(true);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      body: JSON.stringify({
        username: newUsername,
        password: newPassword,
        role: newRole,
      }),
    });

    if (res.ok) {
      setUsers([...users, { username: newUsername, role: newRole }].sort((a, b) =>
        a.username.localeCompare(b.username),
      ));
      showMessage(t("userCreated"));
      setShowCreateModal(false);
      setNewUsername("");
      setNewPassword("");
      setNewRole("user");
    } else {
      const text = await res.text();
      showMessage(text || t("error"));
    }

    setActionLoading(false);
  }

  async function handleRoleChange(username: string, currentRole: string) {
    const newRoleValue = currentRole === "admin" ? "user" : "admin";
    setActionLoading(true);

    const res = await fetch("/api/admin/users", {
      method: "PUT",
      body: JSON.stringify({ username, role: newRoleValue }),
    });

    if (res.ok) {
      setUsers(
        users.map((u) =>
          u.username === username ? { ...u, role: newRoleValue } : u,
        ),
      );
      showMessage(t("roleUpdated"));
    } else {
      showMessage(t("error"));
    }

    setActionLoading(false);
  }

  async function handleResetPassword() {
    if (!resetTarget || !resetPassword) {
      showMessage(t("fieldsRequired"));
      return;
    }

    setActionLoading(true);

    const res = await fetch("/api/admin/users/password", {
      method: "PUT",
      body: JSON.stringify({
        username: resetTarget,
        password: resetPassword,
      }),
    });

    if (res.ok) {
      showMessage(t("passwordReset"));
      setResetTarget(null);
      setResetPassword("");
    } else {
      showMessage(t("error"));
    }

    setActionLoading(false);
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

      <button
        onClick={() => setShowCreateModal(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
      >
        {t("createUser")}
      </button>

      {users.length === 0 ? (
        <p className="text-gray-500">{t("noUsers")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 font-semibold">
                  {t("username")}
                </th>
                <th className="text-left p-3 font-semibold">{t("role")}</th>
                <th className="text-right p-3 font-semibold">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.username} className="border-t hover:bg-gray-50">
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-end">
                      {user.username !== account.user?.name && (
                        <button
                          onClick={() => handleRoleChange(user.username, user.role)}
                          disabled={actionLoading}
                          className="bg-blue-400 px-3 py-1 rounded-md text-white text-sm hover:bg-blue-500 disabled:opacity-50"
                          title={t("changeRole")}
                        >
                          {t("changeRole")}
                        </button>
                      )}
                      <button
                        onClick={() => setResetTarget(user.username)}
                        className="bg-yellow-400 p-1 rounded-full hover:bg-yellow-500"
                        title={t("resetPassword")}
                      >
                        <KeyIcon className="h-5 w-5 text-white" />
                      </button>
                      {user.username !== account.user?.name && (
                        <button
                          onClick={() => setDeleteTarget(user.username)}
                          className="bg-red-400 p-1 rounded-full hover:bg-red-500"
                          title={t("deleteUser")}
                        >
                          <TrashIcon className="h-5 w-5 text-white" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete User Modal */}
      <Modal
        isOpen={deleteTarget !== null}
        closeModal={() => setDeleteTarget(null)}
      >
        <div className="space-y-4">
          <p className="text-lg font-semibold">{t("deleteUser")}</p>
          <p>{t("deleteUserConfirm", { name: deleteTarget })}</p>
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
              {t("deleteUser")}
            </button>
          </div>
        </div>
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        closeModal={() => setShowCreateModal(false)}
      >
        <div className="space-y-4">
          <p className="text-lg font-semibold">{t("createUser")}</p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder={t("username")}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              placeholder={t("password")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleCreate}
              disabled={actionLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {t("submit")}
            </button>
          </div>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={resetTarget !== null}
        closeModal={() => {
          setResetTarget(null);
          setResetPassword("");
        }}
      >
        <div className="space-y-4">
          <p className="text-lg font-semibold">
            {t("resetPassword")} - {resetTarget}
          </p>
          <input
            type="password"
            placeholder={t("newPassword")}
            value={resetPassword}
            onChange={(e) => setResetPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setResetTarget(null);
                setResetPassword("");
              }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleResetPassword}
              disabled={actionLoading}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50"
            >
              {t("resetPassword")}
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
