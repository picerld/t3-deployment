import Hero from "@/components/container/Hero";
import { PageContainer } from "@/components/container/PageContainer";
import { HeadMetaData } from "@/components/meta/HeadMetaData";

export default function Home() {
  return (
    <PageContainer isGuarded={false}>
      <HeadMetaData title="Beranda" />
      <Hero />
    </PageContainer>
  );
}
