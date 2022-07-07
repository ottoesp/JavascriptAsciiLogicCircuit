// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

const { getLogicDiagram } = require('C:/Users/ottoe/OneDrive/Documents/School/Subjects/ComputerScience/IA/Code/JavascriptAsciiLogicCircuit/LogicGates/main.js')
const { getBinaryTree } = require('C:/Users/ottoe/OneDrive/Documents/School/Subjects/ComputerScience/IA/Code/JavascriptAsciiLogicCircuit/BinaryTrees/main.js')

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.getGates = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const input = req.query.input;
    // Send back a message that we've successfully written the message
    res.json({
        result: getLogicDiagram(input)
    });
});

exports.getTree = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const input = JSON.parse(req.query.input);
    const balance = JSON.parse(req.query.balance);
    // Send back a message that we've successfully written the message
    res.json({
        result: getBinaryTree(input, balance),
    });
});
