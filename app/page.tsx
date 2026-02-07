import {Button} from '@/components/ui/button'
import MapView from '@/components/MapView'
import Link from 'next/link'
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-black dark:bg-black sm:items-start">
          <Link href="/discover">
          <Button>Discover</Button>
          </Link>
          <MapView />
        </main>
        </div>

  );
}
