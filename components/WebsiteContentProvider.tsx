'use client'

import { createContext, useContext } from 'react'
import { defaultWebsiteContent, type WebsiteContent } from '@/lib/website-content'

const WebsiteContentContext = createContext<WebsiteContent>(defaultWebsiteContent)

export function WebsiteContentProvider({ children, content }: { children: React.ReactNode; content: WebsiteContent }) {
  return <WebsiteContentContext.Provider value={content}>{children}</WebsiteContentContext.Provider>
}

export function useWebsiteContent() {
  return useContext(WebsiteContentContext)
}
