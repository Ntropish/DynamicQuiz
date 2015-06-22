
/**
 * Created by Justin on 6/19/2015.
 */

/*global $:false */

var questions = [   {question:"What is 3 + 3?", choices: ['5','6','7'], correctAnswer:2},
                    {question:"What is 3 + 4?", choices: ['5','6','7'], correctAnswer:3},
                    {question:"What is 3 + 2?", choices: ['5','6','7'], correctAnswer:1}];

$(document).ready(function() {
    "use strict";
    var questionNum = 0;
    var correctAnswers = 0;

    var warnNoSelection = function() {
        var button = $('#next-button')
        if (button.attr('value') !== 'PICK ONE') {
            button.attr('value', 'PICK ONE');

            setTimeout(function () {
                button.attr('value', 'next');
            }, 800);
        }
    }
    //multi purpose function: handles first, middle, and last cases
    var displayNext = function() {

        //Define question utilities
        var clearQuestion = function() {
            $('#question').empty();
            $('#choices').empty();
        };
        var displayQuestion = function (question) {
            $('#question').text(question.question);
            for (var i = 0; i < question.choices.length; i++) {
                var listElt = $('<li>' + question.choices[i] + '</li>');
                listElt.append($('<input type="radio" name="choice" data-num="' + i + '"/>'));
                $('#choices').append(listElt);
            }
        };

        //grabs the number of the user's choice
        var answer = +$('#choices').find('input:checked').attr('data-num') + 1;
        if (! answer && questionNum !== 0) {
            return false;
        }
        clearQuestion();
        //handle initial case and score keeping if not initial case
        if (questionNum === 0) {
            $('#message').css('opacity', '0');

            $('#next-button').attr('value', 'Next').animate( {'margin-left': '20%'}, 50);
            $('#question-displayer').animate({'opacity': '1'}, 200);
        } else if (+questions[questionNum-1].correctAnswer === answer) {
                correctAnswers++;

        }

        //handle last case and question display if not last case
        if (questionNum >= questions.length) {
            $('body').find('h2').text('You have completed the test!').animate({'opacity': '1'}, 100);
            $('#next-button').css('display', 'none');
            //set text and watch for plurality
            $('#message').text('You got '+correctAnswers+' point' +
                ((correctAnswers === 1)?'':'s') + '!').css('opacity', '1');
        } else if (questions[questionNum]) {
            displayQuestion(questions[questionNum]);
            //set text and watch for plurality
            $('body').find('h2').text( questions.length - questionNum +
                ' question'+ ((questions.length - questionNum) === 1?'':'s') + ' remaining')
                .animate({'opacity': '.8'}, 100 );
        }

        return true;
    };

     $('#next-button').on('click', function() {

         if (displayNext()) {
         questionNum++;
         } else {
            warnNoSelection();
         }
    });
});