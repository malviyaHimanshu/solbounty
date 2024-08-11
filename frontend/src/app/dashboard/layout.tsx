import Header from "@/components/header";
import { instrumentSerif, inter } from "@/lib/fonts";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={inter.className + " max-h-screen min-h-screen h-screen"}>
      <Header />
      <Sidebar />
      <div>
        <div className="h-[70px]"></div>
        <div className="flex">
          <div className="h-[100px] w-[350px]"></div>
          <div className="h-[calc(100vh-70px)] w-[calc(100vw-350px)]">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}