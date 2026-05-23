import type { Metadata } from "next";
import RegisterPage from "./RegisterPage";

export const metadata: Metadata = {
  title: "سجّل الآن | Walk Academy",
  description: "سجّل في دورات Walk Academy — محاسبة، Odoo ERP، وأكثر. Register now for Walk Academy courses.",
  openGraph: {
    title: "سجّل الآن | Walk Academy",
    description: "سجّل في دورات Walk Academy المتخصصة",
    url: "https://www.walk-business.com/register",
    images: [{ url: "https://www.walk-business.com/assets/images/logo.png" }],
  },
};

export default function Page() {
  return <RegisterPage />;
}
