const colorArray=["rgb(13, 211, 82)","rgb(22, 218, 224)","rgb(224, 134, 60)","rgb(243, 121, 137)","rgb(244, 67, 54)","rgb(255, 193, 7)","rgb(96, 125, 139)","rgb(0, 188, 212)","rgb(103, 58, 183)","rgb(233, 30, 99)","rgb(255, 152, 0)","rgb(3, 169, 244)"];

//import jQuery from "jquery";

let data;
function loadData(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // console.log(this.responseText);
        data=JSON.parse(this.responseText);
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
        if (data.success)
            initializeSemesterSelector(data.data);
        else
            window.alert(data.reason);
    },
    error: function (data){
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

const semesterSelector=document.getElementById('semester-selector');
const schoolSelector=document.getElementById('school-selector');
let currentSemester = "0-0-0";
let currentCollege = "";

function firstGraph(dataset) {
    for (let i of document.getElementById("one-tendency").children) {
        i.remove()
    }
    // 定义画布大小和间距
    var padding = 40;
    var svgWidth = 600;
    var svgHeight = 400;

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
        .style('border', '1px solid #999999')


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


function createOption(id,name){
    const option=document.createElement('option');
    option.classList.add('select-options');
    option.style.myid=id;
    option.innerText=name;
    return option;
}

// 创建学期下拉菜单
function initializeSemesterSelector(selectContents){
    const selectOptions=Object.keys(selectContents);
    selectOptions.forEach(selectOption => {
        const option=createOption(selectOption,selectContents[selectOption]);
        // console.log(selectContents[selectOption] + selectOption);
        semesterSelector.appendChild(option);
    });
}

// 创建学院下拉菜单
function initializeSchoolSelector(selectContents){
    const selectOptions=Object.keys(selectContents);
    selectOptions.forEach(selectOption => {
        const option=createOption(selectOption,selectContents[selectOption]);
        schoolSelector.appendChild(option);
    });
}

function selchgd(){
    jQuery.ajax({
        url: "/api/get_trend",
        type: "post",
        data: JSON.stringify({college: currentCollege}),
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
    jQuery.ajax({
        url: "/api/get_typed_courses",
        type: "post",
        data: JSON.stringify({college: currentCollege, qsn: Number(currentSemester.split('-')[0]), xq: Number(currentSemester.split('-')[2])}),
        dataType: "json",
        contentType: "application/json",
        success: (data) => {
            if (data.success)
            secondGraph(data.data);
            else
            window.alert(data.reason);
        },
        error: (data) => {
            window.alert("update failed");
        }
    });
    jQuery.ajax({
        url: "/api/get_weektime_distribution",
        type: "post",
        data: JSON.stringify({college: currentCollege, qsn: Number(currentSemester.split('-')[0]), xq: Number(currentSemester.split('-')[2])}),
        dataType: "json",
        contentType: "application/json",
        success: (data) => {
            if (data.success)
            thirdGraph();
            else
            window.alert(data.reason);
        },
        error: (data) => {
            window.alert("update failed");
        }
    });
    jQuery.ajax({
        url: "/api/get_heatmap",
        type: "post",
        data: JSON.stringify({college: currentCollege, qsn: Number(currentSemester.split('-')[0]), xq: Number(currentSemester.split('-')[2])}),
        dataType: "json",
        contentType: "application/json",
        success: (data) => {
            if (data.success)
            fourthGraph(data.data);
            else
            window.alert(data.reason);
        },
        error: (data) => {
            window.alert("update failed");
        }
    });
};

semesterSelector.addEventListener('change', (event) => {currentSemester=event.target.selectedOptions[0].style.myid;selchgd();});
schoolSelector.addEventListener('change', (event) => {currentCollege=event.target.selectedOptions[0].style.myid;selchgd();});






const class1=document.getElementById('one');
const class2=document.getElementById('two');

const swfunc1=()=>{
    class2.style.display='none';

    class1.style.display='grid';
};
const swfunc2=()=>{
    class1.style.display='none';

    class2.style.display='grid';
};






// 第二个派图
// set the dimensions and margins of the graph
function secondGraph(data){
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
var color = d3.scaleOrdinal()
  .domain(data)
  .range(colorArray)

// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {return d.value; })
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
  .attr('fill', function(d){ return(color(d.data.key)) })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)
}





// 第四个 热力图
    // set the dimensions and margins of the graph

function fourthGraph(heatMapData){
    for (let i of document.getElementById("one-course-dis").children) {
        i.remove()
    }
    var margin = {top: 30, right: 30, bottom: 30, left: 90},
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
    var myVars = ["第一节", "第二节", "第三节", "第四节", "第五节", "第六节", "第七节", "第八节", "第九节", "第十节","第十一节","第十二节"].reverse()
    


    // Build X scales and axis:
    var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(myGroups)
      .padding(0.01);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    
    // Build X scales and axis:
    var y = d3.scaleBand()
      .range([ height, 0 ])
      .domain(myVars)
      .padding(0.01);
    svg.append("g")
      .call(d3.axisLeft(y));
    
    // Build color scale
    

    var myColor = d3.scaleLinear()
      .range(["white", "crimson"])
      .domain([0,d3.max(heatMapData, function(d) { return d.value; })])
    
    svg.selectAll()
        .data(heatMapData, function(d) {return d.group+':'+d.variable;})
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.group) })
        .attr("y", function(d) { return y(d.variable) })
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { return myColor(d.value)} )
}





