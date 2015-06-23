/**
 * Created by Justin on 6/22/2015.
 */
/*global $:false */

// currentState initialized to -1, representing the special start state
var currentState = -1;

var questions = [   {question:"What is 3 + 3?", choices: ['5','6','7'], correctAnswer:1},
    {question:"What is 3 + 4?", choices: ['5','6','7'], correctAnswer:2},
    {question:"What is 3 + 2?", choices: ['5','6','7'], correctAnswer:0}];

function State(question, choices, correctAnswer) {
    'use strict';
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
questions.forEach(function (q) {
    'use strict';
    states.push(new State(q.question, q.choices, q.correctAnswer));
});

$(document).ready( function() {
    'use strict';

    //*******************************************************
    //DOM MANIPULATION FUNCTIONS
    //*******************************************************

    //holds message timeout returns so they can be cancelled if new messages are displayed
    //This is used in displayMessage function
    //NOOB QUESTION: IS THIS THE BEST SCOPE FOR THIS?
    var messageTimeouts = [];
    function displayQuestion(questionText, choices) {
        var textElt = $('#question-text');
        var choicesElt = $('#choices');
        textElt.empty();
        if (questionText) {
            textElt.text(questionText);
        }
        //Empty #choices and fill with new ones if given
        choicesElt.empty();
        if (choices) {
            for (var i = 0; i < choices.length; i++) {
                /*
                fill #choices unordered list with list elements and radio buttons
                that store the choice number in the data-num attribute so we can
                get the users answer
                */
                var listElt = $('<li>' + choices[i] + '</li>');
                listElt.append($('<input type="radio" name="choice" data-num="' + i + '" />'));
                choicesElt.append(listElt);
            }
        }
    }

    function displayMessage(text, time) {
        /*
        Sets the visibility and text of the message div

        Also takes a timeout argument:
            if time = 0 then hide message immediately
            if time > 0 then hide message after timeout ms
            if time is false-ey then display message indefinitely
         */
        var elt = $('#message');
        elt.find('> p').text(text);
        if (time === 0) {
            if (!elt.hasClass('invisible')) {
                elt.addClass('invisible');
            }
            return;
        }

        if (elt.hasClass('invisible')) {
            elt.removeClass('invisible');
        }
        //make sure no old timeouts are active
        for (var messageTimeout in messageTimeouts) {
            if (messageTimeout.hasOwnProperty(messageTimeout)) {
                clearTimeout(messageTimeouts[messageTimeout]);
            }
        }

        if (time) {
            messageTimeouts.push(setTimeout( function() {
                if (!elt.hasClass('invisible')) {
                    elt.addClass('invisible');
                }
            }, time));
        }

    }

    function setAttrOrInvis(elt, attr, val) {
        /*
        This is useful for setting button text/hiding them when not needed

        Must be given a jquery object to do anything. If text attr is also
        given, then that attribute is set to the given val. Otherwise the
        object is given the invisible class
         */
        if (attr) {
            if ( elt.hasClass('invisible')) {
                elt.removeClass('invisible');
            }
            elt.attr(attr, val);
        } else if ( !elt.hasClass('invisible')) {
            elt.addClass('invisible');
        }
    }
    //*******************************************************
    //STATE FUNCTIONS, REALIZE STATES BY MANIPULATING THE DOM
    //*******************************************************
    function enterInitialState() {
        setAttrOrInvis($('#backward'));
        setAttrOrInvis($('#forward'), 'value', 'Continue');
        displayQuestion();
        displayMessage("Are you ready?");
    }

    function enterState(s) {
    //s refers to the index of the state starting from 0 and excluding the initial state
        if (states[s]) {
            displayQuestion(states[s].question, states[s].choices);
            if (states[s].userChoice !== -1) { //check for stored answer and set it to checked
                $('#choices').find('li').eq(states[s].userChoice).find('>').prop('checked', true);
            }
        }
        //Handle button display for initial, last, general cases
        if (s === 0) {
            setAttrOrInvis($('#backward'));
            setAttrOrInvis($('#forward'), 'value', 'Next');

        } else if (s === states.length - 1) {
            displayMessage("Final Question", 2000);
            setAttrOrInvis($('#backward'), 'value', 'Previous');
            setAttrOrInvis($('#forward'), 'value', 'Submit');
        } else {
            setAttrOrInvis($('#backward'), 'value', 'Previous');
            setAttrOrInvis($('#forward'), 'value', 'Next');
        }
    }

    function enterFinalState() {
        displayQuestion();
        displayMessage("Quiz completed!", 2000);
        setAttrOrInvis($('#backward'));
        setAttrOrInvis($('#forward'));

    }
    //*******************************************************
    //OUTER UTILITIES, INSPECTION AND STATE MANIPULATION
    //*******************************************************
    function saveAnswer() {
        var answer = +$('#choices').find('input:checked').attr('data-num');
        if (answer >= 0) {
            states[currentState].userChoice = answer;
        }
    }

    function getScore() {
        var score = 0;
        for (var s in states) {
            if (states[s].userChoice === states[s].correctAnswer) {
                score++;
            }
        }
    }

    function isCompleteQuiz() {
        for (var s in states) {
            if (states.hasOwnProperty(s) && !states[s].userChoice) {
                return false;
            }
        }
        return true;
    }
    //*******************************************************
    //INITIALIZATION AND EVENT HANDLING
    //*******************************************************
    enterInitialState();

    $('#forward').on('click', function() {
        if (currentState === -1) {
            displayMessage("Good Luck!", 2000);
            enterState(++currentState);

        } else if (currentState === questions.length - 1) {
            saveAnswer();
            enterFinalState();
        } else {
            saveAnswer();
            enterState(++currentState);
        }
    });

    $('#backward').on('click', function() {
        if (currentState === -1) { //Shouldn't happen (button should be hidden)
            displayMessage("How did this happen?!", 2000);
        } else if (currentState === 0) { //Shouldn't happen again, don't change state if it does though
            enterState(currentState);
        } else { //Should be the only possible case
            saveAnswer();
            enterState(--currentState);
        }
    });



});