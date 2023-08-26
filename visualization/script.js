const is_debugging = false;

var NF_ARRAY;
var NF1 = 12;
var NF2 = 23;
var XQ = [1, 2];
var NF;
var currentCollege = "00001";


const colorArray = ['rgb(122,40,204)', 'rgb(70,40,204)', 'rgb(40,86,204)', 'rgb(40,142,204)', 'rgb(40,180,204)', 'rgb(40,204,191)', 'rgb(40,204,153)', 'rgb(40,204,106)', 'rgb(51,204,40)', 'rgb(153,204,40)', 'rgb(204,156,40)', 'rgb(204,111,40)', 'rgb(204,84,40)', 'rgb(204,60,40)', 'rgb(204,40,40)'];
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
var currentTypes = JSON.parse (JSON.stringify (typeArray));
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
        selchgd();
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
//     label.style.color=colorArray[i]course;
//     label.fontSize='10px';
//     legends.appendChild(label);
// }
for (let i = 0; i < typeArray.length; i++) {
    createCheckBox(typeArray[i], i);
}

refreshBtn=document.getElementById('refresh')
refreshBtn.addEventListener('click',()=>{selchgd()})
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
        currentTypes = JSON.parse (JSON.stringify (typeArray));
    }
    selchgd()
})
// for (let i = 0; i < typeArray.length; i++) {
//     checkBoxArray.push(document.getElementById(typeArray[i]));
// }



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
        if (data.success) {
            // data.data=={NF:[12,13,...,23]};
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


const schoolSelector = document.getElementById('school-selector');



function createOption(id, name) {
    const option = document.createElement('option');
    option.classList.add('select-options');
    option.style.myid = id;
    option.innerText = name;
    return option;
}




// 年份初始化
function initialize_NF(semester_json) {
    NF_ARRAY = semester_json['NF'];
    NF1 = NF_ARRAY[0];
    NF2 = NF_ARRAY[NF_ARRAY.length - 1];
}

// 创建学院下拉菜单
function initializeSchoolSelector(selectContents) {
    const selectOptions = Object.keys(selectContents);
    selectOptions.forEach(selectOption => {
        const option = createOption(selectOption, selectContents[selectOption]);
        schoolSelector.appendChild(option);
    });
}

//学期CheckBox
const xq1el = document.getElementById('xq1');
const xq2el = document.getElementById('xq2');
const xq3el = document.getElementById('xq3');
xq1el.checked = true;
xq2el.checked = true;
xq3el.checked = false;

// 学期checkbox侦听
function xq_refresh() {
    XQ = []
    if (xq1el.checked)
        XQ.push(1)
    if (xq2el.checked)
        XQ.push(2)
    if (xq3el.checked)
        XQ.push(3)
}
xq1el.addEventListener('input', (event) => { xq_refresh(); })
xq2el.addEventListener('input', (event) => { xq_refresh(); })
xq3el.addEventListener('input', (event) => { xq_refresh(); })

// 学院侦听
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



// 构建年份双滑块
var slider1 = document.getElementById("slider1");
var slider2 = document.getElementById("slider2");
var slideTool = document.getElementById("slideTool");
var slideLeft = document.getElementById("slideLeft");
var slideRight = document.getElementById("slideRight");
var P1 = document.getElementById("p1");
// 滑块1的鼠标按下事件
slider1.onmousedown = function (e) {
    var evt = e || event;
    var x = evt.offsetX;
    var y = evt.offsetY;
    console.log("leftMouseDown");
    // 当触发滑块1鼠标按下事件时绑定鼠标移动事件
    document.onmousemove = function (e) {
        var evt = e || event;
        // 根据鼠标的位置和外层的相对偏移量设置滑块的位置
        slider1.style.left = evt.clientX - slideTool.offsetLeft - x + "px";
        if (evt.clientX - slideTool.offsetLeft - x <= 0) {
            slider1.style.left = "0px";
        }
        if (evt.clientX - slideTool.offsetLeft - x >= 300) {
            slider1.style.left = "300px";
        }
        if (slider1.offsetLeft >= slider2.offsetLeft) {
            //slider1.style.left = slider2.style.left;
            slider1.style.left = slider2.offsetLeft - 10 + "px";
        }
        // 根据滑块的偏移量计算数值
        var value = Math.floor((slider1.offsetLeft + 10) / (300) * (NF_ARRAY[NF_ARRAY.length - 1] - NF_ARRAY[0])) + NF_ARRAY[0] - 1;
        slideLeft.style.width = slider1.offsetLeft + "px";
        value = value + 1;
        if (parseInt(value) < 10) {
            value = '0' + value;
        }
        $("#value1").text(value);
        $("#value1").attr("value", value);
        NF1 = value;
    }
    // 当鼠标按键抬起时解绑鼠标移动事件
    document.onmouseup = function (e) {
        var evt = e || event;
        document.onmousemove = null;
    }
}

slider2.onmousedown = function (e) {
    var evt = e || event;
    var x = evt.offsetX;
    var y = evt.offsetY;
    document.onmousemove = function (e) {
        var evt = e || event;
        slider2.style.left = evt.clientX - slideTool.offsetLeft - x + "px";
        if (evt.clientX - slideTool.offsetLeft - x <= 0) {
            slider2.style.left = "0px";
        }
        if (evt.clientX - slideTool.offsetLeft - x >= 300) {
            slider2.style.left = "300px";
        }
        if (slider2.offsetLeft <= slider1.offsetLeft) {
            //slider2.style.left = slider1.style.left;
            slider2.style.left = slider1.offsetLeft + 10 + "px";
        }
        var value = Math.floor((slider2.offsetLeft + 10) / (300) * (NF_ARRAY[NF_ARRAY.length - 1] - NF_ARRAY[0])) + NF_ARRAY[0] - 1;
        slideRight.style.width = slider2.offsetLeft + "px";
        value = value + 1;
        if (parseInt(value) < 10) {
            value = '0' + value;
        }
        $("#value2").text(value);
        $("#value2").attr("value", value);
        NF2 = value;
    }
    document.onmouseup = function () {
        document.onmousemove = null;
    }
}

// 总课程数
const totalCourseNumber = document.getElementById('total-course-number');

// 网络可视化
const courseSelectorInput = document.getElementById('course-selector-input');
const courseSelectorButton = document.getElementById('course-selector-button');
const courseSelector = document.getElementById('course-selector');

var kch;
courseSelectorButton.addEventListener('click', () => {
    kch=courseSelectorInput.value;
    jQuery.ajax({
        url: "/api/conflict",
        type: "post",
        data: JSON.stringify({ 'kch':  kch}),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if (data.success){
                console.log(data.data);
                ForceGraph(data.data);
                }
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
    linkSource = ({ source }) => source, // given d in links, returns a node identifier string
    linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
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
    nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
    links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

    // Construct the scales.
    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

    // Construct the forces.
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);
    if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
    if (linkStrength !== undefined) forceLink.strength(linkStrength);

    const simulation = d3.forceSimulation(nodes)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center", d3.forceCenter())
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

    if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
    if (L) link.attr("stroke", ({ index: i }) => L[i]);
    if (G) node.attr("fill", ({ index: i }) => color(G[i]));
    if (T) node.append("title").text(({ index: i }) => T[i]);
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

    return Object.assign(svg.node(), { scales: { color } });
}



// 调用script_selchg.js
function selchgd() {
    var readyTypes = []
    for (let i = 0; i < currentTypes.length; i++) {
        readyTypes.push(typeObject[currentTypes[i]])
    }
    seljs = JSON.stringify({ college: currentCollege, nf: [NF1, NF2], xq: XQ, types: readyTypes });
    if (is_debugging)
        window.alert(seljs);
    post_selchgd(seljs);
}


// 初始化

selchgd();


