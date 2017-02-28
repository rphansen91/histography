const PlaceHistory = require('./db/PlaceHistory');

const createPlace = body => {
    const place = new PlaceHistory();
    place.user = body.userId;
    place.title = body.title;
    place.content = body.content;
    place.date = body.date || new Date().getTime();
    place.geo = [body.lng, body.lat];
    return place;
}

const addPlace = (body) => new Promise((res, rej) =>
    createPlace(body).save((err, doc) => {
        if (err) return rej(err);
        res(doc);
    }))
    .then((place) => {
        // ADD TO USERS POSTS
        return place;
    });


const DISTANCE = 1000 / 6371;
const placeQuery = (q) =>
    PlaceHistory.find({
        geo: {
            $near: [q.lng, q.lat],
            $maxDistance: q.distance || DISTANCE
        }});

const findNear = (q) => new Promise((res, rej) => {
    if (!q.lat) return rej({message: "NO_LATITUDE"});
    if (!q.lng) return rej({message: "NO_LONGITUDE"});
    placeQuery(q).exec((err, place) => {
        if (err) return rej(err);
        res(place);
    });
});

const findOne = (q) => new Promise((res, rej) => 
    PlaceHistory.findOne(q).exec((err, place) => {
        if (err) return rej(err);
        res(place);
    }));

const find = (q) => new Promise((res, rej) => 
    PlaceHistory.find(q).exec((err, places) => {
        if (err) return rej(err);
        res(places);
    }));

module.exports = {
    addPlace: addPlace,
    findNear: findNear,
    findOne: findOne,
    find: find
}