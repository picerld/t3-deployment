import { useFormContext } from "react-hook-form";
import type { LocationFormSchema } from "../create/forms/location";
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
  onLocationUpdateSubmit: (value: LocationFormSchema) => void;
};

export const LocationUpdateFormInner: React.FC<
  CategoryUpdateFormInnerProps
> = ({ isPending, open, onOpenChange, onLocationUpdateSubmit }) => {
  const form = useFormContext<LocationFormSchema>();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Ruangan</DialogTitle>
          <DialogDescription className="text-base">
            Ubah ruangan dan klik simpan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onLocationUpdateSubmit)}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Ruangan</FormLabel>
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
