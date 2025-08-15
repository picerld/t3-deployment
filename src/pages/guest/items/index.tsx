import { PageContainer } from "@/components/container/PageContainer";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { ItemPageContainer } from "@/features/guest/item/ItemPageContainer";

export default function GuestItems() {
  return (
    <PageContainer isGuarded={false}>
      <HeadMetaData title="Barang Tercatat" />

      <ItemPageContainer />
    </PageContainer>
  );
}
