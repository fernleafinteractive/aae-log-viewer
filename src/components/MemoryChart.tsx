import {useEffect, useState} from "react";
import {useLogData} from "../context/LogDataContext";
import Chart from "react-apexcharts";

export default function MemoryChart() {
    const [state, setState] = useState({
        series: [],
        options: {
            chart: {
                // height: 350,
                type: 'line',
                zoom: {
                    enabled: true,
                    type: 'x',
                    autoScaleYaxis: false,
                    allowMouseWheelZoom: true,
                    zoomedArea: {
                        fill: {
                            color: '#90CAF9',
                            opacity: 0.4
                        },
                        stroke: {
                            color: '#0D47A1',
                            opacity: 0.4,
                            width: 1
                        }
                    }
                },
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                labels: {
                    useSeriesColors: true
                },
                markers: {
                    shape: 'square',
                    strokeWidth: 0
                }
            }
        },
    });
    const [graphData, setGraphData] = useState({
        xAxis: [],
        series: [],
        data: []
    });

    const {logs} = useLogData();

    useEffect(() => {
        const filteredLogs = logs.filter(l => l.data && l.data.memory_info);
        filteredLogs.sort((a, b) => parseInt(a.data.timestamp) - parseInt(b.data.timestamp));

        const unloadedTimestamp = logs.filter(l => l.message.toLowerCase().includes("unloaded dataframe"));
        unloadedTimestamp.sort((a, b) => parseInt(a.data.timestamp) - parseInt(b.data.timestamp));

        const xAxis = [];
        const series = [
            {
                name: "Available memory (%)",
                data: []
            },
            {
                name: "Memory in use",
                data: []
            }
        ];
        for(const l of filteredLogs) {
            xAxis.push(l.data.timestamp);
            series[0].data.push(l.data.memory_info.available_memory_percent);
            series[1].data.push((l.data.memory_info.total_memory - l.data.memory_info.available_memory) / 1024 / 1024 / 1024);
        }

        const unloadedSeries = [];
        for(const t of xAxis) {
            const f = unloadedTimestamp.filter(l => l.data.timestamp === t);
            unloadedSeries.push(f.length);
        }

        series.push({
            name: "Unloaded event",
            data: unloadedSeries
        });

        setGraphData({
            xAxis,
            series,
            data: filteredLogs
        });


    }, [logs])

    useEffect(() => {

        if(graphData.series.length === 0 || graphData.xAxis.length === 0) return;


        setState({
            options: {
                ...state.options,
                xaxis: {
                    categories: graphData.xAxis
                },
                tooltip: {
                    custom: function({ series, seriesIndex, dataPointIndex, w }) {
                        return (
                            `
                            <div style="padding: 1rem;">
                                <div>${series[0][dataPointIndex]} % available memory</div>
                                <div>${series[1][dataPointIndex]} GB in use</div>
                                <div>${graphData.data[dataPointIndex].data.task_id}</div>
                            </div>
                            `
                        );
                    }
                }
            },
            series: graphData.series
        })

    }, [graphData]);

    return (
        <div>
            <div id="chart">
                <Chart options={state.options} series={state.series} type="line" />
            </div>
            <div id="html-dist"></div>
        </div>
    );
}