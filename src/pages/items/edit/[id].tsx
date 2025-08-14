import { useRouter } from "next/router";
import ItemDetailPage from "@/features/item/update/ItemUpdatePage";

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  if (!id) return null;

  return <ItemDetailPage params={{ id }} />;
}
