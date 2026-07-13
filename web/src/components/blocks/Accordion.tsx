'use client'

import {useState} from 'react'

import PortableText from '../PortableText'
import type {AccordionBlock, AccordionItem} from '@/sanity/types'

function Item({item}: {item: AccordionItem}) {
  const [open, setOpen] = useState(Boolean(item.openByDefault))
  return (
    <div className={`accordion-item${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="accordion-trigger"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{item.question}</span>
        <svg
          className="accordion-chevron"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="accordion-panel" hidden={!open}>
        <div className="accordion-panel-inner">
          <PortableText value={item.answer} />
        </div>
      </div>
    </div>
  )
}

export default function Accordion({block}: {block: AccordionBlock}) {
  const items = block.items ?? []
  return (
    <section className="section">
      <div className="container container--narrow">
        {block.title && <h2 className="section-title">{block.title}</h2>}
        <div className="accordion">
          {items.map((item) => (
            <Item key={item._key} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
