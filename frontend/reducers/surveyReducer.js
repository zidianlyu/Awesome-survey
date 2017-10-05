const initSurveyState = [
    {
        "id": 1,
        "text": "Is this hard?",
        "answers": [
            {
                "id": 1,
                "text": "Yes",
                "responses": 17
            }, {
                "id": 2,
                "text": "No",
                "responses": 20
            }
        ]
    }, {
        "id": 2,
        "text": "Who is going to win the SuperBowl in 2018?",
        "answers": [
            {
                "id": 1,
                "text": "Eagles",
                "responses": 150
            }, {
                "id": 2,
                "text": "Patriots",
                "responses": 100
            }, {
                "id": 3,
                "text": "Seahawks",
                "responses": 120
            }, {
                "id": 4,
                "text": "Broncos",
                "responses": 130
            }
        ]
    }, {
        "id": 3,
        "text": "What is your favorite Tesla vehicle?",
        "answers": [
            {
                "id": 1,
                "text": "Roadster",
                "responses": 120
            }, {
                "id": 2,
                "text": "Model S",
                "responses": 160
            }, {
                "id": 3,
                "text": "Model X",
                "responses": 190
            }, {
                "id": 4,
                "text": "Model 3",
                "responses": 127
            }
        ]
    }
];

const SurveyReducer = (state = initSurveyState, action) => {
    switch (action.type) {
        case 'VOTE':
            let newState = state.slice();
            for (let i = 0; i < newState.length; i++) {
                if (newState[i].id === action.questionId) {
                    for (let j = 0; j < newState[i].answers.length; j++) {
                        if (newState[i].answers[j].id === action.answerId) {
                            newState[i].answers[j].responses += 1;
                        }
                    }
                }
            }
            return newState;
        case 'CLEAR':
            let clearState = state.slice();
            for(let storeIdx in clearState){
                for(let ansIdx in clearState[storeIdx].answers){
                    clearState[storeIdx].answers[ansIdx].responses = 0;
                }
            }
            return clearState;
        case 'RANDOM':
            let randomState = state.slice();
            for(let storeIdx in randomState){
                for(let ansIdx in randomState[storeIdx].answers){
                    randomState[storeIdx].answers[ansIdx].responses = ~~(Math.random() * 100);
                }
            }
            return randomState;
        default:
            return state;
    }
}

export default SurveyReducer;
