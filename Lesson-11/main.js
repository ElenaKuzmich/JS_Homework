// Задание 1

function getObjectsArr(namesArr) {
    var objectsArr = namesArr.map(function(item) {
        return {'name': item};
    });

    return objectsArr;
}

getObjectsArr(['Vasya', 'Petya', 'Anya']); // [{name: 'Vasya'}, {name: 'Petya'}, {name: 'Anya'}]



// Задание 2

function getStr(arr) {
    var result = arr.reduce(function(str, current) {
        return  str + ' : ' + current;
    }, 'Текущее время');

    return result;
}

getStr(['00', '13', '24']); // 'Текущее время : 00 : 13 : 24'



// Задание 3

function countVowels(text) {
    var textArr = text.toLowerCase().split(''); // превращаем текст в массив из символов
    var vowels = 'аеёиоуыэюяaeiouy'; // строка с гласными буквами (рус. и англ. алфавит)

    var count = textArr.reduce(function(sum, current) {
        if (vowels.indexOf(current) !== -1) {
            sum++; //добавляем в кол-во найденных гласных +1
        }

        return sum; // возвращаем новую сумму (или старую, если гласных нет)
    }, 0); // запускаем reduce с нулевой суммой

    return count;
}

console.log('Количество гласных в переданном тексте: ' + countVowels('ЧЕТЫРЕ МОДЕЛИ использования метода .map() в JavaScript.'));



// Задание 4

function countSentencesLetters(text) {
    var sentencesArr = text.split(/[.!?]/g); // превращаем текст в массив из отдельных предложений
    //var sentencesArr = text.split('!').join('.').split('?').join('.').split('.');

    var resultSentencesArr = sentencesArr.filter(function(sentence) {
        return sentence !== '';
    });

    var countOfLetters = resultSentencesArr.map(function(sentenceText) {
        return sentenceText.trim() + ': ' + 'Letters quantity is: ' + sentenceText.trim().split(/[^a-zа-яё]/gi).join('').length;
    });

    return countOfLetters;
}

countSentencesLetters('Привет, студент! Студент... Как дела, студент?');



// Задание 5*

function findMaxRepeatedWord(text) {
    var wordsArr = text.toLowerCase().split(/[^a-zа-яё]/gi); //превращаем текст в массив из отдельных слов
    var controlObj = {};

    var resultWordsArr = wordsArr.filter(function(word) {
        return word !== '';
    });

    resultWordsArr.forEach(function(word) {
        // если этот элемент объекта не создавался ранее
        if (controlObj[word] === undefined){
            controlObj[word] = 1;
        } else {
            controlObj[word]++;
        }
    });

    var maxTimesOfRepeats = 0;
    var maxRepeatedWord = '';
    for (var key in controlObj) {
        if (controlObj[key] > maxTimesOfRepeats) {
            maxTimesOfRepeats = controlObj[key];
            maxRepeatedWord = key;
        }
    }

    return 'Максимальное число повторений у слова "' + maxRepeatedWord + '" - ' + maxTimesOfRepeats;
}

findMaxRepeatedWord('Такие дела... - Привет, студент! Студент... Как дела, студент? - Дела?.. Сложно');


