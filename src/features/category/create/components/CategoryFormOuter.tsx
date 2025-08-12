import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { CategoryFormSchema, categoryFormSchema } from "../forms/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { CategoryFormInner } from "./CategoryFormInner";

export const CategoryFormOuter = () => {
  const { mutate: createCategory, isPending: createCategoryIsPending } =
    trpc.categories.create.useMutation({
      onSuccess: () => {
        toast.success("Berhasil!!", {
          description: "Kategori berhasil ditambahkan",
        });

        form.reset();
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("Anda tidak memiliki akses!!", {
            description: "Silahkan login terlebih dahulu",
          });
        } else {
          toast.error("Kategori gagal ditambahkan!!", {
            description: "Coba periksa kembali form anda!",
          });
        }
      },
    });

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    disabled: createCategoryIsPending,
  });

  function handleCategorySubmit(value: CategoryFormSchema) {
    try {
      createCategory(value);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <CategoryFormInner
        onCategorySubmit={handleCategorySubmit}
        isPending={createCategoryIsPending}
      />
    </Form>
  );
};
