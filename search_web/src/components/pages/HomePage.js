import React, {Component} from 'react';
import {connect} from "react-redux";

// Material UI Imports
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import 'instantsearch.css/themes/satellite.css';

// Action Imports
import {setTest} from "../../actions/home-actions";
import {Hits, SearchBox, Pagination, RefinementList, HitsPerPage, Highlight, Stats} from "react-instantsearch";

const hitComponent = ({hit}) => {
    return (
        <div style={{
            height: "18rem",
        }}
        >
            <img src={hit.media_url} alt={hit.product_name} style={{width: "100px", height: "200px"}}/>
            <Typography variant="body1" color="textSecondary" style={{
                cursor: "pointer",
                textDecoration: "underline",
            }} onClick={() => {
                window.open(hit.url, "_blank");
            }}>
                <Highlight hit={hit} attribute={"product_name"}/>
            </Typography>
            <Typography variant="body2" color="textSecondary">
                {hit.brand}
            </Typography>
        </div>
    );

}

class HomePage extends Component {

    render() {
        return (<div style={{
            margin: "1em",
        }}>
            <SearchBox/>
            <Grid container spacing={16}
                  direction="row"
                  wrap="nowrap"
            >
                <Grid item style={{
                    paddingTop: "1.5em",
                }} xs="auto"
                >
                    <Grid container spacing={16} direction="column">
                        <Grid item>
                            <Stats/>
                        </Grid>
                        <Grid item>
                            <RefinementList attribute="brand"/>
                        </Grid>
                        <Grid item>
                            <HitsPerPage items={[{value: 10, label: "10 per page", default: true}, {
                                value: 15, label: "15 per page"
                            }, {value: 20, label: "20 per page"},]}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs>
                    <div style={{
                        display: "flex", justifyContent: "center", alignItems: "center", margin: "1em",
                    }}>
                        <Pagination/>
                    </div>
                    <Hits hitComponent={hitComponent} classNames={{
                        list: "algolia-list",
                    }}/>
                </Grid>
            </Grid>
        </div>);
    }
}

const mapStateToProps = (state, props) => {
    return {...state, ...props};
};

const mapDispatchToProps = {
    setTest
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);