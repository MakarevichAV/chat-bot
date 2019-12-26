window.addEventListener('load', function () {

    let textarea = document.querySelector('textarea'); // поле ввода
    let submitButton = document.querySelector('.button'), // кнопка отправки
        tape = document.querySelector('.tape'); // лента сообщений, куда будет вставляться новое сообщение

    let chat = document.querySelector('.chat');

    let msg = document.querySelector('.msg');

    function createMsg(person, txt) {
        let message = document.createElement('div'); // создание блока сообщения
        message.classList.add('message');
        message.classList.add(person); // добавление переданного класса для инициализации собеседника
        let avatar = document.createElement('div'); // создание блока аватара
        avatar.classList.add('avatar');
        message.append(avatar); // добавление блока аватара в блок сообщения
        let text = document.createElement('div'); // создание текстового блока сообщения
        text.classList.add('text');
        message.append(text); // добавление текстового блока в блок сообщения
        let paragraph = document.createElement('p'); // создание параграфа
        paragraph.innerHTML = txt; // вставка значения из textarea в параграф 
        text.append(paragraph); // добавление параграфа в текстовый блок
        tape.append(message); // добавление сформированного сообщения в ленту
        chat.scrollTop = tape.clientHeight; // скролл ленты сообщений в самый низ
        textarea.value = ''; // очистка поля ввода после отправки сообщения
        msg.classList.remove('writes');
    }

    // функция ответов Бота
    function answer(text) {
        if (text == '/start' && sessionStorage['start'] != 'true') {
            createMsg('bot', 'Привет, меня зовут Чат-бот, а как зовут тебя?');
            sessionStorage.setItem('start', 'true');
        } else if (sessionStorage['start'] == 'true' && /[/]name:/g.exec(text) != null) { // рег. выражение - проверка на наличие /name:
            let name = text.replace(/[/]name:\s/g, ''); // запишем в name только имя, введенное пользователем
            createMsg('bot', 'Привет, ' + name + '! Приятно познакомится. Я умею считать, введи числа которые надо посчитать');
            sessionStorage.setItem('name', name);
        } else if (sessionStorage['start'] == 'true' && sessionStorage['name'] && /[/]number:/g.exec(text) != null) {
            createMsg('bot', 'Теперь введи один из операторов: -, +, *, /');
            let numbers = text.replace(/\s/g, '').replace(/[/]number:/g, '').split(',');
            sessionStorage.setItem('number1', numbers[0]);
            sessionStorage.setItem('number2', numbers[1]);
        } else if (sessionStorage['start'] == 'true' &&
            sessionStorage['name'] &&
            sessionStorage['number1'] &&
            sessionStorage['number2'] &&
            (text == '-' || text == '+' || text == '*' || text == '/')
        ) {
            sessionStorage.setItem('operator', text);
            createMsg('bot', eval(sessionStorage['number1'] + sessionStorage['operator'] + sessionStorage['number2']));
        } else if (text == '/stop') {
            createMsg('bot', 'Всего доброго! Если хочешь поговорить, пиши /start');
            sessionStorage.clear()
        } else {
            if (sessionStorage['start'] != 'true') {
                createMsg('bot', 'Введите команду /start для начала общения');
            } else {
                createMsg('bot', 'Я не понимаю. Введите другую команду.');
            }
        }
    }

    submitButton.addEventListener('click', function () {
        if (this.classList.contains('active')) { // Если кнопка активна
            let request = textarea.value;
            createMsg('human', textarea.value); // вызов функции создания сообщения с передачей переменной ПЕРСОНЫ (Человек) и текста сообщения
            setTimeout(answer, 500, request);
        }
    });



    // jQuery  // отправка сообщения при клике на Enter
    $('textarea').keyup(function (event) {
        if (event.keyCode == 13 && $(this).val() != '') {
            event.preventDefault(); // отмена стандартного поведения браузера
            $(this).val($(this).val().slice(0, -1)); // стираем перенос строки в конце
            $('.button').click(); // запуск события клика по кнопке
            $(this).val(''); // очищаем значение textarea
            $('.button').removeClass('active'); // делаем кнопку неактивной
            $('.msg').removeClass('writes'); // удаляем у блока ввода сообщения класс, отвечающий за анимацию ввода текста
        } else if ($(this).val() != '') {
            $('.button').addClass('active');
            $('.msg').addClass('writes'); // добавляем блоку ввода сообщения класс, отвечающий за анимацию ввода текста 
        } else {
            $('.button').removeClass('active');
            $('.msg').removeClass('writes');
        }
    });

});