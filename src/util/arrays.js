let reverse = (range, lambda) => {
    var data = [];
    var i = range - 1;
    while(i>=0){
        data.push(lambda(i));
        i--;
    }
    return data;
};

export { reverse }
