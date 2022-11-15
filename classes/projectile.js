class Projectile {
    constructor({ position = { x: 0, y: 0 }, enemy }) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0

        }
        this.enemy = enemy;
        this.radius = 10;
    }
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'orange'
        c.fill()
    }
    update() {
        this.draw()
        const angle = Math.atan2(
            this.enemy.center.y - this.position.y,
            this.enemy.center.x - this.position.x)

        const power = 5;
        this.velocity.x = Math.cos(angle) * power
        this.velocity.y = Math.sin(angle) * power
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

}