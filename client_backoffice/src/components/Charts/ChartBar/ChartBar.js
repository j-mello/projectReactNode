import {ResponsiveBar} from '@nivo/bar'
import {useEffect, useState, useContext} from "react";
import KPIService from "../../../services/KPIService";
import {SellerContext} from "../../../contexts/SellerContext";
import {SessionContext} from "../../../contexts/SessionContext";
import '../chart.css'

const ChartBar = () => {
    const [data, setData] = useState([]);
    const {sellerToDisplay} = useContext(SellerContext)
    const {user} = useContext(SessionContext);

    useEffect(() =>  user && (!user.SellerId || sellerToDisplay) && KPIService.getOperationKPI(sellerToDisplay ? sellerToDisplay.id : null).then(
        data =>
            data.map(
                day => ({
                    date: day._id,
                    operations: day.operations.reduce((acc, operation) => ({
                            ...acc, [operation.status]:operation.number
                        })
                    , {})
                })
            )
        )
        .then(
        data =>
            setData(
                data.map(
                    elt => {
                        return {
                            "jour": elt.date,
                            "refusé": elt.operations.refusing ?? 0,
                            "refuséColor": "hsl(89, 70%, 50%)",
                            "partiellement remboursé": elt.operations.partial_refunding ?? 0,
                            "partiellement rembourséColor": "hsl(299, 70%, 50%)",
                            "remboursé": elt.operations.refunding ?? 0,
                            "rembourséColor": "hsl(264, 70%, 50%)",
                            "payé": elt.operations.capturing ?? 0,
                            "payéColor": "hsl(23, 70%, 50%)"
                        }
                    }
                )
            )
    ), [sellerToDisplay]);

    return (
        <div className="chart chartbar">
            <ResponsiveBar
                data={data}
                keys={['refusé', 'partiellement remboursé', 'remboursé', 'payé']}
                indexBy="jour"
                margin={{top: 70, right: 130, bottom: 50, left: 60}}
                padding={0.3}
                valueScale={{type: 'linear'}}
                indexScale={{type: 'band', round: true}}
                valueFormat={{format: '', enabled: false}}
                colors={{scheme: 'nivo'}}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: '#38bcb2',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: '#eed312',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                borderColor={{from: 'color', modifiers: [['darker', 1.6]]}}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'jour',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'opérations',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{from: 'color', modifiers: [['darker', 1.6]]}}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'row',
                        justify: false,
                        translateX: -300,
                        translateY: -280,
                        itemsSpacing: 10,
                        itemWidth: 200,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
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

export default ChartBar