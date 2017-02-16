const path = require('path');
const natural = require('natural');
const classifier = new natural.BayesClassifier();

const loadData = require('../utils/load');

const train = ({ split=0.75, file }) => 
    loadData(file)
    .then(fileData => fileData.data || [])
    .then(groupData(split))
    .then(testGroupedData)
    .then(stats => console.log(stats))
    .catch(e => console.log(e));

const trainingPath = p => path.resolve(__dirname, '../../', p);                         ``

const groupData = split => data => {
    const splitIndex = Math.floor(data.length * split);
    const training = data.slice(0, splitIndex);
    const test = data.slice(splitIndex);
    return { training, test }
}

const addDoc = doc => classifier.addDocument(doc.text, doc.label);

const testGroupedData = data => {
    const { training, test } = data;

    training.map(addDoc);
    classifier.train();

    const correct = test.filter(t => {
        const res = classifier.classify(t.text);
        if (res === t.label) return true;
    }).length;

    const stats = {
        score: correct,
        percent: (correct / test.length) * 100,
        test: test.length,
        training: training.length
    }

    return stats;
}

const file = process.argv[2] || 'training/test.json';
const split = process.argv[3] || 0.75;

train({ file, split  })