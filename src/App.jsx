import { useEffect, useState } from 'react'
import blimpImg from './assets/img/blimp.png'
import es6BuildingImg from './assets/img/es6-building.png'
import reactBuildingImg from './assets/img/react-building.png'
import sassBuildingImg from './assets/img/sass-building.png'
import seoBuildingImg from './assets/img/seo-building.png'
import reactLogoImg from './assets/img/reactlogo.png'
import './App.css'

const pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon/mimikyu-disguised'

function formatPokemonLabel(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function App() {
  const [pokemonData, setPokemonData] = useState(null)
  const [pokemonError, setPokemonError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    async function loadPokemonData() {
      try {
        setPokemonError('')

        const response = await fetch(pokemonApiUrl, {
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error('API request failed')
        }

        const data = await response.json()
        const pokemonTypes = data.types
          .sort((a, b) => a.slot - b.slot)
          .map((entry) => formatPokemonLabel(entry.type.name))
          .join(' / ')

        setPokemonData({
          name: formatPokemonLabel(data.name),
          types: pokemonTypes,
          number: `#${String(data.id).padStart(3, '0')}`,
          shinyFrontImage: data.sprites?.front_shiny ?? '',
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          setPokemonError('Kon Pokemon data niet laden.')
        }
      }
    }

    loadPokemonData()

    return () => {
      abortController.abort()
    }
  }, [])

  return (
    <section className="scene">
      <img className="sprite sprite-es6" src={es6BuildingImg} alt="ES6 building" />
      <img className="sprite sprite-react" src={reactBuildingImg} alt="React building"/>
      <img className="sprite sprite-sass" src={sassBuildingImg} alt="Sass building" />
      <img className="sprite sprite-seo" src={seoBuildingImg} alt="SEO building" />
      <img className="sprite sprite-blimp" src={blimpImg} alt="Blimp" />
      <img className="sprite sprite-react-logo" src={reactLogoImg} alt="React logo" />

      <div className="pokemon-info" aria-live="polite">
        {pokemonError ? (
          <p className="pokemon-info-line">{pokemonError}</p>
        ) : pokemonData ? (
          <>
            <p className="pokemon-info-line">Naam: {pokemonData.name}</p>
            <p className="pokemon-info-line">Type: {pokemonData.types}</p>
            <p className="pokemon-info-line">Nummer: {pokemonData.number}</p>
          </>
        ) : (
          <p className="pokemon-info-line">Pokemon data laden...</p>
        )}
      </div>

      {pokemonData?.shinyFrontImage ? (
        <img
          className="pokemon-shiny"
          src={pokemonData.shinyFrontImage}
          alt={`${pokemonData.name} shiny front`}
        />
      ) : null}
    </section>
  )
}

export default App
