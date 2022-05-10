//Задание 3 *

var testObject = {
    name_one: 'Vasya',
    name_two: 'Piotr',
    name_three: 'Fedya',
    name_four: 'Piotr'
};

function getObjectWithDuplicates(obj) { //получить объект с дублирующимися значениями
    var duplicates = {};

    for (var key in obj) {
        if (duplicates[obj[key]] != undefined) {
            duplicates[obj[key]]++;
        } else {
            duplicates[obj[key]] = 1;
        }
    }

    for (var key in duplicates) {
        if (duplicates[key] === 1) {
            delete duplicates[key];
        } else {
            duplicates[key] = duplicates[key] + ' times';
        }
    }

    return duplicates;
}

var repeats = getObjectWithDuplicates(testObject), //записываем в переменную результат работы функции - объект с дублирующимися значениями
    sortedObject = {};

function getSortedObject(obj) { //получить отсортированный объект
    var counter = 0,
        k;

    for (var key in obj) {
        if (counter == 0) {
            k = key;
            counter++;
        } else if (k > key) {
            k = key;
        } else continue;
    }

    sortedObject[k + '_length'] = obj[k].length;
    delete obj[k];

    for (var key in obj) {
        getSortedObject(obj);
    }

    sortedObject['\'Duplicated values\''] = repeats;

    return sortedObject;
}

console.log(getSortedObject(testObject));