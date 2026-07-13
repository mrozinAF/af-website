import type {StructureResolver} from 'sanity/structure'
import {DocumentIcon, UsersIcon, CaseIcon, CogIcon} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.listItem()
        .title('Pages')
        .icon(DocumentIcon)
        .child(S.documentTypeList('page').title('Pages')),
      S.divider(),
      S.listItem()
        .title('People')
        .icon(UsersIcon)
        .child(S.documentTypeList('person').title('People')),
      S.listItem()
        .title('Job postings')
        .icon(CaseIcon)
        .child(S.documentTypeList('jobPosting').title('Job postings')),
    ])
