const webhookURL = "https://discordapp.com/api/webhooks/1406040068698931352/MnE3E916bLtXjLfraOWwthK4-euzVEy16gAv9--yw4u6gvj9fXKywerzllGKRAzCEKBo";

let questions = [
    {q:"Через сколько минут после публикации сообщения с призами начинается МП?",a:["5","10","15"],c:1},
    {q:"Можно ли проводить то же МП на следующей неделе?",a:["Да","Нет"],c:1},
    {q:"Когда разрешено забивать МП на следующую неделю?",a:["С пятницы","С субботы","С понедельника"],c:1},
    {q:"Кто имеет право проводить МП?",a:["Любой участник","Только ведущие","Администратор"],c:1},
    {q:"Сколько предупреждений получает ведущий перед снятием?",a:["2","3","4"],c:1},
    {q:"Может ли ведущий участвовать в своём мероприятии?",a:["Да, но без призов","Нет","Только с разрешения администрации"],c:0},
    {q:"Как можно снять предупреждение?",a:["Предложить идею","Провести 2 МП подряд","Оба варианта"],c:2},
    {q:"За сколько дней победитель должен забрать приз?",a:["1","2","3"],c:1},
    {q:"Можно ли передавать приз другому участнику?",a:["Да","Нет","Если ведущий разрешит"],c:1},
    {q:"Куда ведущий пишет после подготовки сообщения с призами?",a:["В чат ведущих","В личные сообщения администрации","В Новости МП"],c:0},
    {q:"Что делать при нехватке участников на МП?",a:["Пингануть участников","Отменить без предупреждения","Ничего"],c:0},
    {q:"Что делать, если не можешь провести МП?",a:["Сообщить Главному ведущему","Просто не проводить","Попросить друга"],c:0},
    {q:"Что получает ведущий за проведение всех 8 МП за месяц?",a:["10 coins","12 coins","15 coins"],c:2},
    {q:"Сколько coins дают за проведение чужого МП?",a:["2","3","5"],c:0},
    {q:"Что происходит при двух нарушениях на МП?",a:["Ничего","Исключение","Блокировка"],c:1},
    {q:"Можно ли забивать МП в воскресенье?",a:["Да","Нет"],c:1},
    {q:"Куда ведущий дублирует итоги МП?",a:["В запросы-на-выдачу","В чат ведущих","В ЛС модератору"],c:0},
    {q:"Можно ли копировать ответы с интернета?",a:["Да","Нет"],c:1},
    {q:"Что запрещено при вопросах типа 'Кто создал...'",a:["Писать только имя","Писать без фамилии","Упоминать ведущего"],c:1},
    {q:"Куда отправляются нарушения с МП?",a:["В ЧС МП","В чат ведущих","Никуда"],c:0},
    {q:"Что произойдёт при 3 предупреждениях у ведущего?",a:["Снятие с поста","Штраф","Ничего"],c:0},
    {q:"Можно ли начинать МП без минимального количества участников?",a:["Да","Нет"],c:1},
    {q:"Какое поведение ведущего допустимо?",a:["Адекватное","Любое","Безразличное"],c:0},
    {q:"Кто публикует таблицу мероприятий?",a:["Главные ведущие","Модераторы","Любой игрок"],c:0},
    {q:"Какой бонус даётся за 15+ участников на МП?",a:["3 coins","2 coins","5 coins"],c:0}
];

let timerInterval, timeLeft = 80;
let currentQuestion = 0;
let correct = 0;
let nickname = "";

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
shuffle(questions);

function startTest() {
    nickname = document.getElementById("nickname").value.trim();
    if (!nickname) return alert("Введите ваш никнейм!");
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");
    startTimer();
    showQuestion();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Осталось: ${timeLeft} сек`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

function showQuestion() {
    const q = questions[currentQuestion];
    const container = document.getElementById("questionContainer");
    container.innerHTML = `<div class="question"><b>${currentQuestion+1}. ${q.q}</b><br>` +
        q.a.map((x, idx) => `<label><input type="radio" name="answer" value="${idx}"> ${x}</label>`).join("") +
        `</div>`;
}

function nextQuestion() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) return alert("Выбери ответ!");
    if (parseInt(selected.value) === questions[currentQuestion].c) correct++;
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    clearInterval(timerInterval);
    document.getElementById("quiz").classList.add("hidden");
    const result = document.getElementById("result");
    result.classList.remove("hidden");
    result.innerHTML = `
        <h2>Результат:</h2>
        <p>Ты ответил правильно на <b>${correct}</b> из <b>${questions.length}</b> вопросов!</p>
    `;

    if (correct >= 20) {
        sendToDiscord(nickname, correct);
        result.innerHTML += `<p style="color:#00ff9d;">✅ Поздравляем! Вы прошли тест и результат отправлен.</p>`;
    } else {
        result.innerHTML += `<p style="color:#ff5555;">❌ Недостаточно правильных ответов (нужно минимум 20).</p>`;
    }
}

function sendToDiscord(nick, score) {
    fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: "Тест МП | Результаты",
            embeds: [{
                title: "📋 Новый результат теста",
                color: 5814783,
                fields: [
                    { name: "Игрок", value: nick, inline: true },
                    { name: "Правильных ответов", value: `${score}/25`, inline: true }
                ],
                footer: { text: "Тест по правилам мероприятий" }
            }]
        })
    });
}
