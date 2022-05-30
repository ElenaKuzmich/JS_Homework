
var container = document.getElementById('container');

var firstPar = document.createElement('p'),
    secondPar = document.createElement('p');

firstPar.innerHTML = 'Hello, here are <a href="https://www.facebook.com">Link 1</a> and <a href="https://twitter.com">Link 2</a>';
secondPar.innerHTML = 'Hello, here are <a href="http://google.by">Link 3</a> and <a href="https://vk.com">Link 4</a>';

container.appendChild(firstPar);
container.appendChild(secondPar);



var button = document.getElementsByTagName('button')[0];

button.onclick = function(event) {
    var firstParChildren = firstPar.children; // получаем коллекцию из всех дочерних узлов-тегов первого абзаца

    for (var i = 0; i < firstParChildren.length; i++) {
        if (firstParChildren[i].tagName === 'A') { // проверяем, что дочерний элемент абзаца является тегом a
            firstParChildren[i].classList.add('changed');  // добавляем css-класс ссылке
        }
    }
};

secondPar.addEventListener('click', changeLinkBehavior, false);

function changeLinkBehavior(event) {
    event.preventDefault(); // отменяем обработку кликов на ссылки браузером по-умолчанию

    var target = event.target; // ссылка на конкретный элемент (DOM-объект), на котором произошло событие

    if (target.tagName === 'A') { // если текущий элемент, на который кликнули, - тег а
        alert(target.getAttribute('href'));
    }
}

