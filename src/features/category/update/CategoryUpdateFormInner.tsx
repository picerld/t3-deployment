import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CategoryFormSchema } from "../create/forms/category";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CategoryUpdateFormInnerProps = {
  isPending: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryUpdateSubmit: (value: CategoryFormSchema) => void;
};

export const CategoryUpdateFormInner: React.FC<CategoryUpdateFormInnerProps> = ({
  isPending,
  open,
  onOpenChange,
  onCategoryUpdateSubmit,
}) => {
  const form = useFormContext<CategoryFormSchema>();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Kategori</DialogTitle>
          <DialogDescription className="text-base">
            Ubah kategori dan klik simpan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onCategoryUpdateSubmit)}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kategori</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
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
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button disabled={isPending} variant="neutral">
                Tidak, Kembali.
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Ya, Perbarui!"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
