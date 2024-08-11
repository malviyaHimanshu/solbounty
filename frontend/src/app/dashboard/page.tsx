import { cn } from "@/lib/utils";
import { coromorantGaramond, instrumentSerif, ptSerif } from "@/lib/fonts";

export default function Dashboard() {
  return (
    <div className="p-10">
      <h1 className={cn("text-3xl text-zinc-600", coromorantGaramond.className)}>Welcome back, Himanshu</h1>
    </div>
  );
}