const QNumArea = document.getElementById("QNum");
const RNumArea = document.getElementById("RNum");
const QuesArea = document.getElementById("QuesCopy");
const QuesBox = document.getElementById("Question");
const RespBox = document.getElementById("Response");
const RespArea = document.getElementById("RespCopy");
const PercArea = document.getElementById("Percent");
const YesArea = document.getElementById("Yes");
const NoArea = document.getElementById("No");
const NextArea = document.getElementById("Next");
const  fadeArea = document.getElementById("Fading");
const IntroArea = document.getElementById("IntroArea");
const QuizArea = document.getElementById("QuizArea");
const ListBox = document.getElementById("ListBox");
const AboutArea = document.getElementById("AboutArea");
const NumofQues = questions.length;
var QNum = 0;
var UsedQues = [999];

if(JSON.parse(sessionStorage.getItem("localUsedQues")) === null) {
    UsedQues = [];
} else{
    UsedQues = JSON.parse(sessionStorage.getItem("localUsedQues"));
}

// Load New Question Number
function NewQnum() {
    QNum = Math.floor(Math.random() * (questions.length));
    var check = UsedQues.includes(QNum);
    if (check === false) {
        UsedQues.push(QNum);
        sessionStorage.setItem('localUsedQues', JSON.stringify(UsedQues));
        logger('NewQnum(usedArr',UsedQues);
        logger('NewQnum',QNum);
        return QNum;
    } else {
        while (check === true){
            QNum = Math.floor(Math.random() * (questions.length-1));
            check = UsedQues.includes(QNum);
            logger("Used NewQnum", QNum);
            if(check === false){
                UsedQues.push(QNum);
                sessionStorage.setItem('localUsedQues', JSON.stringify(UsedQues));
                logger('NewQnum(usedArr',UsedQues);
                logger('NewQnum',QNum);
                return QNum;
            }
        }
    }
}

// Transition Time
function TransTime() {
    let TransTime = Math.round((longestTime * 1000) / 2);
    if (TransTime < 1500) {
        TransTime = 1500;
    }
    return TransTime + "ms";
}
// Fade In effect
function FadeIn() {
    fadeArea.setAttribute("style","opacity:0.9; transition-duration:" + TransTime() + ";");// filter: blur(0vw)
}
// Fade Out Effect
function FadeOut() {
    fadeArea.setAttribute("style","opacity:0; transition-duration:" + TransTime() + ";");//  filter: blur(0.2vw)
}

// Start Button
function Start() {
    loadQuestion();
}

// Load a new Question in
function loadQuestion() {
    FadeOut();
    if (UsedQues.length >= (questions.length-1)) {
        setTimeout(NoQues, Math.round((longestTime * 1000) / 2));
    } else {
        setTimeout(NewQues, Math.round((longestTime * 1000) / 2));
    }
}

// No More Questions
function NoQues() {
    HideOthers(QuizArea);
    clearstyle([QuesBox,YesArea,NoArea]);
    QuizArea.innerHTML = '<p id="IntroText" class="IntroText">Вы достигли конца, и вопросов больше нет</p>';
    FadeIn();
}

// Load Question
function NewQues() {
    HideOthers(QuizArea);

    clearstyle([QuesBox,YesArea,NoArea]);
    
    QNum = NewQnum();
    logger('NewQues',QNum);
    logger('NewQues',questions[QNum]);

    QNumArea.innerText = "Q" + questions[QNum][0];
    QuesArea.innerText = questions[QNum][1];
    YesArea.innerText = "Yes, " + questions[QNum][2];
    NoArea.innerText = "No, " + questions[QNum][3];
    FadeIn();
}

// Record Answer
function Answer(type) {
    FadeOut();
    questions[QNum][6]++;
    let QPcent = GenPcent(QNum);
    let LowQPcent = Math.round(GenPcent(QNum));
    showResults(LowQPcent, false, false);
    setTimeout(() => {
        FadeIn();
        clearstyle([RespBox, Next]);
        QNumArea.innerText = questions[QNum][6] + " Ответов";
        nQNum = questions[QNum][0]

        if (type == "yes") {
            PercArea.innerText = LowQPcent + "%";
            RespArea.innerText = questions[QNum][4];
            gsap.to([PercArea,RespArea],{color:'#81b29a', duration:0})
            questions[QNum][7]++;
        } else {
            PercArea.innerText = 100 - LowQPcent + "%";
            RespArea.innerText = questions[QNum][5]
            gsap.to([PercArea,RespArea],{color:'#e07a5f', duration:0})
            questions[QNum][8]++;
        }
        logger('Answer',type);
        logger('Answer',[questions[QNum],QPcent]);

    }, Math.round((longestTime * 1000) / 2));

    
}

// Generate Percent
function GenPcent(Num) {
    logger('GenPcent', questions[Num][8]  )
    logger('GenPcent', questions[Num][7]  )
    let Frac = questions[Num][7] / (questions[Num][7]+questions[Num][8]);
    let Pcent = (Frac * 100).toFixed(1);
    return Pcent;
}

// Clear Styles Function
function clearstyle(keep) {
    gsap.to([RespBox,Next,QuesBox,YesArea,NoArea],{display:'none', duration:0});
    gsap.to(keep,{display:'block', duration:0});
    gsap.to([PercArea,RespArea],{color:'#3e3b3b', duration:0})
}

// Next Question
function nextQues() {
    loadQuestion();
    reset();
}
