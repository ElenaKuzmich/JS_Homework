//ДОМАШНЕЕ ЗАДАНИЕ 7
//Задание 1

//-----родительский класс или функция-конструктор родителя-----
function Animal(name) {
    this.name = name; //публичное свойство
    this._foodAmount = 50; //защищенное свойство (делаем из приватного, объявленого через var)

    this._formatFoodAmount = function() { //защищенный метод (делаем из приватного, объявленого без this)
        return this._foodAmount + ' гр.';
    };

    this.dailyNorm = function(amount) { //публичный метод
        if (!arguments.length) return this._formatFoodAmount();

        if (amount < 30 || amount > 100) {
            return 'Недопустимое количество корма.';
        }

        this._foodAmount = amount;
    };

    var self = this;

    this.feed = function() { //публичный метод
        console.log('Насыпаем в миску ' + self.dailyNorm() + ' корма.'); //используем self, чтобы избежать конфликтов, связанных с this
    };
}

//-----дочерний класс или функция-конструктор потомка-----
function Cat(name) {
    //строка с наследованием (теперь есть доступ внутри дочернего класса к публичным и защищенным свойствам и методам родительского класса)
    Animal.apply(this, arguments);

    //метод потомка - расширяем поведение родительского метода
    var animalFeed = this.feed; //записываем в любую переменную код родительского метода для разграничения одиникового имени
    this.feed = function() { //объявляем дочерний метод с таким же названием
        animalFeed(); //теперь можно вызывать как угодно, this не важен
        console.log('Кот доволен ^_^');

        return this; //возвращаем ссылку на объект, чтобы можно было вызывать методы цепочкой любое количество раз
    };

    //метод потомка
    this.stroke = function() { //публичный метод
        console.log('Гладим кота.');

        return this;
    };
}

var barsik = new Cat('Барсик');

barsik.dailyNorm(60);
console.log(barsik.dailyNorm());

barsik.feed().stroke().feed();




//Задание 2

//------родительский класс или функция-конструктор родителя-----
//свойства хранятся в функции-конструкторе (в прототипном стиле нет приватных свойств и методов)
function Animal(name) {
    this.name = name; //публичное свойство
    this._foodAmount = 50; //защищенное свойство (делаем из приватного, объявленого через var)
}

//методы хранятся в прототипе
Animal.prototype._formatFoodAmount = function() { //защищенный метод (делаем из приватного, объявленого без this)
    return this._foodAmount + ' гр.';
};

Animal.prototype.dailyNorm = function(amount) { //публичный метод
    if (!arguments.length) return this._formatFoodAmount();

    if (amount < 30 || amount > 100) {
        return 'Недопустимое количество корма.';
    }

    this._foodAmount = amount;
};

Animal.prototype.feed = function() {
    console.log('Насыпаем в миску ' + this.dailyNorm() + ' корма.');
};

//-----дочерний класс или функция-конструктор потомка-----
function Cat(name) {
    Animal.apply(this, arguments); //наследуем конструктор родителя
}

// наследуем методы родителя, т.е. наследуем прототип
Cat.prototype = Object.create(Animal.prototype); //в Cat.prototype записываем пустой объект, у которого ссылка proto ведет на Animal.prototype

// желательно сохранить constructor, восстановить ссылку constructor на Cat
// (по умолчанию в Cat.prototype лежит свойство constructor: Cat; Object.create создал новый объект с ссылкой __proto__: Animal.prototype)
Cat.prototype.constructor = Cat;

// методы потомка (добавляем в объект Cat.prototype свои собственные методы)
Cat.prototype.feed = function() {
    //вызов метода-родителя внутри своего
    Animal.prototype.feed.apply(this);
    console.log('Кот доволен ^_^');

    return this;
};

Cat.prototype.stroke = function() {
    console.log('Гладим кота.');

    return this;
};

var barsik = new Cat('Барсик');

barsik.dailyNorm(60);
console.log(barsik.dailyNorm());

barsik.feed().stroke().feed();

