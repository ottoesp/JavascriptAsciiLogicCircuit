createObjectsFromInpLocal = function (inp, elements) { // Parsing
    if (inp.length < 1) {
        throw "NO INPUT"
    }
    let bracketDepth = 0;
    let outOfBracket = [];
    let inOfBracket = [];
    for (let i = 0; i < inp.length; i++){
        if (inp[i] === "("){
            bracketDepth++;
            if (bracketDepth === 1){
                inOfBracket.push([]);
            }
            inOfBracket[inOfBracket.length - 1].push(inp[i]);
        } else if (inp[i] === ")"){
            bracketDepth--;
            inOfBracket[inOfBracket.length - 1].push(inp[i]);
        } else if (bracketDepth === 0){
            outOfBracket.push(inp[i]);
        } else {
            inOfBracket[inOfBracket.length - 1].push(inp[i]);
        }
    }
    inOfBracket = inOfBracket.map(function (e){
        return e.splice(1, e.length - 2).join("");
    })
    elements.type = /AND|NAND|OR|NOR|XNOR|XOR/.exec(outOfBracket.join(""))
    if (!elements.type) {
        throw "NO GATES"
    }
    elements.type = elements.type[0]
    if (["AND", "NOR", "XOR", "XNOR"].includes(elements.type)) { // "NAND", "OR",
        elements.type = "╢".concat(elements.type.concat("-║"))
    } else if (elements.type === "NAND"){
        elements.type = "╢".concat(elements.type.concat("║"))
    } else if (elements.type === "OR"){
        elements.type = "╢-".concat(elements.type.concat("-║"))
    }
    outOfBracket = outOfBracket.join("").replace(/AND|NAND|OR|NOR|XNOR|XOR/g, "").
    split(" ").filter(function (element){
        return (element !== "");
    })
    for (let i = 0; i < outOfBracket.length; i++){
        if (outOfBracket[i] === "NOT"){
            elements.children.push({type:"NOT", children : [{type : outOfBracket[i + 1], children : []}]})
            i++
        } else {
            elements.children.push({type : outOfBracket[i], children : []})
        }
    }
    for (let i = 0; i < inOfBracket.length; i++){
        elements.children.push(createObjectsFromInpLocal(inOfBracket[i], {type : "", children : []}))
    }
    return elements;
}

exports.createObjectsFromInp = function (inp, elements) {
  return createObjectsFromInpLocal(inp, elements)
}