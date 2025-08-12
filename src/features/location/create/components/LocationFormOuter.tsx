import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { locationFormSchema, LocationFormSchema } from "../forms/location";
import { LocationFormInner } from "./LocationFormInner";

export const LocationFormOuter = () => {
  const { mutate: createLocation, isPending: createLocationIsPending } =
    trpc.locations.create.useMutation({
      onSuccess: () => {
        toast.success("Berhasil!!", {
          description: "Ruangan berhasil ditambahkan",
        });

        form.reset();
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("Anda tidak memiliki akses!!", {
            description: "Silahkan login terlebih dahulu",
          });
        } else {
          toast.error("Ruangan gagal ditambahkan!!", {
            description: "Coba periksa kembali form anda!",
          });
        }
      },
    });

  const form = useForm<LocationFormSchema>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    disabled: createLocationIsPending,
  });

  function handleLocationSubmit(value: LocationFormSchema) {
    try {
      createLocation(value);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <LocationFormInner
        onLocationSubmit={handleLocationSubmit}
        isPending={createLocationIsPending}
      />
    </Form>
  );
};
