const q = el => document.querySelector(el);
const gameArea = q('.game-area');
const startGameArea = q('.start-game');
const scoreBoard = q('.scoreboard');

let timerId;
let message;
let score = 0;
let screen = 600;
let platforms = [];
let animationPlatformId;
let characterMove = true;
let isGameOver = false;
let platformWidth = 160;
let platformHeight = 30;
let characterWidth = 80;
let characterHeight = 130;
let lengthPlatform = 5;
let minutes = 0, seconds = 0;
let gameAreaHeight = startGameArea.clientHeight;
let divCharacter = document.createElement('div');
let characterLeftSpace, characterBottomSpace;
let characterUpId = 0, characterDownId = 0, jumpId = 0;
let characterLeftId = 0, characterRightId = 0;
let characterLeftMove = 0, characterRightMove = 0;


document.addEventListener('keyup', controls)
document.querySelector('.screen').style.width = screen + 'px';
startGameArea.querySelector('button').addEventListener('click', play)


class Platform {
    constructor(platformBottomSpace) {
        let platLeftGap = (screen - platformWidth);

        this.left = Math.floor( Math.random() * platLeftGap );
        this.bottom = platformBottomSpace;
        this.div = document.createElement('div');

        let divPlatform = this.div;

        divPlatform.style.left = this.left + 'px';
        divPlatform.style.bottom = this.bottom + 'px';
        divPlatform.style.width = platformWidth + 'px';
        divPlatform.style.height = platformHeight + 'px';

        divPlatform.classList.add('platform');

        gameArea.appendChild(divPlatform);
    }
}

function create_Platform() {
    for (let i = 0; i < lengthPlatform; i++) {
        let platBottomGap = (gameAreaHeight / lengthPlatform);
        let platformBottomSpace = 60 + (i * platBottomGap);
        let newPlatform = new Platform(platformBottomSpace);
        
        platforms.push(newPlatform);
    }
}

function create_GameCharacter() {
    characterLeftSpace = platforms[0].left;
    characterBottomSpace = platforms[0].bottom;

    divCharacter.style.left = characterLeftSpace + 'px';
    divCharacter.style.bottom =  (characterBottomSpace + platformHeight) + 'px';
    divCharacter.style.width = characterWidth + 'px';
    divCharacter.style.height = characterHeight + 'px';
    divCharacter.classList.add('character')

    gameArea.appendChild(divCharacter);
}

function animation_Platform() {
    animationPlatformId = setInterval(() => {
        platforms.forEach( (p) => {
            p.bottom -= 1;
            p.div.style.bottom = p.bottom + 'px';
            console.log()
    
            if (p.bottom <= 0) {
                //gameArea.removeChild(p.div);
                p.div.classList.remove('platform')
                platforms.shift()
                platforms.push(new Platform(gameAreaHeight))
            }
        })
    }, 6)
}

function jump_Jump() {
    clearInterval(characterDownId)

    characterUpId = setInterval(() => {
        characterBottomSpace += 3;
        divCharacter.style.bottom = characterBottomSpace + 'px';

        if (characterBottomSpace > (jumpId + 400)) {
            falling_Down()
        }
    }, 4)
}

function falling_Down() {
    clearInterval(characterUpId)

    characterDownId = setInterval(() => {
        characterBottomSpace -= 1;
        divCharacter.style.bottom = characterBottomSpace + 'px';

        if (characterBottomSpace <= 0) {
            divCharacter.classList.add('hiding');
            divCharacter.style.bottom = (characterBottomSpace - platformWidth) + 'px';
            clearInterval(characterDownId)
            GameOver();
        }

        platforms.forEach(p => {
            if ((characterBottomSpace >= p.bottom) && 
                (characterBottomSpace <= p.bottom + platformHeight) &&
                ((characterLeftSpace + characterWidth) >= p.left) &&
                (characterLeftSpace <= p.left + platformWidth)) {
                jump_Jump()
                score += 1;
                jumpId = characterBottomSpace;
                scoreBoard.querySelector('.score i').innerHTML = score;
            }
        })
    }, 1)
}

