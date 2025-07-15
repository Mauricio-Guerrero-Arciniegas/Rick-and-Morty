import { useState, useEffect } from 'react'
import axios from 'axios'

export function useLocationSuggestions(search) {
  const [suggestions, setSuggestions] = useState([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        if (!search.trim()) {
          let allLocations = []
          let nextUrl = 'https://rickandmortyapi.com/api/location'

          while (nextUrl) {
            const res = await axios.get(nextUrl)
            allLocations = [...allLocations, ...res.data.results.map(loc => loc.name)]
            nextUrl = res.data.info.next
          }

          setSuggestions(allLocations)
          setNotFound(false)
        } else {
          const res = await axios.get(`https://rickandmortyapi.com/api/location/?name=${search}`)
          const names = res.data.results.map(loc => loc.name)
          setSuggestions(names)
          setNotFound(names.length === 0)
        }
      } catch (error) {
        setSuggestions([])
        setNotFound(true)
      }
    }

    fetchSuggestions()
  }, [search])

  return { suggestions, notFound }
}