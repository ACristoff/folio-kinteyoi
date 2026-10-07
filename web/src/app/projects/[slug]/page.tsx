import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'
import {formatDate} from '@/components/format-date'
import {ProjectBody} from '@/components/project-body'
import {SanityImage} from '@/components/sanity-image'
import {cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions} from '@/sanity/live'
import {PROJECT_QUERY, PROJECT_SLUGS_QUERY} from '@/sanity/queries'

type Params = PageProps<'/projects/[slug]'>['params']

export async function generateStaticParams() {
  const {data} = await cachedSanity({
    query: PROJECT_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  })
  return data.flatMap(({slug}) => (slug ? [{slug}] : []))
}

export async function generateMetadata(props: PageProps<'/projects/[slug]'>): Promise<Metadata> {
  const {slug} = await props.params
  // Metadata always uses published content with stega disabled so no invisible characters reach <head>.
  const {data: project} = await cachedSanity({
    query: PROJECT_QUERY,
    params: {slug},
    perspective: 'published',
    stega: false,
  })
  if (!project) return {}
  return {
    title: project.title,
    description: project.summary ?? undefined,
  }
}

export default async function ProjectPage(props: PageProps<'/projects/[slug]'>) {
  const {isEnabled: isDraftMode} = await draftMode()

  // `params` is awaited inside the Suspense boundary so the route's static shell
  // renders instantly and the slug-specific content streams in (Cache Components).
  return (
    <Suspense fallback={<ProjectShell />}>
      {isDraftMode ? (
        <DynamicProject params={props.params} />
      ) : (
        <PublishedProject params={props.params} />
      )}
    </Suspense>
  )
}

async function PublishedProject({params}: {params: Params}) {
  const {slug} = await params
  return <Project slug={slug} perspective="published" stega={false} />
}

/** Draft mode: resolve cookie-dependent options outside the cache boundary. */
async function DynamicProject({params}: {params: Params}) {
  const {slug} = await params
  const options = await getDynamicFetchOptions()
  return <Project slug={slug} {...options} />
}

async function Project({slug, ...options}: {slug: string} & DynamicFetchOptions) {
  const {data: project} = await cachedSanity({query: PROJECT_QUERY, params: {slug}, ...options})
  if (!project) notFound()

  const published = formatDate(project.publishedAt)
  const links: Array<{label: string; href: string}> = []
  if (project.projectUrl) links.push({label: 'Visit site', href: project.projectUrl})
  if (project.repoUrl) links.push({label: 'View code', href: project.repoUrl})

  return (
    <ProjectShell>
      <header className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">{project.title}</h1>
        {(project.role || published) && (
          <p className="text-base text-foreground/60">
            {[project.role, published].filter(Boolean).join(' · ')}
          </p>
        )}
        {project.summary && (
          <p className="max-w-2xl text-xl leading-8 text-foreground/75">{project.summary}</p>
        )}
        {project.technologies && project.technologies.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <li
                key={technology}
                className="rounded-full border border-moss/50 px-3 py-1 text-sm text-moss"
              >
                {technology}
              </li>
            ))}
          </ul>
        )}
        {links.length > 0 && (
          <div className="flex flex-wrap gap-4 text-base font-medium">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-crimson underline-offset-4 transition-colors hover:text-moss"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </header>

      {project.coverImage?.asset && (
        <SanityImage
          value={project.coverImage}
          width={1600}
          height={1000}
          priority
          sizes="(min-width: 1024px) 64rem, 100vw"
          className="aspect-[8/5] w-full rounded-lg object-cover"
        />
      )}

      {project.body && project.body.length > 0 && <ProjectBody value={project.body} />}
    </ProjectShell>
  )
}

function ProjectShell({children}: {children?: React.ReactNode}) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-24 font-sans">
      <Link href="/" className="text-sm text-foreground/60 transition-colors hover:text-moss">
        ← All projects
      </Link>
      {children}
    </main>
  )
}
