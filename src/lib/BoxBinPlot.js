import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {memoize_one} from "memoize";
import {bisect_left,bisect_right} from "bisect";
import {toDomXCoord_Linear,toDomYCoord_Linear} from "plot-utils";
import LinearGradient from "./LinearGradient";

const YRANGE_LUT = {
  "0-50": {from:0, to:50},
  "50-60": {from:50, to:60},
  "60-70": {from:60, to:70},
  "70-80": {from:70, to:80},
  "80-90": {from:80, to:90},
  "90-100": {from:90, to:100},
  "100-110": {from:100, to:110},
  "110-120": {from:110, to:120},
  "120-200": {from:120, to:200},
  };

const YRANGES = Object.keys(YRANGE_LUT);

const SPAN_LUT = {
  "hour": 3600*1000,
  "day": 24*3600*1000,
  "week": 7*24*3600*1000,
  };

const RESOLUTIONS = Object.keys(SPAN_LUT);

const LINEAR_GRADIENT = new LinearGradient([{x:0,r:255,g:0,b:0},{x:100,r:255,g:255,b:0}])

class BoxBinPlot extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }
  
  render(){
    let {width,height} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={height} style={{display:"block"}}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }

  componentDidUpdate(){
    this.draw();
  }

  draw(){
    let { width,height,
          minX,maxX,
          minY,maxY,
          data} = this.props;
    let gridCells = this.getGridCells(data);
    let resolution = this.getResolution(width,minX,maxX);
    console.log(resolution);
    // Clear plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    // Draw
    for (let cell of gridCells[resolution]){
      let {startX,endX,startY,endY,color} = cell;
      if (endX<=minX || startX>=maxX) {
        continue;
      }
      let startDomX = Math.round(toDomXCoord_Linear(width,minX,maxX,startX));
      let endDomX = Math.round(toDomXCoord_Linear(width,minX,maxX,endX));
      let startDomY = Math.round(toDomXCoord_Linear(height,minY,maxY,endY));
      let endDomY = Math.round(toDomXCoord_Linear(height,minY,maxY,startY));
      ctx.fillStyle = color;
      ctx.fillRect(startDomX,startDomY,endDomX-startDomX,endDomY-startDomY);
    }
  }

  getGridCells = memoize_one( (data)=>{
    let grids = { hour:[],
                  day:[],
                  week:[]
                  };
    for (let resolution of RESOLUTIONS) {
      for (let column of data[resolution]) {
        let startX = column["from"];
        let endX = column["to"];
        for (let row of YRANGES) {
          let count = column[row];
          let color = this.getColor(count);
          let yRange = YRANGE_LUT[row];
          let startY = yRange["from"];
          let endY = yRange["to"];
          grids[resolution].push({startX,endX,startY,endY,color});
        }
      }
    }
    return grids;
  });

  getColor(count){
    let {r,g,b} = LINEAR_GRADIENT.getRGB(count);
    return `rgb(${r},${g},${b})`;
  }

  getResolution(width,minX,maxX){
    let targetCellWidth = 50;
    let curMinDiff=Infinity;
    let curRes=null;
    for (let resolution of RESOLUTIONS) {
      let span = SPAN_LUT[resolution];
      let cellWidth = width/(maxX-minX)*span;
      let diffWidth = Math.abs(targetCellWidth-cellWidth);
      if (diffWidth<curMinDiff) {
        curMinDiff = diffWidth;
        curRes = resolution;
      }
    }
    return curRes;
  }
}

BoxBinPlot.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  minX: PropTypes.number.isRequired,
  maxX: PropTypes.number.isRequired,
  minY: PropTypes.number.isRequired,
  maxY: PropTypes.number.isRequired,
}

export default BoxBinPlot;
