const { wrapper } = require('./routes');

const result = test => {
    if (test.passed) {
        return `
            <div class="passed">
                <img src="${test.img}" />
                <h1>${test.name}</h1>
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

const resultWrapper = wrapper({
    title: 'Histogeo Results',
    styles: `
    <style>
        .passed {background-color: green;color:white;}
        .failed {background-color: red;color:white;}
    </style>
    `
})

module.exports = results =>
    resultWrapper(results.map(result).join(''));