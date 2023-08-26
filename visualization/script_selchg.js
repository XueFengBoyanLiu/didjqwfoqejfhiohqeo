
function happy(){
    window.alert('happy');
};

function post_selchgd(seljs) {
    //seljs = JSON.stringify({ college: currentCollege, nf: NF, xq: XQ, types: readyTypes });


    get_trend();
    post_typed_courses();
    post_weektime_distribution();
    post_heatmap();
    
};

function get_trend(){
    jQuery.ajax({
        url: "/api/get_trend",
        type: "post",
        data: seljs,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if (data.success)
                firstGraph(data.data);
            else
                window.alert(data.reason);
        },
        error: function (data) {
            window.alert("trend update failed");
        }
    });
};



function post_typed_courses(){
    jQuery.ajax({
        url: "/api/get_typed_courses",
        type: "post",
        data: seljs,
        dataType: "json",
        contentType: "application/json",
        success: (data) => {
            if (data.success) {
                secondGraph(data.data);
                // console.log(data.data);
            }
            else
                window.alert(data.reason);
        },
        error: (data) => {
            console.log(data);
            window.alert("typed courses update failed");
        }
    });
};

function post_weektime_distribution(){
    jQuery.ajax({
        url: "/api/get_weektime_distribution",
        type: "post",
        data: seljs,
        dataType: "json",
        contentType: "application/json",
        success: (data) => {
            if (data.success) {
                // console.log(data.data);
                thirdGraph(data.data);
            }
            else
                window.alert(data.reason);
        },
        error: (data) => {
            window.alert("weektime distribution update failed");

        }
    });
};

function post_heatmap(){
    jQuery.ajax({
        url: "/api/get_heatmap",
        type: "post",
        data: seljs,
        dataType: "json",
        contentType: "application/json",
        success: (data) => {
            if (data.success)
                fourthGraph(data.data);
            else
                window.alert(data.reason);
        },
        error: (data) => {
            window.alert("heatmap update failed");
        }
    });
};
