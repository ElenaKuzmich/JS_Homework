// Задание 1

// Примитивные типы данных (строки, числа, булевы значения, null/undefined) копируются целиком, "по значению" (через =),
// в результате такого копирования получаются две полностью независимые переменные, в каждой из которых хранится значение
// В JavaScript поддерживается составной тип данных - объекты, к которому относятся массивы и функции,
// причем функции можно копировать через = и typeof (function() {}) === 'function'
// Хранение и копирование объектов и массивов осуществляется "по ссылке" (сама переменная хранит ссылку на созданный объект или массив)
// копируется эта ссылка, а объект по-прежнему остается в единственном экземпляре

function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') { // если примитивный тип данных: number, string, boolean, null или undefined или функция
        return obj;

    } else if (typeof obj === 'object' && Array.isArray(obj)) { // если массив
        var copiedObj = []; // объявляем переменную для хранения содержимого после копирования
        for (var i = 0; i < obj.length; i++) { // перебираем элементы массива
            copiedObj[i] = deepClone(obj[i]); // для каждого вложенного элемента массива рекурсивно вызываем текущую функцию для проверки типа этого элемента и его клонирования
        }

        return copiedObj;

    } else if (typeof obj === 'object' && !Array.isArray(obj)) { // если объект
        var copiedObj = {}; // объявляем переменную для хранения содержимого после копирования
        for (var key in obj) { // метод for..in перебирает все свойства: и самого объекта и его прототипа
            if (obj.hasOwnProperty(key)) { // проверяем, принадлежит ли свойство самому объекту
                copiedObj[key] = deepClone(obj[key]); // для каждого вложенного свойства объекта рекурсивно вызываем текущую функцию для проверки типа этого элемента и его клонирования
            }
        }

        return copiedObj;

    } else {
        return 'Невозможно скопировать объект. Его тип не поддерживается.';
    }
}

// исходный объект
var initialObj = {
    string: 'Vasya',
    number: 30,
    boolean: true,
    undefined: undefined,
    null: null,
    //NaN: NaN,
    array: [1, 2, 3],
    object: {
        string2: 'Petrov',
        object2: {
            array2: [{}, {}]
        },
        object3: {}
    },
    method: function() {
        alert('Hello');
    }
};

var clonedObj = deepClone(initialObj); // создаем клон исходного объекта

// вносим изменения в клон
clonedObj.object.object2.array2[1].name = 'Vasya';
clonedObj.array.push(2);

console.log(initialObj);
console.log(clonedObj);



// Задание 2

function deepEqual(obj1, obj2) {

    if (obj1 === obj2) { // тождественное равенство (сравниваются значение и тип)
                         // сработает, если у нас 2 одинаковых числа, 2 одинаковые строки, 2 одинаковых значения boolean, 2 null или 2 undefined
                         // не выполнится для 2-ух одиниковых объектов/массивов, так как они равны, если 2 ссылки ведут на один и тот же объект/массив
                         // не выполнится для функций
        return true;

    /*} else if (typeof obj1 == 'number' && isNaN(obj1) && typeof obj2 == 'number' && isNaN(obj2)) { // потому что console.log(NaN === NaN); выводит false
      return true; */

    } else if (Array.isArray(obj1) && Array.isArray(obj2)) { // сравниваем 2 массива
        if (obj1.length !== obj2.length) {
            return false;
        }
        for (var key in obj1) {
            if (!deepEqual(obj1[key], obj2[key])) { // сравниваем вложенные элементы массивов
                return false;
            }

        }
        return true;

    } else if (typeof obj1 === 'function' && typeof obj2 === 'function') { // сравниваем 2 функции
        if (obj1.toString() === obj2.toString()) {
            return true;
        }
        return false;

    } else if (typeof obj1 === 'object' && !Array.isArray(obj1) && obj1 !== null &&
               typeof obj2 === 'object' && !Array.isArray(obj2) && obj2 !== null) { // сравниваем 2 объекта

        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
            return false;
        }

        for (var key in obj1) { // перебираем свойства первого объекта, сохраняя название свойства в key
            if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {   // проверяем, оба ли сравниваемые объекты имеют это свойство
                if (!deepEqual(obj1[key], obj2[key])) { // сравниваем свойства объектов
                    return false;
                }

            } else {
                return false;
            }
        }
        return true;

    } else {    // например, если типы не равны,
                // или сравниваем Array и null (typeof [] = 'object' и typeof null = 'object'),
                // или сравниваем Object и null (typeof {} = 'object' и typeof null = 'object')
        return false;
    }
}

// исходный объект
var initialObj = {
    string: 'Vasya',
    number: 30,
    boolean: true,
    undefined: undefined,
    null: null,
    //NaN: NaN,
    array: [1, 2, 3],
    object: {
        string2: 'Petrov',
        object2: {
            array2: [{}, {}]
        },
        object3: {}
    },
    method: function() {
        alert('Hello');
    }
};

// склонированный объект
var clonedObj = {
    string: 'Vasya',
    number: 30,
    boolean: true,
    undefined: undefined,
    null: null,
    //NaN: NaN,
    array: [1, 2, 3],
    object: {
        string2: 'Petrov',
        object2: {
            array2: [{}, {}]
        },
        object3: {}
    },
    method: function() {
        alert('Hello');
    }
};

console.log(deepEqual(initialObj, clonedObj)); // true

// вносим изменения в клон
clonedObj.object.object2.array2[1].name = 'Vasya';
clonedObj.array.push(2);

console.log(deepEqual(initialObj, clonedObj)); // false