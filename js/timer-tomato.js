// Блок таймера

let startSecondsValue = 5; // начальное значение (секунды)
let startSeconds = startSecondsValue; // начальное значение (секунды)
let intervalUpdate; // интервал

const countDownTimer = document.getElementById('timer-v-minutes'); // элемент для вывода минут

// получаем ид кнопок
const buttonStart = document.getElementById('buttonStart');
const buttonStop = document.getElementById('buttonPause');
const buttonReset = document.getElementById('buttonReset');

// назначаем обработчик события по клику для кнопок
buttonStop.addEventListener('click', timerPause);
buttonStart.addEventListener('click', timerStart);
buttonReset.addEventListener('click', timerReset);

function timerPause() {
	// console.log('timerPause');
	clearInterval(intervalUpdate); // останавливаем таймер, заданный функцией setInterval
}

// форматируем вид вывода секунд
function prepareTime() {
	// console.log('prepareTime');
	const minutes = Math.floor(startSeconds / 60); // => 60 // получаем минуты, разделив секунды от часа на кол-во минут часа
	let seconds = startSeconds % 60; // получаем кол-во секунд от начального значения, путем деления с остатком, остаток и будет секундами в текущей итерации
	seconds = seconds < 10 ? '0' + seconds : seconds; // форматируем вид вывода секунд, добавлением 0 перед одиночным числом
	countDownTimer.innerHTML = `${minutes}:${seconds}`; // вывод текущего значения
}

function countDown() {
	// console.log('countDown');
	prepareTime();
	startSeconds--; // чтобы таймер тикал
	if (startSeconds < 0) {
		clearInterval(intervalUpdate);
		startSeconds = 0; // дополнительно обнулим исходное число счетчика, чтобы при запуске кнопкой старт не оборазовалось минусовое число

		dragAndDrop(); // разрешаем перетаскивать помидор в корзину (Я ДУМАЮ ТУТ ПРОБЛЕМА НАРАЩИВАНИЯ СЧЕТЧИКА)
	}
}

function timerStart() {
	// console.log('timerStart');
	clearInterval(intervalUpdate); // чтобы при нажатии на старт быстро секунды не просчитывались быстрее
	intervalUpdate = setInterval(countDown, 250); // 1000 // запускаем ф-ю по интервалу, привязываем переменную для остановки с помощью clearInterval
}

function timerReset() {
	// console.log('timerReset');
	clearInterval(intervalUpdate); // сначала нужно остановить отсчет
	startSeconds = startSecondsValue; // возвращаем базовое значение
	prepareTime();

	cardTomato.setAttribute('draggable', 'false'); // откл перетаскивание

	localStorage.removeItem('countTomato');
	countTomato = 0;
	storageCountTomato = 0;
	countBasket.innerHTML = countTomato;
}

// Блок перетаскивания

const listTomato = document.getElementById('list-tomato'); // вся область где возможно перетаскивание
const cardTomato = document.getElementById('card-tomato'); // перетаскивающийся объект
const cellBasket = document.getElementById('cell-basket'); // место куда перетаскивается объект
const countBasket = document.getElementById('count-basket'); // счетчик помидоров

let countTomato = 0; // начальное значение счетчика

// let storageCountTomato = localStorage.getItem('countTomato'); // будет для сохранения счетчика при обновлении (пока недореализованно)

const dragAndDrop = () => {
	console.log('dragAndDrop');

	cardTomato.setAttribute('draggable', 'true'); // вкл перетаскивание
};

const dragStart = function () {
	// console.log('dragStart');
	setTimeout(() => { // (хак) таймаут нужен, чтобы успеть зацепить перетаскиваемый объект до его скрытия классом hide
		cardTomato.classList.add('hide'); // добавляем класс для скрытия объекта в начальной точке, после события dragstart (перетаскивания), чтобы был виден только перетаскивающийся объект
	}, 0);
};

const dragEnd = function () {
	// console.log('dragEnd');
	cardTomato.classList.remove('hide'); // удаляем скрывающий класс, чтобы снова был виден перетаскивающийся объект в начальной позиции
};

const dragOver = function (evt) { // передаем событие (без этого не сработает dragDrop)
	// console.log('dragOver');
	evt.preventDefault(); // отменяем действие по умолчанию (без этого не сработает dragDrop)
};

const dragEnter = function (evt) { // передаем событие (? для безопасности)
	// console.log('dragEnter');
	evt.preventDefault(); // ? для безопасности
	this.classList.add('hovered'); // Подсветка ячейки при наведении перетаскиваемого объекта на нее
};

const dragLeave = function () {
	// console.log('dragLeave');
	this.classList.remove('hovered'); // Удаляем подсветку ячейки, когда объект покидает пределы
};

const dragDrop = function (e) {
	console.log('dragDrop', e);
	this.classList.remove('hovered'); // убираем подсветку ячейки, так как после перетаскивания объекта в ячейку она тут больше не нужна

	countDrop(); // !here
};

const countDrop = function () {
	console.group('countDrop')
	// console.log('countDrop');
	console.log('countDrop -> countTomato : ', countTomato);
	console.groupEnd;
	
	countTomato = ++countTomato;
	countBasket.innerHTML = countTomato;
	
	/* localStorage.setItem('countTomato', countTomato); // будет для сохранения счетчика при обновлении (пока недореализованно)
	storageCountTomato = localStorage.getItem('countTomato');
	console.log('storageCountTomato', storageCountTomato); */

	cardTomato.setAttribute('draggable', 'false'); // выкл возможность перетаскивать помидоры после одного перетаскивания
	startSeconds = startSecondsValue;
	prepareTime(); // форматируем вид вывода секунд
};

cardTomato.addEventListener('dragstart', dragStart); // (первое) событие происходящее в момент перетаскивания
cardTomato.addEventListener('dragend', dragEnd); // событие происходящее в момент окончания перетаскивания

cellBasket.addEventListener('dragover', dragOver); // событие постоянно срабатывает, когда оно в пределах элемента, в который ее можно дропнуть. Нужно для срабатываения другого эвента dragDrop
cellBasket.addEventListener('dragenter', dragEnter); // событие срабатывает один раз, когда оно впределах элемента, в который ее можно дропнуть
cellBasket.addEventListener('dragleave', dragLeave); // событие срабатывает один раз, когда оно покидает пределы элемента, в который ее можно было дропнуть
cellBasket.addEventListener('drop', dragDrop); // событие срабатывает при сбросе в допустимую область
