"use client";

import axios from "axios";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Ban,
  CheckCircle2,
  Filter,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  User,
  Users,
  XCircle,
} from "lucide-react";

import { toast } from "sonner";

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isBlocked?: boolean;
  isEmailVerified?: boolean;
  profileImage?: string;
  createdAt: string;
  orderCount?: number;
  totalSpent?: number;
  isCurrentAdmin?: boolean;
};

const filterOptions = [
  "All",
  "Active",
  "Blocked",
  "Admin",
  "User",
  "Verified",
  "Not Verified",
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);
};

export default function AdminUsersPage() {
  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [actionLoadingId, setActionLoadingId] =
    useState("");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);

      const res = await axios.get(
        "/api/admin/users",
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch users"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleBlock = async (
    user: AdminUser
  ) => {
    try {
      if (user.role === "admin") {
        toast.error(
          "Admin users cannot be blocked"
        );
        return;
      }

      if (user.isCurrentAdmin) {
        toast.error(
          "You cannot block your own account"
        );
        return;
      }

      setActionLoadingId(user._id);

      const res = await axios.put(
        `/api/admin/users/block/${user._id}`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message);

      setUsers((prev) =>
        prev.map((item) =>
          item._id === user._id
            ? {
                ...item,
                isBlocked:
                  !item.isBlocked,
              }
            : item
        )
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update user"
      );
    } finally {
      setActionLoadingId("");
    }
  };

  const handleDelete = async (
    user: AdminUser
  ) => {
    try {
      if (user.role === "admin") {
        toast.error(
          "Admin users cannot be deleted"
        );
        return;
      }

      if (user.isCurrentAdmin) {
        toast.error(
          "You cannot delete your own account"
        );
        return;
      }

      const confirmDelete =
        window.confirm(
          `Delete ${user.name}? This action cannot be undone. Users with orders should be blocked instead.`
        );

      if (!confirmDelete) return;

      setActionLoadingId(user._id);

      const res = await axios.delete(
        `/api/admin/users/delete/${user._id}`,
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message);

      setUsers((prev) =>
        prev.filter(
          (item) =>
            item._id !== user._id
        )
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    } finally {
      setActionLoadingId("");
    }
  };

  const filteredUsers = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name
          ?.toLowerCase()
          .includes(query) ||
        user.email
          ?.toLowerCase()
          .includes(query) ||
        user.role
          ?.toLowerCase()
          .includes(query);

      let matchesFilter = true;

      if (filter === "Active") {
        matchesFilter =
          !user.isBlocked;
      }

      if (filter === "Blocked") {
        matchesFilter =
          !!user.isBlocked;
      }

      if (filter === "Admin") {
        matchesFilter =
          user.role === "admin";
      }

      if (filter === "User") {
        matchesFilter =
          user.role === "user";
      }

      if (filter === "Verified") {
        matchesFilter =
          !!user.isEmailVerified;
      }

      if (filter === "Not Verified") {
        matchesFilter =
          !user.isEmailVerified;
      }

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [users, searchQuery, filter]);

  const stats = useMemo(() => {
    const totalUsers = users.length;

    const activeUsers =
      users.filter(
        (user) => !user.isBlocked
      ).length;

    const blockedUsers =
      users.filter(
        (user) => user.isBlocked
      ).length;

    const verifiedUsers =
      users.filter(
        (user) =>
          user.isEmailVerified
      ).length;

    const totalSpent =
      users.reduce(
        (sum, user) =>
          sum +
          (user.totalSpent || 0),
        0
      );

    return {
      totalUsers,
      activeUsers,
      blockedUsers,
      verifiedUsers,
      totalSpent,
    };
  }, [users]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto" />

          <h1 className="text-3xl font-black mt-6">
            Loading Users...
          </h1>

          <p className="text-gray-500 mt-2">
            Fetching latest customer data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-10 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
        <div>
          <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm font-semibold">
            Admin Panel
          </p>

          <h1 className="text-5xl md:text-6xl font-black mt-3">
            Users
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Manage customer accounts,
            verification status and access
            control.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={refreshing}
          className="h-14 px-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 font-bold hover:bg-cyan-500/20 transition flex items-center justify-center gap-3 disabled:opacity-60"
        >
          {refreshing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}

          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        <div className="rounded-[28px] border border-gray-800 bg-[#111827] p-6">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
            <Users className="w-7 h-7 text-cyan-400" />
          </div>

          <p className="text-gray-400 mt-6">
            Total Users
          </p>

          <h2 className="text-3xl font-black mt-2">
            {stats.totalUsers}
          </h2>
        </div>

        <div className="rounded-[28px] border border-gray-800 bg-[#111827] p-6">
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-green-400" />
          </div>

          <p className="text-gray-400 mt-6">
            Active
          </p>

          <h2 className="text-3xl font-black mt-2">
            {stats.activeUsers}
          </h2>
        </div>

        <div className="rounded-[28px] border border-gray-800 bg-[#111827] p-6">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <Ban className="w-7 h-7 text-red-400" />
          </div>

          <p className="text-gray-400 mt-6">
            Blocked
          </p>

          <h2 className="text-3xl font-black mt-2">
            {stats.blockedUsers}
          </h2>
        </div>

        <div className="rounded-[28px] border border-gray-800 bg-[#111827] p-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-blue-400" />
          </div>

          <p className="text-gray-400 mt-6">
            Verified
          </p>

          <h2 className="text-3xl font-black mt-2">
            {stats.verifiedUsers}
          </h2>
        </div>

        <div className="rounded-[28px] border border-gray-800 bg-[#111827] p-6">
          <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
            <ShoppingBag className="w-7 h-7 text-yellow-300" />
          </div>

          <p className="text-gray-400 mt-6">
            Total Spent
          </p>

          <h2 className="text-2xl font-black mt-2">
            {formatPrice(
              stats.totalSpent
            )}
          </h2>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="rounded-[28px] border border-gray-800 bg-[#111827] p-5 mb-8">
        <div className="grid lg:grid-cols-[1fr_260px] gap-4">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

            <input
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              placeholder="Search by name, email or role..."
              className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 pl-14 pr-5 outline-none focus:border-cyan-500 transition text-white"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value
                )
              }
              className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 pl-14 pr-5 outline-none focus:border-cyan-500 transition text-white appearance-none"
            >
              {filterOptions.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                    className="bg-[#0B1120]"
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {/* EMPTY */}
      {filteredUsers.length === 0 && (
        <div className="rounded-[32px] border border-gray-800 bg-[#111827] p-12 text-center">
          <XCircle className="w-14 h-14 text-gray-600 mx-auto" />

          <h2 className="text-3xl font-black mt-5">
            No users found
          </h2>

          <p className="text-gray-500 mt-3">
            Try changing search or filter
            options.
          </p>
        </div>
      )}

      {/* TABLE */}
      {filteredUsers.length > 0 && (
        <div className="rounded-[40px] border border-gray-800 bg-[#111827] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-[#0B1120] border-b border-gray-800">
                <tr>
                  <th className="text-left p-6">
                    User
                  </th>

                  <th className="text-left p-6">
                    Email
                  </th>

                  <th className="text-left p-6">
                    Role
                  </th>

                  <th className="text-left p-6">
                    Status
                  </th>

                  <th className="text-left p-6">
                    Email
                  </th>

                  <th className="text-left p-6">
                    Orders
                  </th>

                  <th className="text-left p-6">
                    Spent
                  </th>

                  <th className="text-right p-6">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map(
                  (user) => {
                    const isActionDisabled =
                      actionLoadingId ===
                        user._id ||
                      user.role ===
                        "admin" ||
                      user.isCurrentAdmin;

                    return (
                      <tr
                        key={user._id}
                        className="border-b border-gray-800 hover:bg-white/5 transition"
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center overflow-hidden">
                              {user.profileImage ? (
                                <img
                                  src={
                                    user.profileImage
                                  }
                                  alt={
                                    user.name
                                  }
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-5 h-5 text-cyan-400" />
                              )}
                            </div>

                            <div>
                              <p className="font-bold">
                                {
                                  user.name
                                }
                              </p>

                              <p className="text-sm text-gray-500">
                                Joined{" "}
                                {new Date(
                                  user.createdAt
                                ).toLocaleDateString(
                                  "en-IN"
                                )}
                              </p>

                              {user.isCurrentAdmin && (
                                <p className="text-xs text-cyan-400 mt-1">
                                  Current
                                  Admin
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-6 text-gray-300">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            {
                              user.email
                            }
                          </div>
                        </td>

                        <td className="p-6">
                          <span
                            className={`px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 ${
                              user.role ===
                              "admin"
                                ? "bg-purple-500/10 text-purple-300"
                                : "bg-cyan-500/10 text-cyan-400"
                            }`}
                          >
                            {user.role ===
                            "admin" ? (
                              <Shield className="w-4 h-4" />
                            ) : (
                              <User className="w-4 h-4" />
                            )}

                            {
                              user.role
                            }
                          </span>
                        </td>

                        <td className="p-6">
                          {user.isBlocked ? (
                            <span className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-semibold">
                              Blocked
                            </span>
                          ) : (
                            <span className="px-4 py-2 rounded-xl bg-green-500/10 text-green-400 text-sm font-semibold">
                              Active
                            </span>
                          )}
                        </td>

                        <td className="p-6">
                          {user.isEmailVerified ? (
                            <span className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-sm font-semibold">
                              Verified
                            </span>
                          ) : (
                            <span className="px-4 py-2 rounded-xl bg-yellow-500/10 text-yellow-300 text-sm font-semibold">
                              Not Verified
                            </span>
                          )}
                        </td>

                        <td className="p-6 font-bold">
                          {user.orderCount ||
                            0}
                        </td>

                        <td className="p-6 font-bold">
                          {formatPrice(
                            user.totalSpent ||
                              0
                          )}
                        </td>

                        <td className="p-6">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() =>
                                handleBlock(
                                  user
                                )
                              }
                              disabled={
                                isActionDisabled
                              }
                              title={
                                user.isBlocked
                                  ? "Unblock user"
                                  : "Block user"
                              }
                              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed ${
                                user.isBlocked
                                  ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                  : "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                              }`}
                            >
                              {actionLoadingId ===
                              user._id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : user.isBlocked ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                <Ban className="w-5 h-5" />
                              )}
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  user
                                )
                              }
                              disabled={
                                isActionDisabled
                              }
                              title="Delete user"
                              className="w-11 h-11 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {actionLoadingId ===
                              user._id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}