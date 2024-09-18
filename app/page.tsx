import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("./(map)/_components/map/Map"), {
  loading: () => <div>Loading....</div>,
  ssr: false,
});

export default function Page() {
  return (
    <div className="h-screen w-full">
      <MapWithNoSSR />
    </div>
  );
}
