import dynamic from 'next/dynamic'

const MapWithNoSSR = dynamic(() => import('../components/Map'), {
  ssr: false,
})

export default function Home() {
  return (
    <div className="h-screen w-full">
      <MapWithNoSSR />
    </div>
  )
}
