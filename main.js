const canvas = document.querySelector("#canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(window.innerHeight);

const spazio = 130;
//========================PLAYER==============================
class Player {
  constructor(x, y, radius, color, gravity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.gravity = gravity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); //x, y, raggio, da 0 a 360 gradi, non in senso antiorario
    c.fillStyle = this.color; // imposto un colore
    c.fill(); // disegno
    this.y += this.gravity;
  }
}
//========================TUBI==============================
class Tubo { // creo una classe player
  constructor() {
    this.x = innerWidth;
    this.y = Math.random() * ((-innerHeight + (innerHeight / 20)) - (-spazio - (innerHeight / 20))) + (-spazio - (innerHeight / 20));
    this.velocity = 4;
  }
  draw() {
    c.beginPath();
    c.fillStyle = "#e6004c"; // imposto un colore
    c.fillRect(this.x, this.y, 75, innerHeight);
    c.fillRect(this.x, this.y + innerHeight + spazio, 75, innerHeight);
    c.fill(); // disegno
  }
  update() {
    this.draw();
    this.x = this.x - this.velocity;
  }
}
//=====================INIZIALIZZO==============================
let x = Math.round(canvas.width / 5);
let y = canvas.height / 2;
const gravity = 6;
let salto = false;
let tubi = [];
let punteggio = 0;
let flag = true;

// creo il giocatore
let player = new Player(x, y, 20, '#fff', gravity);
player.draw();

let tubo = new Tubo(canvas.width / 2, 0);

function jump() {
  addEventListener('keypress', e => {
    if (e.key == 'w') {
      salto = true;
    }
  });
}
//======================CICLO PRINCIPALE===========================
function animate() {
  animationId = requestAnimationFrame(animate);
  // pulizia schermo
  c.fillStyle = 'rgba(0, 0, 0, 0.25)'; // imposto colore sfondo l'alpha aggiunge l'effetto scia
  c.fillRect(0, 0, canvas.width, canvas.height); // pulisco le schermo
  // punti
  c.font = "50px Comic Sans MS";
  c.fillStyle = player.color;
  c.fillText(punteggio, innerWidth/2, innerHeight/6);
  // salto
  jump();
  if (salto == true) {
    gsap.to(player, {
      duration: 0.25,
      y: player.y - 50
    });
    //player.y -= 60;
    salto = false;
  }

  // aggiornamento giocatore
  player.draw();

  // aggiornamento tubi
  if (tubi.length > 0) {
    if (tubi[0].x <= -75) {
      tubi.splice(0, 1);
    }
  }
  tubi.forEach((tubo) => {
    tubo.update();
  });
  // collisione tubi
  tubi.forEach((tubo) => {
    if (player.x + 20 >= tubo.x && player.x - 20 <= tubo.x + 75) {
      if ((player.y - 20 >= tubo.y && player.y - 20 <= tubo.y + innerHeight) || (player.y + 20 >= tubo.y + innerHeight + spazio && player.y + 20 <= tubo.y + innerHeight + spazio + innerHeight)) {
        console.log("contatto");
        animationId = cancelAnimationFrame(animationId);
        flag = false;
      }
    }
  });
  // punteggio
  tubi.forEach((tubo) => {
    if (player.x >= tubo.x + 75 -2 && player.x <= tubo.x + 75 + 2) {
      punteggio += 1;
      console.log(punteggio);
    }
  });
  //console.log("player X:" + player.x + "tubo X: " + tubi[0].x);
}
//========================SPAWN ENEMY============================
if (flag){
  setInterval(() => {
    tubi.push(new Tubo());
  }, 2000);
}
//============================AVVIO==============================
animate();