function GameOver() {
    isGameOver = true;
    clearInterval(timerId);
    clearInterval(characterLeftId);
    clearInterval(characterRightId);
    clearInterval(animationPlatformId);

    verify_Point()

    setTimeout(game_Message, 1400)
}

function verify_Point() {
    if (score <= 10) {
        message = "Loser";
    } else if (score >= 11) {
        message = "Congratulation";
    } else if (score >= 100) {
        message = "Wow that's fantastic"
    }
}

function game_Message() {
    reset()

    startGameArea.querySelector('h1').innerHTML = message;
    setTimeout(() => {
        startGameArea.classList.add('show');
    }, 100)
}

function controls(e) {

    let left = () => {
        characterLeftSpace -= 1;
        divCharacter.style.left = characterLeftSpace + 'px';
        
        if (characterLeftSpace <= 0) {
            clearInterval(characterLeftId);
            characterLeftId = 0;
            characterRightId = setInterval(right, .1)
        }
    }

    let right = () => {
        characterLeftSpace += 1;
        divCharacter.style.left = characterLeftSpace + 'px';

        if (characterLeftSpace >= (screen - characterWidth)) {
            clearInterval(characterRightId);
            characterRightId = 0;
            characterLeftId = setInterval(left, .1)
        }
    }

    if (e.key == 'ArrowLeft' && characterLeftId == 0 && !isGameOver) {
        
        clearInterval(characterRightId);
        characterRightId = 0;

        characterLeftId = setInterval(left, .1)
        
    } else if (e.key == 'ArrowRight' && characterRightId == 0 && !isGameOver) {
        
        clearInterval(characterLeftId);
        characterLeftId = 0;

        characterRightId = setInterval(right, .1)
        
    } else if (e.key == 'ArrowDown') {

        clearInterval(characterLeftId);
        clearInterval(characterRightId);
        characterLeftId = 0;
        characterRightId = 0;

    } else if (e.key == 'Enter' && (startGameArea.classList.contains('show'))) {
        play()
    }
}

function reset() {
    platforms = [];
    score = 0;
    minutes = 0, seconds = 0;
    characterUpId = 0, characterDownId = 0;
    characterLeftId = 0, characterRightId = 0;
    characterLeftMove = 0, characterRightMove = 0;

    isGameOver = false;
    gameArea.innerHTML = '';
    divCharacter.classList.remove('hiding');
    startGameArea.classList.remove('show')
}

function timer() {
    timerId = setInterval(() => {
        seconds += 1;

        if (seconds == 60) {
            minutes += 1;
            seconds = 0;
        }

        let formatSeconds = seconds;

        switch(formatSeconds){
            case 0: formatSeconds = `0${seconds}`; break;
            case 1: formatSeconds = `0${seconds}`; break;
            case 2: formatSeconds = `0${seconds}`; break;
            case 3: formatSeconds = `0${seconds}`; break;
            case 4: formatSeconds = `0${seconds}`; break;
            case 5: formatSeconds = `0${seconds}`; break;
            case 6: formatSeconds = `0${seconds}`; break;
            case 7: formatSeconds = `0${seconds}`; break;
            case 8: formatSeconds = `0${seconds}`; break;
            case 9: formatSeconds = `0${seconds}`; break;
        }

        scoreBoard.querySelector('.time i').innerHTML = `${minutes}:${formatSeconds}`;
    }, 300)
}

function play() {
    if (!isGameOver) {
        create_Platform()
        create_GameCharacter()
        jump_Jump()
        animation_Platform()
        timer()

        startGameArea.classList.remove('show')
        scoreBoard.querySelector('.score i').innerHTML = score;
        scoreBoard.querySelector('.time i').innerHTML = `${minutes}:0${seconds}`;
    }
}