class Shape {
  constructor() {
    this.vertices = [];
    this.state = 'drawing';
    this.centroid = {
      x: 0,
      y: 0,
    };
    this.space = 0;
  }

  addPoint(x,y){
    // IF THE SHAPE IS ABOUT TO BE CLOSED
    if (this.vertices[0]) {
      // MAGNET STYLE ON LAST/FIRST VERTICE
      if (x - this.vertices[0].x >= -magnetrange && x - this.vertices[0].x <= magnetrange && y - this.vertices[0].y >= -magnetrange && y - this.vertices[0].y <= magnetrange ) {
        // CHANGE SHAPE STATE TO DRAWED
        this.state = 'spacing';
        // GO FIND THE CENTROID OF IT, THIS WAY WILL WILL BE ABLE TO ALIGN THE SHAPES WITH DIFFERENT SCALES
        var signedArea = 0;
        for (var i=0; i<this.vertices.length; ++i)
        {
            var x0 = this.vertices[i].x;
            var y0 = this.vertices[i].y;
            var x1 = this.vertices[(i+1) % this.vertices.length].x;
            var y1 = this.vertices[(i+1) % this.vertices.length].y;
            var a = x0*y1 - x1*y0;
            signedArea += a;
            this.centroid.x += (x0 + x1)*a;
            this.centroid.y += (y0 + y1)*a;
        }
        signedArea *= 0.5;
        console.log(width*height / signedArea);
        this.centroid.x /= (6.0*signedArea);
        this.centroid.y /= (6.0*signedArea);
        shapes.push(shape);
      }
    }
    // IF THE SHAPE ISNT COMPLETED THEN ADD VERTICE
    if (this.state === 'drawing') {
      var p = {
        x: x,
        y: y
      };
      this.vertices.push(p);
    }
  }

  drawLine(){ // DRAW THE LINES BASED ON VERTICES ARRAY
    if (this.vertices[1]) {
      for(var i=1; i < this.vertices.length; i++){
        line(this.vertices[i-1].x, this.vertices[i-1].y, this.vertices[i].x, this.vertices[i].y )
      }
    }
  }

  render(){
      push();
      beginShape();
      this.vertices.forEach(function(e){
        vertex(e.x,e.y);
      });
      endShape(CLOSE);
      pop();
  }

  clone(){

    for (var i = 100; i >= 1; i--){
      push();
      var currS = Math.pow(this.space, i);
      if (i%2 === 0){
        fill(255);
      }
      else {
        fill(0);
      }
      translate(-shape.centroid.x*(currS-1), -shape.centroid.y*(currS-1));
      scale(currS);
      shape.render();
      pop();
    }

    shape.render();

    push();
    for (var i = 50; i > 0; i--){
      if (i%2 === 0){
        fill(0);
      }
      else {
        fill(255);
      }
      translate(shape.centroid.x*(1-1/shape.space), shape.centroid.y*(1-1/shape.space));
      scale(1/shape.space);
      shape.render();
    }
    pop();
  }

  showHelper(){
    push();
    stroke(0);
    this.vertices.forEach(function(e){
      ellipse(e.x,e.y,5);
    });
    pop();
  }

  lineHelper(){
    push();
    stroke(128);
    if (this.vertices[0]) {
      if (mouseX - this.vertices[0].x >= -magnetrange && mouseX - this.vertices[0].x <= magnetrange && mouseY - this.vertices[0].y >= -magnetrange && mouseY - this.vertices[0].y <= magnetrange ) {
        line(this.vertices[this.vertices.length-1].x, this.vertices[this.vertices.length-1].y, shape.vertices[0].x, shape.vertices[0].y );
      }
      else {
        line(this.vertices[this.vertices.length-1].x, this.vertices[this.vertices.length-1].y, mouseX, mouseY );
      }
    }
    pop();
  }

}

let shape = new Shape;
let shapes = [];
let s;
let magnetrange = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);
  if (shape.state === 'drawing') {
    shape.showHelper();
    shape.drawLine();
    shape.lineHelper();
  }
  if (shape.state === 'spacing') {push();
    push();
    fill(0);
    s = abs(map(dist(mouseX, mouseY, shape.centroid.x, shape.centroid.y), 0, width, 1, 5));
    translate(-shape.centroid.x*(s-1), -shape.centroid.y*(s-1));
    scale(s);
    shape.render();
    pop();
    shape.render();
  }
  if (shape.state === 'completed') {
    noStroke();
    shape.clone();
    noLoop();
  }
}

function mouseClicked(){
    if (shape.state === 'drawing') {
      shape.addPoint(mouseX,mouseY);
    }
    if (shape.state === 'spacing' && s != undefined) {
      shape.space = s;
      shape.state = 'completed';
      // shape.clone ?
    }
    console.log(shape);
    console.log(shapes);
}
