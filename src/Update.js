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

export const scoreCardMsg = (id, score) => {
    return {
        type: MSGS.SCORE,
        id,
        score,
    }
}
export const SCORES = {
    BAD: 0,
    GOOD: 1,
    SUPER: 2,
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
            return { ...model, cards: updateCards, nextId: id + 1 }
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
        case MSGS.SCORE: {
            const { id, score } = msg;
            const { cards } = model;
            // we want to find a card and do this by using fucntion composition propEq
            // once found, we put the card into the cards model 
            const card = R.find(R.propEq('id', id), cards)
            // now we want to create a ranking system by each score
            //r.cond takes a list of predicates and transformers based on the if or else statament logic
            const rank = R.cond([
                // here if 'score' (predicate) is equal to the score.bad (which is 0), then the outcome will R.always equal 0
                [R.propEq('score', SCORES.BAD), R.always(0)],
                [R.propEq('score', SCORES.GOOD), ({ rank }) => rank + 1],
                [R.propEq('score', SCORES.SUPER), ({ rank }) => rank + 2],
            ])
                // we then obtain the score, then apply the rank to the card.rank property from the model
                ({ score, rank: card.rank });


            // then we use updatedCards function to update the cards
            // use R.pipe to ensure r.map function is evaluated before the sort
            const updateCards = R.pipe(

                //show answer will be false as once vote is done card answer should close
                R.map(updatedCards({ id, showAnswer: false, rank })),
                // then we sort the cards based on the rank prop from the model in ascending order
                R.sortWith([
                    // sort by rank, by the highest
                    R.ascend(R.prop('rank')),
                    // sort the cards in descending by rank and id
                    R.descend(R.prop('id'))],
                )
            )(cards);
            return { ...model, cards: updateCards };
        }
        default:
            return model;
    }
}

export default update;