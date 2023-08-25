const is_debugging=true;

const colorArray=['rgb(122,40,204)', 'rgb(70,40,204)', 'rgb(40,86,204)', 'rgb(40,142,204)', 'rgb(40,180,204)', 'rgb(40,204,191)', 'rgb(40,204,153)', 'rgb(40,204,106)', 'rgb(51,204,40)', 'rgb(153,204,40)', 'rgb(204,156,40)', 'rgb(204,111,40)', 'rgb(204,84,40)', 'rgb(204,60,40)', 'rgb(204,40,40)'];
// const colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
// '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
// '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
// '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
// '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
// '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
// '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
// '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
// '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
// '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
//import jQuery from "jquery";
const typeArray = ['专业任选', '专业必修', '专业限选', '体育', '全校公选课', '军事理论', '双学位', '大学英语', '实习实践', '思想政治', '文科生必修', '毕业论文/设计', '理科生必修', '辅修', '通选课'];
const typeObject = {};
for (let i = 0; i < typeArray.length; i++) {
    typeObject[typeArray[i]] = i;
};
const currentTypes = typeArray;
legends = document.getElementById('legend-of-pie');
function createCheckBox(key, i) {
    var container = document.createElement('div');
    container.style.display = 'inline-block';

    var checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = true;
    checkBox.id = key;
    checkBox.style.color = colorArray[i];
    checkBox.style.cursor = 'pointer';
    checkBox.addEventListener('change', () => {
        if (checkBox.checked) {
            currentTypes.push(key);
        }
        else {
            currentTypes.splice(currentTypes.indexOf(key), 1);
        }

        var readyTypes = [];
        for (let i = 0; i < currentTypes.length; i++) {
            readyTypes.push(typeObject[currentTypes[i]])
        };
        jQuery.ajax({
            url: "/api/get_typed_courses",
            type: "post",
            data: JSON.stringify({ college: currentCollege, qsn: Number(currentSemester.split('-')[0]), xq: Number(currentSemester.split('-')[2]), types: readyTypes }), //:currentTypes.forEach((d)=>{typeObject[d]})
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
                window.alert("update failed here");
            }
        });
    })

    label = document.createElement('label');
    label.for = key;
    label.innerText = key;
    label.style.color = colorArray[i];
    label.style.fontSize = '50%';

    container.appendChild(checkBox);
    container.appendChild(label);
    legends.appendChild(container);
}
// function createLabel(key,i){
//     label=document.createElement('label');
//     label.for=key;
//     label.innerText=key;
//     label.style.color=colorArray[i];
//     label.fontSize='10px';
//     legends.appendChild(label);
// }
for (let i = 0; i < typeArray.length; i++) {
    createCheckBox(typeArray[i], i);
}

selectBtn = document.getElementById('one-select-all')
var selectBtnState = true;
selectBtn.addEventListener('click', () => {
    if (selectBtnState) {
        for (let i = 0; i < typeArray.length; i++) {
            document.getElementById(typeArray[i]).checked = false;
        }
        selectBtnState = false;
        selectBtn.innerText = '全 选';
        currentTypes = [];
    }
    else {
        for (let i = 0; i < typeArray.length; i++) {
            document.getElementById(typeArray[i]).checked = true;
        }
        selectBtnState = true;
        selectBtn.innerText = '全不选';
        currentTypes = typeArray;
    }
})




function showInfo(text, x, y, bcolor, fcolor) {
    Info = document.createElement('div');
    Info.classList.add('info');
    Info.innerText = text;
    Info.style.backgroundColor = bcolor;
    Info.style.opacity = '0.8';
    Info.style.padding = '5px';
    Info.style.borderRadius = '3px';
    Info.style.color = fcolor;
    Info.style.position = 'absolute';
    Info.style.zPosition = '100';
    Info.style.left = window.scrollX + x - 95 + 'px';
    Info.style.top = window.scrollY + y - 65 + 'px';

    document.body.appendChild(Info);

    return Info;
}



let data;
function loadData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText);
            data = JSON.parse(this.responseText);
        }
    };
    xhttp.open("GET", "../database.json", true);
    xhttp.send();
}
loadData();

