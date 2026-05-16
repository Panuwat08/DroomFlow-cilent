"use client";

import React from "react";
import { Search,} from "lucide-react";

const months = [
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
];

const PaymentFilters = ({
     searchTerm,
     setSearchTerm,

     statusFilter,
     setStatusFilter,

     monthFilter,
     setMonthFilter,

     itemsPerPage,
     setItemsPerPage,

     setCurrentPage,

}) => {

     return (

          <div className="flex flex-col lg:flex-row gap-3 bg-white rounded-3xl p-5 shadow-md border border-gray-100">
               {/* Search */}
               <div className="relative flex-1">
                    <Search
                         className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                         size={20}
                    />
                    <input
                         type="text"
                         placeholder="ค้นหาชื่อผู้เช่า หรือเลขห้อง..."
                         value={searchTerm}
                         onChange={(e) =>
                              setSearchTerm(
                                   e.target.value
                              )
                         }
                         className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
               </div>


               <div className="">


               {/* Status */}
               <select
                    value={statusFilter}
                    onChange={(e) => {

                         setStatusFilter(
                              e.target.value
                         );

                         setCurrentPage(1);
                    }}
                    className="px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                    <option value="ALL">ทุกสถานะ</option>
                    <option value="WAITING_VERIFY">รอตรวจสอบ</option>
                    <option value="PAID">ชำระแล้ว</option>
                    <option value="PENDING">รอชำระ</option>
               </select>
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
                    className="px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
               >

                    <option value="ALL">ทุกเดือน
                    </option>{
                         months.map(
                              (
                                   month,
                                   index
                              ) => (
                                   <option
                                        key={index + 1}
                                        value={index + 1}
                                   >
                                        {month}
                                   </option>
                              )
                         )
                    }

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
                    className="px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                    <option value={5}>5 รายการ</option>
                    <option value={10}>10 รายการ</option>
                    <option value={20}>20 รายการ</option>
                    <option value={50}>50 รายการ</option>
               </select>

          </div>
     );
};

export default PaymentFilters;