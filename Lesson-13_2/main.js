// Создаем объект класса XMLHttpRequest
var xhr = new XMLHttpRequest();

// Настраиваем будущий запрос
xhr.open('GET', 'https://reqres.in/api/users?page=2', true); // успешный запрос (код 200) - попадем в onload
// xhr.open('GET', 'https://reqres.in/api2/users?page=2'); // неуспешный запрос - несуществующая страница (код 404) - попадем в onload
// xhr.open('GET', 'https://reqres1.in/api/users?page=2'); // неуспешный запрос - несуществующий домен (код 0) - попадем в onerror

// Отправляем запрос на сервер
xhr.send();

// Отслеживаем событие окончания запроса
// Код состояния и пояснение к нему будут храниться в свойствах status и statusText объекта xhr
// this в данном контексте = xhr
xhr.onload = function() {
    var statusType = Math.round(this.status / 100);
//  var statusType = +String(this.status)[0];

//  console.log((statusType === 2) ? JSON.parse(this.response).data : this.status); // получаем массив с объектами с сервера

    if (statusType === 2) { // если статус-код успешный (запрос начинается на 2)

        try {
            console.log('до генерации исключения');
            // этот код может потенциально пробросить красную ошибку в консоль при попытке распарсить ответ с сервера, если в качестве ответа придет некорректный JSON
            var serverData = JSON.parse(this.response).data;
            console.log(serverData);
         // throw { name:'MyError', message:'что-то пошло не так!' }; // 1 способ порождения исключения: в throw передаем объект со свойствами name и message
         // throw new Error ('что-то пошло не так!'); // 2 способ порождения исключения: пробрасываем объект класса Error
            console.log('после генерации исключения');
        }
        catch (ex) {
            console.error('возникло исключение!');
            console.error('тип исключения: ' + ex.name);
            console.error('текст исключения: ' + ex.message);
        }

        console.log('код продолжает выполняться'); // проверка, продолжает ли выполняться код

    } else { // иначе, если статус-код неуспешный (запрос начинается не на 2), выводим в консоль статус-код
        console.log(this.status);
        console.log('несуществующая страница');
    }

};

// Сработает в ситуации с CORS либо при проблемах с каналом связи (например, неверный домен) - код состояния 0
xhr.onerror = function() {
    console.error(this.status);
    console.log('несуществующий домен');
};

// Отслеживаем любое окончание запроса, не важно - успешное либо нет
// Метод чаще всего используется для очищения каких-либо действий, например для прятания лоадера
xhr.onloadend = function() {
    console.log('запрос завершен');
};


