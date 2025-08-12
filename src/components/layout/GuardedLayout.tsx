import { Menu, Search } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "../ui/mode-toggle";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import Cookies from "js-cookie";

export default function GuardedLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathName = usePathname();
  const router = useRouter();

  const token = Cookies.get("auth.token");

  const navItem = [
    { name: "Dashboard", href: "/dashboard", active: false },
    { name: "Barang", href: "/items", active: false },
    { name: "Kategori", href: "/categories", active: false },
    { name: "Lokasi", href: "/locations", active: false },
    { name: "Akun", href: "/users", active: false },
  ];

  const updatedNavItem = navItem.map((item) => ({
    ...item,
    active: pathName === item.href || pathName.includes(item.href),
  }));

  const group1 = updatedNavItem.filter((item) =>
    ["Akun", "Kategori", "Lokasi"].includes(item.name),
  );

  const group2 = updatedNavItem.filter((item) =>
    ["Barang", "Dashboard"].includes(item.name),
  );

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess() {
      toast.success("Berhasil Logout!", {
        description: "Silahkan login kembali!",
      });
      router.push("/login");
    },
    onError() {
      toast.error("Gagal Logout!", {
        description: "Silahkan coba lagi!",
      });
    },
  });

  function handleLogout() {
    if (!token) {
      toast.error("Tidak ada token, gagal logout");
      return;
    }
    logoutMutation.mutate({ token });
  }

  return (
    <div className="bg-main dark:bg-secondary-background min-h-screen">
      <div className="flex min-h-screen">
        <div className="dark:bg-secondary-background fixed top-0 right-0 left-0 z-50 border-b-4 border-black bg-white">
          <div className="flex h-16 items-center justify-between px-4 sm:px-16">
            <div className="flex items-center space-x-4">
              <Button className="flex sm:hidden">
                <Menu className="mr-1 !size-5" strokeWidth={2.5} />
              </Button>
              <div className="hidden items-center space-x-2 sm:flex">
                <Link href={"/"}>
                  <h1 className="text-2xl font-bold text-black dark:text-white">
                    Inventory
                  </h1>
                </Link>
              </div>
              <nav className="flex items-center space-x-6"></nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="hidden px-5 sm:flex">
                <Search className="mr-1 h-4 w-4" />
                Search
              </Button>
              <ModeToggle />
              <Button
                onClick={handleLogout}
                variant={"neutral"}
                className="px-5"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="dark:bg-secondary-background fixed top-16 left-0 hidden h-full w-64 overflow-y-auto border border-r-4 border-black bg-white sm:block">
          <nav className="text-black dark:text-white">
            <div className="dark:bg-secondary-background flex items-center border-b-4 border-black bg-white py-3 pl-5 text-lg font-semibold">
              Menu
            </div>
            {group2.map((item) => (
              <Link key={item.name} href={item.href} className="group">
                <div
                  className={`flex items-center border-b-4 border-black py-4 pl-5 text-lg ${
                    item.active
                      ? "bg-main group-hover:bg-main font-semibold"
                      : "group-hover:bg-main/70"
                  }`}
                >
                  {item.name}
                </div>
              </Link>
            ))}

            <div className="bg-background dark:bg-secondary-background flex items-center border-b-4 border-black py-3 pl-5 text-lg font-semibold">
              Data Master
            </div>

            {group1.map((item) => (
              <Link key={item.name} href={item.href} className="group">
                <div
                  className={`flex items-center border-b-4 border-black py-4 pl-5 text-lg ${
                    item.active
                      ? "bg-main group-hover:bg-main font-semibold"
                      : "group-hover:bg-main/70"
                  }`}
                >
                  {item.name}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="bg-secondary-background dark:bg-secondary-background min-h-screen flex-1 pt-16 text-black sm:ml-64 dark:text-white">
          <div className="min-h-screen w-full px-5 py-10 sm:px-8 sm:py-20">
            {children}
          </div>
          <footer className="text-muted-foreground dark:text-muted-foreground-dark mt-10 flex min-h-16 border-t-2 border-gray-200 p-4 dark:border-gray-700">
            <p className="w-full text-center">
              &copy; {new Date().getFullYear()}. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
