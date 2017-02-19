const fetch = require('node-fetch');
const { SEARCH_API_KEY } = require('../keys');

const placesUrl = query => 
    Object.keys(query)
    .reduce((url, q) => {
        return url += '&' + q + '=' + query[q];
    }, "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" + "key=" + SEARCH_API_KEY);

const findPhotos = place => {
    place.urls = (place.photos || []).map(findPhoto);
    return place;
}

const findPhoto = (photo) => {
    return 'https://maps.googleapis.com/maps/api/place/photo?photoreference='+photo.photo_reference+'&maxwidth=400&key=' + SEARCH_API_KEY;
}

const findPois = type => (latitude, longitude) =>
    fetch(placesUrl({
        location: [latitude,longitude].join(','),
        radius: 1000,
        type: type
    }))
    .then(res => res.json())
    .then(res => {
        if (!res.results || res.results.length < 1) {
            return [];
            return Promise.reject({ message: res.error_message });
        }

        return res.results
        .map(findPhotos)
        // .map(r => ({
        //     place_id: r.place_id,
        //     name: r.name,
        //     urls: r.urls,
        //     types: r.types
        // }));
    });

module.exports = type => {
    switch (type) {
        case 'art_gallery': return findPois('art_gallery');
        case 'aquarium': return findPois('aquarium');
        case 'museum': return findPois('museum');
        case 'city_hall': return findPois('city_hall');
        case 'park': return findPois('park');
        case 'university': return findPois('university');
        default: return () => Promise.reject('POI_TYPE_INVALID');
    }
}