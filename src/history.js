const PlaceHistory = require('./db/PlaceHistory');

const createPlace = body => {
    const place = new PlaceHistory();
    place.title = body.title;
    place.content = body.content;
    place.geo = [body.lng, body.lat];
    return place;
}

const addPlace = (req) => new Promise((res, rej) =>
    createPlace(req.body).save((err) => {
        if (err) return rej(err);
        res({});
    }));


const DISTANCE = 1000 / 6371;
const placeQuery = (q) =>
    PlaceHistory.find({
        geo: {
            $near: [q.lng, q.lat],
            $maxDistance: q.distance || DISTANCE
        }});

const findNear = (q) => new Promise((res, rej) => 
    placeQuery(q).exec((err, place) => {
        if (err) return rej(err);
        res(place);
    }));

module.exports = {
    addPlace: addPlace,
    findNear: findNear
}