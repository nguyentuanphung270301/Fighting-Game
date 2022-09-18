const canvas = document.querySelector('canvas');
const c= canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './assets/img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
    x: 100,
    y: 0   
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/design/Martial Hero/Sprites/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc:'./assets/design/Martial Hero/Sprites/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc:'./assets/design/Martial Hero/Sprites/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc:'./assets/design/Martial Hero/Sprites/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc:'./assets/design/Martial Hero/Sprites/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc:'./assets/design/Martial Hero/Sprites/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc:'./assets/design/Martial Hero/Sprites/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './assets/design/Martial Hero/Sprites/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
    x: 800,
    y: 100    
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './assets/design/Martial Hero 2/Sprites/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc:'./assets/design/Martial Hero 2/Sprites/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc:'./assets/design/Martial Hero 2/Sprites/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc:'./assets/design/Martial Hero 2/Sprites/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc:'./assets/design/Martial Hero 2/Sprites/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc:'./assets/design/Martial Hero 2/Sprites/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './assets/design/Martial Hero 2/Sprites/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc:'./assets/design/Martial Hero 2/Sprites/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
});

const key = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate) 
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x  = 0

    //player movement
    if(key.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    }
    else if(key.d.pressed && player.lastKey ==='d'){
        player.velocity.x = 5
        player.switchSprite('run')
        
    } else {
        player.switchSprite('idle')
    }
    //jumping
    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if(player.velocity.y > 0) {
        player.switchSprite('fall')

    }

     //enemy movement
     if(key.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')

    }
    else if(key.ArrowRight.pressed && enemy.lastKey ==='ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')

    }
     //jumping
     if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if(enemy.velocity.y > 0) {
        enemy.switchSprite('fall')

    }

    //detect for collision && enemy get hits
    if( rectangularCollision({
        rectangle1: player, rectangle2: enemy
    }) && player.isAttacking && player.framesCurrent === 4){
            enemy.takeHit()
            player.isAttacking = false 
            //document.querySelector('.bar-gameplay__enemy-full-health').style.width = enemy.health + '%'
            gsap.to('.bar-gameplay__enemy-full-health', {
                width: enemy.health + '%'
            })
    }

    //if player missed
    if(player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false 
    }

    //this is where our player gets hit
    if( rectangularCollision({
        rectangle1: enemy, rectangle2: player
    }) && enemy.isAttacking && enemy.framesCurrent === 2 ){
            player.takeHit()
            enemy.isAttacking = false 
           // document.querySelector('.bar-gameplay__player-full-health').style.width = player.health + '%'
            gsap.to('.bar-gameplay__player-full-health',{
                width: player.health + '%'
            })
    }

     //if ennemy missed
     if(enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false 
    }

    //end game base on health
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }


}

animate()

window.addEventListener('keydown', (event) =>{
    if(!player.dead){
        switch(event.key) {
            //player controller
            case 'd':
                key.d.pressed = true
                player.lastKey ='d'
                break
            case 'a':
                key.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case ' ':
             player.attack()
             break   
        }
    }
    if(!enemy.dead) {
        switch(event.key) {
            //enemy controller
            case 'ArrowRight':
                key.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                key.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }

})

window.addEventListener('keyup', (event) =>{
    //player
    switch(event.key) {
        case 'd':
            key.d.pressed = false
            break
        case 'a':
            key.a.pressed = false
            break
    }
    //enemy
    switch(event.key) {
        case 'ArrowRight':
            key.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            key.ArrowLeft.pressed = false
            break
    }
})