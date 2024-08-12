import Header from "../../components/header";
import { instrumentSerif, inter } from "@/lib/fonts";
import Sidebar from "@/components/sidebar";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { useUser } from "@/contexts/user-context";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = cookies().get('auth_token');
  const user = verifyToken(cookie?.value);  
  if(!user) {
    redirect('/');
  }

  // TODO: set user data in context
  
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