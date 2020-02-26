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

export const questionInputMsg = (id, question) => {
    return {
        type: MSGS.QUESTION,
        question,
        id,
    }
}

export const answerInputMsg = (id, answer) => {
    return {
        type: MSGS.ANSWER,
        answer,
        id,
    }
}

export const saveMsg = (id) => {
    return {
        type: MSGS.SAVE,
        id,
    }
}

export const showAnswerMsg = (id) => {
    return {
        type: MSGS.SHOW_ANSWER,
        id,
    }
}

export const editCardMsg = (id) => {
    return {
        type: MSGS.EDIT,
        id,
    };
}


export const newCardMsg = {
    type: MSGS.NEW_CARD,
};

// we need to update the cards each time a method is called
// use R.curry to return the new updated card
// makes more sense when the updateCards function is called
const updatedCards = R.curry((updateCard, card) => {
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
        case MSGS.QUESTION: {
            const { id, question } = msg;
            const { cards } = model;
            const updateCards = R.map(updatedCards({ id, question }), cards);
            return { ...model, cards: updateCards };
        }

        case MSGS.ANSWER: {
            const { id, answer } = msg;
            const { cards } = model;
            const updateCards = R.map(updatedCards({ id, answer }), cards);
            return { ...model, cards: updateCards };
        }
        case MSGS.SAVE: {
            const { id } = msg;
            const { cards } = model;
            const updateCards = R.map(updatedCards({ id, edit: false }), cards);
            return { ...model, cards: updateCards };
        }
        case MSGS.SHOW_ANSWER: {
            const { id } = msg;
            const { cards } = model;
            const updateCards = R.map(updatedCards({ id, showAnswer: true }), cards);
            return { ...model, cards: updateCards };
        }
        case MSGS.EDIT: {
            const { id } = msg;
            const { cards } = model;
            const updateCards = R.map(updatedCards({ id, edit: true }), cards);
            return { ...model, cards: updateCards };
        }
        default: 
        return model;
    }
}

export default update;