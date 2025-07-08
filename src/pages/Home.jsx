import { useState } from 'react'
import { useCharacters } from '../hooks/useCharacters'
import { useLocationSuggestions } from '../hooks/useLocationSuggestions'
import Loader from '../components/Loader'
import CharacterCard from '../components/CharacterCard'
import styles from './Home.module.scss'

function Home() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const { characters, loading, error, locationTitle, residentCount } = useCharacters(query)
  const { suggestions, notFound } = useLocationSuggestions(search)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = search.trim()

    // Validación: si es número, debe estar entre 1 y 126
    if (/^\d+$/.test(trimmed)) {
      const number = Number(trimmed)
      if (number < 1 || number > 126) {
        setErrorMessage('Por favor ingresa un Id de locación entre 1 y 126')
        setQuery(null) // evita búsqueda
        return
      }
    }

    setErrorMessage(null)
    setQuery(trimmed)
    setSearch('')
  }

  const handleSelectSuggestion = (name) => {
    setSearch(name)
    setQuery(name)
    setErrorMessage(null)
  }

  return (
    <div>
      {/* Formulario de búsqueda */}
      <form onSubmit={handleSubmit} className={styles.search}>
        <input
          type="text"
          placeholder="Search by location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Sugerencias */}
      {notFound && <p className={styles.notFound}>Location not found</p>}

      {suggestions.length > 0 && !/^\d+$/.test(search) && (
        <ul className={styles.suggestions}>
          {suggestions.map((loc, index) => (
            <li key={index} onClick={() => handleSelectSuggestion(loc)}>
              {loc}
            </li>
          ))}
        </ul>
      )}

      {/* Título de la locación */}
      {locationTitle && (
        <h2 className={styles.resultTitle}>
          Nombre de la locación: <span>{locationTitle}</span>
          {residentCount > 0 && (
            <span className={styles.count}>
              ({residentCount} {residentCount === 1 ? 'resident' : 'residents'})
            </span>
          )}
        </h2>
      )}

      {/* Loader */}
      {loading && (
        <div className={styles.loadingInfo}>
          <Loader />
          <p>Loading character info...</p>
        </div>
      )}

      {/* Errores */}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {error && !errorMessage && <p className={styles.error}>{error}</p>}

      {/* Sin residentes */}
      {residentCount === 0 && query && !loading && !error && !errorMessage && (
        <p className={styles.noResidents}>Esta locación no tiene residentes.</p>
      )}

      {/* Tarjetas */}
      {residentCount > 0 && !errorMessage && (
        <div className={styles.grid}>
          {characters.map((char) => (
            <CharacterCard key={char.id} character={char} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home