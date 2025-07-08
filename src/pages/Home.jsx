import { useCharacters } from '../hooks/useCharacters'
import Loader from '../components/Loader'

function Home() {
  const { characters, loading, error } = useCharacters()

  if (loading) return <Loader />
  if (error) return <p>{error}</p>

  return (
    <div className="characters">
      {characters.map((char) => (
        <div key={char.id}>
          <img src={char.image} alt={char.name} />
          <h3>{char.name}</h3>
        </div>
      ))}
    </div>
  )
}

export default Home