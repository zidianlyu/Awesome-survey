import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import SurveyReducer from '../reducers/surveyReducer';

const store = compose(applyMiddleware(thunk))(createStore)(SurveyReducer);

export default store;
