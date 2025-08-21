"use client";

import { useFormContext } from "react-hook-form";
import type { UserPasswordFormSchema } from "../forms/user-password";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type UserPasswordUpdateFormInnerProps = {
  isPending: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserPasswordUpdateSubmit: (value: UserPasswordFormSchema) => void;
};

export const UserPasswordUpdateFormInner: React.FC<
  UserPasswordUpdateFormInnerProps
> = ({ isPending, open, onOpenChange, onUserPasswordUpdateSubmit }) => {
  const form = useFormContext<UserPasswordFormSchema>();

  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ubah Password</DialogTitle>
          <DialogDescription className="text-base">
            Psst! Jangan beri passwordmu kepada siapapun.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onUserPasswordUpdateSubmit)}>
          <div className="space-y-6">
            {/* Old Password */}
            {/* <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password Lama</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={isPending}
                        type={show.old ? "text" : "password"}
                        {...field}
                        className="pr-10 text-base"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShow((prev) => ({ ...prev, old: !prev.old }))
                        }
                        className="absolute inset-y-0 right-5 flex cursor-pointer items-center text-gray-800"
                        tabIndex={-1}
                      >
                        {show.old ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password Baru</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={isPending}
                        type={show.new ? "text" : "password"}
                        {...field}
                        className="pr-10 text-base"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShow((prev) => ({ ...prev, new: !prev.new }))
                        }
                        className="absolute inset-y-0 right-5 flex cursor-pointer items-center text-gray-800"
                        tabIndex={-1}
                      >
                        {show.new ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            {/* <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Konfirmasi Password Baru
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={isPending}
                        type={show.confirm ? "text" : "password"}
                        {...field}
                        className="pr-10 text-base"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShow((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="absolute inset-y-0 right-5 flex cursor-pointer items-center text-gray-800"
                        tabIndex={-1}
                      >
                        {show.confirm ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
              <Checkbox
                id="confirmPassword"
                className="data-[state=checked]:bg-main data-[state=checked]:text-white"
              />
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm font-bold">
                  Konfirmasi Password
                </p>
                <p className="text-sm">
                  Pastikan semua password kamu cocok.
                </p>
              </div>
            </Label> */}
          </div>

          <DialogFooter className="mt-10">
            <DialogClose asChild>
              <Button disabled={isPending} variant="neutral">
                Tidak, Kembali.
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Ya, Simpan Password!"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
