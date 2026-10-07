import {draftMode} from 'next/headers'
import {Suspense} from 'react'
import {Hero} from '@/components/hero'
import {ProjectCard} from '@/components/project-card'
import {cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions} from '@/sanity/live'
import {HOME_PAGE_QUERY, PROJECTS_QUERY} from '@/sanity/queries'

export default async function Home() {
  const {isEnabled: isDraftMode} = await draftMode()

  if (isDraftMode) {
    return (
      <Suspense fallback={<ProjectsShell />}>
        <DynamicProjects />
      </Suspense>
    )
  }

  return <Projects perspective="published" stega={false} />
}

/** Draft mode: resolve cookie-dependent options outside the cache boundary. */
async function DynamicProjects() {
  const options = await getDynamicFetchOptions()
  return <Projects {...options} />
}

async function Projects(options: DynamicFetchOptions) {
  const [{data: homePage}, {data: projects}] = await Promise.all([
    cachedSanity({query: HOME_PAGE_QUERY, ...options}),
    cachedSanity({query: PROJECTS_QUERY, ...options}),
  ])

  return (
    <ProjectsShell hero={<Hero value={homePage?.hero} profile={homePage?.profileImage} />}>
      {projects.length === 0 ? (
        <p className="text-lg leading-8 text-foreground/75">
          No projects yet. Create one in the Studio and publish it to see it here.
        </p>
      ) : (
        <ul className="grid gap-12 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </ul>
      )}
    </ProjectsShell>
  )
}

function ProjectsShell({hero, children}: {hero?: React.ReactNode; children?: React.ReactNode}) {
  return (
    <main className="flex w-full flex-1 flex-col font-sans">
      {/* Full-bleed hero; the content below stays in the usual centered column. */}
      {hero}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-24">
        <header className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">Projects</h1>
          <p className="max-w-xl text-lg leading-8 text-foreground/75">
            Selected work, managed in Sanity.
          </p>
        </header>
        {children}
      </div>
    </main>
  )
}
