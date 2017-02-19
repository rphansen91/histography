const wrapper = ({ title, meta, scripts, styles }) => content => 
`
    <html>
        <head>
            <title>${'Histogeo'}</title>
            ${meta || ''}
            ${styles || ''}
        </head>
        <body>
            ${content}
            ${(scripts || []).map(src => `<script src="${src}></script>"`).join('')}
        </body>
    </html>
`

const indexWrapper = wrapper({ 
    styles: `<style>
        body {text-align: center;margin: 0; background-color: #333;}
        img {max-width: 100%;}
        h1 {color: #fff;}
    </style>` 
});
const index = () => indexWrapper(`
    <img src="https://histogeo.com/public/pangeas.png" />
    <h1>Histogeo Is Alive :)</h1>
`);

module.exports = {
    wrapper: wrapper,
    index: index
}