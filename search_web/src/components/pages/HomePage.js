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
import InsertLinkIcon from "@material-ui/icons/InsertLink";
import TimelineIcon from "@material-ui/icons/Timeline";
import Divider from "@material-ui/core/Divider";
import {withRouter} from "react-router-dom";

const hitComponent = withRouter(({hit, history}) => {
    return (
        <div style={{
            height: "20rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
        }}
        >
            <img src={hit.media_url} alt={hit.product_name}
                 style={{width: "100px", height: "200px", marginBottom: "1em", objectFit: "contain"}}/>
            <Typography align="center" variant="body1" color="textSecondary" style={{
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
            }}>
                <Highlight hit={hit} attribute={"product_name"}/>
            </Typography>
            <Typography align="center" variant="body2" color="textSecondary" style={{
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
            }}>
                {hit.brand}
            </Typography>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginTop: "1em",
            }}>
                <Fab color="primary" size="small" onClick={() => {
                    window.open(hit.url, "_blank");
                }}>
                    <InsertLinkIcon/>
                </Fab>
                <Divider orientation="vertical" style={{margin: "0 0.5em"}}/>
                <Fab color="primary" size="small" onClick={() => {
                    history.push(`/product/${hit.product_id}`);
                }}>
                    <TimelineIcon/>
                </Fab>
            </div>
        </div>
    );
});

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