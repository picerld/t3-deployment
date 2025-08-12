import { useFormContext } from "react-hook-form";
import { UserFormSchema } from "../forms/user";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type UserFormInnerProps = {
  onCreateUserSubmit: (value: UserFormSchema) => void;
  isPending: boolean;
};

export const UserFormInner: React.FC<UserFormInnerProps> = ({
  onCreateUserSubmit,
  isPending,
}) => {
  const form = useFormContext<UserFormSchema>();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={form.handleSubmit(onCreateUserSubmit)}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold flex">Nama Pegawai</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
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
        </div>

        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold flex">Role</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value ? field.value.toString() : "1"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Admin</SelectItem>
                    <SelectItem value="2">User</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Menambahkan..." : "Bikin User!"}
          </Button>
        </div>
      </div>
    </form>
  );
};
