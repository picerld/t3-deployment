import { useFormContext } from "react-hook-form";
import { CategoryFormSchema } from "../forms/category";
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

type CategoryFormInnerProps = {
  onCategorySubmit: (value: CategoryFormSchema) => void;
  isPending: boolean;
};

export const CategoryFormInner: React.FC<CategoryFormInnerProps> = ({
  onCategorySubmit,
  isPending,
}) => {
  const form = useFormContext<CategoryFormSchema>();

  return (
    <form onSubmit={form.handleSubmit(onCategorySubmit)}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold flex">Nama Kategori</FormLabel>
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
              <FormDescription>Isi keterangan untuk kategori</FormDescription>
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
