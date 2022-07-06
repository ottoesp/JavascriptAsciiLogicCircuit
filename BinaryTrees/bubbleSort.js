exports.bubbleSort = function (a) {
    const arr = [...a];
    for (let i = 0; i < arr.length; i++) {

        // Last i elements are already in place 
        for (let j = 0; j < (arr.length - i - 1); j++) {

            // Checking if the item at present iteration
            // is greater than the next iteration
            if (arr[j] > arr[j + 1]) {

                // If the condition is true then swap them
                const temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            }
        }
    }
    return arr;
}