const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const main = require('./LogicGates/main')
const tree = require('./BinaryTrees/treeMain')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// for (let i = 0; i < 6; i++) {
//   console.log("-/-/-/-/-/-/-/-/-/", i)
//   console.log(main.start("(S AND NOT A) XOR (T AND S)", 9))

// }


// app.get('/with-cors', cors(), (req, res, next) => {
//   res.json({ msg: 'WHOAH with CORS it works! 🔝 🎉' })
// })


app.get('/api/logic-gates/:param1/:param2', cors(), (req, res) => {
  res.json({ x: main.start(req.params.param1, parseInt(req.params.param2)) });
});

app.get('/api/binary-trees/:param1/:param2', cors(), (req, res) => {
  res.json({ x: tree.start(req.params.param1, req.params.param2)});
});

app.get('/api/db/:param1/:param2', cors(), (req, res) => {
  res.send("ADDED TO DATABASE");
});

app.listen(3000, () => console.log('server started'));