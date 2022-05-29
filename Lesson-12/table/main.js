var table = document.getElementsByTagName('table')[0],
    tbody = table.getElementsByTagName('tbody')[0],
    buttonAdd = document.getElementsByClassName('add')[0];

buttonAdd.addEventListener('click', addRow, false); // по умолчанию режим = false (обработчик)
function addRow(event) {
    var tr = document.createElement('tr');
    tr.innerHTML = '<td></td><td></td><td></td>';

    var firstTR = table.getElementsByTagName('tr')[0];
    tbody.insertBefore(tr, firstTR);
}

var input = document.createElement('input');
input.classList.add('hidden');

table.addEventListener('click', inputText);
function inputText(event) {
    var target = event.target; // ссылка на конкретный элемент (DOM-объект), на котором произошло событие (тег, на который мы кликнули)

//  if (target.tagName === 'TD' && target.className !== 'add') {
    if (target.tagName === 'TD' && !target.classList.contains('add')) { // если у текущего элемента, на который кликнули, tagName === 'TD' и это не ячейка "Добавить"
        input.value = target.textContent; // записываем в input содержимое ячейки
        target.textContent = ''; // ячейку очищаем
        target.appendChild(input);
        input.classList.remove('hidden');
        input.focus();
    }
}

input.addEventListener('blur', function(event) {
    input.parentElement.textContent = input.value; // если потеряли фокус, то текст из input записывается в ячейку таблицы
    input.classList.add('hidden'); // удаляем input из ячейки
});


input.addEventListener('keyup', function(event) { // вешаем событие клавиатуры на input, который в фокусе, так как в одно время в таблице находится только один инпут
    if (event.keyCode == 13) { // проверяем, что клавиша Enter (13 - скан-код клавиши Enter)
        event.preventDefault(); // отменяем действие по умолчанию
        input.parentElement.textContent = input.value;
        input.classList.add('hidden');
    }
});


