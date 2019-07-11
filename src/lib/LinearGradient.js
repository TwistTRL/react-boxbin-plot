import {bisect_left,bisect_right} from "bisect";

class LinearGradient {
  constructor(stops){
    if (stops.length===0){
      throw new TypeError("EmptyArray");
    }
    this._stops = stops.sort( (a,b)=>a.x-b.x )
    this._Xs = this._stops.map( ({x})=>x );
  }

  getRGB(x){
    let Xs = this._Xs;
    let stops = this._stops;
    if (stops.length===0) {
      return null;
    }
    let leftIdx = bisect_left(Xs,x);
    let rightIdx = bisect_right(Xs,x);
    if (rightIdx-leftIdx>=2 ) {
      let IdxOfInterest = Math.round((rightIdx+leftIdx)/2);
      let stop = stops[IdxOfInterest];
      let {r,g,b} = stop;
      return {r,g,b};
    }
    else if (rightIdx-leftIdx===1){
      if (leftIdx===-1){
        let stop = stops[rightIdx];
        let {r,g,b} = stop;
        return {r,g,b};
      }
      else if (rightIdx===stops.length){
        let stop = stops[leftIdx];
        let {r,g,b} = stop;
        return {r,g,b};
      }
      else {
        let leftStop = stops[leftIdx];
        let rightStop = stops[rightIdx];
        let r = Math.round(leftStop.r+(rightStop.r-leftStop.r)/(rightStop.x-leftStop.x)*(x-leftStop.x));
        let g = Math.round(leftStop.g+(rightStop.g-leftStop.g)/(rightStop.x-leftStop.x)*(x-leftStop.x));
        let b = Math.round(leftStop.b+(rightStop.b-leftStop.b)/(rightStop.x-leftStop.x)*(x-leftStop.x));
        return {r,g,b};
      }
    }
    else {
      throw new Error("ProgrammingError")
    }
  }
}

export default LinearGradient;
