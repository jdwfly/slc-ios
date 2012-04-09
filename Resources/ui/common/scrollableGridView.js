
exports.createScrollableGridView = function(params){
    var _p =function(densityPixels){
        return densityPixels*Ti.Platform.displayCaps.dpi/160;
    }
 
    var view = Ti.UI.createScrollView({
        scrollType:"vertical",
        layout: "vertical",
        cellWidth:(params.cellWidth)?params.cellWidth: _p(95),
        cellHeight:(params.cellHeight)?params.cellHeight: _p(95),
        xSpacer:(params.xSpacer)?params.xSpacer: _p(10),
        ySpacer:(params.ySpacer)?params.ySpacer: _p(10),
        xGrid:(params.xGrid)?params.xGrid:3,
        data: params.data,
        contentHeight: 'auto',
        contentWidth: 'auto'
    });
 
    var objSetIndex =0;
    var yGrid = view.data.length/view.xGrid;
 
    for(var y=0; y<yGrid; y++){
        var row = Ti.UI.createView({
            layout:"horizontal",
            focusable:false,
            top: 2*view.ySpacer,
            height: view.cellHeight+(2*view.ySpacer),
            width: (view.cellWidth+view.ySpacer)*view.xGrid
        });
 
        for(var x=0; x<view.xGrid; x++){
            if(view.data[objSetIndex]){
                var thisView = Ti.UI.createView({
                    left: view.ySpacer,
                    height: view.cellHeight,
                    width: view.cellWidth
                });
                thisView.add(view.data[objSetIndex]);
                row.add(thisView);
                objSetIndex++;
           }
        }
        view.add(row);
    }
 
    return view;
};