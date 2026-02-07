
'use client'

import MapView from '@/components/MapView'
import { clubs, type Club } from '@/lib/clubs'
import { calculateDistance } from '@/lib/distance'
import { useState, useMemo, useEffect } from 'react'
import { Filter, SortAsc, Star } from 'lucide-react'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null)
  const [tagFilter, setTagFilter] = useState<string[]>([]) // Multiple tags can be selected
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showTagMenu, setShowTagMenu] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedClubForReviews, setSelectedClubForReviews] = useState<Club | null>(null)
  const [selectedClubForHours, setSelectedClubForHours] = useState<Club | null>(null)

  // Available tags for filtering
  const availableTags = ['play', 'inclusive', 'volunteer', 'woman', 'LGBTQ']

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log('Geolocation error:', error)
        }
      )
    }
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const filterButton = document.querySelector('[data-filter-button]')
      const filterMenu = document.querySelector('[data-filter-menu]')
      const tagButton = document.querySelector('[data-tag-button]')
      const tagMenu = document.querySelector('[data-tag-menu]')

      if (
        showFilterMenu &&
        filterButton &&
        filterMenu &&
        !filterButton.contains(event.target as Node) &&
        !filterMenu.contains(event.target as Node)
      ) {
        setShowFilterMenu(false)
      }

      if (
        showTagMenu &&
        tagButton &&
        tagMenu &&
        !tagButton.contains(event.target as Node) &&
        !tagMenu.contains(event.target as Node)
      ) {
        setShowTagMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showFilterMenu, showTagMenu])

  // Determine which clubs to display
  const filteredClubs = useMemo(() => {
    let result: Club[] | (Club & { distance: number })[] = clubs

    if (searchQuery.trim()) {
      result = clubs.filter(club =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.postcode?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Add distance to clubs and sort by distance if location is available
    if (userLocation) {
      const clubsWithDistance: (Club & { distance: number })[] = result
        .map(club => ({
          ...club,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            club.lat,
            club.long
          ),
        }))
        .sort((a, b) => a.distance - b.distance)

      result = clubsWithDistance as (Club & { distance: number })[]

      // Apply distance filter
      if (distanceFilter !== null) {
        result = (result as (Club & { distance: number })[]).filter(club => club.distance <= distanceFilter)
      }
    }

    // Apply tag filter - show clubs that have at least one of the selected tags
    if (tagFilter.length > 0) {
      result = result.filter(club =>
        tagFilter.some(tag => club.tags.includes(tag))
      )
    }

    return result
  }, [searchQuery, userLocation, distanceFilter, tagFilter])

  return (
    <div className="flex h-screen w-screen bg-black font-sans overflow-hidden">
      {/* Club List Side - Left 50% */}
      <div className="w-1/2 h-full overflow-y-auto bg-gray-900">
        <div className="p-8 sticky top-0 bg-gray-900 z-10 border-b border-gray-700">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Discover</h1>
          </div>

          {/* Search Bar & Filter */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search clubs by name or postcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none transition"
              />
              
              {/* Distance Filter Icon */}
              {userLocation && (
                <div className="relative">
                  <button
                    data-filter-button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className={`p-2 rounded-lg transition flex items-center gap-2 ${
                      distanceFilter !== null
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    title="Filter by distance"
                  >
                    <Filter size={20} />
                    {distanceFilter !== null && <span className="text-xs font-semibold">{distanceFilter}km</span>}
                  </button>

                  {/* Distance Filter Dropdown Menu */}
                  {showFilterMenu && (
                    <div data-filter-menu className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
                      <div className="p-3 space-y-2">
                        <p className="text-gray-400 text-xs font-semibold px-2">Filter by distance</p>
                        <button
                          onClick={() => {
                            setDistanceFilter(null)
                            setShowFilterMenu(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                            distanceFilter === null
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          All Distances
                        </button>
                        <button
                          onClick={() => {
                            setDistanceFilter(1)
                            setShowFilterMenu(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                            distanceFilter === 1
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          Less than 1km
                        </button>
                        <button
                          onClick={() => {
                            setDistanceFilter(5)
                            setShowFilterMenu(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                            distanceFilter === 5
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          Less than 5km
                        </button>
                        <button
                          onClick={() => {
                            setDistanceFilter(10)
                            setShowFilterMenu(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                            distanceFilter === 10
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          Less than 10km
                        </button>
                        <button
                          onClick={() => {
                            setDistanceFilter(20)
                            setShowFilterMenu(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                            distanceFilter === 20
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          Less than 20km
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tag/Sort Filter Icon */}
              <div className="relative">
                <button
                  data-tag-button
                  onClick={() => setShowTagMenu(!showTagMenu)}
                  className={`p-2 rounded-lg transition flex items-center gap-2 ${
                    tagFilter.length > 0
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  title="Filter by tags"
                >
                  <SortAsc size={20} />
                  {tagFilter.length > 0 && <span className="text-xs font-semibold">{tagFilter.length}</span>}
                </button>

                {/* Tag Filter Dropdown Menu */}
                {showTagMenu && (
                  <div data-tag-menu className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
                    <div className="p-3 space-y-2">
                      <p className="text-gray-400 text-xs font-semibold px-2">Filter by tags</p>
                      {availableTags.map((tag) => (
                        <label key={tag} className="flex items-center px-3 py-2 rounded hover:bg-gray-700 cursor-pointer text-gray-300 text-sm">
                          <input
                            type="checkbox"
                            checked={tagFilter.includes(tag)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTagFilter([...tagFilter, tag])
                              } else {
                                setTagFilter(tagFilter.filter(t => t !== tag))
                              }
                            }}
                            className="mr-2 w-4 h-4 rounded bg-gray-700 border-gray-600"
                          />
                          <span className="capitalize">{tag}</span>
                        </label>
                      ))}
                      {tagFilter.length > 0 && (
                        <button
                          onClick={() => setTagFilter([])}
                          className="w-full text-left px-3 py-2 rounded text-sm text-gray-400 hover:bg-gray-700 transition mt-2 border-t border-gray-700 pt-3"
                        >
                          Clear all tags
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Results count */}
          {(searchQuery || distanceFilter !== null || tagFilter.length > 0) && (
            <p className="text-gray-400 text-sm mb-4">
              Found {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Club List */}
        <div className="px-8 pb-8">
          <div className="space-y-4">
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club: any) => (
                <div
                  key={club.id}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-750 transition cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-white">{club.name}</h2>
                      <button
                        onClick={() => setSelectedClubForReviews(club)}
                        className="flex gap-0.5 hover:opacity-80 transition cursor-pointer"
                        title="Click to view reviews"
                      >
                        {Array.from({ length: 5 }).map((_, i) => {
                          const ratingValue = club.rating ?? 0
                          const floor = Math.floor(ratingValue)
                          const frac = Math.max(0, Math.min(1, ratingValue - floor))
                          const width = i < floor ? '100%' : i === floor ? `${Math.round(frac * 100)}%` : '0%'
                          return (
                            <div key={i} className="relative">
                              <Star size={18} className="text-gray-600" />
                              <div
                                className="absolute top-0 left-0 overflow-hidden"
                                style={{ width }}
                              >
                                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                              </div>
                            </div>
                          )
                        })}
                      </button>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {club.opening_hours ? (
                        <div className="text-sm text-right">
                          <button
                            onClick={() => setSelectedClubForHours(club)}
                            className="text-gray-300 hover:text-white underline text-sm"
                            title="View opening hours"
                          >
                            View hours
                          </button>
                        </div>
                      ) : null}

                      {userLocation && 'distance' in club && club.distance !== undefined && (
                        <div className="text-sm font-semibold text-blue-400">
                          {(club.distance as number) < 1
                            ? `${((club.distance as number) * 1000).toFixed(0)}m`
                            : `${(club.distance as number).toFixed(1)}km`}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-400 text-sm">Tags:</span>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {club.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Training Days:</span>
                      <p className="text-white mt-1">{club.training_days.join(", ")}</p>
                    </div>
                    {club.postcode && (
                      <div>
                        <span className="text-gray-400 text-sm">Postcode:</span>
                        <p className="text-white mt-1 font-medium">{club.postcode}</p>
                      </div>
                    )}
                    {club.address && (
                      <div>
                        <span className="text-gray-400 text-sm">Address:</span>
                        <p className="text-white mt-1">{club.address}</p>
                      </div>
                    )}

                    {/* Opening time removed — use "View hours" to open modal */}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-400">No clubs found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Map Side - Right 50% */}
      <div className="w-1/2 h-full overflow-hidden">
        <MapView 
          showLiveLocation={true} 
          trackLocation={true} 
          showClubs={true}
        />
      </div>

      {/* Reviews Modal */}
      {selectedClubForReviews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedClubForReviews.name}</h2>
              <button
                onClick={() => setSelectedClubForReviews(null)}
                className="text-gray-400 hover:text-white transition text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = selectedClubForReviews.rating ? Math.floor(selectedClubForReviews.rating) > i : 0
                const half = selectedClubForReviews.rating ? selectedClubForReviews.rating % 1 !== 0 && Math.floor(selectedClubForReviews.rating) === i : false
                return (
                  <div key={i} className="relative">
                    <Star size={20} className="text-gray-600" />
                    <div
                      className="absolute top-0 left-0 overflow-hidden"
                      style={{
                        width: filled ? '100%' : half ? '50%' : '0%',
                      }}
                    >
                      <Star size={20} className="text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-3">
              <p className="text-gray-400 text-sm font-semibold">Reviews:</p>
              {selectedClubForReviews.reviews && selectedClubForReviews.reviews.length > 0 ? (
                selectedClubForReviews.reviews.map((review: string, index: number) => (
                  <div key={index} className="bg-gray-700 p-3 rounded-lg">
                    <p className="text-gray-200 text-sm">{review}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Opening Hours Modal */}
      {selectedClubForHours && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedClubForHours.name} — Opening Hours</h2>
              <button
                onClick={() => setSelectedClubForHours(null)}
                className="text-gray-400 hover:text-white transition text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="text-sm">
              <table className="w-full text-left">
                <tbody>
                  {Object.entries(selectedClubForHours.opening_hours as Record<string, string>).map(([day, hours]) => (
                    <tr key={day} className="border-b border-gray-700">
                      <td className="py-2 pr-4 text-gray-300 w-16">{day}</td>
                      <td className="py-2 text-white">{hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}