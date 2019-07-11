import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import BoxBinPlot from "./lib";

function generateData(minX,maxX,period) {
  let data = [];
  let start = Math.floor(minX/period)*period;
  let end = Math.floor(maxX/period)*period;
  for (let i=start; i<end; i+=period) {
    data.push({ from: i,
                to: i+period,
                "0-50": Math.round(Math.random()*5),
                "50-60": Math.round(Math.random()*10),
                "60-70": Math.round(Math.random()*20),
                "70-80": Math.round(Math.random()*40),
                "80-90": Math.round(Math.random()*200),
                "90-100": Math.round(Math.random()*40),
                "100-110": Math.round(Math.random()*20),
                "110-120": Math.round(Math.random()*10),
                "120-200": Math.round(Math.random()*5)
                });
  }
  return data;
}

const DATA = {minute:generateData(0,365*24*3600*1000,60*1000),
              hour:generateData(0,365*24*3600*1000,60*60*1000),
              day:generateData(0,365*24*3600*1000,24*60*60*1000),
              week:generateData(0,365*24*3600*1000,7*24*60*60*1000),
              };

class App extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {minX:0,
                  maxX:24*3600*1000,
                  minY:0,
                  maxY:200,
                  width:800,
                  height:400,
                  data_: "minute",
                  };
  }
  
  render() {
    let { minX,maxX,minY,maxY,
          width,height,data_
          } = this.state;
    return (
      <>
        <fieldset>
          <legend>props</legend>
          <div>
            width
            <input  type="range" min={600} max={800} value={width}
                    onChange={ ev=>this.setState({width:Number.parseInt(ev.target.value)}) }/>
          </div>
          <div>
            height
            <input  type="range" min={200} max={600} value={height}
                    onChange={ ev=>this.setState({height:Number.parseInt(ev.target.value)}) }/>
          </div>
          <div>
            minX
            <input  type="range" min={0} max={maxX} value={minX}
                    onChange={ ev=>this.setState({minX:Number.parseInt(ev.target.value)}) }/>
          </div>
          <div>
            maxX
            <input  type="range" min={minX} max={365*24*3600*1000} value={maxX}
                    onChange={ ev=>this.setState({maxX:Number.parseInt(ev.target.value)}) }/>
          </div>
          <div>
            minY
            <input  type="range" min={0} max={maxY} value={minY}
                    onChange={ ev=>this.setState({minY:Number.parseInt(ev.target.value)}) }/>
          </div>
          <div>
            maxY
            <input  type="range" min={minY} max={200} value={maxY}
                    onChange={ ev=>this.setState({maxY:Number.parseInt(ev.target.value)}) }/>
          </div>
          {/*
          <div>
            data
            Select bin size
            <select value={data_} onChange={ ev=>this.setState({data_:ev.target.value}) }>
              <option value="minute">minute</option>
              <option value="hour">hour</option>
              <option value="day">day</option>
              <option value="week">week</option>
            </select>
          </div>
          */}
        </fieldset>
        <fieldset>
          <legend>Results</legend>
          <BoxBinPlot width={width}
                      height={height}
                      minX={minX}
                      maxX={maxX}
                      minY={minY}
                      maxY={maxY}
                      data={DATA["week"]}/>
          <BoxBinPlot width={width}
                      height={height}
                      minX={minX}
                      maxX={maxX}
                      minY={minY}
                      maxY={maxY}
                      data={DATA["day"]}/>
          <BoxBinPlot width={width}
                      height={height}
                      minX={minX}
                      maxX={maxX}
                      minY={minY}
                      maxY={maxY}
                      data={DATA["hour"]}/>
        </fieldset>
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
