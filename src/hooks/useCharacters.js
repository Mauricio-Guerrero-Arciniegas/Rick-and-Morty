import { useEffect, useState } from 'react';
import axios from 'axios';

export function useCharacters(locationName = '') {
	const [characters, setCharacters] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [locationTitle, setLocationTitle] = useState('');
	const [residentCount, setResidentCount] = useState(0);
	const [locationType, setLocationType] = useState('');
	const [locationDimension, setLocationDimension] = useState('');

	useEffect(() => {
		async function fetchByLocation() {
			try {
				setLoading(true);
				setError(null);
				setLocationTitle('');
				setCharacters([]);

				// Si no hay búsqueda, retornar personajes aleatorios
				if (!locationName) {
					const res = await axios.get(
						'https://rickandmortyapi.com/api/character',
					);
					setCharacters(res.data.results);
					return;
				}

				let location;

				// Validación segura: si es un ID numérico entre 1 y 126, usa como ID
				if (
					!isNaN(locationName) &&
					Number(locationName) >= 1 &&
					Number(locationName) <= 126
				) {
					const res = await axios.get(
						`https://rickandmortyapi.com/api/location/${locationName}`,
					);
					location = res.data;
				} else {
					const res = await axios.get(
						`https://rickandmortyapi.com/api/location/?name=${locationName}`,
					);
					location = res.data.results[0];
				}

				if (!location || !location.residents.length) {
					setError('No residents found in this location');
					return;
				}

				setLocationTitle(location.name);
				setResidentCount(location.residents.length);
				setLocationType(location.type);
				setLocationDimension(location.dimension);

				// Obtener IDs de los personajes a partir de las URLs
				const characterIds = location.residents.map((url) =>
					url.split('/').pop(),
				);
				const idsQuery = characterIds.join(',');

				const res = await axios.get(
					`https://rickandmortyapi.com/api/character/${idsQuery}`,
				);
				const data = Array.isArray(res.data) ? res.data : [res.data];

				setCharacters(data);
			} catch (err) {
				console.error(err);
				setError('Error fetching characters');
			} finally {
				setLoading(false);
			}
		}

		fetchByLocation();
	}, [locationName]);

	return {
		characters,
		loading,
		error,
		locationTitle,
		residentCount,
		locationType,
		locationDimension,
	};
}
