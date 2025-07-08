import { useState } from 'react'
import { useCharacters } from '../hooks/useCharacters'
import { useLocationSuggestions } from '../hooks/useLocationSuggestions'
import Loader from '../components/Loader'
import CharacterCard from '../components/CharacterCard'
import styles from './Home.module.scss'

function Home() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const { characters, loading, error, locationTitle, residentCount } = useCharacters(query)
  const { suggestions, notFound } = useLocationSuggestions(search)

  const handleSubmit = (e) => {
    e.preventDefault()
    setQuery(search.trim())
  }

  const handleSelectSuggestion = (name) => {
    setSearch(name)
    setQuery(name)
  }

  return (
    <div>
      {/* Búsqueda */}
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
        {notFound && (
          <p className={styles.notFound}>Location not found</p>
      )}
      {suggestions.length > 0 && !/^\d+$/.test(search) && (
  <ul className={styles.suggestions}>
    {suggestions.map((loc, index) => (
      <li key={index} onClick={() => handleSelectSuggestion(loc)}>
        {loc}
      </li>
    ))}
  </ul>
)}
      {/* titulo de la locacion */}
      {locationTitle && (
        <h2 className={styles.resultTitle}>
          🔍 Results from: <span>{locationTitle}</span>
          {residentCount > 0 && (
            <span className={styles.count}> ({residentCount} {residentCount === 1 ? 'resident' : 'residents'})</span>
          )}
        </h2>
      )}

      {/* Resultados */}
      {loading && <Loader />}
      {error && <p>{error}</p>}

      <div className={styles.grid}>
        {characters.map((char) => (
          <CharacterCard key={char.id} character={char} />
        ))}
      </div>
    </div>
  )
}

export default Home