const fetch = require('node-fetch');

const SEARCH_API_KEY = 'AIzaSyDrnk1jnOJzxtdW9lHkOsqVTQ3CnHWC-Kw';

const format = place => Object.assign(place, {
    urls: (place.photos || []).map(p => p.getUrl && p.getUrl({'maxWidth': 350, 'maxHeight': 350})).filter(u => typeof u === 'string')
})

const findPhotos = place => {
    place.urls = (place.photos || []).map(findPhoto);
    return place;
}

const findPhoto = (photo) => {
    return 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+photo.photo_reference+'&key=' + SEARCH_API_KEY;
}

const placesUrl = query => 
    Object.keys(query)
    .reduce((url, q) => {
        return url += '&' + q + '=' + query[q];
    }, "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" + "key=" + SEARCH_API_KEY);

module.exports = (latitude, longitude) =>
    fetch(placesUrl({
        location: [latitude,longitude].join(','),
        radius: 500,
        type: 'landmarks'
    }))
    .then(res => res.json())
    .then(res => res.results[0])
    .then(place => findPhotos(place || {}));