import {stegaClean} from 'next-sanity'

const formatter = new Intl.DateTimeFormat('en', {year: 'numeric', month: 'long'})

/** Formats a Sanity `date` value. Cleans stega characters first so `Date` can parse it in draft mode. */
export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null
  const date = new Date(stegaClean(value))
  return Number.isNaN(date.getTime()) ? null : formatter.format(date)
}
