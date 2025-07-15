import { useEffect, useState } from 'react'
import axios from 'axios'

export function useCharacters(locationName = '') {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [locationTitle, setLocationTitle] = useState('')
  const [residentCount, setResidentCount] = useState(0)
  const [locationType, setLocationType] = useState('')
  const [locationDimension, setLocationDimension] = useState('')

  useEffect(() => {
    async function fetchByLocation() {
      try {
        setLoading(true)
        setError(null)
        setLocationTitle('')
        
        if (!locationName) {
          const res = await axios.get('https://rickandmortyapi.com/api/character')
          setCharacters(res.data.results)
          return
        }

        let location

        if (/^\d+$/.test(locationName)) {
          const res = await axios.get(`https://rickandmortyapi.com/api/location/${locationName}`)
          location = res.data
        } else {
          const res = await axios.get(
            `https://rickandmortyapi.com/api/location/?name=${locationName}`
          )
          location = res.data.results[0]
        }

        setLocationTitle(location.name)
        setResidentCount(location.residents.length)
        setLocationType(location.type)
        setLocationDimension(location.dimension)

        const characterUrls = location.residents
        const promises = characterUrls.map((url) => axios.get(url))
        const responses = await Promise.all(promises)
        const characterData = responses.map((res) => res.data)

        setCharacters(characterData)
      } catch (err) {
        setError('solo hay 126 locaciones disponibles')
        setCharacters([])
        setLocationTitle('')
        setResidentCount(0)
        setLocationType('')
        setLocationDimension('')
      } finally {
        setLoading(false)
      }
    }

    fetchByLocation()
  }, [locationName])

  return {
    characters,
    loading,
    error,
    locationTitle,
    residentCount,
    locationType,
    locationDimension
  }
}