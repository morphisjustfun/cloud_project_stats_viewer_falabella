import React, {useEffect, useState} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import {getProductByProductId} from "../../services/products";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import InsertLinkIcon from "@material-ui/icons/InsertLink";
import {Card, Table, TableBody, TableCell, TableHead, TableRow, Paper} from "@material-ui/core";
import {FlexibleXYPlot, XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries} from 'react-vis';

const ProductPage = (props) => {
    const {_, match: {params: {id}}} = props;
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            const productInfo = await getProductByProductId(id)
            setData(productInfo);
        })();
    }, []);
    if (data === null) {
        return (
            <div>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{minHeight: '90vh'}}
                >
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "90vh",
                    }}>
                        <CircularProgress/>
                    </div>
                </Grid>
            </div>
        );
    }
    const {info, history} = data;
    const priceHistory = history.map(entry => ({
        x: (new Date(entry.time)).getTime() + 5 * 60 * 60 * 1000,
        y: entry.price
    }));
    const eventPriceHistory = history.map(entry => ({
        x: (new Date(entry.time)).getTime() + 5 * 60 * 60 * 1000,
        y: entry.event_price
    }));

    const actualPrice = priceHistory[priceHistory.length - 1].y;
    const actualEventPrice = eventPriceHistory[eventPriceHistory.length - 1].y;

    return (
        <div>
            <Grid container spacing={16} justify="center" style={{
                margin: "1em",
            }}>
                <Grid item xs={12}>
                    <Card>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            marginTop: "1em",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <img src={info.media_url} alt={info.product_name}
                                 style={{width: "100px", height: "200px", marginBottom: "1em", objectFit: "contain"}}/>
                        </div>
                        <Paper>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Typography color="textSecondary" style={{
                                                fontWeight: "bold",
                                            }} align="center">Property</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography color="textSecondary" style={{
                                                fontWeight: "bold",
                                            }} align="center">Value</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Typography color="textSecondary" align="center">Product Name</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography color="textSecondary"
                                                        align="center">{info.product_name}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography color="textSecondary" align="center">Brand</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography color="textSecondary" align="center">{info.brand}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography color="textSecondary" align="center">Provider</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography color="textSecondary"
                                                        align="center">{info.provider}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography color="textSecondary" align="center">SKU ID</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography color="textSecondary" align="center">{info.sku_id}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography color="textSecondary" align="center">Product ID</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography color="textSecondary"
                                                        align="center">{info.product_id}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography color="textSecondary" align="center">Actual Price</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography color="textSecondary" align="center">{actualPrice}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography color="textSecondary" align="center">Actual Event
                                                Price</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography color="textSecondary"
                                                        align="center">{actualEventPrice}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography color="textSecondary" align="center">Product URL</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}>
                                                <Fab size="small" color="primary" href={info.url} target="_blank">
                                                    <InsertLinkIcon/>
                                                </Fab>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Paper>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card style={{padding: 20}}>
                        <Typography variant="h6" color="textSecondary" gutterBottom align="center">
                            Price History
                        </Typography>
                        <FlexibleXYPlot xType="time" height={300}>
                            <VerticalGridLines/>
                            <HorizontalGridLines/>
                            <XAxis title="Date"/>
                            <YAxis title="Price"/>
                            <LineSeries data={priceHistory} style={{stroke: 'blue', strokeWidth: 2}}/>
                        </FlexibleXYPlot>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card style={{padding: 20}}>
                        <Typography variant="h6" color="textSecondary" gutterBottom align="center">
                            Event Price History
                        </Typography>
                        <FlexibleXYPlot xType="time" height={300}>
                            <VerticalGridLines/>
                            <HorizontalGridLines/>
                            <XAxis title="Date"/>
                            <YAxis title="Price"/>
                            <LineSeries data={eventPriceHistory} style={{stroke: 'red', strokeWidth: 2}}/>
                        </FlexibleXYPlot>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default ProductPage;