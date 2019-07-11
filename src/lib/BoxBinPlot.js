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

const LINEAR_GRADIENT = new LinearGradient([{x:0,r:255,g:255,b:255},{x:100,r:0,g:0,b:0}])

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
    let dataInRange = this.getDataInRange(data,minX,maxX);
    console.log(dataInRange);
    // Clear plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    // Draw
    for (let row of dataInRange){
      let startX = row.from;
      let endX = row.to;
      let startDomX = Math.round(toDomXCoord_Linear(width,minX,maxX,startX));
      let endDomX = Math.round(toDomXCoord_Linear(width,minX,maxX,endX));
      for (let key of Object.keys(YRANGE_LUT)){
        let startY = YRANGE_LUT[key]["from"];
        let endY = YRANGE_LUT[key]["to"];
        let startDomY = Math.round(toDomYCoord_Linear(height,minY,maxY,endY));
        let endDomY = Math.round(toDomYCoord_Linear(height,minY,maxY,startY));
        let count = row[key];
        let rgb = LINEAR_GRADIENT.getRGB(count);
        let color = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
        ctx.fillStyle = color;
        ctx.fillRect(startDomX,startDomY,endDomX-startDomX,endDomY-startDomY);
      }
    }
  }

  getDataInRange = memoize_one( (data,minX,maxX)=>{
    let sortedData = this.getSortedData(data);
    let sortedFrom = this.getSortedFrom(sortedData);
    let sortedTo = this.getSortedTo(sortedData);
    let leftIdx = bisect_right(sortedFrom,minX);
    let rightIdx = bisect_left(sortedTo,maxX);
    return sortedData.slice(leftIdx,rightIdx+1);
  });

  getSortedData = memoize_one( (data)=>{
    return data.sort( (a,b)=>a.from-b.from );
  });

  getSortedFrom = memoize_one( (sortedData)=>{
    return sortedData.map( ({from})=>from );
  });
  
  getSortedTo = memoize_one( (sortedData)=>{
    return sortedData.map( ({to})=>to );
  });
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
