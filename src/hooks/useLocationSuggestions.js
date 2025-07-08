import { useEffect, useState } from 'react'
import axios from 'axios'

export function useLocationSuggestions(searchTerm) {
  const [suggestions, setSuggestions] = useState([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!searchTerm || /^\d+$/.test(searchTerm)) {
      // No sugerencias si es vacío o número
      setSuggestions([])
      setNotFound(false)
      return
    }

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(
          `https://rickandmortyapi.com/api/location/?name=${searchTerm}`
        )
        setSuggestions(res.data.results.map((loc) => loc.name))
        setNotFound(false)
      } catch (err) {
        setSuggestions([])
        setNotFound(true)
      }
    }

    const delay = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(delay)
  }, [searchTerm])

  return { suggestions, notFound }
}