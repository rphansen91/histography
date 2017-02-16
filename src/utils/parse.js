const body = req => new Promise((res, rej) => {
    if (req.method !== 'POST') return rej('MUST BE A POST REQUEST');
    
    let data = '';
    req.on('data', d => data += d);
    req.on('end', () => res(data));
    req.on('error', rej);
});

module.exports = {
    body
}