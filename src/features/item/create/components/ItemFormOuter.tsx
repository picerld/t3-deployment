import { Form } from "@/components/ui/form";
import { trpc } from "@/utils/trpc";
import { useForm } from "react-hook-form";
import { itemFormSchema, ItemFormSchema } from "../forms/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ItemFormInner } from "./ItemFormInner";

export const ItemFormOuter = () => {
  const { mutate: createItem, isPending: createItemIsPending } =
    trpc.items.create.useMutation({
      onSuccess: () => {
        toast.success("Berhasil!!", {
          description: "Barang berhasil dicatatkan!",
        });

        form.reset();
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("Anda tidak memiliki akses!!", {
            description: "Silahkan login terlebih dahulu",
          });
        } else {
          toast.error("Barang gagal ditambahkan!!", {
            description: "Coba periksa kembali form anda!",
          });
        }
      },
    });

  const form = useForm<ItemFormSchema>({
    // @ts-expect-error resolver
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: "",
      merk: "",
      quantity: 0,
      color: "",
      ownerType: "SEGARIS",
      serialNumber: "",
      condition: "BAIK",
      history: "",
    },
    disabled: createItemIsPending,
  });

  function handleItemSubmit(value: ItemFormSchema) {
    try {
      createItem(value);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <ItemFormInner
        onItemSubmit={handleItemSubmit}
        isPending={createItemIsPending}
      />
    </Form>
  );
};
