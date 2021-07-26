import {useState, useEffect, useContext} from 'react'
import { ResponsiveLine } from '@nivo/line'
import KPIService from "../../../services/KPIService";
import {SellerContext} from "../../../contexts/SellerContext";
import {SessionContext} from "../../../contexts/SessionContext";
import '../chart.css'

const ChartLine = () => {
    const [data, setData] = useState([]);
    const {sellerToDisplay} = useContext(SellerContext);
    const {user} = useContext(SessionContext);

    useEffect(() => user && (!user.SellerId || sellerToDisplay) && KPIService.getTransactionsKPI(sellerToDisplay ? sellerToDisplay.id : null).then(
        data =>
            setData([{
                "id": "transaction",
                "color": "hsl(3, 30%, 50%)",
                "data": data.map(
                    elt => {
                        return {
                            "x": elt._id,
                            "y": elt.numberTransaction
                        }
                    }
                )
            }])

    ), [sellerToDisplay,user]);

    return (
        <div className="chart chartline">
            <ResponsiveLine
                data={data}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'jour',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'transactions',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />
        </div>
    )
}

export default ChartLine