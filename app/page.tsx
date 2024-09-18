import dynamic from "next/dynamic";
import { Header } from "./_components/Header";

const MapWithNoSSR = dynamic(() => import("./(map)/Map/Map"), {
  loading: () => <div>Loading....</div>,
  ssr: false,
});

export default function Page() {
  return (
    <div>
      <Header />
      <div className="h-screen w-full">
        <MapWithNoSSR />
      </div>
    </div>
  );
}