jQuery.ajax({
    url: "/api/get_semesters",
    dataType: "json",
    success: function (data) {
        if (data.success){
            // initializeSemesterSelector(data.data);
            // initializeSemesterSelector2(data.data);
            initialize_NF(data.data);
        }
        else
            window.alert(data.reason);
    },
    error: function (data) {
        window.alert("error");
    }
});

jQuery.ajax({
    url: "/api/get_college",
    dataType: "json",
    success: function (data) {
        if (data.success)
            initializeSchoolSelector(data.data);
        else
            window.alert(data.reason);
    },
    error: function (data) {
        window.alert("error");
    }
})

// const semesterSelector = document.getElementById('semester-selector');
// const semesterSelector2 = document.getElementById('semester-selector2');
const schoolSelector = document.getElementById('school-selector');
// let currentSemester = "12-13-1";
// let currentSemester2 = "22-23-1";
let currentCollege = "00001";

function firstGraph(dataset) {
    for (let i of document.getElementById("one-tendency").children) {
        i.remove();
    }
    // 定义画布大小和间距
    var padding = 40;
    var svgWidth = 600;
    var svgHeight = 500;

    // 定义x轴比例尺
    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length)) // 输入域，从0到数据长度
        .range([padding, svgWidth - padding]) // 输出域，从左右边缘开始
        .padding(0) // 设置柱子之间的间隙
        .paddingInner(1) // 设置柱子内部的间隙

    // 定义y轴比例尺
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) { return d.count; })]) // 输入域，从0到最大元素值
        .range([svgHeight - padding, padding]); // 输出域，从下到上边缘开始



    // 创建SVG元素，并设置边框
    var svg = d3.select("#one-tendency")
        .append("svg") // 在body内添加一个svg元素
        .attr("width", svgWidth)
        .attr("height", svgHeight)
    // .style('border', '1px solid #999999')


    var line = d3.line() // 创建折线生成器
        .x(function (d, i) {
            return xScale(i) + xScale.bandwidth() / 2; // 每个X坐标用比例尺进行缩放，并加上柱状图宽度的一半，确保在柱中央插入点
        })
        .y(function (d) {
            return yScale(d.count); // 缩放Y坐标
        })
    // .curve(d3.curveCatmullRom.alpha(0.5)) // 设置曲线样式为折线

    svg.append("path") // 向SVG元素中添加路径
        .datum(dataset) // 数据源
        .attr("class", "line") // CSS类名
        .attr("d", line) // 路径数据
        .attr("fill", "none") // 填充颜色
        .attr("stroke", "#69b3a2") // 线条颜色
        .attr("stroke-width", "2px"); // 线宽

    // 定义x轴和y轴
    var xAxis = d3.axisBottom(xScale) // 构建x轴比例尺
        .tickFormat(function (d, i) {
            return dataset[i].semester; // x轴的数据标签
        });


    var yAxis = d3.axisLeft(yScale); // 构建y轴比例尺


    // 添加x轴和y轴
    svg.append("g")
        .attr("class", "x-axis") // CSS类名
        .attr("transform", "translate(0," + (svgHeight - padding) + ")") // 坐标系偏移
        .call(xAxis) // 插入坐标轴
        .selectAll("text") // 选择所有的标签
        .attr("transform", "rotate(-45)") // 旋转45度
        .attr("text-anchor", "end") // 设置文本锚点


    svg.append("g")
        .attr("class", "y-axis") // CSS类名
        .attr("transform", "translate(" + padding + ",0)") // 坐标系偏移
        .call(yAxis); // 
};


function createOption(id, name) {
    const option = document.createElement('option');
    option.classList.add('select-options');
    option.style.myid = id;
    option.innerText = name;
    return option;
}


// initializations
// 创建学期下拉菜单
// function initializeSemesterSelector(selectContents) {
//     const selectOptions = Object.keys(selectContents);
//     selectOptions.forEach(selectOption => {
//         const option = createOption(selectOption, selectContents[selectOption]);
//         // console.log(selectContents[selectOption] + selectOption);
//         semesterSelector.appendChild(option);
//     });
// }
// 创建学期双滑块
var NF_ARRAY;
var NF1;
var NF2;
var XQ=1;

