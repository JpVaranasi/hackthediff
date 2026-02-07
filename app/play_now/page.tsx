"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"

// --------------------
// utils
// --------------------
function addDays(date: Date, n: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function minutesFromHHMM(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

function formatLongDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function toISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function parseISODate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

function isBetweenDates(itemISO: string, fromISO?: string, toISO?: string) {
  if (!fromISO && !toISO) return true
  const t = parseISODate(itemISO).getTime()
  const from = fromISO ? parseISODate(fromISO).getTime() : -Infinity
  const to = toISO ? parseISODate(toISO).getTime() : Infinity
  return t >= from && t <= to
}

function isWithinTimeWindow(itemHHMM: string, fromHHMM?: string, toHHMM?: string) {
  if (!fromHHMM && !toHHMM) return true
  const t = minutesFromHHMM(itemHHMM)
  const from = fromHHMM ? minutesFromHHMM(fromHHMM) : 0
  const to = toHHMM ? minutesFromHHMM(toHHMM) : 24 * 60
  return t >= from && t <= to
}

function inNextNDays(itemISO: string, fromDate: Date, n: number) {
  const start = new Date(fromDate)
  start.setHours(0, 0, 0, 0)
  const end = addDays(start, n)
  const d = new Date(`${itemISO}T12:00:00`)
  return d >= start && d < end
}

function startsSoonRank(item: Opportunity, fromDate: Date) {
  const base = new Date(`${item.date}T00:00:00`).getTime()
  const mins = minutesFromHHMM(item.time)
  const from = new Date(fromDate)
  from.setHours(0, 0, 0, 0)
  const deltaDays = Math.floor((base - from.getTime()) / (24 * 60 * 60 * 1000))
  return deltaDays * 24 * 60 + mins
}

// --------------------
// types and mock data
// --------------------
type TeamType = "Women" | "Mixed"

type Opportunity = {
  id: string
  date: string
  time: string
  club: string
  location: string
  format: string
  sessionType: string
  need: string
  level: string
  audience: string[]
  tags: string[]
  teamType: TeamType
  logoUrl?: string
}

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "1",
    date: "2026-02-07",
    time: "14:00",
    club: "Cardiff Lions RFC",
    location: "Cardiff",
    format: "XV",
    sessionType: "Fixture cover",
    need: "Need 1 prop, 1 winger",
    level: "Beginner friendly",
    audience: ["Beginner friendly"],
    tags: ["Short notice", "Flexible"],
    teamType: "Mixed",
    logoUrl: "https://placehold.co/96x96?text=CL",
  },
  {
    id: "2",
    date: "2026-02-07",
    time: "11:00",
    club: "Newport Social Touch",
    location: "Newport",
    format: "Social",
    sessionType: "Social session",
    need: "Any position welcome",
    level: "All levels",
    audience: ["Beginner friendly", "LGBTQ plus friendly"],
    tags: ["No commitment", "Bring a mate"],
    teamType: "Mixed",
    logoUrl: "https://placehold.co/96x96?text=NS",
  },
  {
    id: "3",
    date: "2026-02-08",
    time: "10:30",
    club: "Swansea RFC Women",
    location: "Swansea",
    format: "XV",
    sessionType: "Training session",
    need: "Need 2 forwards",
    level: "Intermediate",
    audience: [],
    tags: [],
    teamType: "Women",
    logoUrl: "https://placehold.co/96x96?text=SW",
  },
  {
    id: "4",
    date: "2026-02-09",
    time: "19:00",
    club: "Pontypridd RFC",
    location: "Pontypridd",
    format: "Social",
    sessionType: "Casual training",
    need: "Need 3 players, any role",
    level: "Beginner friendly",
    audience: ["LGBTQ plus friendly"],
    tags: ["Flexible"],
    teamType: "Mixed",
    logoUrl: "https://placehold.co/96x96?text=PR",
  },
]

// --------------------
// UI bits
// --------------------
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1 text-xs transition",
        active ? "border-black/20 bg-black/10" : "border-black/10 bg-white hover:bg-black/5",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-black/10 bg-black/5 px-2.5 py-1 text-[11px]">
      {children}
    </span>
  )
}

function Logo({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="h-12 w-12 overflow-hidden rounded-2xl border border-black/10 bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src || "https://placehold.co/96x96?text=Club"} alt={alt} className="h-full w-full object-cover" />
    </div>
  )
}

