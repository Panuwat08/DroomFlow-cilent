import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
});
export const metadata = {
  title: "ระบบเก็ยค่าเช่าห้องพัก",
  description: "Dormitory Management System",
};
export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={`${kanit.className} min-h-screen bg-green-50`}>
        {children}
      </body>
    </html>
  );
}