'use client'

import Image from 'next/image'
import {useId, useState} from 'react'

/** Sections of the one-page portfolio, in display order. Hardcoded on purpose. */
const SECTIONS = [
  {id: 'home', label: 'Home'},
  {id: 'projects', label: 'Projects'},
  {id: 'illustrations', label: 'Illustrations'},
  {id: 'characters', label: 'Characters'},
  {id: 'animations', label: 'Animations'},
  {id: 'contact', label: 'Contact'},
] as const

/** Resolved profile picture, ready to render. Built server-side in `site-sidebar.tsx`. */
export interface SidebarProfile {
  src: string
  alt: string
  lqip?: string
}

const TOGGLE_CLASS =
  'flex size-8 items-center justify-center rounded-md text-foreground/70 hover:bg-foreground/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss'

/**
 * Collapsible site navigation. Open by default. Closing slides the panel shut
 * to zero width while a floating "open" button fades in at the top-left.
 * Both states stay mounted so the transition can run in either direction.
 */
export function Sidebar({profile}: {profile: SidebarProfile | null}) {
  const [open, setOpen] = useState(true)
  const navId = useId()

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={navId}
        aria-label="Open sidebar"
        tabIndex={open ? -1 : 0}
        className={[
          'fixed top-3 left-3 z-20 border border-foreground/15 bg-background shadow-sm',
          'transition-[opacity,transform] duration-300 ease-in-out motion-reduce:transition-none',
          open ? 'pointer-events-none -translate-x-2 opacity-0' : 'translate-x-0 opacity-100 delay-150',
          TOGGLE_CLASS,
        ].join(' ')}
      >
        <MenuIcon className="size-4" />
      </button>

      <aside
        aria-hidden={!open}
        inert={!open}
        className={[
          'sticky top-0 h-screen shrink-0 overflow-hidden border-foreground/15 bg-background font-sans',
          'transition-[width] duration-300 ease-in-out motion-reduce:transition-none',
          open ? 'w-64 border-r' : 'w-0',
        ].join(' ')}
      >
        {/* Fixed-width inner so the content does not reflow while the width animates. */}
        <div
          className={[
            'flex h-full w-64 flex-col',
            'transition-[opacity,transform] duration-300 ease-in-out motion-reduce:transition-none',
            open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0',
          ].join(' ')}
        >
          <div className="flex items-center justify-end p-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-expanded={open}
              aria-controls={navId}
              aria-label="Close sidebar"
              className={TOGGLE_CLASS}
            >
              <ChevronIcon className="size-4" />
            </button>
          </div>

          <Avatar profile={profile} />

          <nav id={navId} aria-label="Sections" className="flex flex-1 flex-col overflow-y-auto px-3 pt-6 pb-6">
            <ul className="flex flex-col gap-1">
              {SECTIONS.map((section) => (
                <li
                  key={section.id}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-foreground/10 hover:text-moss"
                >
                  {section.label}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}

/**
 * Circular profile picture. Falls back to a neutral placeholder so the layout
 * holds its shape before an image is set in the Studio.
 */
function Avatar({profile}: {profile: SidebarProfile | null}) {
  const px = 96
  const frame =
    'mx-auto size-24 shrink-0 overflow-hidden rounded-full bg-foreground/5 ring-2 ring-moss/60'

  if (!profile) {
    return (
      <div className={frame} aria-hidden="true">
        <PersonIcon className="size-full p-[22%] text-foreground/40" />
      </div>
    )
  }

  return (
    <div className={frame}>
      <Image
        src={profile.src}
        alt={profile.alt}
        width={px}
        height={px}
        sizes={`${px}px`}
        priority
        placeholder={profile.lqip ? 'blur' : 'empty'}
        blurDataURL={profile.lqip}
        className="size-full object-cover"
      />
    </div>
  )
}

function PersonIcon({className}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.42 0-8 2.46-8 5.5V21h16v-1.5c0-3.04-3.58-5.5-8-5.5Z" />
    </svg>
  )
}

function MenuIcon({className}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />
    </svg>
  )
}

function ChevronIcon({className}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M10 3 5 8l5 5" />
    </svg>
  )
}