function Tile({ item, onOpen }: { item: Opportunity; onOpen: (it: Opportunity) => void }) {
  return (
    <button
      onClick={() => onOpen(item)}
      className="group w-[300px] shrink-0 rounded-2xl border border-black/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Logo src={item.logoUrl} alt={item.club} />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{item.club}</div>
            <div className="mt-1 text-xs text-black/70">
              {item.location} · {item.format} · {item.teamType}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-black/5 px-2 py-1 text-xs font-semibold">{item.time}</div>
      </div>

      <div className="mt-3 text-sm">{item.sessionType}</div>
      <div className="mt-1 line-clamp-2 text-xs text-black/70">{item.need}</div>

      <div className="mt-3 flex flex-wrap gap-2">
        {item.level ? <Pill>{item.level}</Pill> : null}
        {(item.audience || []).slice(0, 1).map((a) => (
          <Pill key={a}>{a}</Pill>
        ))}
        {(item.tags || []).slice(0, 1).map((t) => (
          <Pill key={t}>{t}</Pill>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-black/60">{formatLongDate(new Date(`${item.date}T12:00:00`))}</div>
        <div className="text-xs font-semibold text-black/70 group-hover:text-black">View</div>
      </div>
    </button>
  )
}

function Row({
  title,
  subtitle,
  items,
  onOpen,
}: {
  title: string
  subtitle?: string
  items: Opportunity[]
  onOpen: (it: Opportunity) => void
}) {
  if (!items.length) return null
  return (
    <div className="mt-7">
      <div>
        <div className="text-lg font-semibold">{title}</div>
        {subtitle ? <div className="mt-1 text-xs text-black/60">{subtitle}</div> : null}
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
        {items.map((it) => (
          <Tile key={it.id} item={it} onOpen={onOpen} />
        ))}
      </div>
    </div>
  )
}

function Drawer({
  open,
  item,
  onClose,
}: {
  open: boolean
  item: Opportunity | null
  onClose: () => void
}) {
  if (!open || !item) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="border-b border-black/10 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-start gap-3">
                  <Logo src={item.logoUrl} alt={item.club} />
                  <div className="min-w-0">
                    <div className="truncate text-xl font-semibold">{item.club}</div>
                    <div className="mt-1 text-sm text-black/70">
                      {formatLongDate(new Date(`${item.date}T12:00:00`))} · {item.time}
                    </div>
                    <div className="mt-1 text-sm text-black/70">
                      {item.location} · {item.format} · {item.teamType}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm hover:bg-black/5"
              >
                Close
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
              <div className="text-sm font-semibold">Session</div>
              <div className="mt-1 text-sm text-black/80">{item.sessionType}</div>
              <div className="mt-3 text-sm font-semibold">Need</div>
              <div className="mt-1 text-sm text-black/80">{item.need}</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.level ? <Pill>{item.level}</Pill> : null}
              {(item.audience || []).map((a) => (
                <Pill key={a}>{a}</Pill>
              ))}
              {(item.tags || []).map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
              {item.teamType ? <Pill>{item.teamType} team</Pill> : null}
            </div>

            <div className="mt-6 text-xs text-black/60">
              Replace this with sign up flow, chat, or organiser details.
            </div>
          </div>

          <div className="border-t border-black/10 p-5">
            <Button className="w-full rounded-xl">Join</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TopPickCard({ item, onDetails }: { item: Opportunity | null; onDetails: (it: Opportunity) => void }) {
  if (!item) return null
  return (
    <div className="mt-5 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs text-black/60">Top pick</div>
          <div className="mt-1 flex items-start gap-3">
            <Logo src={item.logoUrl} alt={item.club} />
            <div className="min-w-0">
              <div className="truncate text-2xl font-semibold">{item.club}</div>
              <div className="mt-2 text-sm text-black/70">
                {formatLongDate(new Date(`${item.date}T12:00:00`))} · {item.time} · {item.location}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Pill>{item.format}</Pill>
                <Pill>{item.teamType}</Pill>
                {item.level ? <Pill>{item.level}</Pill> : null}
              </div>
              <div className="mt-3 text-sm">{item.need}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => onDetails(item)}>
            Details
          </Button>
          <Button className="rounded-xl" onClick={() => onDetails(item)}>
            Join
          </Button>
        </div>
      </div>
    </div>
  )
}

// --------------------
// page
// --------------------
export default function PlayNowNetflixPage() {
  const [today] = React.useState(() => new Date("2026-02-07T12:00:00"))

  // search controls
  const [query, setQuery] = React.useState("")
  const [dateFrom, setDateFrom] = React.useState(toISODate(today))
  const [dateTo, setDateTo] = React.useState("")
  const [timeFrom, setTimeFrom] = React.useState("")
  const [timeTo, setTimeTo] = React.useState("")

  const [searchOpen, setSearchOpen] = React.useState(false)
  const [anytimeDate, setAnytimeDate] = React.useState(false)
  const [anytimeTime, setAnytimeTime] = React.useState(false)

  // filters
  const [beginner, setBeginner] = React.useState(false)
  const [lgbtq, setLgbtq] = React.useState(false)
  const [social, setSocial] = React.useState(false)
  const [teamType, setTeamType] = React.useState<"all" | "women" | "mixed">("all")

  // drawer
  const [open, setOpen] = React.useState(false)
  const [activeItem, setActiveItem] = React.useState<Opportunity | null>(null)

  // rotating top picks
  const [heroIndex, setHeroIndex] = React.useState(0)

  function openItem(item: Opportunity) {
    setActiveItem(item)
    setOpen(true)
  }

  const filtered = React.useMemo(() => {
    let out = MOCK_OPPORTUNITIES

    if (!anytimeDate) out = out.filter((x) => isBetweenDates(x.date, dateFrom, dateTo))
    if (!anytimeTime) out = out.filter((x) => isWithinTimeWindow(x.time, timeFrom, timeTo))

    if (teamType === "women") out = out.filter((x) => x.teamType === "Women")
    if (teamType === "mixed") out = out.filter((x) => x.teamType === "Mixed")

    if (beginner) out = out.filter((x) => (x.audience || []).includes("Beginner friendly") || x.level === "Beginner friendly")
    if (lgbtq) out = out.filter((x) => (x.audience || []).includes("LGBTQ plus friendly"))
    if (social) out = out.filter((x) => x.format === "Social" || x.sessionType.toLowerCase().includes("social"))

    if (query.trim()) {
      const q = query.toLowerCase()
      out = out.filter((x) =>
        [x.club, x.location, x.need, x.sessionType, x.format, x.teamType]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    }

    return out.slice().sort((a, b) => startsSoonRank(a, today) - startsSoonRank(b, today))
  }, [query, dateFrom, dateTo, timeFrom, timeTo, anytimeDate, anytimeTime, beginner, lgbtq, social, teamType, today])

  const heroCandidates = React.useMemo(() => {
    const anchor = !anytimeDate && dateFrom ? parseISODate(dateFrom) : today
    return filtered.filter((x) => inNextNDays(x.date, anchor, 7)).slice(0, 5)
  }, [filtered, dateFrom, anytimeDate, today])

  React.useEffect(() => {
    setHeroIndex(0)
  }, [query, dateFrom, dateTo, timeFrom, timeTo, anytimeDate, anytimeTime, beginner, lgbtq, social, teamType])

  React.useEffect(() => {
    if (!heroCandidates.length) return
    const t = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroCandidates.length)
    }, 4500)
    return () => clearInterval(t)
  }, [heroCandidates])

  const hero = heroCandidates.length ? heroCandidates[heroIndex % heroCandidates.length] : (filtered[0] || null)

  const startingSoon = filtered.slice(0, 10)
  const nearby = filtered.filter((x) => ["Cardiff", "Newport"].includes(x.location)).slice(0, 10)
  const beginnerRow = filtered.filter((x) => (x.audience || []).includes("Beginner friendly") || x.level === "Beginner friendly").slice(0, 10)
  const socialRow = filtered.filter((x) => x.format === "Social" || x.sessionType.toLowerCase().includes("social")).slice(0, 10)
  const lgbtqRow = filtered.filter((x) => (x.audience || []).includes("LGBTQ plus friendly")).slice(0, 10)
  const womenRow = filtered.filter((x) => x.teamType === "Women").slice(0, 10)
  const mixedRow = filtered.filter((x) => x.teamType === "Mixed").slice(0, 10)

  const dateSummary = anytimeDate
    ? "Anytime"
    : `${dateFrom || "Anytime"}${dateTo ? ` – ${dateTo}` : ""}`

  const timeSummary = anytimeTime
    ? "Any time"
    : `${timeFrom || "Any time"}${timeTo ? `–${timeTo}` : ""}`

  const totalActiveFilters =
    (query.trim() ? 1 : 0) +
    (anytimeDate ? 1 : 0) +
    (anytimeTime ? 1 : 0) +
    (!anytimeDate && (dateFrom || dateTo) ? 1 : 0) +
    (!anytimeTime && (timeFrom || timeTo) ? 1 : 0) +
    (beginner ? 1 : 0) +
    (lgbtq ? 1 : 0) +
    (social ? 1 : 0) +
    (teamType !== "all" ? 1 : 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <ThemeToggle />

        <div className="mt-2 text-4xl font-extrabold tracking-tight" style={{ color: "var(--wru-red)" }}>
          PLAY NOW
        </div>


        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">Search</div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm">
                Active filters {totalActiveFilters}
              </div>

              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-black/5"
              >
                {searchOpen ? "Done ✓" : `${dateSummary} · ${timeSummary} ✈️`}
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1fr,240px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Club, location, role, format"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />

            <div className="flex flex-wrap items-center justify-end gap-2">
              <Chip active={anytimeDate} onClick={() => setAnytimeDate((v) => !v)}>Any date</Chip>
              <Chip active={anytimeTime} onClick={() => setAnytimeTime((v) => !v)}>Any time</Chip>
            </div>
          </div>

          {searchOpen ? (
            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-black/5 p-3">
                <div className="text-xs font-semibold text-black/60">Date range</div>
                {anytimeDate ? (
                  <div className="mt-2 text-sm text-black/70">Anytime</div>
                ) : (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <div className="mb-1 text-[11px] font-semibold text-black/60">From</div>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                      />
                    </div>
                    <div>
                      <div className="mb-1 text-[11px] font-semibold text-black/60">To</div>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-black/10 bg-black/5 p-3">
                <div className="text-xs font-semibold text-black/60">Time window</div>
                {anytimeTime ? (
                  <div className="mt-2 text-sm text-black/70">Anytime</div>
                ) : (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <div className="mb-1 text-[11px] font-semibold text-black/60">From</div>
                      <input
                        type="time"
                        value={timeFrom}
                        onChange={(e) => setTimeFrom(e.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                      />
                    </div>
                    <div>
                      <div className="mb-1 text-[11px] font-semibold text-black/60">To</div>
                      <input
                        type="time"
                        value={timeTo}
                        onChange={(e) => setTimeTo(e.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="text-xs font-semibold text-black/60">Filters</div>
            <Chip active={beginner} onClick={() => setBeginner((v) => !v)}>Beginner friendly</Chip>
            <Chip active={lgbtq} onClick={() => setLgbtq((v) => !v)}>LGBTQ plus friendly</Chip>
            <Chip active={social} onClick={() => setSocial((v) => !v)}>Social</Chip>
            <div className="mx-1 h-5 w-px bg-black/10" />
            <Chip active={teamType === "all"} onClick={() => setTeamType("all")}>All teams</Chip>
            <Chip active={teamType === "women"} onClick={() => setTeamType(teamType === "women" ? "all" : "women")}>Women</Chip>
            <Chip active={teamType === "mixed"} onClick={() => setTeamType(teamType === "mixed" ? "all" : "mixed")}>Mixed</Chip>

            <button
              onClick={() => {
                setQuery("")
                setDateFrom(toISODate(today))
                setDateTo("")
                setTimeFrom("")
                setTimeTo("")
                setAnytimeDate(false)
                setAnytimeTime(false)
                setBeginner(false)
                setLgbtq(false)
                setSocial(false)
                setTeamType("all")
              }}
              className="ml-auto rounded-full border border-black/10 bg-white px-3 py-1 text-xs hover:bg-black/5"
            >
              Clear
            </button>
          </div>
        </div>

        <TopPickCard item={hero} onDetails={openItem} />

        <Row title="Starting soon" subtitle="Earliest sessions first" items={startingSoon} onOpen={openItem} />
        <Row title="Near you" subtitle="Cardiff and Newport" items={nearby} onOpen={openItem} />
        <Row title="Beginner friendly" subtitle="Good first session options" items={beginnerRow} onOpen={openItem} />
        <Row title="Social" subtitle="Low commitment sessions" items={socialRow} onOpen={openItem} />
        <Row title="LGBTQ plus friendly" subtitle="Inclusive sessions" items={lgbtqRow} onOpen={openItem} />
        <Row title="Women team" subtitle="Women only sessions" items={womenRow} onOpen={openItem} />
        <Row title="Mixed gender" subtitle="Mixed team sessions" items={mixedRow} onOpen={openItem} />

        <Drawer open={open} item={activeItem} onClose={() => setOpen(false)} />

      </div>
    </div>
  )
}
