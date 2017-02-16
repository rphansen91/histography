const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');

const isHistory = t => ({
    message: 'Training Index: ' + t.rawIndex + '\n' +t.text,
    name: t.rawIndex + '',
    type: 'confirm'
})

const howMany = max => ({
    type: 'input',
    name: 'count',
    message: max + ' Items, How many do you want?',
    default: 0,
    validate: v => {
        v = v / 1
        if (isNaN(v)) return 'Must Enter A Number';
        if (v < 0) return "Must be greater than 0";
        if (v > max) return "Must be less than " + max;
        return true;
    }
})

const trainingPath = p => path.resolve(__dirname, '../../training', p);
const validate = () => {
    let file, raw;
    return inquirer.prompt([{
        choices: fs.readdirSync(trainingPath('')),
        message: 'Select A Training Set',
        name: 'file',
        type: 'list'
    }])
    .then(res => file = res.file)
    .then(res => fs.readFileSync(trainingPath(file), 'utf-8'))
    .then(res => JSON.parse(res))
    .then(res => raw = res)
    .then(res => inquirer.prompt(howMany(raw.data.length)))
    .then(res => {
        const tests = raw.data.map((t, i) => {
            t.rawIndex = i;
            return t;
        })
        .filter(t => !t.validated)
        .filter((t, i) => i < res.count)
        .map(isHistory);
        return inquirer.prompt(tests).then(selections => {
            Object.keys(selections).map((s, i) => {
                raw.data[s/1].validated = true;
                if (selections[s]) {
                    raw.data[s/1].label = 'historical'
                } else {
                    raw.data[s/1].label = 'nonhistorical'
                }
            })
            raw.updatedDate = new Date().getTime();
            return raw;
        })
        .catch(err => raw);
    })
    .then(fileData => {
        if (fileData.createdDate && fileData.data && fileData.city) {
            return fs.writeFileSync(trainingPath(file), JSON.stringify(fileData, null, 2))
        }
        return Promise.reject({
            message: "NOT SAVED: fileData malformated",
            fileData: fileData
        })        
    })
    .then(res => console.log('SAVED TO: ' + trainingPath(file)))
    .catch(err => console.log(err));
}

validate();