// Практическое задание 2

function Cat(name) {
    this.name = name;
    var foodAmount = 50;

    function formatFoodAmount() {
        return foodAmount + ' гр.'
    }

    this.feed = function() {
        console.log('Насыпаем в миску ' + formatFoodAmount() + ' корма.');
    };
}

var tom = new Cat('Tom');
console.log(tom.name);
tom = null;

var bars = new Cat('Bars');
bars.feed();



// Практическое задание 3

function Cat(name) {
    this.name = name;
    var foodAmount = 50;

    function formatFoodAmount() {
        return foodAmount + ' гр.'
    }

    this.dailyNorm = function(amount) {
        // вызов без параметра, значит режим геттера, возвращаем свойство
        // (отформатированное значение foodAmount), используя приватный метод formatFoodAmount()
        if (!arguments.length) return formatFoodAmount();

        // иначе режим сеттера
        else if (amount < 50) {
            throw new Error('Значение меньше нормы');
        }
        else if (amount > 100) {
            throw new Error('Значение больше нормы');
        }

        foodAmount = amount;
    };

    //метод feed будет внутри себя вместо formatFoodAmount() вызывать геттер (так как осуществляем вызов dailyNorm без параметра),
    //а геттер вызывает приватный метод formatFoodAmount()
    this.feed = function() {
        console.log('Насыпаем в миску ' + this.dailyNorm() + ' корма.');
    };
}

var tom = new Cat('Tom');
console.log(tom.name);
tom = null;

var bars = new Cat('Bars');
bars.feed();

bars.dailyNorm(60);
console.log(bars.dailyNorm());
bars.feed();





