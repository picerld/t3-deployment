import { Menu, Search } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "../ui/mode-toggle";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

export default function GuardedLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathName = usePathname();
  const router = useRouter();

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
    ["Akun", "Kategori", "Lokasi"].includes(item.name)
  );

  const group2 = updatedNavItem.filter((item) =>
    ["Barang", "Dashboard"].includes(item.name)
  );

  // const logoutMutation = trpc.auth.logout.useMutation({
  //   onSuccess() {
  //     toast.success("Berhasil Logout!", {
  //       description: "Silahkan login kembali!",
  //     });
  //     router.push("/login");
  //   },
  //   onError() {
  //     toast.error("Gagal Logout!", {
  //       description: "Silahkan coba lagi!",
  //     });
  //   },
  // });

  function handleLogout() {
    // logoutMutation.mutate();
  }

  return (
    <div className="bg-main dark:bg-secondary-background min-h-screen">
      <div className="flex min-h-screen">
        <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-secondary-background border-b-4 border-black">
          <div className="flex items-center justify-between sm:px-16 px-4 h-16">
            <div className="flex items-center space-x-4">
              <Button className="sm:hidden flex">
                <Menu className="mr-1 !size-5" strokeWidth={2.5} />
              </Button>
              <div className="sm:flex hidden items-center space-x-2">
                <Link href={"/"}>
                  <h1 className="text-2xl font-bold text-black dark:text-white">
                    Inventory
                  </h1>
                </Link>
              </div>
              <nav className="flex items-center space-x-6"></nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="px-5 sm:flex hidden">
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

        <div className="fixed sm:block hidden left-0 top-16 w-64 h-full bg-white dark:bg-secondary-background border border-r-4 border-black overflow-y-auto">
          <nav className="text-black dark:text-white">
            <div className="border-b-4 border-black py-3 font-semibold pl-5 text-lg flex items-center bg-white dark:bg-secondary-background">
              Menu
            </div>
            {group2.map((item) => (
              <Link key={item.name} href={item.href} className="group">
                <div
                  className={`border-b-4 border-black py-4 pl-5 text-lg flex items-center ${
                    item.active
                      ? "bg-main font-semibold group-hover:bg-main"
                      : "group-hover:bg-main/70"
                  }`}
                >
                  {item.name}
                </div>
              </Link>
            ))}

            <div className="border-b-4 border-black py-3 font-semibold pl-5 text-lg flex items-center bg-background dark:bg-secondary-background">
              Data Master
            </div>

            {group1.map((item) => (
              <Link key={item.name} href={item.href} className="group">
                <div
                  className={`border-b-4 border-black py-4 pl-5 text-lg flex items-center ${
                    item.active
                      ? "bg-main font-semibold group-hover:bg-main"
                      : "group-hover:bg-main/70"
                  }`}
                >
                  {item.name}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex-1 sm:ml-64 pt-16 bg-secondary-background dark:bg-secondary-background text-black dark:text-white min-h-screen">
          <div className="w-full sm:px-8 px-5 sm:py-20 py-10 min-h-screen">
            {children}
          </div>
          <footer className="flex min-h-16 border-t-2 border-gray-200 dark:border-gray-700 p-4 mt-10 text-muted-foreground dark:text-muted-foreground-dark">
            <p className="w-full text-center">
              &copy; {new Date().getFullYear()}. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
