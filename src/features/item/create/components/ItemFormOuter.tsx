import { Form } from "@/components/ui/form";
import { trpc } from "@/utils/trpc";
import { useForm } from "react-hook-form";
import { itemFormSchema, type ItemFormSchema } from "../forms/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ItemFormInner } from "./ItemFormInner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import supabase from "@/config/supabase";

export const ItemFormOuter = () => {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<ItemFormSchema>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: "",
      merk: "",
      categoryId: undefined,
      quantity: 0,
      userId: "",
      color: "",
      ownerType: "SEGARIS",
      locationId: undefined,
      serialNumber: "",
      condition: "BAIK",
      history: "",
      detail: "",
      photo: undefined,
    },
  });

  const { mutate: createItem, isPending: createItemIsPending } =
    trpc.items.create.useMutation({
      onSuccess: () => {
        toast.success("Berhasil!!", {
          description: "Barang berhasil dicatatkan!",
        });

        form.reset();

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
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

  // NOTE: USING UPLOAD FOLDER API
  // async function handleItemSubmit(values: ItemFormSchema) {
  //   let photoUrl: string | null = null;

  //   if (values.photo instanceof File) {
  //     const formData = new FormData();
  //     formData.append("file", values.photo);

  //     const uploadRes = await fetch("/api/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!uploadRes.ok) {
  //       toast.error("Gagal mengunggah foto");
  //       return;
  //     }

  //     const data = await uploadRes.json();
  //     photoUrl = data.url;
  //   } else if (typeof values.photo === "string") {
  //     photoUrl = values.photo;
  //   }

  //   createItem({
  //     ...values,
  //     photo: photoUrl,
  //   });
  // }

  async function handleItemSubmit(values: ItemFormSchema) {
    try {
      let photoUrl: string | null = null;

      if (selectedFile) {
        const filename = `${Date.now()}-${selectedFile.name}`;
        const uploadResult = await supabase.storage
          .from("segaris-image")
          .upload(filename, selectedFile);

        if (uploadResult.error) {
          toast.error("Oops! Gagal mengunggah foto", {
            description: uploadResult.error.message,
          });
          return;
        }

        const publicUrlResult = supabase.storage
          .from("segaris-image")
          .getPublicUrl(filename);

        photoUrl = publicUrlResult.data.publicUrl;

        createItem({
          ...values,
          photo: photoUrl,
        });
      } else {
        createItem({
          ...values,
          photo: null,
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Terjadi kesalahan saat mengunggah foto.");
    } finally {
      setSelectedFile(null);
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <ItemFormInner
        onItemSubmit={handleItemSubmit}
        isPending={createItemIsPending}
        setSelectedFile={setSelectedFile}
      />
    </Form>
  );
};
