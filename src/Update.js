import * as R from 'ramda';

export const MSGS = {
    NEW_CARD: 'NEW_CARD',
    QUESTION: 'QUESTION',
    ANSWER: 'ANSWER',
    SHOW_ANSWER: 'SHOW_ANSWER',
    SAVE: 'SAVE',
    DELETE: 'DELETE',
    EDIT: 'EDIT',
    SCORE: 'SCORE',
}

export const newCardMsg = {
    type: MSGS.NEW_CARD,
};

// we need to update the cards each time a method is called
// use R.curry to return the new updated card
// makes more sense when the updateCards function is called
const updateCards = R.curry((updateCard, card) => {
    if (updateCard.id === card.id) {
        return { ...card, ...updateCard };
    }
    return card;
});

const update = (msg, model) => {
    console.log(msg);
    switch (msg.type) {
        case MSGS.NEW_CARD: {
            const { nextId: id, cards } = model;
            const newCard = {
                id,
                question: '',
                answer: '',
                rank: 0,
                showAnswer: false,
                edit: true,
            };
            const updateCards = R.prepend(newCard, cards);
            return { ...model, cards: updateCards, nextId: id + 1}
        }
        default: 
        return model;
    }
}

export default update;