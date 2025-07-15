import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'

import { useCharacters } from '../hooks/useCharacters'
import { useLocationSuggestions } from '../hooks/useLocationSuggestions'

import Loader from '../components/Loader'
import CharacterCard from '../components/CharacterCard'

import styles from './Home.module.scss'

function Home() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState(null)
  const [isRandom, setIsRandom] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isInputFocused, setIsInputFocused] = useState(false)

  const topRef = useRef(null)
  const titleRef = useRef(null)

  const triggerTitleAnimation = () => {
    const el = titleRef.current
    if (!el) return
    el.classList.remove(styles.animate)
    void el.offsetWidth
    el.classList.add(styles.animate)
  }

  const {
    characters,
    loading,
    error,
    locationTitle,
    residentCount,
    locationType,
    locationDimension
  } = useCharacters(query)

  const { suggestions, notFound } = useLocationSuggestions(search)

  const getValidRandomLocation = useCallback(async () => {
    let location = null
    while (!location || location.residents.length === 0) {
      const randomId = Math.floor(Math.random() * 126) + 1
      try {
        const res = await axios.get(`https://rickandmortyapi.com/api/location/${randomId}`)
        location = res.data
      } catch {
        continue
      }
    }
    return location.id
  }, [])

  useEffect(() => {
    const fetchLocation = async () => {
      const validId = await getValidRandomLocation()
      setQuery(validId)
    }
    fetchLocation()
  }, [getValidRandomLocation])

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentPage])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.inputWrapper}`)) {
        setIsInputFocused(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    triggerTitleAnimation()
    const trimmed = search.trim()

    if (Number.isInteger(Number(trimmed)) && trimmed !== '') {
      const number = Number(trimmed)
      if (number < 1 || number > 126) {
        setErrorMessage('❗ Please enter a location number between 1 and 126')
        setQuery(null)
        return
      }
    }

    setErrorMessage(null)
    setQuery(trimmed)
    setSearch('')
    setIsRandom(false)
    setCurrentPage(1)
    setIsInputFocused(false)
  }

  const handleSelectSuggestion = (name) => {
    triggerTitleAnimation()
    setSearch('')
    setQuery(name)
    setErrorMessage(null)
    setIsRandom(false)
    setCurrentPage(1)
    setIsInputFocused(false)
  }

  const residentsPerPage = 8
  const indexOfLast = currentPage * residentsPerPage
  const indexOfFirst = indexOfLast - residentsPerPage
  const currentResidents = characters.slice(indexOfFirst, indexOfLast)

  return (
    <div className={styles.background}>
      <h1 ref={titleRef} className={`${styles.title} ${styles.animate}`}>
        {'Rick and Morty Explorer'.split('').map((char, i) => (
          <span key={i} style={{ '--i': i }}>{char === ' ' ? '\u00A0' : char}</span>
        ))}
      </h1>

      <form onSubmit={handleSubmit} className={styles.search}>
        <div className={styles.inputWrapper}>
          <span className={styles.icon}>🔍</span>
          <input
            type="text"
            placeholder="Busca por Nombre o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
          />
          <span
            className={styles.arrow}
            onClick={(e) => {
              e.stopPropagation()
              setIsInputFocused((prev) => !prev)
            }}
          >
            ▼
          </span>

          {isInputFocused && suggestions.length > 0 && (
            <ul className={styles.suggestions}>
              {suggestions.map((loc, index) => (
                <li key={index} onClick={() => handleSelectSuggestion(loc)}>
                  {loc}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit">Buscar</button>
      </form>

      {notFound && <p className={styles.notFound}>Locacion no encontrada</p>}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {error && !errorMessage && <p className={styles.error}>{error}</p>}

      {locationTitle && (
        <div className={styles.resultBox}>
          <h2 className={styles.resultTitle}>
            Nombre de la Locación: <span>{locationTitle}</span>
          </h2>
          <p><strong>Residentes:</strong> {residentCount} {residentCount === 1 ? 'residente' : 'residentes'}</p>
          <p><strong>Tipo:</strong> {locationType || 'Unknown'}</p>
          <p><strong>Dimensión:</strong> {locationDimension || 'Unknown'}</p>
        </div>
      )}

      {isRandom && locationTitle && !loading && (
        <p className={styles.randomMessage}>
          Mostrando Locación aleatoria: <strong>{locationTitle}</strong>
        </p>
      )}

      {loading && (
        <div className={styles.loadingInfo}>
          <Loader />
          <p>⏳ Loading character info...</p>
        </div>
      )}

      {residentCount === 0 && query && !loading && !error && !errorMessage && (
        <p className={styles.noResidents}>📭 Esta locación no tiene residentes.</p>
      )}

      {residentCount > 0 && !errorMessage && (
        <>
          <div ref={topRef} className={styles.grid}>
            {currentResidents.map((char) => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>

          {characters.length > residentsPerPage && (
            <div className={styles.pagination}>
              {Array.from({ length: Math.ceil(characters.length / residentsPerPage) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={i + 1 === currentPage ? styles.activePage : ''}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Home
