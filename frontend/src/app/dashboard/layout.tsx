import Header from "../../components/header";
import { instrumentSerif, inter } from "@/lib/fonts";
import Sidebar from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <main className={inter.className + " max-h-screen min-h-screen h-screen"}>
      <Sidebar />
      <Header />
      <div>
        <div className="h-[70px]"></div>
        <div className="flex">
          <div className="h-[100px] w-[250px] lg:w-[350px]"></div>
          <div className="p-10 h-[calc(100vh-70px)] w-[calc(100vw-250px)] lg:w-[calc(100vw-350px)]">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}