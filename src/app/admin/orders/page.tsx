"use client";

import axios from "axios";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Download,
  Eye,
  Filter,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  User,
  XCircle,
} from "lucide-react";

import { toast } from "sonner";

type OrderItem = {
  _id: string;
  product?: {
    _id: string;
    title: string;
    slug?: string;
    images?: string[];
    brand?: string;
    category?: string;
    stock?: number;
  };
  title: string;
  image: string;
  price: number;
  quantity: number;
};

type ShippingAddress = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

type OrderUser = {
  _id: string;
  name: string;
  email: string;
  role?: string;
  isEmailVerified?: boolean;
};

type Order = {
  _id: string;
  user?: OrderUser;
  orderItems: OrderItem[];
  shippingAddress?: ShippingAddress;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus:
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled";
  totalPrice: number;
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
};

const orderStatuses = [
  "All",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);
};

const getStatusClasses = (status: string) => {
  if (status === "Processing") {
    return "bg-yellow-500/10 text-yellow-300 border-yellow-500/20";
  }

  if (status === "Shipped") {
    return "bg-blue-500/10 text-blue-300 border-blue-500/20";
  }

  if (status === "Delivered") {
    return "bg-green-500/10 text-green-300 border-green-500/20";
  }

  if (status === "Cancelled") {
    return "bg-red-500/10 text-red-300 border-red-500/20";
  }

  if (status === "Paid") {
    return "bg-green-500/10 text-green-300 border-green-500/20";
  }

  if (status === "Pending") {
    return "bg-yellow-500/10 text-yellow-300 border-yellow-500/20";
  }

  if (status === "Failed") {
    return "bg-red-500/10 text-red-300 border-red-500/20";
  }

  return "bg-gray-500/10 text-gray-300 border-gray-500/20";
};

