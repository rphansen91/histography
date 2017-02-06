const result = test => {
    if (test.passed) {
        return `
            <div class="passed">
                <img src="${test.img}" />
                <h1>${test.name}</h1>
                <p>Details: ${test.detail}</p>
            </div>
        `
    }
    return `
        <div class="failed">
            <h1>${test.name}</h1>
            <p>Latitude: ${test.latitude}</p>
            <p>Longitude: ${test.longitude}</p>
            <p>Details: ${test.detail}</p>
        </div>
    `
}

module.exports = res => results => {
    res.writeHead(200, {"Content-Type": 'text/html'});
    res.end(`
        <html>
            <head><title>Histography Results</title></head>
            <style>
                .passed {background-color: green;color:white;}
                .failed {background-color: red;color:white;}
            </style>
            <body>

                ${results.map(result).join('')}
            
            </body>
        </html>
    `)
}