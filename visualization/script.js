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
        data: JSON.stringify({college: currentCollege, qsn: Number(currentSemester.split('-')[0]), xq: Number(currentSemester.split('-')[1])}),
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
        data: JSON.stringify({college: currentCollege, qsn: Number(currentSemester.split('-')[0]), xq: Number(currentSemester.split('-')[1])}),
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
        data: JSON.stringify({college: currentCollege, qsn: Number(currentSemester.split('-')[0]), xq: Number(currentSemester.split('-')[1])}),
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





// // Dropdown Selector
// const selectors=document.getElementsByClassName('selector-container');
// console.log(selectors);
// const selectOptionsContainers=[]
// for (let i=0;i<selectors.length;i++){
//     selectOptionsContainers.push(
//         selectors[i].querySelector('.select-options-container')
//     )
// }

// let currentOpenOptionsContainer;

// for (let i=0;i<selectors.length;i++){
//     selectors[i].cache=selectContents[i];
// }

// function initializeSelectorOptions(selectContents){
//     for (i=0;i<selectContents.length;i++){
//         const selectOptions=Object.keys(selectContents[i]);
//         const selectOptionsContainer=selectOptionsContainers[i];
//         selectOptions.forEach(selectOption => {
//             const option=document.createElement('option');
//             option.classList.add('select-options');
//             option.style.value=selectOption;
//             option.innerText=selectContents[i][selectOption];
//             selectOptionsContainer.appendChild(option);
//         });
//     }

// }
// initializeSelectorOptions(selectContents);

// function closeOptions(){
//     currentOpenOptionsContainer.style.display='none';
// }
// function showOptions(){
//     currentOpenOptionsContainer.style.display='inline-block';
// }

// function setSelectedOptionTo(option){
//     currentOpenOptionsContainer.previousElementSibling.innerText=currentOpenOptionsContainer.parentElement.cache[option.style.value];
//     currentOpenOptionsContainer.querySelectorAll('option').forEach(option=>{
//         option.classList.remove('select-option-activated');
//     }
//     )
//     option.classList.add('select-option-activated');
// }

// function selectorHandler1(event){

//     if (event.target.classList.contains('selected')){
//         currentOpenOptionsContainer=event.target.nextElementSibling;
//         showOptions();
//     }
// }
// function selectorHandler2(event){
//     if (event.target===currentOpenOptionsContainer.previousElementSibling){
//         return;
//     } else 
//     if(currentOpenOptionsContainer.contains(event.target)){
//         setSelectedOptionTo(event.target);
//         closeOptions();
//     } else{
//         closeOptions();
//     }
// }

// document.addEventListener('click',selectorHandler2);
// for (let i=0;i<selectors.length;i++){
//     selectors[i].addEventListener('click',selectorHandler1);
// }
// selector.addEventListener('click',selectorHandler1);

