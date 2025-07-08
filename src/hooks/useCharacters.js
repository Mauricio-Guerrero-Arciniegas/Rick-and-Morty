import { useEffect, useState } from 'react'
import axios from 'axios'

export function useCharacters(query = '') {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCharacters() {
      try {
        setLoading(true)
        const response = await axios.get(`https://rickandmortyapi.com/api/character${query}`)
        setCharacters(response.data.results)
      } catch (err) {
        setError('Failed to fetch characters')
      } finally {
        setLoading(false)
      }
    }

    fetchCharacters()
  }, [query])

  return { characters, loading, error }
}