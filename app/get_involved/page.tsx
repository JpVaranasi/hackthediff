"use client"

import { Button } from '@/components/ui/button'
import { ThemeToggle } from "@/components/ThemeToggle"
import { EmblaCarousel } from '@/components/EmblaCarousel'

export default function GetInvolved() {
  const items = [
    { title: 'Item 1', description: 'Description 1', image: '/images/cardiff lions.jpg' },
    { title: 'Item 2', description: 'Description 2', image: '/images/cardiff lions.jpg' },
    { title: 'Item 3', description: 'Description 3', image: '/images/cardiff lions.jpg' },
    { title: 'Item 4', description: 'Description 4', image: '/images/cardiff lions.jpg' },
    { title: 'Item 5', description: 'Description 5', image: '/images/cardiff lions.jpg' },
    { title: 'Item 6', description: 'Description 6', image: '/images/cardiff lions.jpg' },
  ]

  const actionItems = [
    { title: "Join a club", image: "/images/hands.png" },
    { title: "Volunteer", image: "/images/hands.png" },
    { title: "Support", image: "/images/hands.png" },
  ]

  return (
    <>
      <ThemeToggle />

      {/* HERO */}
      <section className="mx-auto py-8">
        <div
          style={{ backgroundColor: 'var(--wru-red)' }}
          className="text-white overflow-hidden flex flex-col md:flex-row items-stretch"
        >
          <div className="md:w-1/2 p-8 flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl font-bold mb-3">GET INVOLVED</h1>
            <p className="mb-4 max-w-md">
              Many rugby clubs welcome players of all skill levels and backgrounds.
              Joining a club can provide a supportive community and opportunities
              for personal growth.
            </p>
          </div>

          <div className="md:w-1/2 h-56 md:h-auto">
            <img
              src="/images/cardiff lions.jpg"
              alt="Get Involved"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ACTIONS */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-10 text-center">
          Your Place in the Game
        </h2>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 justify-items-center max-w-4xl w-full">
            {actionItems.map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="flex justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-32 w-32 rounded-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  />
                </div>

                <h3 className="mt-4 text-center font-medium">
                  {item.title}
                </h3>

                <p className="mt-2 text-center text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-70">
                  Learn more
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLUBS */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Inclusive Rugby Clubs
        </h2>

        <EmblaCarousel
          items={items}
          cardsPerView={3}
          maxWidth="1200px"
        />
      </section>
    </>
  )
}