function initialize_NF(semester_json) {
    NF_ARRAY=semester_json['NF'];
    NF1=NF_ARRAY[0];
    NF2=NF_ARRAY[NF_ARRAY.length-1];
}
// 创建学院下拉菜单
function initializeSchoolSelector(selectContents) {
    const selectOptions = Object.keys(selectContents);
    selectOptions.forEach(selectOption => {
        const option = createOption(selectOption, selectContents[selectOption]);
        schoolSelector.appendChild(option);
    });
}

// var NF1 = Number(currentSemester.split('-')[0]);
// var NF2 = Number(currentSemester2.split('-')[0]);

function selchgd() {
    var XQ=1;
    var NF = [NF1, NF2];
    
    if(is_debugging)
        window.alert(JSON.stringify({ college: currentCollege, nf: NF, xq: XQ}));

    jQuery.ajax({
        url: "/api/get_trend",
        type: "post",
        data: JSON.stringify({ college: currentCollege }),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if (data.success)
                firstGraph(data.data);
            else
                window.alert(data.reason);
        },
        error: function (data) {
            window.alert("update failed");
        }
    });


    var readyTypes = []
    for (let i = 0; i < currentTypes.length; i++) {
        readyTypes.push(typeObject[currentTypes[i]])
    }
    jQuery.ajax({
        url: "/api/get_typed_courses",
        type: "post",
        data: JSON.stringify({ college: currentCollege, nf: NF, xq: XQ, types: readyTypes }),
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
    jQuery.ajax({
        url: "/api/get_weektime_distribution",
        type: "post",
        data: JSON.stringify({ college: currentCollege, nf: NF, xq: XQ}),
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
    jQuery.ajax({
        url: "/api/get_heatmap",
        type: "post",
        data: JSON.stringify({ college: currentCollege, nf: NF, xq: XQ }),
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

// semesterSelector.addEventListener('change', (event) => { currentSemester = event.target.selectedOptions[0].style.myid; selchgd(); });
// semesterSelector2.addEventListener('change', (event) => { currentSemester2 = event.target.selectedOptions[0].style.myid; selchgd(); });
schoolSelector.addEventListener('change', (event) => { currentCollege = event.target.selectedOptions[0].style.myid; selchgd(); });






const class1 = document.getElementById('one');
const class2 = document.getElementById('two');

const swfunc1 = () => {
    class2.style.display = 'none';

    class1.style.display = 'grid';
};
const swfunc2 = () => {
    class1.style.display = 'none';

    class2.style.display = 'grid';
};






// 第二个派图
// set the dimensions and margins of the graph
const totalCourseNumber = document.getElementById('total-course-number');
function secondGraph(data) {
    totalCourseNumber.innerText = d3.sum(Object.values(data));

    for (let i of document.getElementById("one-course-type").children) {
        i.remove();
    }
    // console.log(Object.keys(data));

    var width = 450
    height = 450
    margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select("#one-course-type")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Create dummy data

    
    // set the color scale

    var ready_colarArray=[];
    for(let i=0;i<currentTypes.length;i++){
        ready_colarArray.push(colorArray[typeObject[Object.keys(data)[i]]]);
    }
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(ready_colarArray)

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function (d) { return d.value; })
    var data_ready = pie(d3.entries(data))

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('whatever')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function (d) { return (color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    //  画标签
    var total = d3.sum(Object.values(data));
    var props = [];
    for (let i = 0; i < Object.values(data).length; i++) {
        props.push((Object.values(data)[i] / total * 100).toFixed(2) + '%');
    }
    var pathes = document.querySelectorAll('#one-course-type svg path');
    for (let i = 0; i < pathes.length; i++) {
        var path = pathes[i];
        path.style.cursor = 'pointer';
        path.addEventListener('mouseover', (event) => {
            Info = showInfo(Object.keys(data)[i] + ': ' + props[i], event.clientX, event.clientY, colorArray[typeObject[Object.keys(data)[i]]], 'white');
        })
        path.addEventListener('mouseout', (event) => {
            Info.remove();
        }
        )
    }
}





// 第三个 直方图
// set the dimensions and margins of the graph
function thirdGraph(data) {
    for (let i of document.getElementById("one-course-length").children) {
        i.remove();
    }

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
width = 590 - margin.left - margin.right,
height = 435 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#one-course-length")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // get the data
    // X axis: scale and draw:
    // console.log(data);
    // console.log(d3.max(data, function(d) { return d.weektime }));
    var x = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.weektime })])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function (d) { return d.weektime; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(70)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data);

    // Y axis: scale and draw:
    var y = d3.scaleLinear()
        .range([height, 0]);
    y.domain([0, d3.max(bins, function (d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    svg.append("g")
        .call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
        .attr("height", function (d) { return height - y(d.length); })
        .style("fill", "#69b3a2")
}



// 第四个 热力图
// set the dimensions and margins of the graph

function fourthGraph(heatMapData) {
    for (let i of document.getElementById("one-course-dis").children) {
        i.remove();
    }

    var margin = { top: 30, right: 30, bottom: 30, left: 90 },
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // one-course-dis
    var svg = d3.select("#one-course-dis")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Labels of row and columns
    var myGroups = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
    var myVars = ["第一节", "第二节", "第三节", "第四节", "第五节", "第六节", "第七节", "第八节", "第九节", "第十节", "第十一节", "第十二节"].reverse()



    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([0, width])
        .domain(myGroups)
        .padding(0.01);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

    // Build X scales and axis:
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(myVars)
        .padding(0.01);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Build color scale


    var myColor = d3.scaleLinear()
        .range(["white", "crimson"])
        .domain([0, d3.max(heatMapData, function (d) { return d.value; })])

    svg.selectAll()
        .data(heatMapData, function (d) { return d.group + ':' + d.variable; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.group) })
        .attr("y", function (d) { return y(d.variable) })
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) { return myColor(d.value) })

    var rects = document.querySelectorAll('#one-course-dis svg g rect');
    for (let i = 0; i < rects.length; i++) {
        var rect = rects[i];
        rect.style.cursor = 'pointer';

        rect.addEventListener('mouseover', (event) => {
            Info = showInfo(heatMapData[i].value, event.clientX, event.clientY, 'darkred', 'white');
        })
        rect.addEventListener('mouseout', (event) => {
            Info.remove();

        })
    }

}

var slider1 =document.getElementById("slider1");
var slider2 =document.getElementById("slider2");
var slideTool =document.getElementById("slideTool");
var slideLeft =document.getElementById("slideLeft");
var slideRight =document.getElementById("slideRight");
var P1 =document.getElementById("p1");
//滑块1的鼠标按下事件
slider1.onmousedown=function(e){
    var evt =e||event;
    var x =evt.offsetX;
    var y =evt.offsetY;
    console.log("leftMouseDown");
    //当触发滑块1鼠标按下事件时绑定鼠标移动事件
    document.onmousemove=function(e){
        var evt =e||event;
        //根据鼠标的位置和外层的相对偏移量设置滑块的位置
        slider1.style.left=evt.clientX-slideTool.offsetLeft-x+"px";
        if(evt.clientX-slideTool.offsetLeft-x<=0){
            slider1.style.left="0px";
        }
        if(evt.clientX-slideTool.offsetLeft-x>=300){
            slider1.style.left="300px";
        }
        if(slider1.offsetLeft >= slider2.offsetLeft){
            //slider1.style.left = slider2.style.left;
            slider1.style.left = slider2.offsetLeft - 10 + "px";
        }
        //根据滑块的偏移量计算数值
        var value = Math.floor((slider1.offsetLeft+10)/(300)*(NF_ARRAY[NF_ARRAY.length-1]-NF_ARRAY[0]))+NF_ARRAY[0]-1;
        slideLeft.style.width=slider1.offsetLeft+"px";
        value = value+1;
        if(parseInt(value) < 10){
            value = '0' + value;
        }
        $("#value1").text(value);
        $("#value1").attr("value",value);
        NF1=value;
    }
    //当鼠标按键抬起时解绑鼠标移动事件
    document.onmouseup=function(e){
        var evt =e||event;
        document.onmousemove=null;
    }
}


slider2.onmousedown=function(e){
    var evt =e||event;
    var x =evt.offsetX;
    var y =evt.offsetY;
    document.onmousemove=function(e){
        var evt =e||event;
        slider2.style.left=evt.clientX-slideTool.offsetLeft-x+"px";
        if(evt.clientX-slideTool.offsetLeft-x<=0){
            slider2.style.left="0px";
        }
        if(evt.clientX-slideTool.offsetLeft-x>=300){
            slider2.style.left="300px";
        }
        if(slider2.offsetLeft <= slider1.offsetLeft){
            //slider2.style.left = slider1.style.left;
            slider2.style.left = slider1.offsetLeft + 10 + "px";
        }
        var value = Math.floor((slider2.offsetLeft+10)/(300)*(NF_ARRAY[NF_ARRAY.length-1]-NF_ARRAY[0]))+NF_ARRAY[0]-1;
        slideRight.style.width=slider2.offsetLeft+"px";
        value = value+1 ;
        if(parseInt(value) < 10){
            value = '0' + value;
        }
        $("#value2").text(value);
        $("#value2").attr("value",value);
        NF2=value;
    }
    document.onmouseup=function(){
        document.onmousemove=null;
    }
}


// 网络可视化
const courseSelectorInput = document.getElementById('course-selector-input');
const courseSelectorButton = document.getElementById('course-selector-button');
const courseSelector = document.getElementById('course-selector');

courseSelectorButton.addEventListener('click', () => {
    jQuery.ajax({
        url: "/api/conflict",
        type: "post",
        data: {'kch':courseSelectorInput.value},
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if (data.success)
                ForceGraph(data.data);
            else
                window.alert(data.reason);
        },
        error: function (data) {
            window.alert("查询失败");
        }
    });
})



function ForceGraph({
    nodes, // an iterable of node objects (typically [{id}, …])
    links // an iterable of link objects (typically [{source, target}, …])
  }, {
    nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
    nodeGroup, // given d in nodes, returns an (ordinal) value for color
    nodeGroups, // an array of ordinal values representing the node groups
    nodeTitle, // given d in nodes, a title string
    nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
    nodeStroke = "#fff", // node stroke color
    nodeStrokeWidth = 1.5, // node stroke width, in pixels
    nodeStrokeOpacity = 1, // node stroke opacity
    nodeRadius = 5, // node radius, in pixels
    nodeStrength,
    linkSource = ({source}) => source, // given d in links, returns a node identifier string
    linkTarget = ({target}) => target, // given d in links, returns a node identifier string
    linkStroke = "#999", // link stroke color
    linkStrokeOpacity = 0.6, // link stroke opacity
    linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
    linkStrokeLinecap = "round", // link stroke linecap
    linkStrength,
    colors = d3.schemeTableau10, // an array of color strings, for the node groups
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    invalidation // when this promise resolves, stop the simulation
  } = {}) {
    // Compute values.
    const N = d3.map(nodes, nodeId).map(intern);
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
    const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
    const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);
  
    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
    links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));
  
    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);
  
    // Construct the scales.
    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);
  
    // Construct the forces.
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(links).id(({index: i}) => N[i]);
    if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
    if (linkStrength !== undefined) forceLink.strength(linkStrength);
  
    const simulation = d3.forceSimulation(nodes)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center",  d3.forceCenter())
        .on("tick", ticked);
  
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    const link = svg.append("g")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
        .attr("stroke-linecap", linkStrokeLinecap)
      .selectAll("line")
      .data(links)
      .join("line");
  
    const node = svg.append("g")
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", nodeRadius)
        .call(drag(simulation));
  
    if (W) link.attr("stroke-width", ({index: i}) => W[i]);
    if (L) link.attr("stroke", ({index: i}) => L[i]);
    if (G) node.attr("fill", ({index: i}) => color(G[i]));
    if (T) node.append("title").text(({index: i}) => T[i]);
    if (invalidation != null) invalidation.then(() => simulation.stop());
  
    function intern(value) {
      return value !== null && typeof value === "object" ? value.valueOf() : value;
    }
  
    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
  
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    }
  
    function drag(simulation) {    
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  
    return Object.assign(svg.node(), {scales: {color}});
  }


// 初始化
selchgd();



