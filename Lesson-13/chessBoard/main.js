var inputX = document.getElementById('x'),
    inputY = document.getElementById('y'),
    button = document.getElementsByTagName('button')[0];

button.disabled = true;

inputX.addEventListener('keyup', checkInput);
inputY.addEventListener('keyup', checkInput);

function checkInput(event) {
    if (inputX.value !== '' && inputY.value !== '') {
        button.disabled = false;
    }
}

button.onclick = function(event) {
    if ((!Number.isFinite(+inputX.value) || inputX.value < 1 || inputX.value > 10 || (inputX.value % 1) != 0) &&
        (!Number.isFinite(+inputY.value) || inputY.value < 1 || inputY.value > 10 || (inputY.value % 1) != 0)) {
        alert('Введите корректное значение в поле X - целое число от 1 до 10');
        alert('Введите корректное значение в поле Y - целое число от 1 до 10');
        inputX.value = '';
        inputY.value = '';
        button.disabled = true;

    } else if (!Number.isFinite(+inputX.value) || inputX.value < 1 || inputX.value > 10 || (inputX.value % 1) != 0) {
        alert('Введите корректное значение в поле X - целое число от 1 до 10');
        inputX.value = '';
        button.disabled = true;

    } else if (!Number.isFinite(+inputY.value) || inputY.value < 1 || inputY.value > 10 || (inputY.value % 1) != 0) {
        alert('Введите корректное значение в поле Y - целое число от 1 до 10');
        inputY.value = '';
        button.disabled = true;

    } else {
        var isTable = document.getElementsByTagName('table')[0];
        if (isTable !== undefined) {
            isTable.remove();
        }

        var table = document.createElement('table');
        for (var i = 0; i < +inputY.value; i++) {
            var tr = document.createElement('tr');

            for (var j = 0; j < +inputX.value; j++) {
                var td = document.createElement('td');

                if (i % 2 == j % 2) {
                    td.classList.add('white'); // td.className = 'white';

                } else {
                    td.classList.add('black'); //td.className = 'black';
                }
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        document.body.appendChild(table);

        inputX.value = '';
        inputY.value = '';
        button.disabled = true;

        table.addEventListener('click', changeBackColor, false);

        function changeBackColor(event) {
            var target = event.target; // ссылка на конкретный элемент (DOM-объект), на котором произошло событие (тег, на который мы кликнули) - td

            if (target.tagName === 'TD') { // если у текущего элемента, на который кликнули, tagName === 'TD'
                var tds = table.getElementsByTagName('td');

                for (var i = 0; i < tds.length; i++) {

                    if (tds[i].classList.contains('white')) {
                        tds[i].classList.remove('white');
                        tds[i].classList.add('black');

                    } else {
                        tds[i].classList.remove('black');
                        tds[i].classList.add('white');
                    }
                }
            }
        }
    }
};






