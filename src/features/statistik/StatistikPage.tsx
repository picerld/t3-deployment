import { Header } from "@/components/container/Header";
import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import ChartYearItem from "./components/ChartYearItem";
import ChartPieLabelList from "./components/ChartPieItem";

export default function StatistikPage() {
  return (
    <GuardedLayout>
      <HeadMetaData title="Statistik" />
      <Header
        title="Statistik Analitik"
        subtitle="Analitik pencatatan barang."
      />

      <div className="grid md:grid-cols-2 grid-cols-1 gap-10">
        <ChartYearItem />
        <ChartPieLabelList />
      </div>
    </GuardedLayout>
  );
}
