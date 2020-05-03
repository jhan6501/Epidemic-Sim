class gameArea {
    constructor() {
        //this.a = new Person();
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.width = 480;
        this.height = 270;
        this.numPeople = 25;
        this.peopleList = [];
        this.numInfected = 0;
        this.numNotInfected = 0;
        for (let i = 0; i < this.numPeople; i++) {
            this.peopleList[i] = new Person();
            if (this.peopleList[i].isInfected) {
                this.numInfected = this.numInfected + 1;
            } else {
                this.numNotInfected =  this.numInfected + 1;
            }
        }

    }
    
    initializeArea() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style = "border:1px solid #000000";
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        //create the plot
        Plotly.plot('chart', [{
            y:[this.numInfected], 
            type:'line'
        }]);
    }

    update() {
        this.ctx.clearRect(0,0, this.width, this.height);
        //this.movePerson(this.a);
        for (let i = 0; i < this.peopleList.length; i++) {
            let curr = this.peopleList[i];
            curr.update();
            this.drawPerson(curr);
            this.drawInfectionRadius(curr);
            //this.drawOverLap(curr);
        }
        //this.testCollision(this.peopleList);
        this.infectPeople(this.peopleList);
        Plotly.extendTraces('chart', {y:[[this.numInfected]]}, [0]);
        console.log("the number infected is: " + this.numInfected);
    }

    // movePerson (toMove) {
    //     toMove.px = toMove.px + toMove.vx;
    //     toMove.py = toMove.py + toMove.vy;
    // }
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
        //let ctx = this.canvas.getContext("2d");
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
        for (let i = 0; i < peopleList.length; i++) {
            let curr = peopleList[i];
            let changed = false;
            if (!curr.isInfected) {
                for (let j = 0; j < peopleList.length; j++) {
                    let compareTo = peopleList[j];
                    if (i != j && compareTo.isInfected && distance(curr, compareTo) < curr.radius + compareTo.infectionRadius) {
                        curr.isInfected = true;
                        this.numInfected = this.numInfected + 1;
                        this.numNotInfected = this.numNotInfected - 1;
                        break;
                    }
                }
            }
        }
    }
}

class Person {
    constructor() {
        this.px = Math.random() * 480;
        this.py = Math.random() * 270;
        let degree = Math.random() * 2 * Math.PI;
        this.vx = Math.cos(degree) * 1;
        this.vy = Math.sin(degree) * 1;
        // this.vx = Math.random() * 1 + Math.random() * -1;
        // this.vy = Math.random() * 1 + Math.random() * -1;
        this.radius = 5;
        this.infectionRadius = 10;
        if (Math.random() > 0.25) {
            this.isInfected = false; 
        } else {
            this.isInfected = true;
        }
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
    //console.log("the coordates of person 1 are: (" + person1.px + "," + person1.py + ")");
    //console.log("the coordates of person 1 are: (" + person2.px + "," + person2.py + ")");
    //console.log("the calculated distance is: " + returnDist);

    return returnDist;
}

function updateCanvas () {
    area.update();
    window.requestAnimationFrame(updateCanvas);
}

let area = new gameArea();

function startGame() {
    area.initializeArea();
    updateCanvas();
}