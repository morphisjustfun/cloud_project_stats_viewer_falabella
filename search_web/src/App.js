import React, {Component} from 'react';
import {connect} from 'react-redux';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

// Material UI Imports
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {CssBaseline} from "@material-ui/core";

// Component Imports
import AppBar from "./components/AppBar";

// Page Imports
import HomePage from "./components/pages/HomePage";
import NoPageFound from "./components/pages/NoPageFound";
import TestPage from "./components/pages/TestPage";
import SettingsPage from "./components/pages/SettingsPage";

// Action Imports
import {setSettings} from "./actions/settings-actions";
import {InstantSearch} from 'react-instantsearch';

// Local Storage Operations
import {getLocalSettings, setLocalSettings} from "./services/settingsOperations";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";

const typesenseInstantsearchAdapter = new TypesenseInstantsearchAdapter({
    server: {
        apiKey: 'uGmYS0l54MFa8NZpTw1wDPIipKgAVAE5',
        nodes: [
            {
                host: '34.149.0.171',
                port: '80',
                protocol: 'http'
            }
        ]
    },
    additionalSearchParameters: {
        queryBy: 'product_name, brand'
    }
});

const searchClient = typesenseInstantsearchAdapter.searchClient;


class App extends Component {

    constructor(props) {
        super(props);

        // Settings init
        let settings = getLocalSettings();
        if (settings === null || settings === undefined)
            setLocalSettings(this.props.settings);
        else
            this.props.setSettings(settings);
    }

    render() {

        // const theme = createMuiTheme(this.props.settings);
        const theme = createMuiTheme({
            palette: {
                primary: {
                    main: '#45496a',
                },
                secondary: {
                    main: '#e5857b',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#000000',
                },
                background: {
                    // default: '#dedede',
                }
            },
            typography: {
                useNextVariants: true,
                h6: {
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    lineHeight: 1.6,
                    letterSpacing: '0.0075em',
                }
            },
        });

        return (
            <InstantSearch searchClient={searchClient} indexName="products">
                <MuiThemeProvider theme={theme}>
                    <CssBaseline/>
                    <Router>
                        <AppBar/>
                        <Switch>
                            <Route path={"/"} exact /*strict*/ component={HomePage}/>
                            <Route path={"/test"} exact /*strict*/ component={TestPage}/>
                            <Route path={"/settings"} exact /*strict*/ component={SettingsPage}/>
                            <Route exact /*strict*/ component={NoPageFound}/>
                        </Switch>
                    </Router>
                </MuiThemeProvider>
            </InstantSearch>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {...state, ...props};
};

const mapDispatchToProps = {
    setSettings
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
