const { LogicGateFactory } = require('./logicGate')

var LogicGate;
const splitElements = function (str) {
    let bracketDepth = 0;
    let output = ['']
    for (let i = 0; i < str.length; i++) {
        const character = str[i];
        if (bracketDepth === 0 && character === ' ') {
            output.push('');
        };
        if (character === '(') {
            bracketDepth++
        } else if (character === ')') {
            bracketDepth--
        };

        if (bracketDepth > 0 || character !== ' ') {
            output[output.length - 1] += character
        };
    };
    if (bracketDepth > 0) {
        throw 'ERROR: UNENCLOSED BRACKETS'
    };
    // strip surrounding brackets
    output.forEach((element, i) => {
        if (element[0] === '(') {
            output[i] = element.slice(1, element.length - 1)
        };
    });
    return output;
}

const stringToLogicGate = function (input, depth = 0) {
    let splitInput = splitElements(input);

    const ORDER_OF_OPERATIONS = [
        ['OR', 'NOR', 'XOR', 'XNOR'],
        ['AND', 'NAND'],
        ['NOT']
    ];
    // loop through each group of operations and test against each element from right to left
    const output = LogicGate(depth);
    if (splitInput.length === 1) {
        output.setSymbol(splitInput[0]);
        return output
    }
    for (let j = 0; j < ORDER_OF_OPERATIONS.length; j++) {
        const operationArray = ORDER_OF_OPERATIONS[j];
        for (let i = splitInput.length - 1; i >= 0; i--) {
            const element = splitInput[i];
            if (operationArray.includes(element)) {
                output.setSymbol(element);
                if (i > 0) {
                    output.children.push(
                        stringToLogicGate(splitInput.slice(0, i).join(' '), depth + 1)
                    )
                }
                if (i < splitInput.length - 1) {
                    output.children.push(
                        stringToLogicGate(splitInput.slice(i + 1, splitInput.length).join(' '), depth + 1)
                    )
                }
                return output
            }
        }
    }
}

exports.parseInput = function (input) {
    // remove any excess whitespece
    LogicGate = LogicGateFactory();
    return stringToLogicGate(input.replace(/\s{2,}/g, ' ').trim().toUpperCase())
}
