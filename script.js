var bondLength = 50;
var bondScale = 0.001;
var repelScale = 0.3;
var decay = 0.01;
var atoms = [];

atoms.push(new Atom("H"));
atoms.push(new Atom("H"));
atoms.push(new Atom("H"));
atoms.push(new Atom("C"));
atoms.push(new Atom("C"));
atoms.push(new Atom("e"));
atoms.push(new Atom("H"));
atoms.push(new Atom("H"));
atoms[0].x = 300;
atoms[1].x = 500;
atoms[2].y = 200;
atoms[3].y = 400;
atoms[0].bond(atoms[4]);
atoms[1].bond(atoms[4]);
atoms[2].bond(atoms[4]);
atoms[3].bond(atoms[4]);
atoms[5].bond(atoms[3]);
atoms[5].y += 200;
atoms[6].bond(atoms[3]);
atoms[6].y += 100;
atoms[6].x += 100;
atoms[7].bond(atoms[3]);
atoms[7].y += 100;
atoms[7].x -= 100;

setInterval(run, 1000/60);

function Atom(symbol) {
	this.symbol = symbol;
	this.radius = 20;
	this.x = 400;
	this.y = 300;
	this.vx = 0;
	this.vy = 0;
	this.bonds = [];

	this.bond = function(atom) {
		this.bonds.push(atom);
		atom.bonds.push(this);
	}
	
	this.distanceTo = function(atom) {
		var dx = atom.x - this.x;
		var dy = atom.y - this.y;

		return Math.sqrt(dx*dx + dy*dy);
	}

	this.angleTo = function(atom) {
		var dx = atom.x - this.x;
		var dy = atom.y - this.y;

		return Math.atan2(dy, dx);
	}
}

function run() {
	update();
	draw();
}

function update() {
	for (var i=0; i<atoms.length; i++) {
		var atom = atoms[i];

		for (var j=0; j<atom.bonds.length; j++) {
			var bond = atom.bonds[j];
			var error = atom.distanceTo(bond) - bondLength;

			if (error > 0) {
				var theta = atom.angleTo(bond);
				
				atom.vx += Math.cos(theta) * error * bondScale;
				atom.vy += Math.sin(theta) * error * bondScale;
			}
		}

		for (var j=0; j<atoms.length; j++) {
			if (j != i) {
				var atom2 = atoms[j];
				var dist = atom.distanceTo(atom2);
				var theta = atom.angleTo(atom2);

				atom.vx -= (Math.cos(theta) * repelScale) / dist;
				atom.vy -= (Math.sin(theta) * repelScale) / dist;
			}
		}
	}

	for (var i=0; i<atoms.length; i++) {
		var atom = atoms[i];

		//motion decay
		if (atom.vx > 0)
			if (atom.vx < decay)
				atom.vx = 0;
			else
				atom.vx -= decay;

		if (atom.vx < 0)
			if (atom.vx > -decay)
				atom.vx = 0;
			else
				atom.vx += decay;

		if (atom.vy > 0)
			if (atom.vy < decay)
				atom.vy = 0;
			else
				atom.vy -= decay;

		if (atom.vy < 0)
			if (atom.vy > -decay)
				atom.vy = 0;
			else
				atom.vy += decay;

		//movement
		atom.x += atom.vx;
		atom.y += atom.vy;
	}
}


function draw() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	clearCanvas(canvas, ctx);

	for (var i=0; i<atoms.length; i++)
		drawBonds(atoms[i], ctx);

	for (var i=0; i<atoms.length; i++)
		drawAtom(atoms[i], ctx);
}

function clearCanvas(canvas, ctx) {
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillRect(0,0, canvas.width, canvas.height);
}

function drawBonds(atom, ctx) {
	var bonds = atom.bonds;

	for (var i=0; i<bonds.length; i++) {
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.beginPath();
		ctx.moveTo(atom.x, atom.y);
		ctx.lineTo(bonds[i].x, bonds[i].y);
		ctx.stroke();
	}
}

function drawAtom(atom, ctx) {
	var r = Math.random() * 256;
	var g = Math.random() * 256;
	var b = Math.random() * 256;

	//ctx.fillStyle = "rgb("+r+","+g+","+b+")";
	ctx.fillStyle = "rgb(30,210,60)";
	ctx.beginPath();
	ctx.arc(atom.x, atom.y, 20, 0,2*Math.PI);
	ctx.fill();

	ctx.fillStyle = "rgb(0,0,0)";
	ctx.beginPath();
	ctx.arc(atom.x, atom.y, 20, 0,2*Math.PI);
	ctx.stroke();

	ctx.font = "30px Arial";
	ctx.fillText(atom.symbol, atom.x-11, atom.y+11);
}
