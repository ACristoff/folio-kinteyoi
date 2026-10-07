import Link from 'next/link'
import type {PROJECTS_QUERY_RESULT} from '@/sanity.types'
import {formatDate} from './format-date'
import {SanityImage} from './sanity-image'

export function ProjectCard({project}: {project: PROJECTS_QUERY_RESULT[number]}) {
  const published = formatDate(project.publishedAt)

  return (
    <li className="group">
      <Link href={`/projects/${project.slug}`} className="flex flex-col gap-4">
        {project.coverImage?.asset ? (
          <SanityImage
            value={project.coverImage}
            width={960}
            height={600}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-[8/5] w-full rounded-lg object-cover transition-opacity group-hover:opacity-90"
          />
        ) : (
          <div className="aspect-[8/5] w-full rounded-lg bg-foreground/5" />
        )}
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-moss transition-colors">
            {project.title}
          </h2>
          {(project.role || published) && (
            <p className="text-sm text-foreground/60">
              {[project.role, published].filter(Boolean).join(' · ')}
            </p>
          )}
          {project.summary && (
            <p className="text-base leading-7 text-foreground/75">{project.summary}</p>
          )}
        </div>
      </Link>
    </li>
  )
}
