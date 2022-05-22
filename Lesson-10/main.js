// Задание 1
function filterNumbersArr(numbers) {
    var newArr = numbers.filter(function(el) {
        return el > 0;
    });

    return newArr;
}

filterNumbersArr([-1, 0, 2, 34, -2]); // 2, 34



// Задание 2
// 1_method
function getFirstPositiveNum(numbersArr) {
    var foundPositiveNum = numbersArr.find(function(number) {
        return number > 0;
    });

    return foundPositiveNum;
}

getFirstPositiveNum([-3, -11, 8, 6, 15, -5, 7, 4, 88, 0, 62]); // 8


// 2_method
function getFirstPositiveNum(numbersArr) {
    var foundPositiveNum = numbersArr.filter(function(number) {
        return number > 0;
    })[0];

    return foundPositiveNum;
}

getFirstPositiveNum([-3, -11, 8, 6, 15, -5, 7, 4, 88, 0, 62]); // 8



// Задание 3
function isPalindrome(word) {
    word = word.toLowerCase();

    if (word == word.split('').reverse().join('')) {
        return true;
    } else {
        return false;
    }
    //ИЛИ в одну строку: return (word.toLowerCase() == word.toLowerCase().split('').reverse().join(''));
}

console.log(isPalindrome('шалаШ')); // true
console.log(isPalindrome('привет')); // false



// Задание 4
function areAnagrams(word1, word2) {
    return (word1.toLowerCase().split('').sort().join('') == word2.toLowerCase().split('').sort().join(''));
}

console.log(areAnagrams('кот', 'Отк')); // true
console.log(areAnagrams('кот', 'атк')); // false
console.log(areAnagrams('кот', 'отко')); // false



// Задание 5
// 1_method
function divideArr(arr, size) {
    var resultArr = []; // массив, в который будем выводить результат

    for (var i = 0; i < arr.length; i += size) {
        resultArr.push(arr.slice(i, i + size));
    }

    return resultArr;
}

console.log(divideArr([1, 2, 3, 4], 2)); // [[1, 2], [3, 4]]
console.log(divideArr([1, 2, 3, 4, 5, 6, 7, 8], 3)); // [[1, 2, 3], [4, 5, 6], [7, 8]]


// 2_method
function divideArr(arr, size) {
    var resultArr = []; // массив, в который будем выводить результат

    for (var i = 0; i < Math.ceil(arr.length/size); i++){
        resultArr.push(arr.slice((i * size), (i * size) + size)); // ИЛИ resultArr[i] = arr.slice((i * size), (i * size) + size);
    }

    return resultArr;
}

console.log(divideArr([1, 2, 3, 4], 2)); // [[1, 2], [3, 4]]
console.log(divideArr([1, 2, 3, 4, 5, 6, 7, 8], 3)); // [[1, 2, 3], [4, 5, 6], [7, 8]]


// 3_method
function divideArr(arr, size) {
    var resultArr = []; // массив, в который будем выводить результат

    while (arr.length > 0) {
        resultArr.push(arr.splice(0, size));
    }

    return resultArr;
}

console.log(divideArr([1, 2, 3, 4], 2)); // [[1, 2], [3, 4]]
console.log(divideArr([1, 2, 3, 4, 5, 6, 7, 8], 3)); // [[1, 2, 3], [4, 5, 6], [7, 8]]



// Задание 6*
// 1_method
function isPowerOfTwo(number) {
    var value = 1;

    while (value < number) {
        value *= 2;
    }

    if (value == number) {
        return true;
    } else {
        return false;
    }
    // ИЛИ return (value == number);
}

console.log(isPowerOfTwo(16)); // true
console.log(isPowerOfTwo(10)); // false
console.log(isPowerOfTwo(64)); // true


// 2_method
function isPowerOfTwo(number) {
    if (number <= 0) {
        return false;
    }

    while (number % 2 == 0) {
        number /= 2;
    }

    if (number == 1) {
        return true;
    } else {
        return false;
    }
    //ИЛИ return (number == 1);
}

console.log(isPowerOfTwo(16)); // true
console.log(isPowerOfTwo(10)); // false
console.log(isPowerOfTwo(64)); // true



