export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center bg-black">
      <div className="w-[90%] h-[80%] flex overflow-hidden rounded-2xl shadow-2xl">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-1/2 bg-black flex flex-col justify-center px-20 gap-4 z-10"
        >
          {/* Logo */}
          <img
            src="/images/logo.png"
            width={90}
            alt="WRU Logo"
            className="mb-2"
          />

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-destructive leading-tight">
              Find Rugby Near YOU 
            </h1>

            <p className="text-lg text-muted-foreground max-w-md">
              Discover clubs, find matches, volunteer, and join inclusive
              rugby communities across Wales.
            </p>
          </div>

          {/* CTA LINKS */}
          <div className="flex flex-col gap-4 mt-4 text-gray-400">

            <Link
              href="/discover"
              className="text-xl font-semibold hover:text-destructive transition-colors"
            >
              Discover Clubs →
            </Link>

            <Link
              href="/get_involved"
              className="text-xl font-semibold hover:text-destructive transition-colors"
            >
              Get Involved →
            </Link>

            <Link
              href="/play_now"
              className="text-xl font-semibold hover:text-destructive transition-colors"
            >
              Play Now →
            </Link>

          </div>
        </motion.div>


        {/* RIGHT SIDE IMAGE */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-1/2 relative"
        >
          <div
            className="absolute inset-0 bg-cover bg-center clip-diagonal-reverse"
            style={{
              backgroundImage: "url('/images/cardiff lions.jpg')",
            }}
          />

          {/* subtle overlay for contrast */}
          <div className="absolute inset-0 bg-black/20 clip-diagonal-reverse" />
        </motion.div>

      </div>
    </main>
  )
    <div className=""></div>
  );
}
