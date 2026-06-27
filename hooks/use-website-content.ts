import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useWebsiteContent() {
  const supabase = createClient()
  const [content, setContent] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      try {
        const { data, error } = await supabase
          .from('website_content')
          .select('section_key, content')

        if (error) throw error

        const mapped: Record<string, any> = {}
        data?.forEach((row) => {
          mapped[row.section_key] = row.content
        })
        setContent(mapped)
      } catch (err) {
        console.error('Failed to load website content from Supabase:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [supabase])

  const getSection = (key: string, fallback: any) => {
    return content[key] ? { ...fallback, ...content[key] } : fallback
  }

  return { content, loading, getSection }
}
