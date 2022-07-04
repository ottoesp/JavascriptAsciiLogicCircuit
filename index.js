// const express = require('express');
// const cors = require('cors')
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const app = express();
const { getLogicDiagram } = require('./LogicGates/main')
// const tree = require('./BinaryTrees/treeMain')

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));


// app.get('/api/logic-gates/:param1/:param2', cors(), (req, res) => {
//   res.json({ x: main.start(req.params.param1, parseInt(req.params.param2)) });
// });

// app.get('/api/binary-trees/:param1/:param2', cors(), (req, res) => {
//   res.json({ x: tree.start(req.params.param1, req.params.param2)});
// });

// app.get('/api/db/:param1/:param2', cors(), (req, res) => {
//   res.send("ADDED TO DATABASE");
// });

// app.listen(3000, () => console.log('server started'));

console.log(getLogicDiagram('(NOT B AND B AND NOT A) OR C AND B XNOR D'));
console.log(getLogicDiagram('(NOT B AND B AND NOT A) AND B XNOR D', 5));