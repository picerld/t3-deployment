import { useFormContext } from "react-hook-form";
import { type ItemFormSchema } from "../forms/item";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/utils/trpc";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PhotoUploadCard } from "./PhotoUploadCard";

type ItemFormInnerProps = {
  isPending: boolean;
  onItemSubmit: (value: ItemFormSchema) => void;
};

export const ItemFormInner: React.FC<ItemFormInnerProps> = ({
  isPending,
  onItemSubmit,
}) => {
  const { data: categories, isLoading: categoriesIsLoading } =
    trpc.categories.getAll.useQuery();

  const { data: users, isLoading: usersIsLoading } =
    trpc.users.getAll.useQuery();

  const { data: locations, isLoading: locationIsLoading } =
    trpc.locations.getAll.useQuery();

  const form = useFormContext<ItemFormSchema>();

  return (
    <form onSubmit={form.handleSubmit(onItemSubmit)}>
      <div className="space-y-6">
        <PhotoUploadCard />

        <div className="grid grid-cols-2 gap-10">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex font-bold">Nama Barang</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="merk"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex font-bold">Merk</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="detail"
          render={({ field }) => (
            <FormItem className="flex flex-1 flex-col">
              <FormLabel className="flex font-bold">
                Detail Spesifikasi (opsional)
              </FormLabel>
              <FormControl className="flex-1">
                <Textarea rows={10} {...field} />
              </FormControl>
              <FormDescription>
                Contoh: Spesifikasi, ram, layar, dll
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-10">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex font-bold">
                  Kategori Barang
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesIsLoading ? (
                        <p>Loading...</p>
                      ) : (
                        categories?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex font-bold">Warna Barang</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex font-bold">Kondisi Barang</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kondisi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BAIK">BAIK</SelectItem>
                    <SelectItem value="RUSAK">RUSAK</SelectItem>
                    <SelectItem value="PERBAIKAN">PERBAIKAN</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-10">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex font-bold">Kuantiti</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        field.onChange(Number(value));
                      }
                    }}
                    disabled={isPending}
                    type="text"
                  />
                </FormControl>
                <FormDescription>Ketikan angka!</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex font-bold">Serial Number</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormDescription>
                  Pastikan serial number barang sudah sesuai!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-10">
          <FormField
            control={form.control}
            name="ownerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex font-bold">
                  Jenis Kepemilikan
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEGARIS">Segaris</SelectItem>
                      <SelectItem value="IMN">IMN</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="locationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex font-bold">Ruangan</FormLabel>
                <FormControl>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih ruangan" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationIsLoading ? (
                        <p>Loading...</p>
                      ) : (
                        locations?.map((location) => (
                          <SelectItem
                            key={location.id}
                            value={location.id.toString()}
                          >
                            {location.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex font-bold">Penanggung Jawab</FormLabel>
              <FormControl>
                <Select
                  value={field.value?.toString()}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih penanggung jawab" />
                  </SelectTrigger>
                  <SelectContent>
                    {usersIsLoading ? (
                      <p>Loading...</p>
                    ) : (
                      users?.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name ?? user.username}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="history"
          render={({ field }) => (
            <FormItem className="flex flex-1 flex-col">
              <FormLabel className="flex font-bold">
                Histori Penggunaan
              </FormLabel>
              <FormControl className="flex-1">
                <Textarea rows={10} {...field} />
              </FormControl>
              <FormDescription>
                Histori barang harus lengkap dan jelas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-20 flex justify-end gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full sm:max-w-[150px]"
        >
          {isPending ? "Loading..." : "Catat Barang!"}
        </Button>
      </div>
    </form>
  );
};
