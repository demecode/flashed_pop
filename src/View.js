import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import { model } from './Model';
import { newCardMsg, questionInputMsg, answerInputMsg, saveMsg, showAnswerMsg, editCardMsg, scoreCardMsg, SCORES } from './Update';

const { div, h1, pre, a, i, textarea, form, thead, tr, th, label, input, button } = hh(h);

// shows question from the model
const question = (dispatch, card) => {
    return div({ className: '' }, [
        div({ className: ' b f6 mv1 underline ph1 ' }, 'Question'),
        div(
            { className: 'pointer  hover-bg-black-10  bg-animate pv2 ph1', onclick: () => dispatch(editQuestionMsg(card.id)) },
            card.question,
        ),
    ]);
}

// shows the answer from the mdoel if edit show answer is clicked..
const answer = (dispatch, card) => {
    const { showAnswer } = card
    return showAnswer ?
        div([
            div({ className: ' b f6 mv1 underline ph1 ' }, 'Answer'),
            div(
                { className: 'pointer  hover-bg-black-10  bg-animate pv2 ph1', onclick: () => dispatch(editCardMsg(card.id)) },
                card.answer,
            ),
        ])
        :
        div(
            a(
                {
                    className: 'f6 underline link pointer',
                    onclick: () => dispatch(showAnswerMsg(card.id)),
                },
                'Show Answer',
            ),
        );
}



// edit question
const editQuestion = (dispatch, card) => {
    return div({ className: '' }, [
        div({ className: 'b f6 mv1' }, 'Question'),
        textarea({
            className: 'w-100 h3',
            value: card.question,
            oninput: e => dispatch(questionInputMsg(card.id, e.target.value)),
        }),
    ]);
}


// edit answer
const editAnswer = (dispatch, card) => {

    return div({ className: '' }, [
        div({ className: 'b f6 mv1' }, 'Answer'),
        textarea({
            className: 'w-100 h3',
            value: card.answer,
            oninput: e => dispatch(answerInputMsg(card.id, e.target.value)),
        }),
    ]);
}


// edit card yo
const editCard = (dispatch, card) => {
    return div({ className: 'w-third pa2' },

        div(
            {
                className: 'w-100 h-100 pa2 bg-light-yellow shadow-1 mv2 relative pb5'
            },
            [
                editQuestion(dispatch, card),
                editAnswer(dispatch, card),
                button(
                    {
                        className: 'f4 ph3 pv2 br1 bg-gray bn white mv2',
                        onclick: () => dispatch(saveMsg(card.id)),
                    },
                    'Save'
                )
            ],
        ),
    );
}

const gradeButtons = (dispatch, card) => {
    const { showAnswer, rank } = card
    if (showAnswer) {
        return div([
            div({ className: 'absolute bottom-0 left-0 w-100 ph2' }, [
                button(
                    {
                        className: 'f4 ph3 pv2 bg-red bn white br1',
                        onclick: () => dispatch(scoreCardMsg(card.id, SCORES.BAD)),
                    },
                    'BAD'
                ),
                button(
                    {
                        className: 'f4 ph3 pv2 bg-blue bn white br1',
                        onclick: () => dispatch(scoreCardMsg(card.id, SCORES.GOOD)),
                    },
                    'GOOD'
                ),
                button(
                    {
                        className: 'f4 ph3 pv2 bg-black bn white br1',
                        onclick: () => dispatch(scoreCardMsg(card.id, SCORES.SUPER)),
                    },
                    'SUPER',
                ),
            ]),
        ]);
    }
}



// view a card
const viewCard = (dispatch, card) => {
    return div({ className: 'w-third pa2' },
        div(
            {
                className: 'w-100 h-100 pa2 bg-light-yellow shadow-1 mv2 relative pb5',
            },
            [
                question(dispatch, card),
                answer(dispatch, card),
                // deleteCard(dispatch, card),
                gradeButtons(dispatch, card),
            ],
        ),
    );
}


// Create a card by using currying
// Obtain the edit prop from the card model (individual card not cards)
// third line gets the edit value and returns the edit card or view card dependant of whether the edit value is true or false
// if edit is false then its view card function 
// if edit is true then edit card function is shown
const card = R.curry((dispatch, card) => {
    const { edit } = card;
    return edit ? editCard(dispatch, card) : viewCard(dispatch, card)
});

// view of the page
const view = (dispatch, model) => {
    const cards = R.map(
        card(dispatch),
        model.cards
    );
    return div({ className: 'mw8 center' }, [
        h1({ className: 'f2 pv2 bb' }, ['Woah woah']),
        div(
            button(
                {
                    onclick: () => dispatch(newCardMsg),
                },
                [i({ className: 'fa fa-plus ph1' }), 'Add Card'],
            ),
        ),
        // create new div for the cards to be rendered
        div({ className: 'flex flex-wrap nl2 nr2' }, cards),
        pre(JSON.stringify(model, null, 2)),
    ]);
}

export default view;