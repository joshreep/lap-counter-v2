import Image from 'next/image'

export default function Home() {
  return (
    <div className="bg-root-bg">
      <Image
        src="/splash.png"
        alt="Splash Screen Image"
        height={2778}
        width={1284}
        className="w-full"
      />
    </div>
  )
}
