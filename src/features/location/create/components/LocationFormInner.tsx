import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LocationFormSchema } from "../forms/location";

type LocationFormInnerProps = {
  onLocationSubmit: (value: LocationFormSchema) => void;
  isPending: boolean;
};

export const LocationFormInner: React.FC<LocationFormInnerProps> = ({
  onLocationSubmit,
  isPending,
}) => {
  const form = useFormContext<LocationFormSchema>();

  return (
    <form onSubmit={form.handleSubmit(onLocationSubmit)}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold flex">Nama Ruangan</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold flex">
                Keterangan (opsional)
              </FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>Isi keterangan untuk ruangan</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full">
          <Button
            type="submit"
            className="w-full py-6 text-base"
            disabled={isPending}
          >
            {isPending ? "Menyimpan..." : "Simpan!"}
          </Button>
        </div>
      </div>
    </form>
  );
};
