class gameArea {
    constructor(numStart) {
        //this.a = new Person();
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.width = 720;
        this.height = 500;
        this.numPeople = numStart;
        this.peopleList = [];
        this.numInfected = {
            x: [],
            y: [],
            mode: 'lines',
            line: {color: 'red', width: 2},
            name: 'infected count'
        };
        this.numNotInfected = {
            x: [],
            y: [],
            mode: 'lines',
            line: {color: 'blue', width: 2},
            name: 'not infected count'
        };
        this.infectedCount = 0;
        this.notInfectedCount = 0;
        for (let i = 0; i < this.numPeople; i++) {
            let isInfected = false;
            if (Math.random() < .1) {
                isInfected = true;
                this.infectedCount++;
            } else {
                this.notInfectedCount++;
            }
            this.peopleList[i] = new Person(this.width, this.height, isInfected);

        }
        this.numInfected.x.push(0);
        this.numInfected.y.push(this.infectedCount);
        this.numNotInfected.x.push(0);
        this.numNotInfected.y.push(this.notInfectedCount);
        this.framesPassed = 0;
    }

    initializePeople(numStart) {
        this.numPeople = numStart;
        this.peopleList = [];
        this.numInfected = {
            x: [],
            y: [],
            mode: 'lines',
            line: {color: 'red', width: 2},
            name: 'infected count'
        };
        this.numNotInfected = {
            x: [],
            y: [],
            mode: 'lines',
            line: {color: 'blue', width: 2},
            name: 'not infected count'
        };
        this.infectedCount = 0;
        this.notInfectedCount = 0;
        for (let i = 0; i < this.numPeople; i++) {
            let isInfected = false;
            if (Math.random() < .1) {
                isInfected = true;
                this.infectedCount++;
            } else {
                this.notInfectedCount++;
            }
            this.peopleList[i] = new Person(this.width, this.height, isInfected);

        }
        this.numInfected.x.push(0);
        this.numInfected.y.push(this.infectedCount);
        this.numNotInfected.x.push(0);
        this.numNotInfected.y.push(this.notInfectedCount);
        this.framesPassed = 0;

    }
    initializeArea() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style = "border:1px solid #000000";
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        //create the plot
        //Plotly.plot('chart', [this.numInfected, this.numNotInfected]);
        Plotly.plot('chart', [{
            y: [this.infectedCount],
            name: 'infected count',
            line: {color: 'RED', width: 2}
          }, {
            y: [this.notInfectedCount],
            name: 'not infected count',
            line: {color: 'BLUE', width: 2}
          }]);
    }

    update() {
        this.framesPassed++;
        this.ctx.clearRect(0,0, this.width, this.height);

        this.infectPeople(this.peopleList);

        //updating the data sets
        this.numInfected.x.push(this.framesPassed);
        this.numInfected.y.push(this.infectedCount);
        this.numNotInfected.x.push(this.framesPassed);
        this.numNotInfected.y.push(this.notInfectedCount);

        Plotly.extendTraces('chart', {
            y: [[this.infectedCount],[this.notInfectedCount]],
        }, [0,1]);

        this.drawFrame();
    }

    drawFrame() {
        for (let i = 0; i < this.peopleList.length; i++) {
            let curr = this.peopleList[i];
            curr.update();
            this.drawPerson(curr);
            this.drawInfectionRadius(curr);
        }
    }

    drawOverLap (toDraw) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(toDraw.px, toDraw.py, toDraw.radius,0,2 * Math.PI);
        if (toDraw.isOverlap) {
            this.ctx.strokeStyle = '#FF0000';
        }
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawPerson (toDraw) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(toDraw.px, toDraw.py, toDraw.radius,0,2 * Math.PI);
        if (toDraw.isInfected) {
            this.ctx.strokeStyle = '#FF0000';
        }
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawInfectionRadius (toDraw) {
        if (toDraw.isInfected) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(toDraw.px, toDraw.py, toDraw.infectionRadius,0,2 * Math.PI);

            this.ctx.strokeStyle = '#FFFF00';

            this.ctx.stroke();

            this.ctx.restore();
        }
    }

    testCollision(peopleList) {
        for (let i = 0; i < peopleList.length; i++) {
            let curr = peopleList[i];
            let changed = false;
            for (let j = 0; j < peopleList.length; j++) {
                let compareTo = peopleList[j];
                if (i != j && distance(curr, compareTo) < curr.radius + compareTo.radius) {
                    curr.isOverlap = true;
                    compareTo.isOverlap = true;
                    changed = true;
                    break;
                }
            }
            if (!changed) {
                curr.isOverlap = false;
            }

        }
    }

    infectPeople(peopleList) {
        let touchingArray = [];
        for (let i = 0; i < peopleList.length; i++) {
            touchingArray[i] = false;
        }
        for (let i = 0; i < peopleList.length; i++) {
            let curr = peopleList[i];
            let changed = false;
            if (!curr.isInfected) {
                for (let j = 0; j < peopleList.length; j++) {
                    let compareTo = peopleList[j];
                    if (i != j && distance(curr, compareTo) < curr.radius + compareTo.radius) {
                        touchingArray[i] = true;
                        touchingArray[j] = true;
                    }
                    if (i != j && compareTo.isInfected && distance(curr, compareTo) < curr.radius + compareTo.infectionRadius) {
                        touchingArray[i] = true;
                        touchingArray[j] = true;
                        if (Math.random() < .25) {
                            curr.isInfected = true;
                            this.infectedCount = this.infectedCount + 1;
                            this.notInfectedCount = this.notInfectedCount - 1;
                            break;
                        }
                    }
                }
            }
        }
        for (let i = 0; i < peopleList.length; i++) {
            if (touchingArray[i]) {
                peopleList[i].vx *= -1;
                peopleList[i].vy *= -1;
            }
        }
    }
}

class Person {
    constructor(width, height, isInfected) {
        this.px = Math.random() * width;
        this.py = Math.random() * height;
        let degree = Math.random() * 2 * Math.PI;
        this.vx = Math.cos(degree) * 1;
        this.vy = Math.sin(degree) * 1;
        this.radius = 2;
        this.infectionRadius = 5;
        this.isInfected = isInfected;
        this.isOverlap = false;
    }

    update() {
        this.px = this.px + this.vx;
        this.py = this.py + this.vy;
        if (this.px < 0 || this.px > area.width) {
            this.vx = -this.vx;
        }
        if (this.py < 0 || this.py > area.height) {
            this.vy = -this.vy;
        }
    }
}

function distance (person1, person2) {
    let dx = person1.px - person2.px;
    let dy = person1.py - person2.py;
    let returnDist = Math.sqrt(dx * dx + dy * dy);

    return returnDist;
}

function updateCanvas () {
    area.update();
    if (area.notInfectedCount != 0) {
        window.requestAnimationFrame(updateCanvas);
    }
}
let numStart = 0;
let area = new gameArea(numStart);

function startGame() {
    area.initializeArea();
}

function runGame() {
    numStart = document.getElementById("inputNumber").value;
    area.initializePeople(numStart);
    updateCanvas();
}
