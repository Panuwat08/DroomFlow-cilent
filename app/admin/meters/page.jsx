"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ModelMeters from "../../../components/meters/modelMeters";

import {
  Search,
  Plus,
  Trash2,
  Droplets,
  Zap,
  Calendar,
  House,
  FileText,
} from "lucide-react";

import { API_URL } from "@/src/lib/config";

const MetersPage = () => {

  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [openModel, setOpenModel] = useState(false);
  const [editData, setEditData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const getMeters = async () => {

    try {

      const { data } =
        await axios.get(
          `${API_URL}/meter/all`,
          {
            headers: {
              Authorization:
                `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

      setMeters(data.data);

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text:
          error?.response?.data?.message ||
          "ไม่สามารถดึงข้อมูลมิเตอร์ได้",
      });

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    getMeters();

  }, []);

  // filter
  const filteredMeters =
    meters.filter((meter) => {

      // search room
      const matchSearch =
        meter.room.roomNumber
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      // month
      const matchMonth =
        monthFilter === "ALL"
          ? true
          : meter.month ===
          Number(monthFilter);

      // year
      const matchYear =
        yearFilter === "ALL"
          ? true
          : meter.year ===
          Number(yearFilter);

      // status
      const matchStatus =
        statusFilter === "ALL"
          ? true
          : meter.bill?.status ===
          statusFilter;

      return (
        matchSearch &&
        matchMonth &&
        matchYear &&
        matchStatus
      );
    });

  // pagination
  const indexOfLastItem =
    currentPage * itemsPerPage;

  const indexOfFirstItem =
    indexOfLastItem - itemsPerPage;

  const currentMeters =
    filteredMeters.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

  const totalPages =
    Math.ceil(
      filteredMeters.length /
      itemsPerPage
    );

  const handleDelete =
    async (meterId) => {

      try {

        const result =
          await Swal.fire({
            title:
              "ยืนยันการลบ ?",

            text:
              "คุณต้องการลบข้อมูลมิเตอร์นี้หรือไม่",
            icon:
              "warning",
            showCancelButton:
              true,
            confirmButtonText:
              "ลบ",

            cancelButtonText:
              "ยกเลิก",
          });

        if (!result.isConfirmed)
          return;

        await axios.delete(
          `${API_URL}/meter/delete/${meterId}`,
          {
            headers: {
              Authorization:
                `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text:
            "ลบข้อมูลมิเตอร์สำเร็จ",
        });

        getMeters();

      } catch (error) {

        console.error(error);

        Swal.fire({
          icon: "error",
          title:
            "เกิดข้อผิดพลาด",

          text:
            error?.response?.data
              ?.message ||
            "ไม่สามารถลบข้อมูลได้",
        });
      }
    };

  const handleEdit = (meter) => {
    setEditData(meter);
    setOpenModel(true);
  };

  const handleOpenAdd = () => {
    setEditData(null);
    setOpenModel(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6">

      {/* Header */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <div className="">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900">
            แจ้งค่าน้ำค่าไฟ
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">
            จัดการข้อมูลมิเตอร์และบิลทั้งหมด
          </p>
        </div>

        {/* Add */}
        <button
          onClick={handleOpenAdd}
          className="bg-linear-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-lg transition whitespace-nowrap text-xs sm:text-sm md:text-base flex-1 sm:flex-none mr-3 sm:mr-2"
        >
          <Plus size={16} className="sm:block hidden" />
          <Plus size={14} className="sm:hidden block" />
          เพิ่มมิเตอร์
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <div className="flex justify-between gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ค้นหาเลขห้อง..."
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-gray-300 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-12 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <Search
              size={16}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Month */}
          <select
            value={monthFilter}
            onChange={(e) => {
              setMonthFilter(
                e.target.value
              );
              setCurrentPage(1);
            }}

            className="border border-gray-300 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="ALL">ทุกเดือน</option>
            {
              Array.from(
                { length: 12 },
                (_, i) => (
                  <option key={i + 1} value={i + 1}
                  >
                    {
                      [
                        "มกราคม",
                        "กุมภาพันธ์",
                        "มีนาคม",
                        "เมษายน",
                        "พฤษภาคม",
                        "มิถุนายน",
                        "กรกฎาคม",
                        "สิงหาคม",
                        "กันยายน",
                        "ตุลาคม",
                        "พฤศจิกายน",
                        "ธันวาคม",
                      ][i]
                    }
                  </option>
                )
              )
            }
          </select>
          {/* Year */}
          <select
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(
                e.target.value
              );
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >

            <option value="ALL">ทุกปี</option>

            {
              [...new Set(
                meters.map(
                  (m) => m.year
                )
              )].map((year) => (

                <option key={year} value={year}
                >
                  {year}
                </option>
              ))
            }
          </select>
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(
                e.target.value
              );
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >

            <option value="ALL">ทุกสถานะ</option>
            <option value="PENDING"> รอชำระ</option>
            <option value="WAITING_VERIFY">รอตรวจสอบ</option>
            <option value="PAID">ชำระแล้ว</option>
            <option value="OVERDUE"> ค้างชำระ</option>

          </select>
          {/* Controls Bottom */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
            {/* Items */}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(
                  Number(
                    e.target.value
                  )
                );
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >

              <option value={5}> 5 รายการ</option>
              <option value={10}>10 รายการ</option>
              <option value={20}> 20 รายการ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table - Desktop View */}
      <div className="hidden md:block bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <table className="w-full min-w-280">
            <thead className="bg-linear-to-r from-green-600 to-green-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  ห้อง
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  เดือน / ปี
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  ค่าน้ำ
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  ค่าไฟ
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  ค่าเช่า
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  ยอดรวม
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  สถานะ
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {
                loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-16 text-gray-500"
                    >
                      กำลังโหลดข้อมูล...
                    </td>
                  </tr>

                ) : currentMeters.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-16 text-gray-500"
                    >
                      ไม่พบข้อมูลมิเตอร์
                    </td>
                  </tr>
                ) : (
                  currentMeters.map((meter) => (
                    <tr
                      key={meter.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      {/* Room */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <House
                            size={18}
                            className="text-green-600"
                          />
                          <span className="font-bold text-gray-800">
                            {
                              meter.room.roomNumber
                            }
                          </span>
                        </div>
                      </td>
                      {/* Month */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <Calendar size={18} />
                          {meter.month}/{meter.year}
                        </div>
                      </td>
                      {/* Water */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                          <Droplets size={18} />
                          {meter.bill?.waterAmount}{" "}บาท
                        </div>
                      </td>
                      {/* Electric */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-yellow-600 font-semibold text-sm">
                          <Zap size={18} />
                          {meter.bill?.electricAmount} {" "}บาท
                        </div>
                      </td>
                      {/* Rent */}
                      <td className="px-6 py-4 text-green-700 font-semibold text-sm">
                        {meter.bill?.rentAmount}{" "}บาท
                      </td>
                      {/* Total */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-lg text-gray-900">
                          {meter.bill?.totalAmount}{" "}บาท
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
  ${meter.bill?.status === "PAID"
                              ? "bg-green-100 text-green-700"

                              : meter.bill?.status ===
                                "WAITING_VERIFY"
                                ? "bg-blue-100 text-blue-700"

                                : meter.bill?.status ===
                                  "PENDING"
                                  ? "bg-yellow-100 text-yellow-700"

                                  : "bg-red-100 text-red-700"
                            }
`}
                        >

                          {
                            meter.bill?.status === "PAID"
                              ? "ชำระแล้ว"

                              : meter.bill?.status ===
                                "WAITING_VERIFY"
                                ? "รอตรวจสอบ"

                                : meter.bill?.status ===
                                  "PENDING"
                                  ? "รอชำระ"

                                  : "ค้างชำระ"
                          }

                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleEdit(
                                meter
                              )
                            }
                            className="w-10 h-10 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center transition"
                          >
                            <FileText size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(
                                meter.id
                              )
                            }
                            className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              }
            </tbody>
          </table>
        </div>
      </div>
      {/* Cards - Mobile View */}
      <div className="md:hidden space-y-3 sm:space-y-4">
        {loading ? (

          <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
            กำลังโหลดข้อมูล...
          </div>
        ) : currentMeters.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
            ไม่พบข้อมูลมิเตอร์
          </div>
        ) : (
          currentMeters.map((meter) => (
            <div
              key={meter.id}
              className="bg-white rounded-2xl shadow-md p-4 space-y-3 hover:shadow-lg transition"
            >
              {/* Room Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <House
                    size={20}
                    className="text-green-600"
                  />
                  <span className="font-bold text-gray-800 text-sm">
                    ห้อง {meter.room.roomNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleEdit(meter)
                    }
                    className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center transition"
                  >
                    <FileText size={14} />
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(
                        meter.id
                      )
                    }
                    className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {/* Month */}
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Calendar size={16} className="text-gray-500" />
                <span className="font-medium">เดือน {meter.month} ปี {meter.year}</span>
              </div>
              {/* Amount Grid */}
              <div className="grid grid-cols-2 gap-2">
                {/* Water */}
                <div className="bg-blue-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Droplets size={16} className="text-blue-600" />
                    <span className="text-xs text-gray-600">ค่าน้ำ</span>
                  </div>
                  <div className="font-bold text-sm text-blue-700">
                    {meter.bill?.waterAmount} บาท
                  </div>
                </div>
                {/* Electric */}
                <div className="bg-yellow-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap size={16} className="text-yellow-600" />
                    <span className="text-xs text-gray-600">ค่าไฟ</span>
                  </div>
                  <div className="font-bold text-sm text-yellow-700">
                    {meter.bill?.electricAmount} บาท
                  </div>
                </div>
              </div>
              {/* Rent and Total */}
              <div className="grid grid-cols-2 gap-2">
                {/* Rent */}
                <div className="bg-green-50 rounded-lg p-2.5">
                  <div className="text-xs text-gray-600 mb-1">ค่าเช่า</div>
                  <div className="font-bold text-sm text-green-700">
                    {meter.bill?.rentAmount} บาท
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gray-900 rounded-lg p-2.5">
                  <div className="text-xs text-gray-300 mb-1">ยอดรวม</div>
                  <div className="font-bold text-sm text-white">
                    {meter.bill?.totalAmount} บาท
                  </div>
                </div>
              </div>
              {/* Status */}
              <div className="pt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${meter.bill?.status === "PAID"
                      ? "bg-green-100 text-green-700"

                      : meter.bill?.status ===
                        "WAITING_VERIFY"
                        ? "bg-blue-100 text-blue-700"

                        : meter.bill?.status ===
                          "PENDING"
                          ? "bg-yellow-100 text-yellow-700"

                          : "bg-red-100 text-red-700"
                    }
                  `}
                >

                  {
                    meter.bill?.status === "PAID"
                      ? "ชำระแล้ว"

                      : meter.bill?.status ===
                        "WAITING_VERIFY"
                        ? "รอตรวจสอบ"

                        : meter.bill?.status ===
                          "PENDING"
                          ? "รอชำระ"
                          : "ค้างชำระ"
                  }

                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-3 sm:p-4 md:p-6 mt-4 sm:mt-6">
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
          {/* Left */}
          <div className="text-xs sm:text-sm text-gray-600 text-center md:text-left">
            <span className="font-semibold">
              แสดง
              {" "}
              {indexOfFirstItem + 1}
              -
              {
                Math.min(
                  indexOfLastItem,
                  filteredMeters.length
                )
              }
            </span>
            <span>
              {" "}
              จาก{" "}
            </span>
            <span className="font-semibold">
              {filteredMeters.length}
            </span>
            <span>
              {" "}
              รายการ
            </span>

          </div>
          {/* Buttons */}
          <div className="flex items-center justify-center gap-2 flex-wrap">

            <button
              disabled={currentPage === 1}

              onClick={() =>
                setCurrentPage(
                  currentPage - 1
                )
              }
              className="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-100 transition text-xs sm:text-sm"
            >
              ก่อนหน้า

            </button>

            <div className="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-gray-100 text-xs sm:text-sm font-semibold text-gray-700">
              หน้า
              {" "}
              {currentPage}
              {" "}
              /{" "}
              {totalPages || 1}
            </div>
            <button
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage(
                  currentPage + 1
                )
              }
              className="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-linear-to-r from-green-600 to-green-700 text-white disabled:opacity-50 hover:from-green-700 hover:to-green-800 transition text-xs sm:text-sm"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      <ModelMeters
        open={openModel}
        setOpen={setOpenModel}
        getMeters={getMeters}
        editData={editData}
      />

    </div>
  );
};


export default MetersPage;