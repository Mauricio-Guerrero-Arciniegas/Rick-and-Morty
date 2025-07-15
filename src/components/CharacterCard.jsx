import styles from './CharacterCard.module.scss'

function CharacterCard({ character }) {
  return (
    <div className={styles.card}>
      <img
        src={character.image}
        alt={character.name}
        className={styles['card__image']}
      />

      <div className={styles['card__info']}>
        <h3 className={styles['card__name']}>{character.name}</h3>

        <p className={styles['card__status']}>
          <span
            className={`${styles['card__dot']} ${styles[`card__dot--${character.status.toLowerCase()}`]}`}
          ></span>
          {character.status} — {character.species}
        </p>

        <p className={styles['card__extra']}>Origen: {character.origin.name}</p>
        <p className={styles['card__extra']}>Numero de Episodios: {character.episode.length}</p>
      </div>
    </div>
  )
}

export default CharacterCard