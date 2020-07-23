import { mapBoxConfig } from '../config';

const getParametersFromUrl = () => {
	const parametersObj = {};

	if (window.location.search) {
		let tempParameters = window.location.search;
		tempParameters = tempParameters.split(/[&?]/);
		tempParameters.map((param, i) => {
			const p = param.split(/[=]/);
			if (p[0]) {
				parametersObj[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
			}
			return param;
		});
	}

	return parametersObj;
};

function getParameterFromUrl(name) {
	const allParams = getParametersFromUrl();
	return allParams[name];
}

/**
 * Add, update, or removes parameters from the current url and returns them as a string.
 *
 * @param {Objects[]} newParams - List of parameters to add, update, or remove to the url.
 * @param {string} newParams[].value - Value of the parameter. Parameter gets removed from url when this string is empty.
 * @param {string} newParams[].key - Key of the parameter.
 * @param {string[]} [newParams[].deleteIf] - Ignore this parameter if the value matches ay value of the deleteId array.
 */
function getUpdatedParametersFromUrl(newParams = []) {
	let finalParameters = [];
	const parametersObj = getParametersFromUrl();

	newParams.forEach((param) => {
		if (param.value)
			parametersObj[param.key] = encodeURIComponent(param.value.trim());
	});

	newParams.forEach((param) => {
		if (param.deleteIf && param.deleteIf.length > 0) {
			param.deleteIf.forEach((str) => {
				if (!param.value || param.value.trim() === str)
					delete parametersObj[param.key];
			});
		} else {
			if (param.value.trim() === '') delete parametersObj[param.key];
		}
	});

	finalParameters = Object.keys(parametersObj).map((key) => {
		return `${key}=${parametersObj[key]}`;
	});
	return finalParameters.join('&');
}

const timeAgo = (time, suffix = 'ago', mostRecentString = 'Just now') => {
	const timeAgoMs = Date.now() - time;
	const timeAgoS = parseInt((timeAgoMs / 1000) % 60);
	const timeAgoMin = parseInt((timeAgoMs / (1000 * 60)) % 60);
	const timeAgoH = parseInt((timeAgoMs / (1000 * 60 * 60)) % 24);
	const timeAgoD = parseInt((timeAgoMs / (1000 * 60 * 60 * 24)) % 7);
	const timeAgoW = parseInt((timeAgoMs / (1000 * 60 * 60 * 24 * 7)) % 4);
	const timeAgoMon = parseInt((timeAgoMs / (1000 * 60 * 60 * 24 * 7)) % 12);
	const timeAgoY = parseInt(timeAgoMs / (1000 * 60 * 60 * 24 * 7));

	// console.log(timeAgoY, timeAgoMon, timeAgoW, timeAgoD, timeAgoH, timeAgoMin, timeAgoS, timeAgoMs);
	switch (true) {
		case timeAgoY > 0:
			return `${timeAgoY} years${suffix && ` ${suffix}`}`;
		case timeAgoMon > 0:
			return `${timeAgoMon} months${suffix && ` ${suffix}`}`;
		case timeAgoW > 0:
			return `${timeAgoW} weeks${suffix && ` ${suffix}`}`;
		case timeAgoD > 0:
			return `${timeAgoD} days${suffix && ` ${suffix}`}`;
		case timeAgoH > 0:
			return `${timeAgoH} hours${suffix && ` ${suffix}`}`;
		case timeAgoMin > 0:
			return `${timeAgoMin} minutes${suffix && ` ${suffix}`}`;
		case timeAgoS > 0:
			return `${timeAgoS} seconds`;

		default:
			return mostRecentString;
	}
};

function validateEmail(email) {
	if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		return true;
	}
	return false;
}

function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

function groupBy(array, key) {
	const grouped = array.reduce((result, item) => {
		(result[item[key]] = result[item[key]] || []).push(item);
		return result;
	}, {});
	return grouped;
}

async function forwardGeocode(query) {
	const baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

	const formatedLocation = `${encodeURI(
		query.length <= 0 ? 'brussel' : query
	)}`;
	const response = await fetch(
		`${baseUrl}${formatedLocation}.json?types=postcode,place,locality,neighborhood,address&&language=nl,en,fr&&country=BE&&access_token=${mapBoxConfig.token}`
	);
	return await response.json();
}

async function reverseGeocode(coords) {
	const baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

	const response = await fetch(
		`${baseUrl}${coords.longitude},${coords.latitude}.json?types=postcode,place,locality,neighborhood,address&&language=nl,en,fr&&country=BE&&access_token=${mapBoxConfig.token}`
	);
	return await response.json();
}

function formatLocationFromResult(data) {
	if (!data || !data.features || !data.features[0]) return;
	const currentFeature = data.features[0];
	let locationName;
	const context = currentFeature.context;
	switch (true) {
		case currentFeature.place_type.includes('locality'):
			locationName = currentFeature.text;
			break;
		case currentFeature.place_type.includes('place'):
			locationName = currentFeature.text;
			break;
		case !!context.find((c) => c.id.includes('locality')):
			locationName = context.find((c) => c.id.includes('locality')).text;
			break;
		case !!context.find((c) => c.id.includes('place')):
			locationName = context.find((c) => c.id.includes('place')).text;
			break;

		default:
			console.log(context.find((c) => c.id.includes('locality')));
			console.log(context.find((c) => c.id.includes('place')));
			break;
	}

	const location = {
		coords: {
			longitude: data.features[0].center[0],
			latitude: data.features[0].center[1],
		},
		name: locationName,
	};

	return location;
}

export default {
	clamp,
	getParametersFromUrl,
	getParameterFromUrl,
	getUpdatedParametersFromUrl,
	groupBy,
	timeAgo,
	validateEmail,
	forwardGeocode,
	reverseGeocode,
	formatLocationFromResult,
};
