const fetch = require('node-fetch');

const html = url => fetch(url).then(res => res.text());

const find = (match,begin,end) => content => {
    let index = content.indexOf(match);
    if (index !== -1) {
        const a = content.slice(index);
        const b = a.slice(a.indexOf(begin) + begin.length);
        return b.slice(0, b.indexOf(end));
    }

    return false;
}

String.prototype.replaceAll = function (m,r) {
    var regex = new RegExp(m,'gi');
    return this.replace(regex,r);
}
String.prototype.all = function (match) {
    var results = [];
    var regex = new RegExp(match,'gi');
    while (regex.exec(this)){
        results.push(regex.lastIndex);
    }
    return results;
}

const findReferer = find('may refer to:','/wiki/','"');
const findImage = find('src', 'src="','"');
const findDetail = content => {
    const indices = content.all(/class=\"toctext\">/)
    return indices.reduce((p,c)=> {
        const begin = content.slice(c);
        const name = begin.slice(0, begin.indexOf('</span>'));
        if (name) p[name] = '';
        return p;
    },{})
}

const findImages = content => {
    const indices = content.all('img')
    return indices.map(i => {
        const begin = content.slice(i);
        const src = findImage(begin);
        return src;
    })
}

const addWikiLinks = content =>
    (content || '').replaceAll('href="/wiki/', 'target=_blank href="https://en.wikipedia.org/wiki/');

const details = place =>
    html('https://en.wikipedia.org/w/index.php?search=' + place.name.replaceAll(' ', '_'))
    .then(content => {
        if (content.indexOf('There is a page named ') !== -1) {
            return html('https://en.wikipedia.org/wiki/' + place.name.replaceAll(' ', '_'))
        }
        return content;
    })
    .then(content => {
        const referer = findReferer(content);
        if (referer) return html('https://en.wikipedia.org/' + referer);
        return content;
    })
    .then(content => {
        var d = findDetail(content);
        Object.keys(d).map(name => {
            d[name] = {}
            d[name].name = name;
            d[name].html = find('id="'+name.replaceAll(' ', '_')+'"','<p>','<h2>')(content);
            d[name].html = addWikiLinks(d[name].html);
            d[name].urls = findImages(d[name].html);
        });
        return d;
    })
    .then(d => {
        place.details = d || {};
        return place;
    });

module.exports = details;