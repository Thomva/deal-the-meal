import { default as React, useState } from 'react';
import { Button } from '../buttons';
import * as Routes from '../../routes';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import Utils from '../../utilities/Utils';

const Searchbar = ({ defaultValues }) => {
	const [searchString, setSearchString] = useState('');
	const [locationString, setLocationString] = useState('');
	const [locationURLQuery, setLocationURLQuery] = useState('');
	const [url, setUrl] = useState(null);
	const history = useHistory();

	const clickHandler = (e) => {
		e.preventDefault();
		updateUrl();
	};

	const searchChangeHandler = (e) => {
		setSearchString(e.target.value);
	};

	const locationQueryChangeHandler = async (e) => {
		// (async () => {
		// 	const data = await Utils.reverseGeocode(coords);
		// 	handleLocationFound(data, onMarkerChange);
		// })();
		if (!e.target || !e.target.value) return;
		const value = e.target.value;
		const data = await Utils.forwardGeocode(value);
		const loc = await Utils.formatLocationFromResult(data);
		console.log(loc);
		if (!loc) return;
		console.log();
		setLocationString(loc.name);
		setLocationURLQuery(`${loc.coords.latitude},${loc.coords.longitude}`);
	};

	const updateUrl = () => {
		const params = [
			{ key: 't', value: searchString },
			{ key: 'l', value: locationURLQuery },
		];

		setUrl(`${Routes.RESULTS}?${Utils.getUpdatedParametersFromUrl(params)}`);
	};

	useEffect(() => {
		if (url) history.push(`${url}`);
	}, [url, history]);

	return (
		<form className="searchbar">
			<div className="searchbar__inputs">
				<input
					className="input-text input-text--search input-text--item"
					type="text"
					name="qItem"
					id="InputSearchItem"
					placeholder="Strawberries"
					onChange={(e) => searchChangeHandler(e)}
					defaultValue={defaultValues && defaultValues.title}
				/>
				<div className="searchbar__location">
					<div className="searchbar__near">near</div>
					<input
						className="input-text input-text--search input-text--location"
						type="text"
						name="qLocation"
						id="InputSearchLocation"
						placeholder="Gent"
						onChange={locationQueryChangeHandler}
						defaultValue={defaultValues && defaultValues.location}
					/>
				</div>
			</div>

			<Button text="Search" classes="button--search" onClick={clickHandler} />
		</form>
	);
};

export default Searchbar;
