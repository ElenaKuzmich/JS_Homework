var contentBlock = document.getElementsByClassName('page-content')[0],
    button = contentBlock.getElementsByTagName('button')[0],
    usersTabsBlock = contentBlock.getElementsByClassName('users-tabs')[0],
    infoBlock = contentBlock.getElementsByClassName('info-block')[0];

var counter = 0; // счетчик для контроля количества нажатий на кнопку

button.onclick = function(event) {
    ++counter;

    if (localStorage.getItem('usersArray') !== null) { // если данные уже есть в LocalStorage
        // при последующих кликах на кнопку удаляем все уже добавленные на страницу данные о пользователях,
        // чтобы не дублировалась информация на странице, а потом в функции добавим их вновь из LocalStorage
        while (usersTabsBlock.firstChild) {
            usersTabsBlock.firstChild.remove();
        }

        while (infoBlock.firstChild) {
            infoBlock.firstChild.remove();
        }

        addUsersInfo(); // запускаем функцию для отрисовки на странице информации о пользователе

    } else {
        // Создаем объект класса XMLHttpRequest
        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://reqres.in/api/users?page=2', true); // успешный запрос (код 200) - попадем в onload
     // xhr.open('GET', 'https://reqres.in/api2/users?page=2'); // неуспешный запрос - несуществующая страница (код 404) - попадем в onload
     // xhr.open('GET', 'https://reqres1.in/api/users?page=2'); // неуспешный запрос - несуществующий домен (код 0) - попадем в onerror

        // Отправляем запрос на сервер
        xhr.send();

        // Отслеживаем событие окончания запроса
        // this в данном контексте = xhr
        xhr.onload = function () {
            var statusType = Math.round(this.status / 100);
        //  var statusType = +String(this.status)[0];

            if (statusType === 2) { // если статус-код успешный (запрс начинается на 2)
                var usersArray = JSON.parse(this.response).data; // записываем в переменную интересующие нас данные, полученные с сервера (список пользователей)

                localStorage.setItem('usersArray', JSON.stringify(usersArray)); // сохраняем полученные данные в LocalStorage

                addUsersInfo(); // запускаем функцию для отрисовки на странице информации о пользователе

            } else { // если запрос неуспешный - несуществующая страница (код 404) - все еще попадаем в onload
                console.log (this.status);

                // отрисовываем на странице сообщение о том, что данные не получены
                var errorInfoBlock = document.createElement('div');
                errorInfoBlock.innerHTML = '<h2>Data not received</h2><p>Sorry, the page you are looking for could not be found. It might have been removed, renamed, or did not exist in the first place</p>';
                contentBlock.appendChild(errorInfoBlock);
                errorInfoBlock.classList.add('error');

                if (counter > 1) { // при повторном нажатии на кнопку, удаляем уже отрисованный блок с ошибкой
                    errorInfoBlock.remove();
                }
            }
        };

        // Сработает в ситуации с CORS либо при проблемах с каналом связи (например, неверный домен) - код состояния 0
        xhr.onerror = function() {
            console.error(this.status);

            // отрисовываем на странице сообщение о том, что данные не получены
            var errorInfoBlock = document.createElement('div');
            errorInfoBlock.innerHTML = '<h2>Data not received</h2><p>Sorry, the request was not sent to the server. The specified domain either does not exist or could not be contacted</p>';
            contentBlock.appendChild(errorInfoBlock);
            errorInfoBlock.classList.add('error');

            if (counter > 1) { // при повторном нажатии на кнопку, удаляем уже отрисованный блок с ошибкой
                errorInfoBlock.remove();
            }
        };

        // Отслеживаем любое окончание запроса, не важно - успешное либо нет
        // Метод чаще всего используется для очищения каких-либо действий, например для прятания лоадера
        xhr.onloadend = function() {
            console.log('Запрос завершен');
        };
    }

    function addUsersInfo() {
        var usersArray = JSON.parse(localStorage.getItem('usersArray')); // сохраняем в переменную данные из LocalStorage

        // создаем вкладки
        for (var i = 0; i < usersArray.length; i++) {

            var newUserTab = document.createElement('a');
            newUserTab.innerText = 'User ' + (i + 1);
            newUserTab.setAttribute('href', '#');
            newUserTab.setAttribute('id', usersArray[i].id);

            usersTabsBlock.appendChild(newUserTab);
        }

        // делаем активной первую вкладку (добавляем ей class="active")
        var usersTabs = usersTabsBlock.children;
        var firstUserTab = usersTabs[0];
        firstUserTab.classList.add('active');

        // отрисовываем блок с информацией о пользователе
        var userPhoto = document.createElement('img');
        infoBlock.appendChild(userPhoto);

        var nameBlock = document.createElement('div');
        infoBlock.appendChild(nameBlock);

        var firstName = document.createElement('p');
        nameBlock.appendChild(firstName);

        var lastName = document.createElement('p');
        nameBlock.appendChild(lastName);

        // изначально активна первая вкладка, показываем под ней блок с информацией о пользователе
        userPhoto.setAttribute('src', usersArray[0].avatar);
        firstName.innerText = 'First Name: ' + usersArray[0]['first_name'];
        lastName.innerText = 'Last Name: ' + usersArray[0]['last_name'];

        usersTabsBlock.onclick = function (event) { // переключение вкладок
            var target = event.target;

            if (target.tagName === 'A') {
                event.preventDefault(); // отменяем обработку браузером по умолчанию кликов по ссылке

                // получаем id активной вкладки и сохраняем его в переменную
                var activeTabId = +target.getAttribute('id');

                for (var i = 0; i < usersArray.length; i++) {
                    // при клике на новую вкладку, предыдущую делаем неактивной (удаляем class="active")
                    if (usersTabs[i].classList.contains('active')) {
                        usersTabs[i].removeAttribute('class');

                    // текущую вкладку делаем активной (добавляем class="active")
                    // и выводим в блок информацию о текущем пользователе
                    } else if (usersArray[i].id === activeTabId) {
                        target.classList.add('active');

                        userPhoto.setAttribute('src', usersArray[i].avatar);
                        firstName.innerText = 'First Name: ' + usersArray[i]['first_name'];
                        lastName.innerText = 'Last Name: ' + usersArray[i]['last_name'];
                    }
                }
            }
        }
    }
};


