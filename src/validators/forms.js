
export const testUnits = ({ units }, testCall) => {
    var _units = parseInt(units);

    if(_units && _units > 0){
      if(testCall){
        return testCall(_units);
      }
      return true;
    }
}