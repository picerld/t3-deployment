"use client";

import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ModeToggle } from "../ui/mode-toggle";
import { trpc } from "@/utils/trpc";
import Cookies from "js-cookie";
import { skipToken } from "@tanstack/react-query";
import React from "react";

export default function GuestNavbar() {
  const token = Cookies.get("auth.token");

  const [mounted, setMounted] = React.useState(false);

  const { data: user, isLoading } = trpc.auth.authMe.useQuery(
    token ? { token } : skipToken,
    {
      retry: false,
      enabled: !!token,
      refetchOnWindowFocus: false,
    },
  );

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="bg-background dark:bg-secondary-background shadow-shadow fixed w-full px-10 py-5">
      <div className="container mx-auto flex items-center justify-between sm:px-32">
        <nav className="flex w-full items-center justify-start gap-6">
          <Link href={"/"} className="text-foreground text-xl">
            Beranda
          </Link>
        </nav>
        <div className="flex justify-end gap-3">
          <ModeToggle />
          {!isLoading &&
            (user ? (
              <Link
                href={"/dashboard"}
                className={buttonVariants({
                  variant: "default",
                  className: "py-5",
                })}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href={"/login"}
                className={buttonVariants({
                  variant: "default",
                  className: "py-5",
                })}
              >
                Masuk
              </Link>
            ))}
        </div>
      </div>
    </header>
  );
}
