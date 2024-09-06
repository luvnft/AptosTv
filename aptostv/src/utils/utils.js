export function epsilonRound(num, zeros = 4) {
    let temp = num;
    if (typeof num === 'string') {
      temp = parseFloat(num);
    }
    return (
      Math.round((temp + Number.EPSILON) * Math.pow(10, zeros)) /
      Math.pow(10, zeros)
    );
  }

  export function findIndexByProperty(array, property, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][property] === value) {
        return i;
      }
    }
    return -1; // If not found
  }