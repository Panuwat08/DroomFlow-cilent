"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import Swal from "sweetalert2";

import ManageModalTenant from "../../../components/modelTenant/manageModelTenant";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  User,
  Phone,
  Mail,
  House,
} from "lucide-react";

import { API_URL } from "@/src/lib/config";

import { formatPhone } from "@/src/lib/formatPhone";

const ManageTenantsPage = () => {

  const [tenants, setTenants] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(10);

  const [openModelTenant, setOpenModelTenant] =
    useState(false);

  const [editData, setEditData] =
    useState(null);

  const getTenants = async () => {

    try {

      const { data } =
        await axios.get(
          `${API_URL}/manage-tenant/all`,
          {
            headers: {
              Authorization:
                `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

      setTenants(data.data);

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text:
          error?.response?.data?.message ||
          "ไม่สามารถดึงข้อมูลผู้เช่าได้",
      });

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    getTenants();

  }, []);

  const filteredTenants =
    tenants.filter((tenant) => {

      const fullname =
        `${tenant.first_name} ${tenant.last_name}`;

      return (
        fullname
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        tenant.email
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        tenant?.tenant?.room?.roomNumber
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );
    });

  const indexOfLastItem =
    currentPage * itemsPerPage;

  const indexOfFirstItem =
    indexOfLastItem - itemsPerPage;

  const currentTenants =
    filteredTenants.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

  const totalPages =
    Math.ceil(
      filteredTenants.length /
      itemsPerPage
    );

  const handleDelete =
    async (tenantId) => {

      try {

        const result =
          await Swal.fire({
            title:
              "ยืนยันการลบ ?",

            text:
              "เมื่อลบแล้วจะไม่สามารถกู้คืนได้",

            icon:
              "warning",

            showCancelButton:
              true,

            confirmButtonColor:
              "#16a34a",

            cancelButtonColor:
              "#dc2626",

            confirmButtonText:
              "ลบข้อมูล",

            cancelButtonText:
              "ยกเลิก",
          });

        if (!result.isConfirmed)
          return;

        await axios.delete(
          `${API_URL}/manage-tenant/delete/${tenantId}`,
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
            "ลบข้อมูลผู้เช่าเรียบร้อย",
        });

        getTenants();

      } catch (error) {

        console.error(error);

        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text:
            error?.response?.data?.message ||
            "ไม่สามารถลบข้อมูลได้",
        });
      }
    };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-5 lg:p-6">

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">
          จัดการผู้เช่าห้องพัก
        </h1>

        <p className="text-sm sm:text-base text-gray-600 mt-2">
          จัดการข้อมูลผู้เช่าทั้งหมดในระบบ
        </p>

      </div>

      {/* Controls */}
      <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6 mb-6">

        <div className="flex flex-col xl:flex-row xl:items-center gap-4">

          {/* Search */}
          <div className="relative flex-1">

            <input
              type="text"

              placeholder="ค้นหาชื่อ อีเมล หรือห้องพัก..."

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 pl-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <Search
              size={20}

              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

          </div>

          {/* Right */}
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Items */}
            <div className="flex items-center justify-between sm:justify-start gap-3">

              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                รายการต่อหน้า
              </span>

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

                className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >

                <option value={5}>
                  5
                </option>

                <option value={10}>
                  10
                </option>

                <option value={20}>
                  20
                </option>

                <option value={50}>
                  50
                </option>

              </select>

            </div>

            {/* Add */}
            <button
              onClick={() => {

                setOpenModelTenant(true);

                setEditData(null);
              }}

              className="bg-linear-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-lg transition whitespace-nowrap"
            >

              <Plus size={20} />

              เพิ่มผู้เช่า

            </button>

          </div>

        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

          <table className="w-full min-w-215">

            <thead className="bg-linear-to-r from-green-600 to-green-700 text-white">

              <tr>

                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold">
                  ผู้เช่า
                </th>

                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold">
                  อีเมล
                </th>

                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold">
                  เบอร์โทร
                </th>

                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold">
                  ห้องพัก
                </th>

                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold">
                  วันที่เข้าพัก
                </th>

                <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold">
                  จัดการ
                </th>

              </tr>

            </thead>

            <tbody>

              {
                loading ? (

                  <tr>

                    <td
                      colSpan="6"

                      className="text-center py-16 text-gray-500"
                    >

                      กำลังโหลดข้อมูล...

                    </td>

                  </tr>

                ) : filteredTenants.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"

                      className="text-center py-16 text-gray-500"
                    >

                      ไม่พบข้อมูลผู้เช่า

                    </td>

                  </tr>

                ) : (

                  currentTenants.map((tenant) => (

                    <tr
                      key={tenant.id}

                      className="border-b border-gray-100 hover:bg-green-50 transition"
                    >

                      {/* User */}
                      <td className="px-4 sm:px-6 py-4">

                        <div className="flex items-center gap-4">

                          <div className="w-11 h-11 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">

                            <User size={20} />

                          </div>

                          <div>

                            <h3 className="font-bold text-gray-800">
                              {tenant.prefix}
                              {" "}
                              {tenant.first_name}
                              {" "}
                              {tenant.last_name}
                            </h3>

                            <p className="text-xs text-gray-500">
                              Tenant
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Email */}
                      <td className="px-4 sm:px-6 py-4">

                        <div className="flex items-center gap-2 text-gray-700">

                          <Mail size={18} />

                          {tenant.email}

                        </div>

                      </td>

                      {/* Phone */}
                      <td className="px-4 sm:px-6 py-4">

                        <div className="flex items-center gap-2 text-gray-700">

                          <Phone size={18} />

                          {formatPhone(tenant.phone)}

                        </div>

                      </td>

                      {/* Room */}
                      <td className="px-4 sm:px-6 py-4">

                        <div className="flex items-center gap-2">

                          <House
                            size={18}

                            className="text-green-600"
                          />

                          <span className="font-semibold text-green-700">
                            {
                              tenant?.tenant?.room?.roomNumber
                            }
                          </span>

                        </div>

                      </td>

                      {/* Date */}
                      <td className="px-4 sm:px-6 py-4 text-gray-700">

                        {
                          new Date(
                            tenant?.tenant?.checkInDate
                          ).toLocaleDateString(
                            "th-TH"
                          )
                        }

                      </td>

                      {/* Actions */}
                      <td className="px-4 sm:px-6 py-4">

                        <div className="flex items-center justify-center gap-2">

                          <button
                            onClick={() => {

                              setEditData(tenant);

                              setOpenModelTenant(true);
                            }}

                            className="w-10 h-10 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-700 flex items-center justify-center transition"
                          >

                            <Pencil size={18} />

                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                tenant.id
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
              {indexOfFirstItem + 1}
              -
              {
                Math.min(
                  indexOfLastItem,
                  filteredTenants.length
                )
              }

            </span>

            <span>
              {" "}
              จาก{" "}
            </span>

            <span className="font-semibold">
              {filteredTenants.length}
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

              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-100 transition text-sm"
            >

              ← ก่อนหน้า

            </button>

            <div className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700">

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

              className="px-4 py-2 rounded-xl bg-linear-to-r from-green-600 to-green-700 text-white disabled:opacity-50 hover:from-green-700 hover:to-green-800 transition text-sm"
            >

              ถัดไป →

            </button>

          </div>

        </div>

      </div>

      <ManageModalTenant
        open={openModelTenant}
        setOpen={setOpenModelTenant}
        getTenants={getTenants}
        editData={editData}
      />

    </div>
  );
};

export default ManageTenantsPage;