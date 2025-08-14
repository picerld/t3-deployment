"use client";

import { useForm } from "react-hook-form";
import {
  locationFormSchema,
  type LocationFormSchema,
} from "../create/forms/location";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { LocationUpdateFormInner } from "./LocationUpdateFormInner";

type LocationUpdateFormOuterProps = {
  locationId: number;
  open: boolean;
  onClose: () => void;
};

export const LocationUpdateFormOuter = ({
  locationId,
  open,
  onClose,
}: LocationUpdateFormOuterProps) => {
  const form = useForm<LocationFormSchema>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      id: locationId,
      name: "",
      description: "",
    },
  });

  const { refetch } = trpc.locations.getById.useQuery(
    { id: locationId },
    { enabled: false },
  );

  const updateLocationMutation = trpc.locations.update.useMutation({
    onSuccess: () => {
      toast.success("Berhasil!!", {
        description: "Ruangan berhasil diperbarui!",
      });

      form.reset();
      onClose();

      setTimeout(() => window.location.reload(), 1000);
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Anda tidak memiliki akses!!", {
          description: "Silahkan login terlebih dahulu",
        });
      } else {
        toast.error("Kategori gagal diubah!!", {
          description: "Coba periksa kembali form anda!",
        });
      }
    },
  });

  useEffect(() => {
    if (open) {
      refetch().then((res) => {
        if (res.data) {
          form.reset({
            id: locationId,
            name: res.data.name ?? "",
            description: res.data.description ?? "",
          });
        }
      });
    }
  }, [open, locationId, refetch, form]);

  function handleUpdateLocation(data: LocationFormSchema) {
    updateLocationMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <LocationUpdateFormInner
        open={open}
        onOpenChange={(state) => !state && onClose()}
        isPending={updateLocationMutation.isPending}
        onLocationUpdateSubmit={handleUpdateLocation}
      />
    </Form>
  );
};
