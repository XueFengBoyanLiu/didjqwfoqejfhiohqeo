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
const currentTypes = [];
legends = document.getElementById('legend-of-pie');
function createCheckBox(key, i) {
    var container = document.createElement('div');
    container.style.display = 'inline-block';

    var checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = key;
    checkBox.style.color = colorArray[i];
    checkBox.addEventListener('change', () => {
        if (checkBox.checked) {
            currentTypes.push(key);
        }
        else {
            currentTypes.splice(currentTypes.indexOf(key), 1);
        }
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
var selectBtnState = false;
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
        if (data.success)
            initializeSemesterSelector(data.data);
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

const semesterSelector = document.getElementById('semester-selector');
const schoolSelector = document.getElementById('school-selector');
let currentSemester = "0-0-0";
let currentCollege = "";

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

// 创建学期下拉菜单
function initializeSemesterSelector(selectContents) {
    const selectOptions = Object.keys(selectContents);
    selectOptions.forEach(selectOption => {
        const option = createOption(selectOption, selectContents[selectOption]);
        // console.log(selectContents[selectOption] + selectOption);
        semesterSelector.appendChild(option);
    });
}

// 创建学院下拉菜单
function initializeSchoolSelector(selectContents) {
    const selectOptions = Object.keys(selectContents);
    selectOptions.forEach(selectOption => {
        const option = createOption(selectOption, selectContents[selectOption]);
        schoolSelector.appendChild(option);
    });
}

function selchgd() {
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
    jQuery.ajax({
        url: "/api/get_weektime_distribution",
        type: "post",
        data: JSON.stringify({ college: currentCollege, qsn: Number(currentSemester.split('-')[0]), xq: Number(currentSemester.split('-')[2]) }),
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
            window.alert("update failed");
        }
    });
    jQuery.ajax({
        url: "/api/get_heatmap",
        type: "post",
        data: JSON.stringify({ college: currentCollege, qsn: Number(currentSemester.split('-')[0]), xq: Number(currentSemester.split('-')[2]) }),
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

semesterSelector.addEventListener('change', (event) => { currentSemester = event.target.selectedOptions[0].style.myid; selchgd(); });
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
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(colorArray)

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
    console.log('HIHIHIIH');
    var pathes = document.querySelectorAll('#one-course-type svg path');
    for (let i = 0; i < pathes.length; i++) {
        var path = pathes[i];
        path.style.cursor = 'pointer';
        path.addEventListener('mouseover', (event) => {
            Info = showInfo(Object.keys(data)[i] + ': ' + props[i], event.clientX, event.clientY, colorArray[i], 'white');
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




