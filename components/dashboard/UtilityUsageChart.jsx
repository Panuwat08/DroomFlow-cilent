"use client";

import {
     ResponsiveContainer,
     BarChart,
     CartesianGrid,
     XAxis,
     YAxis,
     Tooltip,
     Bar,
     Legend,
} from "recharts";

import {
     Card,
     CardContent,
     CardHeader,
     CardTitle,
     CardDescription,
} from "@/components/ui/card";

const UtilityUsageChart = ({
     dashboard,
}) => {

     const monthNames = [
          "ม.ค.",
          "ก.พ.",
          "มี.ค.",
          "เม.ย.",
          "พ.ค.",
          "มิ.ย.",
          "ก.ค.",
          "ส.ค.",
          "ก.ย.",
          "ต.ค.",
          "พ.ย.",
          "ธ.ค.",
     ];

     const data =
          dashboard?.utilityByMonth?.map(
               (item) => ({
                    month:
                         `${monthNames[item.month - 1]} ${item.year}`,

                    water:
                         item._sum.waterUsed || 0,

                    electric:
                         item._sum.electricUsed || 0,
               })
          ) || [];

     return (
          <Card className="rounded-3xl border-0 shadow-md">

               <CardHeader>

                    <CardTitle className="text-2xl font-black">
                         สรุปการใช้น้ำและไฟ
                    </CardTitle>

                    <CardDescription>
                         เปรียบเทียบการใช้น้ำและไฟฟ้ารายเดือน
                    </CardDescription>

               </CardHeader>

               <CardContent>

                    <div className="w-full min-w-0">

                         <ResponsiveContainer
                              width="100%"
                              height={350}
                         >

                              <BarChart
                                   data={data}
                                   margin={{
                                        top: 20,
                                        right: 10,
                                        left: 0,
                                        bottom: 0,
                                   }}
                              >

                                   {/* Gradient */}
                                   <defs>

                                        {/* Water */}
                                        <linearGradient
                                             id="waterGradient"
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

                                        {/* Electric */}
                                        <linearGradient
                                             id="electricGradient"
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

                                   </defs>

                                   <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                   />

                                   <XAxis
                                        dataKey="month"
                                   />

                                   <YAxis />

                                   <Tooltip />

                                   <Legend />

                                   {/* Water */}
                                   <Bar
                                        dataKey="water"
                                        name="น้ำ"

                                        fill="url(#waterGradient)"

                                        radius={[
                                             10,
                                             10,
                                             0,
                                             0,
                                        ]}
                                   />

                                   {/* Electric */}
                                   <Bar
                                        dataKey="electric"
                                        name="ไฟฟ้า"

                                        fill="url(#electricGradient)"

                                        radius={[
                                             10,
                                             10,
                                             0,
                                             0,
                                        ]}
                                   />

                              </BarChart>

                         </ResponsiveContainer>

                    </div>

               </CardContent>

          </Card>
     );
};

export default UtilityUsageChart;