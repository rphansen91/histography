const zlib = require('zlib');

const json = res => data => {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    });
    res.end(JSON.stringify(data));
}

const html = res => doc => {
    res.writeHead(200, {"Content-Type": 'text/html'});
    res.end(doc);
}

const zipped = res => doc => {
    res.writeHead(200, {
        'Content-Type': 'text/html', 
        'Content-Encoding': 'gzip'
    })
    zlib.gzip(doc, function (_, result) {
      res.end(result);
    });
}

const error = res => err => {
    console.log('ERROR',err);
    res.writeHead(500, { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" 
    });
    res.end(JSON.stringify({ err }));
}

module.exports = {
    json,
    html,
    zipped,
    error
}