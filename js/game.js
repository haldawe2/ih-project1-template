class Game{
  constructor(context) {
    this.ctx = context;
    this.dungeon = [];
    this.player;
    this.enemies = [];
    this.exit = {}
  }

  _createDungeon(x, y) {
    this.dungeon = new Array(x);
    for (let i = 0; i < x; i++) {
        this.dungeon[i] = new Array(y);
        for (let j = 0; j < y; j++) {
            this.dungeon[i][j] = "white";
        }
    }
}

  _createWalls() {
      //top and bottom walls
      for (let i = 0; i < this.dungeon.length; i++) {
          this.dungeon[i][0] = "brown"
      }
      for (let i = 0; i < this.dungeon.length; i++) {
          this.dungeon[i][this.dungeon.length - 1] = "brown"
      }
      //left and right walls
      for (let i = 0; i < this.dungeon.length; i++) {
          this.dungeon[0][i] = "brown"
      }
      for (let i = 0; i < this.dungeon.length; i++) {
          this.dungeon[this.dungeon.length - 1][i] = "brown"
      }
  }

  _renderDungeon() {
    for (let i = 0; i < this.dungeon.length; i++) {
      for (let j = 0; j < this.dungeon[i].length; j++) {
        this.ctx.fillStyle = `${this.dungeon[i][j]}`;
        this.ctx.fillRect(
          i * (1000 / this.dungeon.length),
          j * (600 / this.dungeon[i].length),
          1000 / this.dungeon.length,
          600 / this.dungeon[i].length
        );
      }
    }
  }

  _createEnemies() {
    for (let i = 0; i < 2; i++) {
      let randomX = Math.floor(Math.random() * Math.ceil((this.dungeon.length - 2) / 2)) + Math.floor(this.dungeon.length / 2);
      let randomY = Math.floor(Math.random() * (this.dungeon[0].length - 2)) + 1;
      this.enemies.push(new Enemy(this, randomX, randomY));
    }
  }

  _checkDeaths() {
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].health <= 0) {
        this.enemies.splice(i, 1);
      }
    }
  }

  _renderPlayer() {
    const lengthX = 1000 / this.dungeon.length;
    const lengthY = 600 / this.dungeon[0].length;
    this.ctx.fillStyle = `${this.player.color}`
    this.ctx.fillRect(this.player.position.x * lengthX, this.player.position.y * lengthY, 1000 / this.dungeon.length, 600 / this.dungeon[0].length)
  }

  _renderEnemies() {
    const lengthX = 1000 / this.dungeon.length;
    const lengthY = 600 / this.dungeon[0].length;
    for (let i = 0; i < this.enemies.length; i++) {
      this.ctx.fillStyle = `${this.enemies[i].color}`
      this.ctx.fillRect(this.enemies[i].position.x * lengthX, this.enemies[i].position.y * lengthY, 1000 / this.dungeon.length, 600 / this.dungeon[0].length)
    }
  }

  _assignControls() {
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.player.moveLeft();
          this.enemies.forEach((enemy) => (enemy._moveEnemy()));
          break;
        case 'ArrowRight':
          this.player.moveRight();
          this.enemies.forEach((enemy) => (enemy._moveEnemy()));
          break;
        case 'ArrowUp':
          this.player.moveUp();
          this.enemies.forEach((enemy) => (enemy._moveEnemy()));
          break;
        case 'ArrowDown':
          this.player.moveDown();
          this.enemies.forEach((enemy) => (enemy._moveEnemy()));
          break;
        case 'q':
          this.player.attackRanged();
          this.enemies.forEach((enemy) => (enemy._moveEnemy()));
          break;
        default:
          break;
      }
    });
  }

  _createExit() {
    this.exit.x = this.dungeon.length - 1;
    this.exit.y = Math.floor(this.dungeon[0].length / 2);
    this.dungeon[this.exit.x][this.exit.y] = 'green'
  }

  _checkWin() {
    if (this.player.position.x === this.exit.x && this.player.position.y === this.exit.y) {
      const canvas = document.getElementById('canvas');
      canvas.classList.add('hidden');
      document.getElementById('win-page').style = 'display: flex'
    }
  }

  _checkLoss() {
    if (this.player.health <= 0) {
      const canvas = document.getElementById('canvas');
      canvas.classList.add('hidden');
      document.getElementById('lose-page').style = 'display: flex'
    }
  }

  _update() {
    this._checkWin();
    this._checkLoss();
    this._checkDeaths();
    this._renderDungeon();
    this._renderEnemies();
    this._renderPlayer();
    window.requestAnimationFrame(() => this._update());
  }

  start() {
    this._createDungeon(9, 9);
    this._createWalls();
    this._createExit();
    this.player = new Player(this);
    this._createEnemies();
    this._assignControls();
    this._update();
  }
}