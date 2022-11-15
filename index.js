
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 768

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const placementTileData2D = []
for (let i = 0; i < placementTileData.length; i += 20) {
    placementTileData2D.push(placementTileData.slice(i, i + 20));
}
console.log(placementTileData2D);



const placementTiles = []

placementTileData2D.forEach((row, chosen_y) => {
    row.forEach((symbol, chosen_x) => {
        if (symbol === 14) { // means the user allows to build in this place.
            // add new bulding placement tile here
            placementTiles.push(new PlacementTile({
                position: {
                    x: chosen_x * 64,
                    y: chosen_y * 64

                }
            }))
        }
    })
})

console.log(placementTiles);

const image = new Image()


image.onload = () => {
    c.drawImage(image, 0, 0)
    animate()
}
image.src = 'img/gameMap.png'


const enemies = []

function spwanEnemies(spwanCount) {

    for (let i = 1; i < spwanCount + 1; i++) {
        const xOffset = i * 150
        enemies.push(
            new Enemy({
                position: { x: waypoints[0].x - xOffset, y: waypoints[0].y }
            })
        )
    }
}

const buildings = [];
let activeTile = undefined;
let enemyCount = 3;



let hearts = 10;
let coins = 100;

spwanEnemies(enemyCount);

function animate() {
   const animationID = requestAnimationFrame(animate)

    c.drawImage(image, 0, 0)
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i]
        enemy.update()
        if (enemy.position.x > canvas.width) {
            hearts-=1;
            enemies.splice(i, 1);
            document.querySelector('#hearts').innerHTML = hearts;
            if(hearts === 0) {
                console.log('game over')
                window.cancelAnimationFrame(animationID)
                document.querySelector('#gameOver').style.display = 'flex'
            }
        }

    }

    //tracking total amount of enemies
    if (enemies.length === 0) {
        enemyCount += 2
        spwanEnemies(enemyCount);
    }

    placementTiles.forEach((tile) => {
        tile.update(mouse)
    })
    buildings.forEach((building) => {
        building.update();
        building.target = null
        const validEnemies = enemies.filter(enemy => {
            const xDistance = enemy.center.x - building.center.x
            const yDistance = enemy.center.y - building.center.y
            const distance = Math.hypot(xDistance, yDistance)
            return distance < enemy.radius + building.radius
        })

        building.target = validEnemies[0]



        for (let i = building.projectiles.length - 1; i >= 0; i--) {
            const projectile = building.projectiles[i]

            projectile.update()

            const xDistance = projectile.enemy.center.x - projectile.position.x
            const yDistance = projectile.enemy.center.y - projectile.position.y
            const distance = Math.hypot(xDistance, yDistance)
            //this is when tower hits an enmey
            if (distance < projectile.enemy.radius + projectile.radius) {
                //enemy health and enemy removal
                projectile.enemy.health -= 20;
                if (projectile.enemy.health <= 0) {
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectile.enemy === enemy
                    })
                    if (enemyIndex > -1) {
                        enemies.splice(enemyIndex, 1)
                        coins +=25;
                        document.querySelector('#coins').innerHTML = coins;
                    }

                }
                building.projectiles.splice(i, 1)
            }
        }

    })
}

const mouse = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('click', (event) => {
    if (activeTile && !activeTile.isOccupied && coins >= 50) {
        coins -= 50;
        document.querySelector('#coins').innerHTML = coins;
        buildings.push(new Building({
            position: {
                x: activeTile.position.x,
                y: activeTile.position.y
            }
        })
        )
        activeTile.isOccupied = true;
    }
    console.log(buildings);
})

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    activeTile = null;
    for (let i = 0; i < placementTiles.length; i++) {
        const tile = placementTiles[i];
        if (mouse.x > tile.position.x &&
            mouse.x < tile.position.x + tile.size
            && mouse.y > tile.position.y
            && mouse.y < tile.position.y + tile.size) {
            activeTile = tile;
            break;

        }
    }
})

