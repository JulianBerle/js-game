const highScore = document.querySelector("#personal-high span").innerHTML;

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=None; Secure";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
            }
        }
    return "";
}

function checkCookie() {
    let username = getCookie("username");
        if (username != "") {
            alert("Welcome again " + username);
        } else {
            username = prompt("Please enter your name:", "");
            if (username != "" && username != null) {
                setCookie("username", username, 365);
            }
        }
}

function deleteCookie(cname) {
    createCookie(cname,"",-9999999999);
}

if (getCookie("highScore") === null || getCookie("highScore") === "") {
    setCookie("highScore", 0, 999999999);
    console.log("Highscore cookie aangemaakt.")
} else {
    console.log("highscore cookie bestaat al.")
}

if (getCookie("score") === null || getCookie("score") === "") {
    setCookie("score", 0, 999999999);
    console.log("Score cookie aangemaakt.")
} else {
    console.log("Score cookie bestaat al.")
}

if (getCookie("level") === null || getCookie("level") === "") {
    setCookie("level", 1, 999999999);
    console.log("Level cookie aangemaakt.")
} else {
    console.log("Level cookie bestaat al.")
}

if (getCookie("invaderSpeed") === null || getCookie("invaderSpeed") === "") {
    setCookie("invaderSpeed", 500, 999999999);
    console.log("InvaderSpeed cookie aangemaakt.")
} else {
    console.log("InvaderSpeed cookie bestaat al.")
}

let invaderSpeed = document.cookie.split('; ').find((row) => row.startsWith('invaderSpeed='))?.split('=')[1];

let levelNumber = document.cookie.split('; ').find((row) => row.startsWith('level='))?.split('=')[1];

document.querySelector("#level-score span").innerHTML = `${levelNumber}`;

const lastScoreCookie = document.cookie  .split('; ')  .find((row) => row.startsWith('score='))  ?.split('=')[1];

document.querySelector("#last-score span").innerHTML = `${lastScoreCookie}`;

const highScoreCookie = document.cookie  .split('; ')  .find((row) => row.startsWith('highScore='))  ?.split('=')[1];

document.querySelector("#personal-high span").innerHTML = `${highScoreCookie}`;

function gameReset() {
    setCookie("highScore", "", -1);
    setCookie("score", "", -1);
    setCookie("level", 1, -1)

    location.reload(); 
}

function gameStart() {
    const grid = document.querySelector('.grid');
    const resultsDisplay = document.querySelector('.results')
    let currentShooterIndex = 202;
    let width = 15;
    let direction = 1;
    let invadersId;
    let goingRight = true;
    let aliensRemoved = [];
    let results = 0;
    
    document.querySelector(".game").style.display = "block";
    document.querySelector(".container").style.display = "none";
    
    for (let i = 0; i < 225; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
    };
    
    const squares = Array.from(document.querySelectorAll('.grid div'));
    
    const alienInvaders = [
        0,1,2,3,4,5,6,7,8,9,15,16,17,18,19,20,21,22,23,24,30,31,32,33,34,35,36,37,38,39,
    ];
    
    function draw() {
        for (let i = 0; i < alienInvaders.length; i++) {
            if (!aliensRemoved.includes(i)) {
                squares[alienInvaders[i]].classList.add('invader');
            };
        };
    };
    
    
    draw();
    
    function remove() {
        for (let i = 0; i < alienInvaders.length; i++) {
            squares[alienInvaders[i]].classList.remove('invader')
        };
    };
    
    squares[currentShooterIndex].classList.add('shooter');
    
    function moveShooter(e) {
        squares[currentShooterIndex].classList.remove('shooter');
    
        switch(e.key) {
            case 'a':
                if (currentShooterIndex % width !== 0) currentShooterIndex -=1;
                break;
            case 'd':
                if (currentShooterIndex % width < width -1) currentShooterIndex +=1;
                break;
            case 'A':
                if (currentShooterIndex % width !== 0) currentShooterIndex -=1;
                break;
            case 'D':
                if (currentShooterIndex % width < width -1) currentShooterIndex +=1;
                break;
        };
    
        squares[currentShooterIndex].classList.add('shooter');
    };
    
    document.addEventListener('keydown', moveShooter);
    
    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0;
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1;
        remove();
    
        if (rightEdge && goingRight) {
            for (let i = 0; i < alienInvaders.length; i++) {
                alienInvaders[i] += width +1;
                direction = -1;
                goingRight = false;
            }
        } 
    
        if (leftEdge && !goingRight) {
            for (let i = 0; i <alienInvaders.length; i++) {
                alienInvaders[i] += width -1
                direction = 1
                goingRight = true
            }
        }
    
    
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += direction;
        };
    
        draw();
    
        if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
            resultsDisplay.innerHTML = 'GAME OVER youre score was ' + results;
                setCookie("score", `${results}`, 2);
                clearInterval(invadersId);
                if (highScoreCookie < results) {
                    setCookie("highScore", `${results}`, 99999999);
                } else {
                    console.log("Score was lower as the highscore");
                }
                window.location.reload();
            };
    
        for (let i = 0; i < alienInvaders.length; i++) {
            if(alienInvaders[i] > (squares.length )) {
                resultsDisplay.innerHTML = 'GAME OVER youre score was ' + results;
                    setCookie("score", `${results}`, 2);
                    clearInterval(invadersId);
                    if (highScoreCookie < results) {
                        setCookie("highScore", `${results}`, 99999999);
                    } else {
                        console.log("Score was lower as the highscore");
                    }
                    window.location.reload();
          };
        };
        if (aliensRemoved.length === alienInvaders.length) {
            resultsDisplay.innerHTML = 'YOU WIN with score ' + results;
                setCookie("score", `${results}`, 2);
                setCookie("level", parseInt(levelNumber)+1, 9999)
                setCookie("invaderSpeed", parseInt(invaderSpeed)-10, 9999)
                clearInterval(invadersId);
                if (highScoreCookie < results) {
                    setCookie("highScore", `${results}`, 99999999);
                } else {
                    console.log("Score was lower as the highscore");
                }
                window.location.reload();
            };
        };
    
    invadersId = setInterval(moveInvaders, parseInt(invaderSpeed));
    
    
    function shoot(e) {
        let laserID;
        let currentLaserIndex = currentShooterIndex;
        function moveLaser() {
            squares[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= width;
            squares[currentLaserIndex].classList.add('laser');
    
            if (squares[currentLaserIndex].classList.contains('invader')) {
                squares[currentLaserIndex].classList.remove('laser');
                squares[currentLaserIndex].classList.remove('invader');
                squares[currentLaserIndex].classList.add('boom');
    
                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);
                clearInterval(laserID);
    
                const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
                aliensRemoved.push(alienRemoved)
                results++
                resultsDisplay.innerHTML = results;
                console.log(aliensRemoved)
            }
        }
        switch(e.key) {
            case 'w': 
            laserID = setInterval(moveLaser, 1)
            break;
            case 'W': 
            laserID = setInterval(moveLaser, 1)
            break;
        }
    }
    
    document.addEventListener('keydown', shoot)
}