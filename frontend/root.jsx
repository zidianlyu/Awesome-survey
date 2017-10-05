import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/store';
import Survey from './components/survey';
import Report from './components/report';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: store,
            tabIdx: store.getState().length
        }
    }
    updateStore = () => {
        this.setState({store: this.state.store})
    }

    updateTabIdx = (idx) => {
        this.setState({tabIdx: idx})
    }

    render() {
        return (
            <div id="root">
                <MuiThemeProvider id="survey-component">
                    <Survey store={this.state.store} updateStore={() => this.updateStore()} updateTabIdx={(idx) => this.updateTabIdx(idx)}/>
                </MuiThemeProvider>
                <MuiThemeProvider id="report-component">
                    <Report store={this.state.store} tabIdx={this.state.tabIdx}/>
                </MuiThemeProvider>
            </div>
        );
    }
}
document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Root/>, document.getElementById('main'));
})
