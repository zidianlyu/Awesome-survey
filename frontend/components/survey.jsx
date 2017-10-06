import React from 'react';
import surveyActionAdd from '../actions/surveyActionAdd';
import surveyActionClear from '../actions/surveyActionClear';
import surveyActionRandom from '../actions/surveyActionRandom';
import Report from './report';

import Paper from 'material-ui/Paper'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import PanoramaFishEye from 'material-ui/svg-icons/image/panorama-fish-eye';
import ContentCreate from 'material-ui/svg-icons/content/create';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import InsertChart from 'material-ui/svg-icons/editor/insert-chart';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Divider from 'material-ui/Divider';
import {
    Card,
    CardActions,
    CardHeader,
    CardMedia,
    CardTitle,
    CardText
} from 'material-ui/Card';

import Snackbar from 'material-ui/Snackbar';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

import {Step, Stepper, StepLabel} from 'material-ui/Stepper';

import {fullWhite, teal500, pink400, yellow500, grey400} from 'material-ui/styles/colors';

import Moment from 'react-moment';

class Survey extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionId: '',
            answerId: '',
            snackBarOpen: false,
            snackBarMsg: '',
            optionTrigger: false,
            finished: false,
            stepperIdx: 0,
            stepLabel: 'Start',
            stepMsg: 'Please share your thought!',
            optionNumStack: [...Array(this.props.store.getState().length).keys()].sort((a, b) => 0.5 - Math.random()),
            timeStr: new Date()
        }
        this.surveyActionAdd = surveyActionAdd.bind(this);
        this.surveyActionClear = surveyActionClear.bind(this);
        this.surveyActionRandom = surveyActionRandom.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(() => this.updateTime(), 1000)
    }

    componentWillMount() {
        clearInterval(this.timer)
    }

    updateTime() {
        this.setState({timeStr: new Date()})
    }

    updateCheckBoxInfo = (e, questionId) => {
        let msg = 'Added ' + this.props.store.getState().filter(x => x.id === questionId)[0].answers.filter(x => x.id === parseInt(e.target.value))[0].text + ' to the survey!';
        let stepperIdx = this.state.optionNumStack.length === 1
            ? 2
            : 1;
        this.setState({
            questionId: questionId,
            answerId: parseInt(e.target.value),
            snackBarMsg: msg,
            optionTrigger: true,
            stepperIdx: stepperIdx
        })
    }

    updateSurveyState = (e) => {
        this.props.store.dispatch(this.surveyActionAdd(this.state.questionId, this.state.answerId));
        this.props.updateStore();
        this.handleSnackBarOpen();
        this.state.optionNumStack.shift();
        if (this.state.optionNumStack.length === 0) {
            this.setState({
                optionNumStack: [...Array(this.props.store.getState().length).keys()].sort((a, b) => 0.5 - Math.random()),
                stepLabel: 'Retake',
                stepMsg: 'Appreciate your time!',
                stepperIdx: 3
            })
        } else {
            this.setState({optionTrigger: false, questionId: 0, answerId: 0})
        }
    }

    handleSnackBarOpen = () => {
        this.setState({snackBarOpen: true});
    }

    handleSnackBarClose = () => {
        this.setState({snackBarOpen: false});
    }

    getViewChart = () => {
        this.handleToolBtnClick('Here is the target chart!')
        let tabIdx = this.state.optionNumStack[0];
        this.props.updateTabIdx(tabIdx);
    }

    forwardToSurvey = (e) => {
        if (this.state.stepperIdx === 0) {
            this.props.updateTabIdx(3)
            this.handleToolBtnClick("Thank you for taking our survey!")
            this.setState({stepLabel: 'Ongoing', stepperIdx: 1})
        } else if (this.state.stepperIdx === 3) {
            this.setState({
                stepLabel: 'Start',
                stepperIdx: 0,
                stepMsg: 'Please share your thought!',
                questionId: '',
                answerId: '',
                optionTrigger: false
            })
        }
    }

    resetSurvey = () => {
        this.handleToolBtnClick("Roger that, we have reset the survey for you!")
        this.props.updateTabIdx(3)
        this.setState({
            stepLabel: 'Start',
            stepperIdx: 0,
            stepMsg: 'Please share your thought!',
            questionId: '',
            answerId: '',
            optionTrigger: false,
        })
    }

    buildInputButton(info) {
        let buttonInputs = [];
        for (let idx in info.answers) {
            buttonInputs.push(
                <RadioButton key={idx} label={info.answers[~~ idx].text} value={~~ idx + 1} checkedIcon={< CheckCircle style = {{fill: teal500}}/>} uncheckedIcon={< PanoramaFishEye style = {{fill: teal500}}/>} style={{
                    marginBottom: '12px'
                }} labelStyle={{
                    color: pink400,
                    fontSize: '15px'
                }}/>
            );
        }

        return (
            <RadioButtonGroup name="survey" valueSelected={this.state.answerId} onChange={(e) => this.updateCheckBoxInfo(e, info.id)}>
                {buttonInputs}
            </RadioButtonGroup>
        );
    }

    buildStepper() {
        return (
            <div style={{
                width: '100%',
                maxWidth: 700,
                margin: 'auto'
            }}>
                <Stepper activeStep={this.state.stepperIdx}>
                    <Step>
                        <StepLabel className="step-label">Introduction</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel className="step-label">Survey</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel className="step-label">Finished</StepLabel>
                    </Step>
                </Stepper>
            </div>
        );
    }

    handleToolBtnClick(s) {
        this.setState({snackBarMsg: s});
        this.handleSnackBarOpen();
    }

    clearStoreData() {
        this.handleToolBtnClick('Already cleaned up all the data for you, my friend!!');
        this.props.store.dispatch(this.surveyActionClear());
        this.props.updateStore();
    }

    randomStoreData() {
        this.handleToolBtnClick('I just added some random data, have fun!!');
        this.props.store.dispatch(this.surveyActionRandom());
        this.props.updateStore();
    }

    render() {
        const surveyPaperStyle = {
            padding: '20px',
            position: 'relative',
            height: '745px'
        };

        const submitBtnStyle = {
            display: 'block',
            width: '120px',
            margin: '0 auto'
        };

        let avatarMark = (
            <Avatar color={fullWhite} backgroundColor={pink400} size={30} style={{
                margin: '5px 15px 5px 0',
                fontSize: '15px',
                fontWeight: '200'
            }}>
                {this.props.store.getState().length + 1 - this.state.optionNumStack.length}
            </Avatar>
        );

        let surveyInput = this.props.store.getState().map(info => (
            <Card key={info.id} style={{
                height: '384px',
                position: 'relative'
            }}>
                <CardHeader avatar={avatarMark} subtitle={info.text} style={{
                    display: 'flex',
                    display: '-webkit-flex',
                    alignItems: 'center'
                }} textStyle={{
                    padding: '0'
                }} subtitleStyle={{
                    fontSize: '17px'
                }}/>
                <Divider/>
                <CardText style={{
                    padding: '8px'
                }}>
                    <div className="survey-item-input-group">
                        {this.buildInputButton(info)}
                    </div>
                    {this.state.optionTrigger
                        ? (
                            <div className="survey-submit-btn-group">
                                <div style={{
                                    margin: '0 auto'
                                }}>
                                    <RaisedButton label="chart" icon={< InsertChart color = {
                                        fullWhite
                                    } />} labelStyle={{
                                        color: fullWhite
                                    }} backgroundColor={teal500} style={submitBtnStyle} onClick={() => this.getViewChart()}/>
                                </div>
                                <span>or</span>
                                {this.state.optionNumStack.length === 1
                                    ? (<RaisedButton label='Finish' primary={true} style={submitBtnStyle} onClick={(e) => this.updateSurveyState(e)}/>)
                                    : (<RaisedButton label='Submit' secondary={true} style={submitBtnStyle} onClick={(e) => this.updateSurveyState(e)}/>)}
                            </div>
                        )
                        : (
                            <div className="survey-submit-btn-group">
                                <div style={{
                                    margin: '0 auto'
                                }}>
                                    <RaisedButton label="chart" icon={< InsertChart color = {
                                        fullWhite
                                    } />} labelStyle={{
                                        color: fullWhite
                                    }} backgroundColor={teal500} style={submitBtnStyle} onClick={() => this.getViewChart()}/>
                                </div>
                                <span>or</span>
                                <RaisedButton label="Choose" labelStyle={{
                                    color: grey400
                                }} style={submitBtnStyle} onClick={() => this.handleToolBtnClick('Oops, please select an option!!')}/>
                            </div>
                        )}
                </CardText>
            </Card>
        ));

        let timeStr = (
            <div className="time-str-group">
                <Moment format="MMM Do YYYY">
                    {this.state.timeStr}
                </Moment>
                <RaisedButton onClick={() => this.handleToolBtnClick('You have a wonderful day!!')}>
                    <Moment format="dddd" style={{
                        color: pink400
                    }}>
                        {this.state.timeStr}
                    </Moment>
                </RaisedButton>
                <Moment format="hh:mm:ss a">
                    {this.state.timeStr}
                </Moment>
            </div>
        );

        return (
            <div className="survey-container">
                <Paper style={surveyPaperStyle} zDepth={4}>
                    <div className="survey-top-bar" style={{backgroundColor: pink400}}></div>
                    <div className="survey-top-header">
                        <FloatingActionButton backgroundColor={pink400} onClick={() => this.resetSurvey()}>
                            <ContentCreate/>
                        </FloatingActionButton>
                    </div>
                    {this.buildStepper()}
                    {this.state.stepperIdx === 1 || this.state.stepperIdx === 2
                        ? (
                            <div>
                                {surveyInput[this.state.optionNumStack[0]]}
                            </div>
                        )
                        : (
                            <Card style={{
                                height: '384px'
                            }}>
                                <CardHeader title="Zidian Lyu" subtitle="Software Engineer" avatar="asset/img/profile_img.jpg" style={{display: 'flex', display: '-webkit-flex', alignItems: 'center'}} subtitleStyle={{fontWeight: '100'}}/>
                                <Divider/>
                                <CardMedia overlay={< CardTitle title = "A survey about favorite" subtitle = {
                                    this.state.stepMsg
                                }
                                titleStyle = {{color: fullWhite, textAlign: 'center'}}subtitleStyle = {{textAlign: 'center', color: pink400, fontSize: '16px', margin: '0 0 10px'}}/>} overlayStyle={{
                                    bottom: '50px'
                                }}>
                                    <img src="asset/img/root.jpg" alt=""/>
                                </CardMedia>
                                <CardText>
                                    <RaisedButton label={this.state.stepLabel} backgroundColor={pink400} labelStyle={{
                                        color: fullWhite
                                    }} style={submitBtnStyle} onClick={(e) => this.forwardToSurvey(e)}/>
                                </CardText>
                            </Card>
                        )}
                    <Card style={{
                        margin: '20px 0 0',
                        height: '170px'
                    }}>
                        <CardTitle title="Extra tool" subtitle={timeStr}/>
                        <Divider/>
                        <CardText>
                            <div className="custom-data-btn">
                                <RaisedButton label="Clear" secondary={true} style={submitBtnStyle} onClick={() => this.clearStoreData()}/>
                                <RaisedButton label="Random" secondary={true} style={submitBtnStyle} onClick={() => this.randomStoreData()}/>
                            </div>
                        </CardText>
                    </Card>
                    <Snackbar open={this.state.snackBarOpen} message={this.state.snackBarMsg} autoHideDuration={1700} onRequestClose={this.handleSnackBarClose} style={{
                        textAlign: 'center'
                    }} contentStyle={{
                        color: yellow500
                    }}/>
                </Paper>
            </div>
        )
    }
}

export default Survey;
