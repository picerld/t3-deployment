import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  CircleCheck,
  CloudAlert,
  Info,
  Loader,
  Trash,
} from "lucide-react";

export const OnDeleteLoadingDialog = ({
  status,
  handleSubmit,
}: {
  status: "idle" | "loading" | "success" | "error";
  handleSubmit: () => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"noShadow"}>
          <Trash className="!size-4" strokeWidth={2.5} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex items-center">
          {status === "loading" && (
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white">
              <Info className="text-main size-8" strokeWidth={2.5} />
            </div>
          )}

          {status === "error" && (
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white">
              <CloudAlert className="text-main size-8" strokeWidth={2.5} />
            </div>
          )}

          {status === "idle" && (
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white">
              <AlertTriangle className="text-main size-8" strokeWidth={2.5} />
            </div>
          )}

          {status === "success" && (
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white">
              <CircleCheck className="text-main size-8" strokeWidth={2.5} />
            </div>
          )}

          <DialogTitle className="text-xl">
            {status === "loading" && "Memproses..."}

            {status === "error" && "Oops, terjadi kesalahan."}

            {status === "success" && "Sukses!!"}

            {status === "idle" && "Kamu yakin mau menghapus?"}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {status === "loading" && "Memproses permintaan anda..."}

            {status === "error" && "Gagal untuk menghapus ini."}

            {status === "success" && "Data ini berhasil dihapus."}

            {status === "idle" &&
              "Setelah dihapus, kamu tidak bisa mengembalikan data tersebut!"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex pt-5">
          <DialogClose asChild className="w-1/2" disabled={status !== "idle"}>
            <Button variant="neutral">Tidak, Kembali.</Button>
          </DialogClose>
          <Button
            className="w-1/2"
            disabled={status !== "idle"}
            onClick={() => {
              handleSubmit();
            }}
          >
            {status === "loading" ? (
              <Loader className="mr-2 animate-spin" />
            ) : (
              "Ya, Hapus!"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
