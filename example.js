#!/usr/bin/env node

//
// rough draft thing
//

var Bento = require("./index");

// main container
var container = new Bento.Container({
  width: process.stdout.columns,
  height: process.stdout.rows,
  split: Bento.Container.SPLIT.vertical,
});

// tell us when there's a reflow
container.on("reflow", function() {
  console.log(JSON.stringify(container, null, 2));
});

// window title thing
container.addWidget(new Bento.Widget(), {height: 1, name: "title"});

// main content
container.addWidget(new Bento.Widget(), {name: "main"});

// nav
container.addWidget(new Bento.Widget(), {height: 1, name: "nav"});

// input box
container.addWidget(new Bento.Widget(), {height: 1, name: "input"});

// force initial (re)flow
container.reflow();

// make sure we reflow when we need to
process.stdout.on("resize", function() {
  container.width = process.stdout.columns;
  container.height = process.stdout.rows;
  container.reflow();
});

// this just stops the app from closing right away
process.stdin.resume();
