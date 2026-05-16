"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Home,
  Users,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { API_URL } from "@/src/lib/config";
import BillStatusChart from "../../../components/dashboard/BillStatusChart";
import UtilityUsageChart from "../../../components/dashboard/UtilityUsageChart";
const AdminDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const getDashboard = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/dashboard/admin`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setDashboard(
        data.data
      );

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getDashboard();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            กำลังโหลด Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-5 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">
          Dashboard ผู้ดูแลระบบ
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">ภาพรวมข้อมูลทั้งหมดของระบบหอพัก</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {/* Income */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 border-l-4 border-l-green-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">รายได้ทั้งหมด</p>
              <h2 className="text-3xl font-black text-green-700 mt-2">
                {dashboard?.monthlyIncome?.toLocaleString()}
              </h2>
              <p className="text-sm mt-1 opacity-80 text-gray-700">บาท</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
              <Wallet size={32} />
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 border-l-4 border-l-blue-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">ห้องทั้งหมด</p>
              <h2 className="text-3xl font-black text-blue-700 mt-2">
                {dashboard?.totalRooms}
              </h2>
              <p className="text-sm mt-1 opacity-80 text-gray-700">ห้อง</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Home size={32} />
            </div>
          </div>
        </div>

        {/* Tenants */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 border-l-4 border-l-purple-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500"> ผู้เช่าทั้งหมด </p>

              <h2 className="text-3xl font-black text-purple-700 mt-2">
                {dashboard?.totalTenants}
              </h2>
              <p className="text-sm mt-1 opacity-80 text-gray-700">คน</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Users size={32} />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 border-l-4 border-l-orange-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">บิลรอชำระ </p>
              <h2 className="text-3xl font-black text-orange-700 mt-2">
                {dashboard?.pendingBills}
              </h2>
              <p className="text-sm mt-1 opacity-80 text-gray-700">
                รายการ
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
              <Clock3 size={32} />
            </div>
          </div>
        </div>
      </div>
      {/* Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {/* Overdue */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 border-l-4 border-l-orange-500 hover:shadow-lg transition">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">

                ค้างชำระ

              </p>

              <h2 className="text-3xl font-black text-orange-700 mt-2">

                {
                  dashboard?.overdueBills
                }

              </h2>

              <p className="text-sm mt-1 opacity-80 text-gray-700">

                รายการ

              </p>

            </div>

            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">

              <AlertCircle size={32} />

            </div>

          </div>

        </div>
        {/* Waiting Verify */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 border-l-4 border-l-blue-500 hover:shadow-lg transition">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">

                รอตรวจสอบ

              </p>

              <h2 className="text-3xl font-black text-blue-700 mt-2">

                {
                  dashboard?.waitingVerifyBills
                }

              </h2>

              <p className="text-sm mt-1 opacity-80 text-gray-700">

                รายการ

              </p>

            </div>

            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">

              <Clock3 size={32} />

            </div>

          </div>

        </div>
        {/* Available */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 border-l-4 border-l-green-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">ห้องว่าง </p>
              <h2 className="text-3xl font-black text-green-700 mt-2">
                {dashboard?.availableRooms}
              </h2>
              <p className="text-sm mt-1 opacity-80 text-gray-700">ห้อง</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
          </div>
        </div>

        {/* Occupied */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 border-l-4 border-l-red-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                ห้องไม่ว่าง
              </p>
              <h2 className="text-3xl font-black text-red-700 mt-2">
                {dashboard?.occupiedRooms}
              </h2>
              <p className="text-sm mt-1 opacity-80 text-gray-700">ห้อง</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
              <Home size={32} />
            </div>
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className="flex lg:flex-row sm:flex-col gap-6 mt-6">
        {/* Utility */}
        <div className="w-full min-w-0 ml-1">
          <UtilityUsageChart
            dashboard={dashboard}
          />
        </div>
        {/* Bill */}
        <div className="lg:w-2/3 w-full min-w-0">
          <BillStatusChart
            dashboard={dashboard}
          />
        </div>
      </div>
    </div>
  );
};
export default AdminDashboardPage;