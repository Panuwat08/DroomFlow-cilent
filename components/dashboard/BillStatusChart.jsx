"use client";

import {
     PieChart,
     Pie,
     Cell,
     Tooltip,
     ResponsiveContainer,
     Legend,
} from "recharts";

import {
     Card,
     CardContent,
     CardHeader,
     CardTitle,
     CardDescription,
} from "@/components/ui/card";

const BillStatusChart = ({ dashboard, }) => {

     const data = [
          {
               name: "ชำระแล้ว",
               value:
                    dashboard?.paidBills || 0,
          },

          {
               name: "รอตรวจสอบ",
               value:
                    dashboard?.waitingVerifyBills || 0,
          },

          {
               name: "รอชำระ",
               value:
                    dashboard?.pendingBills || 0,
          },

          {
               name: "ค้างชำระ",
               value:
                    dashboard?.overdueBills || 0,
          },
     ];

     const totalBills =
          data.reduce(
               (sum, item) =>
                    sum + item.value,
               0
          );

     const chartData =
          totalBills > 0
               ? data
               : [
                    {
                         name: "ยังไม่มีข้อมูล",
                         value: 1,
                    },
               ];

     const COLORS = [
          "url(#paidGradient)",
          "url(#waitingGradient)",
          "url(#pendingGradient)",
          "url(#overdueGradient)",
     ];

     return (
          <Card className="border-0 shadow-md rounded-3xl">

               <CardHeader>

                    <CardTitle className="text-2xl font-black">
                         สถานะการชำระเงิน
                    </CardTitle>

                    <CardDescription>
                         ภาพรวมสถานะบิลทั้งหมดในระบบ
                    </CardDescription>

               </CardHeader>

               <CardContent>

                    <div className="w-full mim-w-0">

                         <ResponsiveContainer
                              width="100%"
                              height={350}
                         >

                              <PieChart>
                                   <defs>

                                        {/* Paid */}
                                        <linearGradient
                                             id="paidGradient"
                                             x1="0"
                                             y1="0"
                                             x2="0"
                                             y2="1"
                                        >

                                             <stop
                                                  offset="0%"
                                                  stopColor="#16a34a"
                                             />

                                             <stop
                                                  offset="100%"
                                                  stopColor="#4ade80"
                                             />

                                        </linearGradient>

                                        {/* Waiting Verify */}
                                        <linearGradient
                                             id="waitingGradient"
                                             x1="0"
                                             y1="0"
                                             x2="0"
                                             y2="1"
                                        >

                                             <stop
                                                  offset="0%"
                                                  stopColor="#2563eb"
                                             />

                                             <stop
                                                  offset="100%"
                                                  stopColor="#60a5fa"
                                             />

                                        </linearGradient>

                                        {/* Pending */}
                                        <linearGradient
                                             id="pendingGradient"
                                             x1="0"
                                             y1="0"
                                             x2="0"
                                             y2="1"
                                        >

                                             <stop
                                                  offset="0%"
                                                  stopColor="#f59e0b"
                                             />

                                             <stop
                                                  offset="100%"
                                                  stopColor="#fcd34d"
                                             />

                                        </linearGradient>

                                        {/* Overdue */}
                                        <linearGradient
                                             id="overdueGradient"
                                             x1="0"
                                             y1="0"
                                             x2="0"
                                             y2="1"
                                        >

                                             <stop
                                                  offset="0%"
                                                  stopColor="#dc2626"
                                             />

                                             <stop
                                                  offset="100%"
                                                  stopColor="#f87171"
                                             />

                                        </linearGradient>

                                   </defs>

                                   <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={75}
                                        outerRadius={110}
                                        paddingAngle={4}
                                        dataKey="value"
                                   >

                                        {
                                             chartData.map(
                                                  (
                                                       entry,
                                                       index
                                                  ) => (

                                                       <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                 totalBills > 0
                                                                      ? COLORS[
                                                                      index %
                                                                      COLORS.length
                                                                      ]
                                                                      : "#d1d5db"
                                                            }
                                                       />
                                                  )
                                             )
                                        }

                                   </Pie>

                                   <Tooltip
                                        formatter={
                                             (value) =>
                                                  totalBills > 0
                                                       ? value
                                                       : 0
                                        }
                                   />

                                   <Legend
                                        payload={
                                             totalBills > 0
                                                  ? undefined
                                                  : [
                                                       {
                                                            value:
                                                                 "ยังไม่มีข้อมูลบิล",
                                                            type:
                                                                 "circle",
                                                            color:
                                                                 "#d1d5db",
                                                       },
                                                  ]
                                        }
                                   />

                              </PieChart>

                         </ResponsiveContainer>

                    </div>

               </CardContent>

          </Card>
     );
};

export default BillStatusChart;
