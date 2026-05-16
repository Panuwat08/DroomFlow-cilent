"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ManageModalRoom from "../../../components/modelRoom/manageModelRoom";
import {
  Pencil,
  Trash2,
  Search,
  Plus,
} from "lucide-react";

import { API_URL } from "@/src/lib/config";
const ManageRoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [floorFilter, setFloorFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [openModel, setOpenModel] = useState(false);
  const getRooms = async () => {

    try {
      const { data } = await axios.get(`${API_URL}/manage-room/all`,
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRooms(data.data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error?.response?.data?.message || "ไม่สามารถดึงข้อมูลห้องได้",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getRooms();
  }, []);

  // Filter
  const filteredRooms =
    rooms.filter((room) => {
      const matchesSearch =
        room.roomNumber
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchFloor = floorFilter === "ALL"
        ? true
        : room.floor ===
        Number(
          floorFilter
        );

      return (
        matchesSearch &&
        matchFloor
      );
    });

  // Pagination
  const totalPages = Math.ceil(
    filteredRooms.length /
    itemsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const paginatedRooms =
    filteredRooms.slice(
      startIndex,
      startIndex +
      itemsPerPage
    );

  const handleDelete =
    async (id) => {
      const result =
        await Swal.fire({
          title: "ยืนยันการลบ ?",
          text: "คุณต้องการลบห้องนี้หรือไม่",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ลบ",
          cancelButtonText: "ยกเลิก",
        });

      if (!result.isConfirmed)
        return;
      try {
        await axios.delete(`${API_URL}/manage-room/delete/${id}`,
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
          text: "ลบห้องสำเร็จ",
        });
        getRooms();

      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: error?.response?.data?.message || "ไม่สามารถลบห้องได้",
        });
      }
    };
  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-5 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">
          จัดการห้องพัก
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          จัดการข้อมูลห้องพักทั้งหมด
        </p>
      </div>
      {/* Controls */}
      <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col xl:flex-row xl:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ค้นหาห้อง..."
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 pl-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Right */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Floor */}
            <select
              value={floorFilter}
              onChange={(e) => {
                setFloorFilter(
                  e.target.value
                );
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="ALL">ทุกชั้น</option>
              <option value="1">  ชั้น 1</option>
              <option value="2"> ชั้น 2</option>
              <option value="3"> ชั้น 3</option>
              <option value="4"> ชั้น 4</option>
            </select>

            {/* Per Page */}
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
              className="border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value={5}>5 รายการ</option>
              <option value={10}>10 รายการ</option>
              <option value={20}>20 รายการ
              </option>
            </select>

            {/* Add */}
            <button
              onClick={() => {
                setSelectedRoom(
                  null
                );
                setOpenModel(true);
              }}
              className="bg-linear-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-lg transition whitespace-nowrap"
            >
              <Plus size={20} />
              เพิ่มห้อง
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <table className="w-full text-sm sm:text-base">
            <thead className="bg-linear-to-r from-green-600 to-green-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left">
                  เลขห้อง
                </th>
                <th className="px-6 py-4 text-left">
                  ชั้น
                </th>
                <th className="px-6 py-4 text-left">
                  ค่าเช่า
                </th>
                <th className="px-6 py-4 text-left">
                  ค่าน้ำ
                </th>
                <th className="px-6 py-4 text-left">
                  ค่าไฟ
                </th>
                <th className="px-6 py-4 text-left">
                  สถานะ
                </th>
                <th className="px-6 py-4 text-center">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {
                loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-16 text-gray-500"
                    >
                      กำลังโหลดข้อมูล..
                    </td>
                  </tr>
                ) : paginatedRooms.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-16 text-gray-500"
                    >
                      ไม่พบข้อมูลห้องพัก
                    </td>
                  </tr>
                ) : (
                  paginatedRooms.map((room) => (
                    <tr
                      key={room.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-bold text-gray-800">
                        {room.roomNumber}
                      </td>
                      <td className="px-6 py-4">
                        ชั้น {room.floor}
                      </td>
                      <td className="px-6 py-4 text-green-700 font-semibold">
                        {room.monthlyRent} บาท
                      </td>
                      <td className="px-6 py-4 text-blue-600 font-semibold">
                        {room.waterRate} บาท
                      </td>
                      <td className="px-6 py-4 text-yellow-600 font-semibold">
                        {room.electricRate} บาท
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-semibold
                          ${room.status === "AVAILABLE"
                              ? "bg-green-100 text-green-700"
                              : room.status === "OCCUPIED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                        `}
                        >
                          {
                            room.status === "AVAILABLE"
                              ? "ว่าง"
                              : room.status === "OCCUPIED"
                                ? "ไม่ว่าง"
                                : "ปรับปรุง"
                          }
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          {/* Edit */}
                          <button
                            onClick={() => {
                              setSelectedRoom(
                                room
                              );
                              setOpenModel(true);
                            }}
                            className="w-10 h-10 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-700 flex items-center justify-center transition"
                          >
                            <Pencil size={18} />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() =>
                              handleDelete(
                                room.id
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
      {/* Pagination */}
      <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6 mt-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left */}
          <div className="text-sm text-gray-600 text-center lg:text-left">
            <span className="font-semibold">
              แสดง
              {" "}
              {startIndex + 1}
              -
              {
                Math.min(
                  startIndex +
                  itemsPerPage,
                  filteredRooms.length
                )
              }
            </span>
            <span>
              {" "}จาก{" "}
            </span>
            <span className="font-semibold">
              {filteredRooms.length}
            </span>
            <span>
              {" "}รายการ
            </span>
          </div>
          {/* Buttons */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    prev - 1
                )
              }
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-100 transition text-sm"
            >
              ก่อนหน้า
            </button>
            <div className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700">
              หน้า{" "}{currentPage}{" "}/{" "}{totalPages || 1}
            </div>
            <button
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    prev + 1
                )
              }
              className="px-4 py-2 rounded-xl bg-linear-to-r from-green-600 to-green-700 text-white disabled:opacity-50 hover:from-green-700 hover:to-green-800 transition text-sm"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
      {/* Modal */}
      <ManageModalRoom
        open={openModel}
        setOpen={setOpenModel}
        editData={selectedRoom}
        getRooms={getRooms}
      />
    </div>
  );
};

export default ManageRoomPage;