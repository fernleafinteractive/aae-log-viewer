import {useEffect, useState} from "react";
import {useLogData} from "../context/LogDataContext";
import Chart from "react-apexcharts";

export default function MemoryChart() {
    const [state, setState] = useState({
        series: [],
        options: {
            grid: {
                show: true,
                xaxis: {
                    lines: {
                        show: false
                    }
                },
                yaxis: {
                    lines: {
                        show: false
                    }
                }
            },
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
            },
            yaxis: {
                labels: {
                    style: {
                        colors: "#afb2b6"
                    }
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
                            <div style="padding: 1rem; background-color: #272B34;">
                                <div style="color: #258FFB;"> <span style="font-weight: bold;">${series[0][dataPointIndex].toFixed(2)}</span>% available memory</div>
                                <div style="color: #21CA89;"> <span style="font-weight: bold;">${series[1][dataPointIndex].toFixed(2)}</span>GB in use</div>
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
        <div className={"flex flex-col grow p-4 bg-[#272B34] rounded-[0.25rem] overflow-y-auto"}>
            <div id="chart">
                <Chart options={state.options} series={state.series} type="line" />
            </div>
            <div id="html-dist"></div>
        </div>
    );
}