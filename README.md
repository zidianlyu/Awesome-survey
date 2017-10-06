# Story Write Up

This is an functional app for survey purpose built in ReactJS.

[LIVE][survey]

- Author: Zidian Lyu
- Time: Oct-2017

## The view of app

- Home page

    <img src="https://github.com/zidianlyu/Awesome-survey/blob/master/docs/fullview.png" align="center" width="600" overflow="hidden">

## Steps to run

```bash
npm start
open index.html
```

## Features

### MVP

1. The website will randomly draw a question for the user to answer. The UI will displace the question with all the possible options.

    <img src="https://github.com/zidianlyu/Awesome-survey/blob/master/docs/question1.png" align="center" width="400" overflow="hidden">

    <img src="https://github.com/zidianlyu/Awesome-survey/blob/master/docs/question2.png" align="center" width="400" overflow="hidden">


2. The report panel will interact with the user and update the count of answer selected.

    <img src="https://github.com/zidianlyu/Awesome-survey/blob/master/docs/react_chart.png" align="center" width="400" overflow="hidden">

3. Right after an answered be submitted, the user can view the statistic of the answer chosen. And the UI automatically forward the user to the next question.

    <img src="https://github.com/zidianlyu/Awesome-survey/blob/master/docs/forward2.png" align="center" width="400" overflow="hidden">

    <img src="https://github.com/zidianlyu/Awesome-survey/blob/master/docs/forward1.png" align="center" width="400" overflow="hidden">

4. When the user answered the whole set of questions once(without repetition), the user can restart the answering question process, or the user can always view the data panel.

    <img src="https://github.com/zidianlyu/Awesome-survey/blob/master/docs/finish.png" align="center" width="400" overflow="hidden">

    <img src="https://github.com/zidianlyu/Awesome-survey/blob/master/docs/data_panel.png" align="center" width="400" overflow="hidden">


### Extra Features

5. All the buttons are responsive, use will get feedbacks in each click; a message will pop up from a snack bar

    <img src="https://github.com/zidianlyu/Awesome-survey/blob/master/docs/snackbar1.png" align="center" width="400" overflow="hidden">

    <img src="https://github.com/zidianlyu/Awesome-survey/blob/master/docs/snackbar2.png" align="center" width="400" overflow="hidden">

6. "RANDOM" button can generate random results for the survey, "CLEAR" button can clean up  all the results from the survey

    <img src="https://github.com/zidianlyu/Awesome-survey/blob/master/docs/random.png" align="center" height="100" width="200" overflow="hidden">

    <img src="https://github.com/zidianlyu/Awesome-survey/blob/master/docs/clear.png" align="center" height="100" width="200" overflow="hidden">

## Project Management

### File Structure

#### Templates

```html
index.html(/)
    - frontend
        - root
        - action
        - reducer
        - store
        - components
            - survey
            - report
    - asset
        - css
            - local
            - ext
                - jQuery
                - bootstrap
                - devicon
                - font awesome
        - js
            bundle
```

#### Styling

```html
index.html(root)
    - <head>
        - css/main.css
            - component1.css
            - component2.css
            ...
```


## React/Redux Implementation

##### Action -> Middlewares -> Reducer -> Store

1. Declare action (config action object)
```javascript
const surveyAction = (questionId, answerId) => {
    return {type: "VOTE", questionId: questionId, answerId: answerId};
}
export default surveyAction;
```

2. Pass middlewares (from store.dispatch(action))
```javascript
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import SurveyReducer from '../reducers/surveyReducer';

const store = compose(applyMiddleware(thunk))(createStore)(SurveyReducer);

export default store;
```

3. Handle state and create newState in reducer
```javascript
const SurveyReducer = (state = initSurveyState, action) => {
    switch (action.type) {
        case 'VOTE':
            // create a copy of original state
            let newState = state.slice();
            for(let i = 0; i < newState.length; i++){
                if(newState[i].id === action.questionId){
                    for(let j = 0; j < newState[i].answers.length; j++){
                        if(newState[i].answers[j].id === action.answerId){
                            newState[i].answers[j].responses += 1;
                        }
                    }
                }
            }
            // return a new state
            return newState;
            ...
        default:
            return state;
    }
}

export default SurveyReducer;
```

4. update the store in dispatch
```javascript
// in child component
updateSurveyState = (e) => {
    this.props.store.dispatch(this.surveyAction(this.state.questionId, this.state.answerId));
}
this.props.updateStore();

// in root component
updateStore = () => {
    this.setState({store: this.state.store})
}
```

## DevOps and Deployment

##### The project is tested to be deployable on Github

## Reference and citations

[React-Redux](http://redux.js.org/)

[Matuerial-UI](http://www.material-ui.com/)

[Chartjs](http://www.chartjs.org/)

[Momentjs](https://momentjs.com/)

[survey]: https://zidianlyu.github.io/Awesome-survey/
