const startGame = document.querySelector('.btn-play')
const gamePlay = document.querySelector('.gameplay')
const menu = document.querySelector('.menu')
const replayBtn = document.querySelector('.btn-replay')

startGame.onclick = function() {
    gamePlay.style.display = 'inline-block'
    menu.style.display = 'none'
    timer = 60
}

replayBtn.onclick = function() {
    location.reload()
}

function rectangularCollision({rectangle1,rectangle2}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    ) 
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    document.querySelector('.result-text').style.display = 'flex'
    if(player.health === enemy.health) {
        document.querySelector('.result-text').innerHTML = 'Tie'
        replayBtn.style.display = 'flex'
    } else if(player.health > enemy.health) {
        document.querySelector('.result-text').innerHTML = 'Player 1 Wins'
        replayBtn.style.display = 'flex'
    }
    else if(player.health < enemy.health) {
        document.querySelector('.result-text').innerHTML = 'Player 2 Wins'
        replayBtn.style.display = 'flex'
    }
}

let timer = 1000
let timerId
function decreaseTimer() {
if(timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('.timer').innerHTML = timer
}

if(timer === 0){
    determineWinner({player, enemy, timerId})
}
}
