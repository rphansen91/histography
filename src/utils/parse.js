const body = req => new Promise((res, rej) => {
    if (req.method !== 'POST') return rej('MUST BE A POST REQUEST');
    
    let data = '';
    req.on('data', d => data += d);
    req.on('end', () => res(data));
    req.on('error', rej);
});

const form = req => 
    body(req).then(data =>
        data.split('&')
        .map(c => c.split('='))
        .reduce((p,c) => {
            p[c[0]] = c[1];
            return p;
        }, {}));

module.exports = {
    body,
    form
}