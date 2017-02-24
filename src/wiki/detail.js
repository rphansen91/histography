const fetch = require('node-fetch');
const isDate = require('./isDate');

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

const findResult = find('mw-search-result-heading', '<a', '>');
const findPageName = find('There is a page named ','href="','"');
const findDidYouMean = find('Did you mean: ', 'href="', '"');
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
    (content || '').replaceAll('href="/wiki/', 'target="_blank" href="https://en.wikipedia.org/wiki/');

const details = place => {
    const name = (place.name+','+place.state).replaceAll(' ', '_');
    const stats = { query: name }

    return html('https://en.wikipedia.org/w/index.php?search=' + name)
    .then(content => {
        const result = findResult(content);
        if (result) {
            stats.resultName = find('title','"','"')(result);
            stats.resultUrl = find('href','"','"')(result);
            return html('https://en.wikipedia.org' + stats.resultUrl);
        }
        return content;
    })
    // .then(content => {
    //     const pageName = findPageName(content);
    //     if (pageName) {
    //         stats.pageNameRedirect = pageName;
    //         return html('https://en.wikipedia.org/' + pageName)
    //     }
    //     return content;
    // })
    // .then(content => {
    //     const referer = findReferer(content);
    //     if (referer) {
    //         stats.refererNameRedirect = referer;
    //         return html('https://en.wikipedia.org/wiki/' + referer);
    //     }
    //     return content;
    // })
    .then(content => {
        if (content.length) stats.contentLength = content.length;
        return Object.keys(findDetail(content))
        .map(name => {
            var c = {}
            var h = find('id="'+name.replaceAll(' ', '_')+'"','<p>','<h2>')(content);
            if (!isDate(h)) return;
            
            c.name = name;
            c.html = addWikiLinks(h);
            c.urls = findImages(c.html);
            return c;
        })
        .filter(c => c && c.html);
    })
    .then(d => {
        stats.count = d ? d.length : 0;
        place.stats = stats;
        place.details = d || [];
        return place;
    });
}

module.exports = details;