"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SlipModal from "../../../components/payment/SlipModal";
import PaymentFilters from "../../../components/payment/PaymentFilters";
import { API_URL } from "@/src/lib/config";
import {
  CheckCircle2,
  Clock3,
  Eye,
  Search,
  XCircle,
} from "lucide-react";

const getStatus = (status) => {
  switch (status) {
    case "WAITING_VERIFY":
      return {
        text: "รอตรวจสอบ",
        className: "bg-blue-100 text-blue-700",
      };
    case "PAID":
      return {
        text: "ชำระแล้ว",
        className: "bg-green-100 text-green-700",
      };
    case "REJECTED":
      return {
        text: "ถูกปฏิเสธ",
        className: "bg-red-100 text-red-700",
      };
    default:
      return {
        text: "-",
        className: "bg-gray-100 text-gray-700",
      };
  }
};

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [monthFilter, setMonthFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);


  const [selectedSlip, setSelectedSlip] = useState(null);

  const handleApprove = async (paymentId) => {
    try {
      const confirm = await Swal.fire({
        title: "อนุมัติการชำระเงิน",
        text: "คุณแน่ใจว่าต้องการอนุมัติการชำระเงินนี้?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "อนุมัติ",
        cancelButtonText: "ยกเลิก",
      });

      if (!confirm.isConfirmed) return;

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/payment/approve/${paymentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "อนุมัติการชำระเงินสำเร็จ",
        });
        fetchPayments();
      }
    } catch (error) {
      console.error("Error approving payment:", error);
      Swal.fire({
        icon: "error",
        title: "ผิดพลาด",
        text: error.response?.data?.message || "เกิดข้อผิดพลาด",
      });
    }
  };

  const handleReject = async (paymentId) => {
    try {
      const { value: rejectReason } = await Swal.fire({
        title: "ปฏิเสธการชำระเงิน",
        input: "textarea",
        inputLabel: "เหตุผลการปฏิเสธ",
        inputPlaceholder: "กรุณาระบุเหตุผล...",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "ปฏิเสธ",
        cancelButtonText: "ยกเลิก",
        inputValidator: (value) => {
          if (!value) {
            return "กรุณาระบุเหตุผลการปฏิเสธ";
          }
        },
      });

      if (!rejectReason) return;

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/payment/reject/${paymentId}`,
        { rejectReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "ปฏิเสธการชำระเงินสำเร็จ",
        });
        fetchPayments();
      }
    } catch (error) {
      console.error("Error rejecting payment:", error);
      Swal.fire({
        icon: "error",
        title: "ผิดพลาด",
        text: error.response?.data?.message || "เกิดข้อผิดพลาด",
      });
    }
  };

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/payment/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPayments(response.data.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);


  const getPaymentStats = () => {
    const waiting = payments.filter((p) => p.bill?.status === "WAITING_VERIFY").length;
    const paid = payments.filter((p) => p.bill?.status === "PAID").length;
    const rejected = payments.filter((p) => p.bill?.status === "PENDING" && p.status === "REJECTED").length;
    return { waiting, paid, rejected };
  };

  const stats = getPaymentStats();

  const filteredPayments =
    payments.filter((payment) => {

      // search
      const fullName =
        `${payment.bill?.room?.tenant?.user?.first_name || ""}
      ${payment.bill?.room?.tenant?.user?.last_name || ""}`
          .toLowerCase();

      const roomNumber =
        payment.bill?.room?.roomNumber
          ?.toString()
          .toLowerCase();

      const matchesSearch =

        fullName.includes(
          searchTerm.toLowerCase()
        ) ||

        roomNumber.includes(
          searchTerm.toLowerCase()
        );

      // status
      const matchesStatus =

        statusFilter === "ALL" ||

        payment.bill?.status ===
        statusFilter;

      // month
      const paymentMonth =
        payment.paidAt
          ? new Date(
            payment.paidAt
          ).getMonth() + 1
          : null;

      const matchesMonth =

        monthFilter === "ALL" ||

        paymentMonth ===
        Number(monthFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMonth
      );
    });

  const totalPages =
    Math.ceil(
      filteredPayments.length /
      itemsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const paginatedPayments =
    filteredPayments.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  return (

    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-4xl font-black text-gray-900">

            จัดการการชำระเงิน

          </h1>

          <p className="text-gray-500 mt-2">

            ตรวจสอบและอนุมัติการชำระเงินของผู้เช่า

          </p>

        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* Waiting */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">รอตรวจสอบ</p>
              <h2 className="text-3xl font-black text-blue-700 mt-2">
                {stats.waiting}
              </h2>
              <p className="text-sm text-gray-500 mt-1">รายการ</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Clock3 size={32} />
            </div>
          </div>
        </div>
        {/* Paid */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">ชำระแล้ว</p>
              <h2 className="text-3xl font-black text-green-700 mt-2">
                {stats.paid}
              </h2>
              <p className="text-sm text-gray-500 mt-1">รายการ</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">ถูกปฏิเสธ</p>
              <h2 className="text-3xl font-black text-red-700 mt-2">
                {stats.rejected}
              </h2>
              <p className="text-sm text-gray-500 mt-1">รายการ</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
              <XCircle size={32} />
            </div>
          </div>
        </div>

      </div>

      <PaymentFilters

        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}

        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}

        monthFilter={monthFilter}
        setMonthFilter={setMonthFilter}

        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}

        setCurrentPage={setCurrentPage}

      />

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-green-600 to-lime-600 border-b border-gray-100">
              <tr className="text-left">
                <th className="px-6 py-4 text-sm font-bold text-white">
                  ผู้เช่า
                </th>
                <th className="px-6 py-4 text-sm font-bold text-white">
                  ห้อง
                </th>
                <th className="px-6 py-4 text-sm font-bold text-white">
                  จำนวนเงิน
                </th>
                <th className="px-6 py-4 text-sm font-bold text-white">
                  วันที่ชำระ
                </th>
                <th className="px-6 py-4 text-sm font-bold text-white">
                  สถานะ
                </th>
                <th className="px-6 py-4 text-sm font-bold text-white">
                  สลิป
                </th>
                <th className="px-6 py-4 text-sm font-bold text-white text-center ">
                  จัดการข้อมูล
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    กำลังโหลด...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    ไม่มีข้อมูลการชำระเงิน
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment) => {
                  const status = getStatus(payment.bill?.status);
                  return (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-5">
                        <div className="font-bold text-gray-900">
                          {payment.bill?.room?.tenant?.user?.prefix}{payment.bill?.room?.tenant?.user?.first_name} {payment.bill?.room?.tenant?.user?.last_name || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-gray-700">
                        {payment.bill?.room?.roomNumber || "N/A"}
                      </td>
                      <td className="px-6 py-5 font-bold text-gray-900">
                        ฿{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-5 text-gray-700">
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString("th-TH")
                          : "-"}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-2 rounded-2xl text-sm font-bold ${status.className}`}
                        >
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="">
                          <button
                            onClick={() =>
                              setSelectedSlip(
                                `${API_URL}${payment.slipImage}`
                              )
                            }
                            className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-200 transition"
                          >
                            <Eye size={20} />
                          </button>
                        </div>
                      </td>
                      <td>
                        {payment.bill?.status === "WAITING_VERIFY" && (
                          <>
                            <button
                              onClick={() => handleApprove(payment.id)}
                              className="px-4 py-2 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 transition"
                            >
                              อนุมัติ
                            </button>
                            <button
                              onClick={() => handleReject(payment.id)}
                              className="px-4 py-2 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition"
                            >
                              ปฏิเสธ
                            </button>
                          </>
                        )}
                        {payment.bill?.status === "PAID" && (
                          <span className="px-4 py-2 text-sm text-center text-green-700 font-bold">
                            ✓ อนุมัติแล้ว
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-6 py-5 border-t border-gray-100">

            <p className="text-sm text-gray-500">

              แสดง
              {" "}
              {startIndex + 1}
              -
              {
                Math.min(
                  startIndex +
                  itemsPerPage,
                  filteredPayments.length
                )
              }
              {" "}
              จาก
              {" "}
              {filteredPayments.length}
              {" "}
              รายการ

            </p>

            <div className="flex items-center gap-2">

              {/* Prev */}
              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
                className="px-4 py-2 rounded-2xl border border-gray-200 disabled:opacity-50"
              >

                ก่อนหน้า

              </button>

              {/* Page */}
              <div className="px-4 py-2 rounded-2xl bg-blue-100 text-blue-700 font-bold">

                {currentPage}

              </div>

              {/* Next */}
              <button
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
                className="px-4 py-2 rounded-2xl border border-gray-200 disabled:opacity-50"
              >

                ถัดไป

              </button>

            </div>

          </div>
        </div>
      </div>
      <SlipModal
        selectedSlip={selectedSlip}
        setSelectedSlip={setSelectedSlip}
      />

    </div>
  );
};

export default PaymentsPage;