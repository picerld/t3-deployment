import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, type LoginFormSchema } from "../forms/login";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { LoginFormInner } from "./LoginFormInner";
import { useRouter } from "next/navigation";

export const LoginFormOuter = () => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate: loginUser, isPending: loginIsPending } =
    trpc.auth.login.useMutation({
      onSuccess: async () => {
        toast.success("Berhasil Login", {
          description: "Selamat datang!!",
        });

        await utils.auth.authMe.invalidate();

        form.reset();

        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      },
      onError: () => {
        toast.error("Gagal Login", {
          description:
            "Username atau password anda salah, coba periksa kembali",
        });
      },
    });

  const handleLogin = (values: LoginFormSchema) => {
    loginUser(values);
  };

  return (
    <Form {...form}>
      <LoginFormInner onLoginSubmit={handleLogin} isPending={loginIsPending} />
    </Form>
  );
};
