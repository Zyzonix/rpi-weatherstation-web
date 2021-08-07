/*
#
# written by @author ZyzonixDev
# published by ZyzonixDevelopments 
# -
# date      | 25/06/2021
# -
# file      | src/WebCore.js
# project   | rpi-weatherstation-web
# project-v | 1.0.1 (beta)
# 
*/

// importing required React-framework- and chartlibs + icons for livedata
import React from 'react';
import ApexCharts from 'apexcharts';
import temperatureICO from './rsrc/temperature.png';
import pressureICO from './rsrc/pressure.png';
import humidityICO from './rsrc/humidity.png';

/*
INFORMATION:
'<>{content}</>' == one single HTML element 

The return within React.Component is only allowed to return 
one single element and not several.
--> '<>' solves this issue
*/

// static ip storage
const rpi_weatherstation_IP = "192.168.8.49";
const backend_IP = "192.168.8.48";

// style of info- and selectboxes (header and core component)
const boxStyle = {
    margin: "1% 0.5% 1% 0.5%",
    backgroundColor: "orange",
    overflow: "hidden",
    width: "99%",
    borderRadius: "15px",
    textAlign: "center",
}

// returns timestamp for console
function getCurTime() {
    var timestamp = "[" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + "] ";
    return timestamp;
}

// header without livedata div's
function Header() {
    return (
        <>
            <div className="headerRow">
                <div className="text">
                    Raspberry Pi Weatherstation - Webinterface
                </div>
            </div>
        </>
    )
}

// var-storage for livedata
var temperature = "";
var pressure = "";
var humidity = "";
var ts = "";

