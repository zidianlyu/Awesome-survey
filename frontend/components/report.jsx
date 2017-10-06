import React from 'react';
import Paper from 'material-ui/Paper';
import {Pie, Bar} from 'react-chartjs-2';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Visibility from 'material-ui/svg-icons/action/visibility';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
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
import {teal500, pink400, yellow500} from 'material-ui/styles/colors';

class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resStore: this.props.store.getState(),
            tabIdx: this.props.tabIdx,
            snackBarMsg: '',
            snackBarOpen: false
        }
    }

    handleTabChange = (value) => {
        this.setState({tabIdx: value});
    };

    handleClickChip(s) {
        this.setState({snackBarMsg: s});
        this.handleSnackBarOpen();
    }

    handleSnackBarOpen = () => {
        this.setState({snackBarOpen: true});
    };

    handleSnackBarClose = () => {
        this.setState({snackBarOpen: false});
    };

    componentWillReceiveProps(nextProps) {
        this.setState({tabIdx: nextProps.tabIdx})
    }

    buildSummaryReport() {
        const store = this.props.store.getState().slice();
        let counts = [];
        for (let item of store) {
            let count = 0;
            for (let res of item.answers) {
                count += res.responses;
            }
            counts.push(count);
        }
        const themeColor = ['rgba(255, 99, 132, 0.75)', 'rgba(75, 192, 192, 0.75)', 'rgba(255, 206, 86, 0.75)', 'rgba(54, 162, 235, 0.75)', 'rgba(231, 233, 237, 0.75)'];
        const backgroundColor = themeColor.sort((a, b) => 0.5 - Math.random());
        const hoverBackgroundColor = backgroundColor.slice().map(x => x.replace(new RegExp('0.75', 'gi'), '1'));
        const data = {
            labels: store.map(item => item.text.split(' ').sort((x, y) => x.length - y.length).slice(-1)[0].replace('?', '')),
            datasets: [
                {
                    label: 'Survey Distribution',
                    backgroundColor: backgroundColor,
                    borderWidth: 2,
                    hoverBackgroundColor: hoverBackgroundColor,
                    data: counts
                }
            ]
        };

        const barChartBottomLabel = ['HARD', 'BOWL', 'TSLA'];
        let bottomCount = [];

        for (let idx in store) {
            bottomCount.push(
                <div key={~~ idx} className='data-under-chart-item'>
                    <label>
                        {barChartBottomLabel[idx]}
                    </label>
                    <span className='data-num-label' style={{
                        color: hoverBackgroundColor[~~ idx]
                    }}>
                        {counts[idx]}
                    </span>
                </div>
            );
        }

        return (
            <Card key={this.props.store.getState().length} className="doughnut-chart-pack">
                <span className="doughnut-chart-header" style={{
                    color: teal500
                }}>Data Summary</span>
                <div className='doughnut-chart'>
                    <Bar data={data}/>
                </div>
                <div className='data-under-chart'>
                    {bottomCount}
                </div>
            </Card>
        )
    }

    buildSurveyReport() {
        let surveyReport = [];
        const tabStyles = {
            headline: {
                fontSize: 24,
                paddingTop: 16,
                marginBottom: 12,
                fontWeight: 400
            }
        };

        let tabCover = [];

        const tabLabels = ['HARD', 'BOWL', 'TSLA'];

        this.state.resStore.map((info, idx) => {
            const themeColor = ['rgba(255, 99, 132, 0.75)', 'rgba(75, 192, 192, 0.75)', 'rgba(255, 206, 86, 0.75)', 'rgba(54, 162, 235, 0.75)', 'rgba(231, 233, 237, 0.75)'];
            const backgroundColor = themeColor;
            const hoverBackgroundColor = backgroundColor.slice().map(x => x.replace(new RegExp('0.75', 'gi'), '1'));
            const data = {
                datasets: [
                    {
                        data: info.answers.map(ans => ans.responses),
                        backgroundColor: backgroundColor,
                        borderWidth: 2,
                        hoverBackgroundColor: hoverBackgroundColor
                    }
                ],
                labels: info.answers.map(ans => ans.text)
            };

            let outChartItems = [];

            for (let idx in info.answers) {
                outChartItems.push(
                    <div key={~~ idx} className='data-under-chart-item'>
                        <label>
                            {info.answers[~~ idx].text}&nbsp;
                        </label>
                        <span className='data-num-label' style={{
                            color: hoverBackgroundColor[~~ idx]
                        }}>
                            {info.answers[~~ idx].responses}
                        </span>
                    </div>
                );
            }

            tabCover.push(
                <Tab key={idx} icon={< ActionFavorite />} label={tabLabels[idx]} value={idx}/>
            );

            surveyReport.push(
                <Card key={idx} className="doughnut-chart-pack">
                    <span className="doughnut-chart-header" style={{
                        color: teal500
                    }}>{info.text}</span>
                    <div className='doughnut-chart'>
                        <Pie data={data}/>
                    </div>
                    <div className='data-under-chart'>
                        {outChartItems}
                    </div>
                </Card>
            );
        });

        tabCover.push(
            <Tab key={this.props.store.getState().length} icon={< Dashboard />} label="all" value={this.props.store.getState().length}/>
        );

        surveyReport.push(this.buildSummaryReport());

        return (
            <div>
                <Tabs tabItemContainerStyle={{
                    backgroundColor: teal500
                }} inkBarStyle={{
                    backgroundColor: pink400,
                    height: '4px',
                    bottom: '2px'
                }} style={{
                    margin: '20px 0 0'
                }} onChange={this.handleTabChange} value={this.state.tabIdx}>
                    {tabCover}
                </Tabs>
                <SwipeableViews index={this.state.tabIdx} onChangeIndex={this.handleTabChange}>
                    {surveyReport}
                </SwipeableViews>
            </div>
        );
    }

    render() {
        const reportPaperStyle = {
            padding: '20px',
            position: 'relative',
            height: '745px'
        };

        return (
            <div className="report-container">
                <Paper style={reportPaperStyle} zDepth={4}>
                    <div className='report-top-bar' style={{backgroundColor: teal500}}></div>
                    <div className="report-top-header">
                        <FloatingActionButton backgroundColor={teal500} onClick={() => this.handleClickChip('Ah ha, please feel free to take a took at the data!')}>
                            <Visibility/>
                        </FloatingActionButton>
                    </div>
                    {this.buildSurveyReport()}
                    <Card style={{
                        margin: '0 3px'
                    }}>
                        <CardTitle title="Skills demo" subtitle="Sep 2017" subtitleStyle={{
                            padding: '2px 0 2px 2px'
                        }}/>
                        <Divider/>
                        <CardText>
                            <div style={{
                                display: 'flex',
                                display: '-webkit-flex',
                                justifyContent: 'space-around'
                            }}>
                                <Avatar onClick={() => this.handleClickChip('The first language that I learn about web development!')} style={{
                                    cursor: 'pointer',
                                    backgroundColor: teal500
                                }}>
                                    <i className="devicon-html5-plain"></i>
                                </Avatar>

                                <Avatar onClick={() => this.handleClickChip('CSS is an enchanting magic for crafting visual artifact!')} style={{
                                    cursor: 'pointer',
                                    backgroundColor: teal500
                                }}>
                                    <i className="devicon-css3-plain"></i>
                                </Avatar>

                                <Avatar onClick={() => this.handleClickChip('Material-UI is my favorite styling framework ever.')} style={{
                                    cursor: 'pointer',
                                    backgroundColor: teal500
                                }}>
                                    <span style={{
                                        fontWeight: '200'
                                    }}>M</span>
                                </Avatar>

                                <Avatar onClick={() => this.handleClickChip('Applied Reactjs to develope this project. Please reach out to me for more demos!')} style={{
                                    cursor: 'pointer',
                                    backgroundColor: teal500
                                }}>
                                    <i className="devicon-react-original"></i>
                                </Avatar>

                                <Avatar onClick={() => this.handleClickChip('My favorite IDE, with friendly external packages and beautiful UI.')} style={{
                                    cursor: 'pointer',
                                    backgroundColor: teal500
                                }}>
                                    <i className="devicon-atom-original"></i>
                                </Avatar>

                                <Avatar onClick={() => this.handleClickChip('I am experienced GIT user as well as a team-contributer.')} style={{
                                    cursor: 'pointer',
                                    backgroundColor: teal500
                                }}>
                                    <i className="devicon-git-plain"></i>
                                </Avatar>
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
        );
    }
}

export default Report;
