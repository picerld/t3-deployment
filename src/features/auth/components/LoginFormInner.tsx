import { useFormContext } from "react-hook-form";
import { type LoginFormSchema } from "../forms/login";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type LoginFormInnerProps = {
  onLoginSubmit: (values: LoginFormSchema) => void;
  isPending: boolean;
};

export const LoginFormInner: React.FC<LoginFormInnerProps> = ({
  onLoginSubmit,
  isPending,
}) => {
  const form = useFormContext<LoginFormSchema>();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={form.handleSubmit(onLoginSubmit)}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold flex">Username</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="font-bold flex">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-5 flex items-center text-gray-800 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm font-semibold">
            Lupa Password?
          </Link>
        </div>

        <div className="w-full">
          <Button type="submit" className="w-full py-6 text-base" disabled={isPending}>
            {isPending ? "Login..." : "Masuk Sekarang!"}
          </Button>
        </div>
      </div>
    </form>
  );
};
