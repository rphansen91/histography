module.exports = (res, doc) => {
    res.writeHead(200, {"Content-Type": 'text/html'});
    res.end(doc);
}