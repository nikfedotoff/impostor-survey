// Когда страницы грузится
var Logger = false

document.onload = pageSetUp()

const HideOthers = (Box) => {
    gsap.to([ListBox, IntroArea, QuizArea, AboutArea], {display: 'none', duration: 0});
    gsap.to(Box, {display:'block', duration: 0})
}

// Инициализация
function pageSetUp() {
    generateStartingGrid();
    loadLotties();
    let readywidth = document.getElementById("no99").offsetHeight;
    wait(readywidth, 0);
    FadeIn();
}

function logger(func, thing){
    if(Logger == true){
        console.log(`${func} whispers:`);
        console.log(thing);
    }
}