export default function AdminOrdersPage() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState("");

  const [expandedOrderId, setExpandedOrderId] =
    useState("");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);

      const res = await axios.get(
        "/api/admin/orders",
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    orderStatus: string
  ) => {
    try {
      setUpdatingId(orderId);

      const res = await axios.patch(
        `/api/admin/orders/update-status/${orderId}`,
        {
          orderStatus,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? res.data.order
              : order
          )
        );

        toast.success(
          "Order status updated successfully"
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingId("");
    }
  };

  const filteredOrders = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "All" ||
        order.orderStatus === statusFilter;

      const matchesSearch =
        !query ||
        order._id
          .toLowerCase()
          .includes(query) ||
        order.user?.name
          ?.toLowerCase()
          .includes(query) ||
        order.user?.email
          ?.toLowerCase()
          .includes(query) ||
        order.shippingAddress?.fullName
          ?.toLowerCase()
          .includes(query) ||
        order.orderItems.some((item) =>
          item.title
            .toLowerCase()
            .includes(query)
        );

      return (
        matchesStatus && matchesSearch
      );
    });
  }, [
    orders,
    searchQuery,
    statusFilter,
  ]);

  const stats = useMemo(() => {
    const totalRevenue =
      orders.reduce(
        (sum, order) =>
          order.paymentStatus === "Paid"
            ? sum + order.totalPrice
            : sum,
        0
      );

    const totalOrders = orders.length;

    const processing =
      orders.filter(
        (order) =>
          order.orderStatus ===
          "Processing"
      ).length;

    const delivered =
      orders.filter(
        (order) =>
          order.orderStatus ===
          "Delivered"
      ).length;

    return {
      totalRevenue,
      totalOrders,
      processing,
      delivered,
    };
  }, [orders]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto" />

          <h1 className="text-3xl font-black mt-6">
            Loading Orders...
          </h1>

          <p className="text-gray-500 mt-2">
            Fetching latest admin order data
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
            Orders
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Manage customer orders, invoices,
            payments and delivery status.
          </p>
        </div>

        <button
          onClick={fetchOrders}
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
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="rounded-[28px] border border-gray-800 bg-[#111827] p-6">
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
            <CreditCard className="w-7 h-7 text-green-400" />
          </div>

          <p className="text-gray-400 mt-6">
            Paid Revenue
          </p>

          <h2 className="text-3xl font-black mt-2">
            {formatPrice(
              stats.totalRevenue
            )}
          </h2>
        </div>

        <div className="rounded-[28px] border border-gray-800 bg-[#111827] p-6">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
            <Package className="w-7 h-7 text-cyan-400" />
          </div>

          <p className="text-gray-400 mt-6">
            Total Orders
          </p>

          <h2 className="text-3xl font-black mt-2">
            {stats.totalOrders}
          </h2>
        </div>

        <div className="rounded-[28px] border border-gray-800 bg-[#111827] p-6">
          <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
            <ShoppingBag className="w-7 h-7 text-yellow-300" />
          </div>

          <p className="text-gray-400 mt-6">
            Processing
          </p>

          <h2 className="text-3xl font-black mt-2">
            {stats.processing}
          </h2>
        </div>

        <div className="rounded-[28px] border border-gray-800 bg-[#111827] p-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <Truck className="w-7 h-7 text-blue-300" />
          </div>

          <p className="text-gray-400 mt-6">
            Delivered
          </p>

          <h2 className="text-3xl font-black mt-2">
            {stats.delivered}
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
              placeholder="Search by order id, customer, email or product..."
              className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 pl-14 pr-5 outline-none focus:border-cyan-500 transition text-white"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 pl-14 pr-5 outline-none focus:border-cyan-500 transition text-white appearance-none"
            >
              {orderStatuses.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                    className="bg-[#0B1120]"
                  >
                    {status}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {/* EMPTY */}
      {filteredOrders.length === 0 && (
        <div className="rounded-[32px] border border-gray-800 bg-[#111827] p-12 text-center">
          <XCircle className="w-14 h-14 text-gray-600 mx-auto" />

          <h2 className="text-3xl font-black mt-5">
            No orders found
          </h2>

          <p className="text-gray-500 mt-3">
            Try changing search or filter options.
          </p>
        </div>
      )}

      {/* ORDERS */}
      <div className="grid gap-6">
        {filteredOrders.map((order) => {
          const expanded =
            expandedOrderId === order._id;

          return (
            <div
              key={order._id}
              className="rounded-[32px] border border-gray-800 bg-[#111827] overflow-hidden"
            >
              {/* MAIN CARD */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col 2xl:flex-row 2xl:items-start 2xl:justify-between gap-8">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                      <Package className="w-8 h-8 text-cyan-400" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl md:text-3xl font-black">
                          Order #
                          {order._id.slice(-6)}
                        </h2>

                        <span
                          className={`px-4 py-2 rounded-full border text-sm font-bold ${getStatusClasses(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>

                        <span
                          className={`px-4 py-2 rounded-full border text-sm font-bold ${getStatusClasses(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 text-gray-400">
                        <span className="inline-flex items-center gap-2">
                          <User className="w-4 h-4 text-cyan-400" />
                          {order.user?.name ||
                            order
                              .shippingAddress
                              ?.fullName ||
                            "Unknown User"}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <Mail className="w-4 h-4 text-cyan-400" />
                          {order.user?.email ||
                            "No email"}
                        </span>

                        {order.shippingAddress
                          ?.phone && (
                          <span className="inline-flex items-center gap-2">
                            <Phone className="w-4 h-4 text-cyan-400" />
                            {
                              order
                                .shippingAddress
                                .phone
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="2xl:text-right">
                    <p className="text-gray-400">
                      Total Amount
                    </p>

                    <h3 className="text-4xl font-black mt-1">
                      {formatPrice(
                        order.totalPrice
                      )}
                    </h3>

                    <p className="text-gray-500 mt-2">
                      {new Date(
                        order.createdAt
                      ).toLocaleString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* QUICK INFO */}
                <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-4 gap-5">
                  <div className="rounded-2xl bg-[#0B1120] border border-gray-800 p-5">
                    <p className="text-gray-400 text-sm">
                      Order Status
                    </p>

                    <select
                      value={
                        order.orderStatus
                      }
                      disabled={
                        updatingId ===
                          order._id ||
                        order.orderStatus ===
                          "Delivered"
                      }
                      onChange={(e) =>
                        updateOrderStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="mt-3 w-full h-12 rounded-xl bg-[#111827] border border-gray-700 px-4 outline-none focus:border-cyan-500 transition text-white disabled:opacity-60"
                    >
                      {orderStatuses
                        .filter(
                          (status) =>
                            status !== "All"
                        )
                        .map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="bg-[#0B1120]"
                          >
                            {status}
                          </option>
                        ))}
                    </select>

                    {updatingId ===
                      order._id && (
                      <p className="text-cyan-400 text-xs mt-2 flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Updating...
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-[#0B1120] border border-gray-800 p-5">
                    <p className="text-gray-400 text-sm">
                      Payment
                    </p>

                    <h3 className="text-xl font-bold mt-3">
                      {
                        order.paymentMethod
                      }
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      {
                        order.paymentStatus
                      }
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#0B1120] border border-gray-800 p-5">
                    <p className="text-gray-400 text-sm">
                      Products
                    </p>

                    <h3 className="text-xl font-bold mt-3">
                      {
                        order.orderItems
                          .length
                      }{" "}
                      item
                      {order.orderItems
                        .length > 1
                        ? "s"
                        : ""}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      Qty:{" "}
                      {order.orderItems.reduce(
                        (sum, item) =>
                          sum +
                          item.quantity,
                        0
                      )}
                    </p>
                  </div>

                  {/* <div className="rounded-2xl bg-[#0B1120] border border-gray-800 p-5">
                    <p className="text-gray-400 text-sm">
                      Invoice
                    </p>

                    <div className="mt-3 flex gap-3">
                      <a
                        href={`/api/orders/invoice/${order._id}`}
                        target="_blank"
                        className="h-11 px-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold hover:bg-cyan-500/20 transition flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </a>

                      <a
                        href={`/api/orders/invoice/${order._id}?download=true`}
                        className="h-11 px-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 font-bold hover:bg-blue-500/20 transition flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </a>
                    </div>
                  </div> */}
                </div>

                {/* ACTION */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      setExpandedOrderId(
                        expanded
                          ? ""
                          : order._id
                      )
                    }
                    className="h-12 px-5 rounded-2xl border border-gray-700 bg-[#0B1120] text-gray-300 font-bold hover:border-cyan-500/40 hover:text-cyan-300 transition flex items-center gap-2"
                  >
                    {expanded ? (
                      <>
                        <ChevronUp className="w-5 h-5" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-5 h-5" />
                        View Details
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* EXPANDED DETAILS */}
              {expanded && (
                <div className="border-t border-gray-800 bg-[#0B1120]/70 p-6 md:p-8">
                  <div className="grid xl:grid-cols-[1.3fr_0.7fr] gap-6">
                    {/* PRODUCTS */}
                    <div className="rounded-[28px] border border-gray-800 bg-[#111827] p-5">
                      <h3 className="text-2xl font-black flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 text-cyan-400" />
                        Ordered Products
                      </h3>

                      <div className="mt-5 space-y-4">
                        {order.orderItems.map(
                          (item) => (
                            <div
                              key={
                                item._id
                              }
                              className="rounded-2xl border border-gray-800 bg-[#0B1120] p-4 flex flex-col md:flex-row md:items-center gap-4"
                            >
                              <img
                                src={
                                  item.image ||
                                  item.product
                                    ?.images?.[0] ||
                                  "/next.svg"
                                }
                                alt={
                                  item.title
                                }
                                className="w-full md:w-24 h-24 object-cover rounded-2xl border border-gray-800 bg-white"
                              />

                              <div className="flex-1">
                                <h4 className="text-lg font-black">
                                  {
                                    item.title
                                  }
                                </h4>

                                <p className="text-gray-500 text-sm mt-1">
                                  {
                                    item
                                      .product
                                      ?.brand
                                  }{" "}
                                  •{" "}
                                  {
                                    item
                                      .product
                                      ?.category
                                  }
                                </p>

                                <p className="text-gray-400 text-sm mt-2">
                                  Quantity:{" "}
                                  <span className="text-white font-bold">
                                    {
                                      item.quantity
                                    }
                                  </span>
                                </p>
                              </div>

                              <div className="md:text-right">
                                <p className="text-gray-400 text-sm">
                                  Item Price
                                </p>

                                <h4 className="text-xl font-black">
                                  {formatPrice(
                                    item.price
                                  )}
                                </h4>

                                <p className="text-cyan-300 font-bold mt-1">
                                  {formatPrice(
                                    item.price *
                                      item.quantity
                                  )}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* CUSTOMER + ADDRESS */}
                    <div className="space-y-6">
                      <div className="rounded-[28px] border border-gray-800 bg-[#111827] p-5">
                        <h3 className="text-2xl font-black flex items-center gap-3">
                          <User className="w-6 h-6 text-cyan-400" />
                          Customer
                        </h3>

                        <div className="mt-5 space-y-4">
                          <div>
                            <p className="text-gray-500 text-sm">
                              Name
                            </p>

                            <p className="font-bold mt-1">
                              {order.user
                                ?.name ||
                                order
                                  .shippingAddress
                                  ?.fullName ||
                                "Unknown"}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-500 text-sm">
                              Email
                            </p>

                            <p className="font-bold mt-1 break-all">
                              {order.user
                                ?.email ||
                                "No email"}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-500 text-sm">
                              Phone
                            </p>

                            <p className="font-bold mt-1">
                              {order
                                .shippingAddress
                                ?.phone ||
                                "No phone"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[28px] border border-gray-800 bg-[#111827] p-5">
                        <h3 className="text-2xl font-black flex items-center gap-3">
                          <MapPin className="w-6 h-6 text-cyan-400" />
                          Shipping Address
                        </h3>

                        {order.shippingAddress ? (
                          <div className="mt-5 rounded-2xl border border-gray-800 bg-[#0B1120] p-5 text-gray-300 leading-8">
                            <p className="font-bold text-white">
                              {
                                order
                                  .shippingAddress
                                  .fullName
                              }
                            </p>

                            <p>
                              {
                                order
                                  .shippingAddress
                                  .address
                              }
                            </p>

                            <p>
                              {
                                order
                                  .shippingAddress
                                  .city
                              }{" "}
                              -{" "}
                              {
                                order
                                  .shippingAddress
                                  .pincode
                              }
                            </p>

                            <p>
                              Phone:{" "}
                              {
                                order
                                  .shippingAddress
                                  .phone
                              }
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-500 mt-5">
                            No shipping address found.
                          </p>
                        )}
                      </div>

                      <div className="rounded-[28px] border border-gray-800 bg-[#111827] p-5">
                        <h3 className="text-2xl font-black flex items-center gap-3">
                          <CreditCard className="w-6 h-6 text-cyan-400" />
                          Payment Details
                        </h3>

                        <div className="mt-5 space-y-4">
                          <div>
                            <p className="text-gray-500 text-sm">
                              Method
                            </p>

                            <p className="font-bold mt-1">
                              {
                                order.paymentMethod
                              }
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-500 text-sm">
                              Status
                            </p>

                            <p className="font-bold mt-1">
                              {
                                order.paymentStatus
                              }
                            </p>
                          </div>

                         

                          <div className="pt-4 border-t border-gray-800">
                            <p className="text-gray-500 text-sm">
                              Grand Total
                            </p>

                            <p className="text-3xl font-black mt-1">
                              {formatPrice(
                                order.totalPrice
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}