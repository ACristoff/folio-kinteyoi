import type {StructureResolver} from 'sanity/structure'
import {HomeIcon} from '@sanity/icons/Home'

/** Document types that exist exactly once. Their `_id` equals their type name. */
export const SINGLETONS = ['homePage']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home page')
        .id('homePage')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage').title('Home page')),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !SINGLETONS.includes(item.getId() ?? '')),
    ])
