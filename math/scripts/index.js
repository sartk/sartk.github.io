/**
 * index.js
 * - All our useful JS goes here, awesome!
 */
var start;
var totaltime = 0;
var myArray = [];

var problemText = "";
var module;

// Show an element
var show = function(elem) {
  elem.style.display = "block";
};

// Hide an element
var hide = function(elem) {
  elem.style.display = "none";
};

// Toggle element visibility
var toggle = function(elem) {
  // If the element is visible, hide it
  if (window.getComputedStyle(elem).display === "block") {
    hide(elem);
    return;
  }

  // Otherwise, show it
  show(elem);
};

var modules = ["add_1", "add_2", "mul", "sub"];
var correctAns = 0;
var numCorrect = 0;
var numIncorrect = 0;
var live_modules = {
  add_1: 1,
  add_2: 1,
  mul: 1,
  sub: 1
};
var status = "result";

function insert(module) {
  live_modules[module] = Math.abs(1 - live_modules[module]);
}
window.addEventListener("keydown", e => {
  if (e.which == 13) {
    if (status == "result") {
      start = new Date().getTime();
      nextProblem();
      status = "problem";
    } else {
      showResult();
      status = "result";
    }
  }
});

function randomModule() {
  var randomPick = modules[Math.floor(Math.random() * modules.length)];
  if (live_modules[randomPick] === 0) {
    return randomModule();
  } else {
    return randomPick;
  }
}

function nextProblem() {
  document.getElementById("sample4").value = "";
  module = randomModule();

  if (module == "add_2" || module == "sub") {
    num1 = Math.floor(Math.random() * 100);
    num2 = Math.floor(Math.random() * 100);

    if (module == "add_2") {
      op = " + ";
      correctAns = num1 + num2;
    }

    if (module == "sub") {
      if (num2 > num1) {
        var x = num1;
        num1 = num2;
        num2 = x;
      }

      op = " - ";
      correctAns = num1 - num2;
    }
  }

  if (module == "add_1") {
    num1 = Math.floor(Math.random() * 100);
    num2 = 10 * Math.floor(Math.random() * 10) + (10 - num1 % 10);
    op = " + ";
    correctAns = num1 + num2;
  }

  if (module == "mul") {
    num1 = Math.floor(Math.random() * 20) + 1;
    num2 = Math.floor(Math.random() * 20) + 1;
    op = " x ";
    correctAns = num1 * num2;
  }

  problemText = num1 + op + num2;

  document.getElementById("problem").innerHTML = problemText;
  //start = Date.getTime();
}

function showResult() {
  var elapsed = new Date().getTime() - start;
  totaltime += elapsed;
  //totaltime += Date.getTime() - start;

  if (Number(document.getElementById("sample4").value) == correctAns) {
    document.getElementById("problem").innerHTML = "Correct";
    numCorrect++;
    document.getElementById("problem").classList.remove("incorrect");
    document.getElementById("problem").classList.add("correct");
  } else {
    document.getElementById("problem").innerHTML = "Incorrect, " + correctAns;
    numIncorrect++;
    document.getElementById("problem").classList.add("incorrect");
    document.getElementById("problem").classList.remove("correct");
  }
  var tpq = totaltime / (numCorrect + numIncorrect);
  updateScore(tpq);
  log(elapsed);
}

function log(elapsed) {
  var myObj = {
    problem: problemText,
    response: document.getElementById("sample4").value,
    correct: correctAns,
    elapsed: elapsed,
    module: module
  }
  myArray.push(myObj);

}

function updateScore(tpq) {
  var text =
    numCorrect +
    " out of " +
    (numCorrect + numIncorrect) +
    " correct. Time/question = " +
    Math.floor(tpq) +
    " ms.";
  document.getElementById("stats").innerHTML = text;
}

function togglestats() {
  toggle(document.getElementById("stats"));
}

const copyToClipboard = str => {
  const el = document.createElement("textarea"); // Create a <textarea> element
  el.value = str; // Set its value to the string that you want copied
  el.setAttribute("readonly", ""); // Make it readonly to be tamper-proof
  el.style.position = "absolute";
  el.style.left = "-9999px"; // Move outside the screen to make it invisible
  document.body.appendChild(el); // Append the <textarea> element to the HTML document
  const selected =
    document.getSelection().rangeCount > 0 // Check if there is any content selected previously
      ? document.getSelection().getRangeAt(0) // Store selection if found
      : false; // Mark as false to know no selection existed before
  el.select(); // Select the <textarea> content
  document.execCommand("copy"); // Copy - only works as a result of a user action (e.g. click events)
  document.body.removeChild(el); // Remove the <textarea> element
  if (selected) {
    // If a selection existed before copying
    document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
    document.getSelection().addRange(selected); // Restore the original selection
  }
};

function logToClipboard(){
  copyToClipboard(JSON.stringify(myArray)); 
  alert("Log copied to clipboard")
}
