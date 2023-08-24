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
let currentSemester = "0-0";
let currentCollege = "";


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
        console.log(selectContents[selectOption] + selectOption);
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
                firstGraph();
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
            secondGraph();
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
            fourthGraph();
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











// 第四个 热力图
    // set the dimensions and margins of the graph

function fourthGraph(heatMapData){
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
    var myVars = ["第一节", "第二节", "第三节", "第四节", "第五节", "第六节", "第七节", "第八节", "第九节", "第十节","第十一节","第十二节"]
    


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

