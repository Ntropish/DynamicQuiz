/**
 * Created by Justin on 6/22/2015.
 */
/*global $:false */

// currentState initialized to -1, representing the special start state
var currentState = -1;

var questions = [   {question:"What is 3 + 3?", choices: ['5','6','7'], correctAnswer:2},
    {question:"What is 3 + 4?", choices: ['5','6','7'], correctAnswer:3},
    {question:"What is 3 + 2?", choices: ['5','6','7'], correctAnswer:1}];

function State(question, choices, correctAnswer) {
    /*
    State stores all question data and is intended to store properties
    of the state such as the user's answer to a question.

    State is designed this way, redundantly storing question data, so that
    it doesn't rely on the question list remaining static and the only way
    input questions. This way the question list is only needed at
    initialization, questions from other sources can be used dynamically,
    and states can change positions.

    State does not represent the starting and ending states. These two
    special cases are to be dealt with individually
    */

    this.question = question;
    this.choices = choices;
    this.correctAnswer = correctAnswer;
    this.userChoice = -1; //-1 until the user presses the 'next' button with a choice selected
}

//state object list is created here
var states = [];
for (var q in questions) {
    states.append(new State(q.question, q.choices, q.correctAnswer));
}

$(document).ready( function() {
    'use strict';

    function enterInitialState() {

    }

    function enterState() {

    }

    function enterFinalState() {

    }

});