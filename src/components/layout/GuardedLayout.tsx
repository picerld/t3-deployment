import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { ModeToggle } from "../ui/mode-toggle";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import React, { useState } from "react";
import { skipToken } from "@tanstack/react-query";
import GlobalSearch from "./GlobalSearch";
import { LogoutButton } from "./LogoutButton";
import NavItemComponent, { type INavItem } from "./NavItemComponent";

export default function GuardedLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathName = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [mobileExpandedItems, setMobileExpandedItems] = useState<Set<string>>(new Set());

  const token = Cookies.get("auth.token");

  const { data: user, isLoading } = trpc.auth.authMe.useQuery(
    token ? { token } : skipToken,
    {
      retry: false,
      enabled: !!token,
      refetchOnWindowFocus: false,
    },
  );

  const navItem: INavItem[] = [
    { name: "Dashboard", href: "/dashboard", active: false },
    { name: "Statistik", href: "/statistik", active: false },
    { name: "Dokumen", href: "/documents", active: false },
    { name: "Barang", href: "/items", active: false },
    { name: "Kategori", href: "/categories", active: false },
    { name: "Lokasi", href: "/locations", active: false },
    { name: "Akun", href: "/users", active: false },
    { 
      name: "Database", 
      href: "/database", 
      active: false,
      children: [
        // { name: "Koneksi", href: "/database/connections", active: false },
        { name: "Konfigurasi", href: "/database/configuration", active: false },
      ]
    },
  ];

  const updatedNavItem = navItem.map((item) => ({
    ...item,
    active: pathName === item.href || pathName.includes(item.href),
    children: item.children?.map((child: INavItem) => ({
      ...child,
      active: pathName === child.href || pathName.includes(child.href),
    })),
  }));

  const group1 = updatedNavItem.filter((item) =>
    ["Akun", "Kategori", "Lokasi"].includes(item.name),
  );

  const group2 = updatedNavItem.filter((item) =>
    ["Barang", "Dashboard", "Statistik", "Dokumen"].includes(item.name),
  );

  const group3 = updatedNavItem.filter((item) =>
    ["Database"].includes(item.name),
  );

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const toggleMobileExpanded = (itemName: string) => {
    setMobileExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      return newSet;
    });
  };

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess() {
      toast.success("Berhasil Logout!", {
        description: "Silahkan login kembali!",
      });

      router.push("/login");
    },
    onError(error) {
      console.log(error);
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

    Cookies.remove("auth.token");

    logoutMutation.mutate({ token });
  }

  return (
    <div className="bg-main dark:bg-secondary-background min-h-screen">
      <div className="flex min-h-screen">
        <div className="dark:bg-secondary-background fixed top-0 right-0 left-0 z-50 border-b-4 border-black bg-white">
          <div className="flex h-16 items-center justify-between px-4 md:px-4">
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="flex lg:hidden">
                    <Menu className="mr-1 !size-5" strokeWidth={2.5} />
                  </Button>
                </SheetTrigger>
                <SheetHeader></SheetHeader>
                <SheetContent side="left">
                  <nav className="text-black dark:text-white">
                    <div className="dark:bg-secondary-background flex items-center border-b-4 border-black bg-white py-3 pl-5 text-lg font-semibold">
                      Menu
                    </div>
                    {group2.map((item) => (
                      <NavItemComponent
                        key={item.name}
                        item={item}
                        isMobile={true}
                        expandedItems={mobileExpandedItems}
                        toggleExpanded={toggleMobileExpanded}
                      />
                    ))}

                    <div className="bg-background dark:bg-secondary-background flex items-center border-b-4 border-black py-3 pl-5 text-lg font-semibold">
                      Data Master
                    </div>

                    {group1.map((item) => (
                      <NavItemComponent
                        key={item.name}
                        item={item}
                        isMobile={true}
                        expandedItems={mobileExpandedItems}
                        toggleExpanded={toggleMobileExpanded}
                      />
                    ))}

                    <div className="bg-background dark:bg-secondary-background flex items-center border-b-4 border-black py-3 pl-5 text-lg font-semibold">
                      Setting
                    </div>

                    {group3.map((item) => (
                      <NavItemComponent
                        key={item.name}
                        item={item}
                        isMobile={true}
                        expandedItems={mobileExpandedItems}
                        toggleExpanded={toggleMobileExpanded}
                      />
                    ))}
                  </nav>
                  <SheetFooter>
                    <Button
                      variant={"neutral"}
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      Logout
                    </Button>
                    <div className={buttonVariants({ variant: "default" })}>
                      {user ? user.name : "Unknown"}
                    </div>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              <div className="hidden items-center space-x-2 lg:flex">
                <Link href={"/"}>
                  <h1 className="text-2xl font-bold text-black dark:text-white">
                    Deployment
                  </h1>
                </Link>
              </div>
              <nav className="flex items-center space-x-6"></nav>
            </div>
            <div className="flex items-center space-x-4">
              <GlobalSearch />
              <ModeToggle />
              <LogoutButton />
            </div>
          </div>
        </div>

        <div className="dark:bg-secondary-background fixed top-16 left-0 hidden h-full w-64 overflow-y-auto border border-r-4 border-black bg-white lg:block">
          <nav className="flex h-full flex-col text-black dark:text-white">
            <div className="dark:bg-secondary-background flex items-center border-b-4 border-black bg-white py-3 pl-5 text-lg font-semibold">
              Menu
            </div>
            {group2.map((item) => (
              <NavItemComponent
                key={item.name}
                item={item}
                expandedItems={expandedItems}
                toggleExpanded={toggleExpanded}
              />
            ))}

            <div className="bg-background dark:bg-secondary-background flex items-center border-b-4 border-black py-3 pl-5 text-lg font-semibold">
              Data Master
            </div>

            {group1.map((item) => (
              <NavItemComponent
                key={item.name}
                item={item}
                expandedItems={expandedItems}
                toggleExpanded={toggleExpanded}
              />
            ))}

            <div className="bg-background dark:bg-secondary-background flex items-center border-b-4 border-black py-3 pl-5 text-lg font-semibold">
              Setting
            </div>

            {group3.map((item) => (
              <NavItemComponent
                key={item.name}
                item={item}
                expandedItems={expandedItems}
                toggleExpanded={toggleExpanded}
              />
            ))}

            <div className="mt-auto mb-20 w-full border-t-4 border-black pt-3 pl-5 text-lg">
              {user ? user.name : "Unknown"}
            </div>
          </nav>
        </div>

        <div className="bg-secondary-background dark:bg-secondary-background min-h-screen flex-1 pt-16 text-black lg:ml-64 dark:text-white">
          <div className="min-h-screen w-full px-5 py-10 sm:px-8 sm:py-14">
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