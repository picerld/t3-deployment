import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema, type UserFormSchema } from "../forms/user";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { UserFormInner } from "./UserFormInner";

export const UserFormOuter = () => {
  const { mutate: createUser, isPending: createUserIsPending } =
    trpc.users.create.useMutation({
      onSuccess: () => {
        toast.success("Berhasil!!", {
          description: "User berhasil ditambahkan",
        });

        form.reset();
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("Anda tidak memiliki akses!!", {
            description: "Silahkan login terlebih dahulu",
          });
        } else {
          toast.error("User gagal ditambahkan!!", {
            description: "Coba periksa kembali form anda!",
          });
        }
      },
    });

  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      roleId: 2,
    },
    disabled: createUserIsPending,
  });

  function handleUserCreateSubmit(value: UserFormSchema) {
    try {
      createUser(value);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <UserFormInner
        onCreateUserSubmit={handleUserCreateSubmit}
        isPending={createUserIsPending}
      />
    </Form>
  );
};
