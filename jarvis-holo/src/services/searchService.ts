export type SearchResult = { title: string; link: string; snippet: string }

export async function webSearch(query: string): Promise<SearchResult[]> {
  const res = await fetch('/api/search?q=' + encodeURIComponent(query))
  if (!res.ok) return []
  const data = await res.json()
  return data.results as SearchResult[]
}