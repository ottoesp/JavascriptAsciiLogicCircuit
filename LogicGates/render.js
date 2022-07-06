const getDirection = function (current, next) {
    const directions = {
        '01': 'down',
        '10': 'right',
        '0-1': 'up',
        '-10': 'left'
    }
    return directions[[next[0] - current[0], next[1] - current[1]].join('')];
}

const pathToDirections = function (path) {
    return ['left'].concat(path.map((cell, i) => {
        return path[i + 1] ? getDirection(path[i], path[i + 1]) : 'left'
    }));
}

const dirCodeToTile = {
    "1001": "┘",
    "0011": "┐",
    "0110": "┌",
    "1100": "└",
    "0101": "─",
    "1010": "│",
    
    "1011": "┤",
    "1101": "┴",
    "0111": "┬",
    "1110": "├",
    "1111": "┼",
}

const tileToDirCode = Object.keys(dirCodeToTile).reduce((ret, key) => {
    ret[dirCodeToTile[key]] = key;
    return ret;
}, {});

const determineCrossover = function (a, b) {
    const chars = [tileToDirCode[a], tileToDirCode[b]];
    const output = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
        if (chars[0][i] === "1" || chars[1][i] === "1") {
            output[i] = 1;
        };
    };
    return dirCodeToTile[output.join("")];
}

exports.render = function (path, grid, sharedPaths) {
    
    const dirsToTiles = {
        "[\"right\",\"up\"]": "┘",
        "[\"down\",\"left\"]": "┘",

        "[\"right\",\"down\"]": "┐",
        "[\"up\",\"left\"]": "┐",

        "[\"up\",\"right\"]": "┌",
        "[\"left\",\"down\"]": "┌",

        "[\"down\",\"right\"]": "└",
        "[\"left\",\"up\"]": "└",

        "[\"right\",\"right\"]": "─",
        "[\"left\",\"left\"]": "─",

        "[\"down\",\"down\"]": "│",
        "[\"up\",\"up\"]": "│",
    }

    const dirs = pathToDirections(path)
    for (let i = 0; i < dirs.length - 1; i++) {
        const currentDir = dirs[i];
        const nextDir = dirs[i + 1];

        const x = path[i][0];
        const y = path[i][1];
        let tile = dirsToTiles[JSON.stringify([currentDir, nextDir])];

        if (sharedPaths.includes(JSON.stringify([x, y]))) {
            tile = determineCrossover(tile, grid[y][x])
        }

        grid[y][x] = tile;
    }
}
