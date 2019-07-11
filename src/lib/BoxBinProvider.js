import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {memoize_one} from "memoize";
import {bisect_left,bisect_right} from "bisect";
import {toDomXCoord_Linear,toDomYCoord_Linear} from "plot-utils";
import LinearGradient from "./LinearGradient";

const TIME_SPAN_LUT = {
  "hour": 3600*1000,
  "day": 24*3600*1000,
  "week": 7*24*3600*1000,
  };

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

  getGridCells = memoize_one( (data)=>{
    let grids = { hour:[],
                  day:[],
                  week:[]
                  };
    for (let key of ["hour","day","week"]) {
      
    }
  });

  getDataInRange = memoize_one( (data,minX,maxX)=>{
    let sortedData = this.getSortedData(data);
    let sortedFrom = this.getSortedFrom(sortedData);
    let sortedTo = this.getSortedTo(sortedData);
    let leftIdx = bisect_right(sortedTo,minX);
    let rightIdx = bisect_left(sortedFrom,maxX);
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
