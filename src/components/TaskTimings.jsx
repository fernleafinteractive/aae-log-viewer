import {useContext, useEffect, useState} from "react";
import {stringToColor} from "../log_utils.js";
import ErrorIcon from "./ErrorIcon.jsx";
import Loading from "./Loading.jsx";
import ChevronUp from "./ChevronUp.jsx";
import ChevronDown from "./ChevronDown.jsx";
import LogTaskStatusRow from "./LogTaskStatusRow.jsx";
import Chart from "react-apexcharts";
import {didTaskFail, isTaskRunning, getTaskExecutionTime} from "../utils/task_utils.js";
import {LogDataContext} from "../context/LogDataContext.jsx";

export default function TaskTimings({mapping, totalExecutionTime}) {

    if(mapping.length === 0) {
        return (
        <div className={"flex flex-1 items-center justify-center"}>
            No data
        </div>
        )
    }

    return (
        <div>

            <MemoryChart graphData={[]} />


            <h1 className={"text-xl mb-4 bg-gray-300 p-2 rounded"}>Total execution time: <span className={"font-bold"}>{totalExecutionTime > 1000 ? totalExecutionTime / 1000 : totalExecutionTime}</span> {totalExecutionTime > 1000 ? 'seconds' : 'ms'}</h1>

            <div className={"flex items-center rounded"}>

                {mapping.map((task, index) => (
                    <div title={task.key} key={index} className={`first:rounded-s last:rounded-e mb-4 p-3`} style={{width: `${(getTaskExecutionTime(task.value)/totalExecutionTime)*100}%`, backgroundColor: `${stringToColor(task.key)}`}}></div>
                ))}

            </div>

            {mapping.map((task, index) => (
                <div key={index}>
                    <Timing taskId={task.key} tasks={task.value} />
                </div>
            ))}

        </div>
    )

}

function Timing({taskId, tasks}) {
    const [showTimings, setShowTimings] = useState(false);

    return (
        <div className={"mb-4"}>
            <div className={"flex items-center"}>
                <div className={`p-2 rounded me-4`} style={{backgroundColor: stringToColor(taskId)}}></div>
                <div className={"me-4 flex items-center"}>
                    {taskId}
                    {didTaskFail(tasks) ? <span title={"task failed"} className={"text-red-500 ms-4"}><ErrorIcon /></span>
                        : ''}
                </div>
                <div className={"ms-auto me-4"}>{isTaskRunning(tasks) ?
                    <Loading/> : `${getTaskExecutionTime(tasks)}ms`}</div>
                <button className={"ms-4"} onClick={() => {
                    setShowTimings(!showTimings)
                }}>
                    {showTimings ? <ChevronUp/> : <ChevronDown/>}
                </button>

            </div>
            <div className={!showTimings ? 'hidden border-0' : 'border-s-2 ms-1.5 ps-2'} style={{borderColor:  stringToColor(taskId)}}>
                {tasks.map((v, index) => (
                    <LogTaskStatusRow info={v} key={index}/>
                ))}
            </div>
        </div>
    )

}

function MemoryChart() {
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

    const logContext = useContext(LogDataContext);

    useEffect(() => {
        const filteredLogs = logContext.logs.filter(l => l.data && l.data.memory_info);
        filteredLogs.sort((a, b) => parseInt(a.data.timestamp) - parseInt(b.data.timestamp));

        const unloadedTimestamp = logContext.logs.filter(l => l.message.toLowerCase().includes("unloaded dataframe"));
        unloadedTimestamp.sort((a, b) => parseInt(a.data.timestamp) - parseInt(b.data.timestamp));
        // console.log(unloadedTimestamp);

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


    }, [logContext.logs])

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