// header with livedata div's
function HeaderAndData() {
    return (
        <>
            <Header />
            <hr className="spacer"></hr>
            <div className="headerRow2">
                <div className="liveDataHolder">
                    <div className="liveBox">
                        <div className="liveText" id="curTim">
                            Livedata ({ts}):
                        </div>
                    </div>
                    <div className="liveBox">
                        <div className="liveText" id="curTem">
                        <img className="dataIcon" src={temperatureICO} alt="nothing works" /> {temperature} °C
                        </div>
                    </div>
                    <div className="liveBox">
                        <div className="liveText" id="curPre">
                        <img className="dataIcon" src={pressureICO} alt="nothing works" /> {pressure} hPa
                        </div>
                    </div>
                    <div className="liveBox">
                        <div className="liveText" id="curHum">
                        <img className="dataIcon" src={humidityICO} alt="nothing works" /> {humidity} %
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    
}

// header component (first row)
class WebHeader extends React.Component {

    // component constructor (React-states)
    constructor(props) {
        super(props);
        this.state = {
            headerContent: <Header />
        };
    }

    // livedata-handler
    // pastes livevalues to header component
    PasteLiveValues = (data) => {
        var valueList = data[0].data;
        var status = data[0].status;
        if (status === 1000){
            ts = valueList[0];
            temperature = valueList[1];
            humidity = valueList[2];
            pressure = valueList[3];
            this.setState({headerContent: <HeaderAndData />})
        } else {

        }
    }

    // requests livedata from weatherstation
    RequestLiveValues = (callback) => {
        let xmlhttpCurrent = new XMLHttpRequest();
        xmlhttpCurrent.open("GET", "http://" + rpi_weatherstation_IP + ":8001/");
        xmlhttpCurrent.onload = function() {
            callback(JSON.parse(xmlhttpCurrent.response));
            console.log(getCurTime() + "inserted livedata from weatherstation");
        };
        xmlhttpCurrent.onerror = function() {
            console.log(getCurTime() + "weatherstation unreachable");
        };
        xmlhttpCurrent.send();
    }

    // reloads livedata
    ReloadRequest = () => {
        console.log(getCurTime() + "refreshing livedata");
        this.setState({headerContent: <Header />})
        this.RequestLiveValues(this.PasteLiveValues);
    }

    // header: HTML components
    render () {
        return (
            <>
            <div style={boxStyle} onClick={this.ReloadRequest}>{this.state.headerContent}</div>
            </>
        )
    }
    
    // runs only on first componentmount  
    componentDidMount() {
        console.log(getCurTime() + "requesting livedata")
        // initialize HTTP request to WS
        this.RequestLiveValues(this.PasteLiveValues);
    }
}

// html datatype selection template
function DataSelect({number}) {
    const valueNumber = "selectValue" + number;
    
    return (
        <select className="selectmenu" id={valueNumber}>
            <option value="temperature">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="pressure">Pressure</option>
            <option value="pm025">PM2.5</option>
            <option value="pm100">PM10</option>
        </select>
    );

}

// html animation template for 3rd row
function LoadingAnimation() {
    
    return (
        <div className="loadingBase">
            <div className="loadingCore">
                <div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    );

}

// CHART:
// static chart description storage
// description setting: key: [name, description]
var dataSetting = {
    "temperature":["Temperature","Temperature in °C"],
    "humidity":["Humidity","Humidity in %"],
    "pressure":["Pressure","Pressure in hPa"],
    "pm025":["Particulate matter (2.5µm)","Particulate matter (2.5µm) in µg/m³"],
    "pm100":["Particulate matter (10µm)","Particulate matter (10µm) in µg/m³"]
};
// Y axis setting: key: [subtract/add]
var chartSetting = {
    "temperature":[2.5],
    "humidity":[2.5],
    "pressure":[1],
    "pm025":[2.5],
    "pm100":[2.5]
};

// charthandling --> inserts data and calculates y-axis description +  inserts chart to div
function ChartHandler(dataRaw, value1, value2) {

    // static storage; 
    var data1 = [];
    var data2 = [0,1]; // preset if value1 == value2 (prevents exception)
    var xAxisDescrp = [];
    var lowestYAxisValue1;
    var highestYAxisValue1;
    var lowestYAxisValue2;
    var highestYAxisValue2;
    var lowestValueHolder = 0;
    var highestValueHolder = 0;

    // adding data (value1) to array1
    for (var selectedValueKey1 in dataRaw[0].data.dataValue1) {
        var selectedValue1 = dataRaw[0].data.dataValue1[selectedValueKey1];
        
        // pushing value to array (y axis)
        data1.push(selectedValue1);
        //console.log(dataRaw[0].data.dataValue1[selectedValue1]);
        // calculation of highest/lowest Y axis value
        if ((lowestValueHolder === 0) || (highestValueHolder === 0)) {
            lowestValueHolder = selectedValue1;
            highestValueHolder = selectedValue1;
        }
        // checking if selected value is greater/less than saved value
        if (lowestValueHolder > selectedValue1) {
            lowestValueHolder = selectedValue1;
        }
        if (highestValueHolder < selectedValue1) {
            highestValueHolder = selectedValue1;
        }
    }
    
    // pasting lowest/highest value for y axis into var (value1)
    lowestYAxisValue1 = lowestValueHolder - chartSetting[value1][0];
    highestYAxisValue1 = highestValueHolder + chartSetting[value1][0];
    if (lowestYAxisValue1 < 0) {
        lowestYAxisValue1 = 0;
    }
    
    // resetting value holder
    lowestValueHolder = 0;
    highestValueHolder = 0;

    // handle data for value2 
    if (value1 !== value2) {
        
        // adding data to array2 if value1 != value2
        // resetting array
        data2 = [];
        for (var selectedValueKey2 in dataRaw[0].data.dataValue2) {
            var selectedValue2 = dataRaw[0].data.dataValue2[selectedValueKey2]
            data2.push(selectedValue2);
            //console.log(dataRaw[0].data.dataValue2[selectedValue2]);
            // calculation of highest/lowest Y axis value
            if ((lowestValueHolder === 0) || (highestValueHolder === 0)) {
                lowestValueHolder = selectedValue2;
                highestValueHolder = selectedValue2;
            }
            // checking if selected value is greater/less than saved value
            if (lowestValueHolder > selectedValue2) {
                lowestValueHolder = selectedValue2;
            }
            if (highestValueHolder < selectedValue2) {
                highestValueHolder = selectedValue2;
            }
        }
    }

    // pasting values into var
    lowestYAxisValue2 = lowestValueHolder - chartSetting[value2][0];
    highestYAxisValue2 = highestValueHolder + chartSetting[value2][0];
    if (lowestYAxisValue2 < 0) {
        lowestYAxisValue2 = 0;
    }

    // resetting value holder
    lowestValueHolder = 0;
    highestValueHolder = 0;

    // second Y axis setting
    var secondYAxis = {
        opposite: true,
        title: {
            text: dataSetting[value2][1]
        },
        decimalsInFloat: 2,
        min: lowestYAxisValue2,
        max: highestYAxisValue2
    };

    // second Y axis data array
    var secondData = {
        name: dataSetting[value2][1],
        data: data2
    };

    // retrieving status --> if not 10000 --> display error
    var status = dataRaw[0].status;
    
    if (status === 10000) {
        // chart settings (style and data)
        var options = {
            chart: {
                type: 'line'
            },
            series: [{
                name: dataSetting[value1][1],
                data: data1
            }],
            stroke: {
                curve: "smooth"
            },
            xaxis: {
                categories: xAxisDescrp,
                tickAmount: 13,
                tickPlacement: "on",
            },
            yaxis: [
                {
                  title: {
                    text: dataSetting[value1][1]
                  },
                  decimalsInFloat: 2,
                  min: lowestYAxisValue1,
                  max: highestYAxisValue1
                }
              ],
        }

        // customizing the chart if values are unequal, adding second y axis and it's data
        if (value1 !== value2) {
            options["yaxis"].push(secondYAxis);
            options["series"].push(secondData);
        }

        // preparing x axis
        for (var selectedxValue in dataRaw[0].data.dataValue1) {
            var formattedxAxisValueDate = selectedxValue.split("_")[0].replace("-",".").replace("-",".");
            var formattedxAxisValueTime = selectedxValue.split("_")[1].replace("-",":");
            xAxisDescrp.push(formattedxAxisValueDate + " - " + formattedxAxisValueTime);
        }

        // collecting settings (style and data) --> creating new chart instance
        var chart = new ApexCharts(document.getElementById("chartPanel"), options);
        
        // rendering and inserting chart to div
        chart.render();
    } else {
        // printing exception + errorcode to 3rd row 
        toggleChartDisplay("Something went wrong. Error: " + status);
    }
}

// inserts text into div (3rd row)
function toggleChartDisplay(toDiv) {
    var element = document.getElementById("chartPanel");
    element.innerHTML = toDiv;
}

// prepares path to request (for http-data-request) --> array to string
function PrepareRequest(data) {
    // array --> string for URL
    var prepath = "";
    for (var i in data) {
        prepath += data[i] + "_"; 
    }

    // removing last "-"
    var path = prepath.slice(0, -1);
    return path;
}

// requests available datarange via HTTP GET request
function RequestDataRange() {
    let xmlhttpRange = new XMLHttpRequest();
    
    // (!) runs synchronously
    xmlhttpRange.open("GET", "http://" + backend_IP + ":8000/datarange", false);
    xmlhttpRange.send();
    var responseRange = [];
    responseRange = JSON.parse(xmlhttpRange.response);
    return responseRange;
}

// getting and validating input
function inputHandler() {

    // read input/select values
    const data = {};
    data["firstValue"] = document.getElementById("selectValue1").value;
    data["secondValue"] = document.getElementById("selectValue2").value;
    data["startDate"] = document.getElementById("startDate").value;
    data["startTime"] = document.getElementById("startTime").value;
    data["endDate"] = document.getElementById("endDate").value;
    data["endTime"] = document.getElementById("endTime").value;

    // validate input
    var alertM = "Something went wrong, please check these values:\n";
    for (var i in data) {
        if (!data[i]) {
            alertM += "- " + i + "\n";
        } else {
            
            // checking if all given parameters are matching requirements
            var dataSplit = data[i].split("-");
            if (i.includes("Time")) {
                if (dataSplit.length !== 2) {
                    alertM += "- " + i + "\n";
                }
                if (!(dataSplit[0] < 24) || !(dataSplit[1] < 60)) {
                    alertM += "- " + i + "\n";
                }
            } else if (i.includes("Date")) {
                if (dataSplit.length !== 3) {
                    alertM += "- " + i + "\n";
                }
                if (!(parseInt(dataSplit[0]) === 2021) || !(dataSplit[1] < 13) || !(dataSplit[2] < 32)) {
                    alertM += "- " + i + "\n";
                }
            }
        }
    }

    if (alertM !== "Something went wrong, please check these values:\n") {
        alert(alertM);
        return;
    }

    // checking if date are valid
    var sd = data["startDate"].replace("-","").replace("-","");
    var ed = data["endDate"].replace("-","").replace("-","");
    if (!(parseInt(sd) < parseInt(ed)) && (parseInt(sd) !== parseInt(ed))) {
        alert("The given dates are unvalid!");
        return;
    }

    // checking if requested data is available
    try {
        var dataRangeJSON = RequestDataRange();
        var dataRangeList = dataRangeJSON[0].files;
        if ((dataRangeList.indexOf(data["startDate"]) === -1) || (dataRangeList.indexOf(data["endDate"]) === -1)) {
            alert("The given timerange is unvalid - no data available");
            return;
        }
    } catch (err) {
        //  do nothing --> exception will be printed ou after next async request
    }
    
    var reqValues = [data["firstValue"], data["secondValue"]];
    return [data, reqValues];
}

var chartPanelContent = "Please select at least one value and a timerange.";

// component for data selection and visualization
class WebDisplay extends React.Component {

    // component constructor (React-states)
    // (dataRequested == unused)
    constructor(props) {
        super(props);
        
        this.state = {
          isVisible: false,
          dataRequested: false
        };
    }

    // content toggler for 3rd row
    handleLoading = async () => {
        console.log("\n\n" + getCurTime() + "event triggered | initialized datavisualization")
        // starting core function
        var success = this.WSCore();
        // toggling animation (content of) in 3rd component
        // when all previous process have been completed successfully
        if (success) {
            this.setState({isVisible: true});
        }
        // unused
        this.setState({dataRequested: true});
    }

    // controls charthandler
    ControlChartHandler = (data, value1, value2) => {
        // clearing div
        chartPanelContent = "";
        // toggling div conent
        this.setState({isVisible: false});
        // inserting data into chart
        console.log(getCurTime() + "inserting data to chart");
        ChartHandler(data, value1, value2);
        console.log(getCurTime() + "datavisualization finished");
    }

    // requests required data via HTTP GET request from path
    RequestData = (path, callback, error, reqValues) => {
        let xmlhttpData = new XMLHttpRequest();
        xmlhttpData.open("GET", "http://" + backend_IP + ":8000/request/" + path);
        
        // (!) runs asynchronously
        xmlhttpData.onload = function() {
            console.log(getCurTime() + "request completed");
            callback(JSON.parse(xmlhttpData.response), reqValues[0], reqValues[1]);
        };
        xmlhttpData.onerror = function() {
            error("An error occured: unable to reach backendserver");
        };
        xmlhttpData.send();
    }

    // initializing and handling HTTP request + initializing and calculating data visualization
    WSCore = () => {
        console.log(getCurTime() + "collecting and validating input");
        var inputOut = inputHandler();
        
        if (!inputOut) {
            console.log(getCurTime() + "input invalid - returning");
            return false;
        }

        console.log(getCurTime() + "finished");
        console.log(getCurTime() + "preparing HTTP path");
        var requestedPath = PrepareRequest(inputOut[0]);
        console.log(getCurTime() + "finished");
        console.log(getCurTime() + "requesting data from backend");
        this.RequestData(requestedPath, this.ControlChartHandler, toggleChartDisplay, inputOut[1]);
        
        return true;
    }

    render () {

        let chartPanel;
        let { isVisible } = this.state;
        // content of 3rd row
        if (!isVisible) {
            chartPanel = <div id="chartPanel" className="chartPanel">{chartPanelContent}</div>;
        } else {
            chartPanel = <div id="chartPanel" className="chartPanel"><LoadingAnimation /></div>;
        }

        // HTML elements --> 2nd and 3rd row
        return (
            <>
                <div style={boxStyle}>
                    <div className="sbox">
                        <div className="text">
                            <label htmlFor="fv">First value:</label>
                            <DataSelect number={"1"} />
                        </div>
                    </div>
                    <div className="sbox">
                        <div className="text">
                            <label htmlFor="sv">Second value:</label>
                            <DataSelect number={"2"} />
                        </div>
                    </div>
                    <div className="sbox">
                        <div className="text">
                            <label htmlFor="startDate">Start date:</label>
                            <input type="text" 
                            name="startDate"
                            className="timeField" 
                            id="startDate" 
                            placeholder="yyyy-mm-dd" />
                        </div>
                    </div>
                    <div className="sbox">
                        <div className="text">
                            <label htmlFor="startTime">Start time:</label>
                            <input type="text" 
                            name="startTime"
                            className="timeField" 
                            id="startTime" 
                            placeholder="hh-mm"/>
                        </div>
                    </div>
                    <div className="sbox">
                        <div className="text">
                            <label htmlFor="endDate">End date:</label>
                            <input type="text" 
                            name="endDate"
                            className="timeField" 
                            id="endDate" 
                            placeholder="yyyy-mm-dd" />
                        </div>
                    </div>
                    <div className="sbox">
                        <div className="text">
                            <label htmlFor="endTime">End time:</label>
                            <div className="innerTextBox">
                            <input type="text" 
                            name="endTime"
                            className="timeField" 
                            id="endTime" 
                            placeholder="hh-mm" />
                            </div>
                        </div>
                    </div>
                    <div className="genButton">
                        <div className="text" id="buttonField">
                            <input id="ggraph" 
                            type="button" 
                            value="Generate graph" 
                            onClick={this.handleLoading} />
                        </div>
                    </div>
                </div>
                
                <div style={boxStyle}>
                    {chartPanel}
                </div>
            </>
        )
    }

    // unused
    componentDidUpdate() {
        let { dataRequested } = this.state;
        
        if (dataRequested) {
            this.setState({dataRequested: false});
        }
    }
}

// webpage blueprint --> component collector (implementation via JSX) (3 orange rows + background)
class WebCore extends React.Component {
    
    render() {
        
        const pageStyle = {
            backgroundColor: "white",
            marginLeft: "15%",
            marginRight: "15%",
            borderRadius: "15px",
            padding: "0.5%",
            overflow: "hidden"
        }
        
        return (
            // inserting all blocks to parent HTML 
            // forward to Github-profile
            <div style={pageStyle}>
                <WebHeader />
                <WebDisplay />
                <div className="imprint">
                    <a className="imprint-link" 
                    href="https://github.com/Zyzonix/" 
                    target="_blank" 
                    rel="noreferrer noopener">Developed by ZyzonixDev in 2021</a> | <a 
                    className="imprint-link" 
                    href="https://github.com/Zyzonix/rpi-weatherstation-web/" 
                    target="_blank" 
                    rel="noreferrer noopener">Sourcecode</a>
                </div>
            </div>
        )
    }
}

// returns blueprint with content
export default WebCore