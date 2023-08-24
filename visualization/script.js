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

const selectContents=[
    {'所有学院': '所有学院',
    '物理学院': '物理学院',
    '体育教研部': '体育教研部',
    '城市与环境学院': '城市与环境学院',
    '新闻与传播学院': '新闻与传播学院',
    '艺术学院': '艺术学院',
    '国际关系学院': '国际关系学院',
    '信息科学技术学院': '信息科学技术学院',
    '中国语言文学系': '中国语言文学系',
    '化学与分子工程学院': '化学与分子工程学院',
    '外国语学院': '外国语学院',
    '马克思主义学院': '马克思主义学院',
    '生命科学学院': '生命科学学院',
    '经济学院': '经济学院',
    '政府管理学院': '政府管理学院',
    '历史学系': '历史学系',
    '法学院': '法学院',
    '数学科学学院': '数学科学学院',
    '考古文博学院': '考古文博学院',
    '学生工作部人民武装部': '学生工作部人民武装部',
    '地球与空间科学学院': '地球与空间科学学院',
    '光华管理学院': '光华管理学院',
    '元培学院': '元培学院',
    '国家发展研究院': '国家发展研究院',
    '哲学系': '哲学系',
    '心理学系': '心理学系',
    '环境科学与工程学院': '环境科学与工程学院',
    '工学院': '工学院',
    '社会学系': '社会学系',
    '医学部教学办': '医学部教学办',
    '教育学院': '教育学院',
    '产业技术研究院': '产业技术研究院',
    '英语语言文学系': '英语语言文学系',
    '信息管理系': '信息管理系',
    '歌剧研究院': '歌剧研究院',
    '北京大学教务部': '北京大学教务部',
    '北京大学中国社会科学调查中心': '北京大学中国社会科学调查中心',
    '环境学院': '环境学院',
    '软件与微电子学院': '软件与微电子学院',
    '心理与认知科学学院': '心理与认知科学学院',
    '人口研究所': '人口研究所',
    '北京大学现代农学院（筹）': '北京大学现代农学院（筹）',
    '现代农学院（筹）': '现代农学院（筹）',
    '建筑与景观设计学院': '建筑与景观设计学院',
    '教务部': '教务部',
    '对外汉语教育学院': '对外汉语教育学院',
    '现代农学院': '现代农学院',
    '中国社会科学调查中心': '中国社会科学调查中心',
    '中国共产主义青年团北京大学委员会': '中国共产主义青年团北京大学委员会',
    '创新创业学院': '创新创业学院',
    '前沿交叉学科研究院': '前沿交叉学科研究院',
    '人工智能研究院': '人工智能研究院',
    '材料科学与工程学院': '材料科学与工程学院',
    '汇丰商学院': '汇丰商学院'},
    {'all': '所有学期',
    '(12,2)': '2012 春',
    '(12,3)': '2012 夏',
    '(13,1)': '2013 秋',
    '(13,2)': '2013 春',
    '(13,3)': '2013 夏',
    '(14,1)': '2014 秋',
    '(14,2)': '2014 春',
    '(14,3)': '2014 夏',
    '(15,1)': '2015 秋',
    '(15,2)': '2015 春',
    '(15,3)': '2015 夏',
    '(16,1)': '2016 秋',
    '(16,2)': '2016 春',
    '(16,3)': '2016 夏',
    '(17,1)': '2017 秋',
    '(17,2)': '2017 春',
    '(17,3)': '2017 夏',
    '(18,1)': '2018 秋',
    '(18,2)': '2018 春',
    '(18,3)': '2018 夏',
    '(19,1)': '2019 秋',
    '(19,2)': '2019 春',
    '(19,3)': '2019 夏',
    '(20,1)': '2020 秋',
    '(20,2)': '2020 春',
    '(20,3)': '2020 夏',
    '(21,1)': '2021 秋',
    '(21,2)': '2021 春',
    '(21,3)': '2021 夏',
    '(22,1)': '2022 秋',
    '(22,2)': '2022 春',
    '(22,3)': '2022 夏',
    '(23,1)': '2023 秋'}
]


const semesterSelector=document.getElementById('semester-selector');
const schoolSelector=document.getElementById('school-selector');
let currentSemester;
let currentSchool;


function createOption(id,name){
    const option=document.createElement('option');
    option.classList.add('select-options');
    option.style.value=id;
    option.innerText=name;
    return option;
}

// 创建学期下拉菜单
function initializeSemesterSelector(selectContents){
    const selectOptions=Object.keys(selectContents);
    selectOptions.forEach(selectOption => {
        const option=createOption(selectOption,selectContents[selectOption]);
        semesterSelector.appendChild(option);
    });
}
initializeSemesterSelector(selectContents[1]);
// 创建学院下拉菜单
function initializeSchoolSelector(selectContents){
    const selectOptions=Object.keys(selectContents);
    selectOptions.forEach(selectOption => {
        const option=createOption(selectOption,selectContents[selectOption]);
        schoolSelector.appendChild(option);
    });
}
initializeSchoolSelector(selectContents[0]);


function changeData(currentSemester,currentSchool){
    firstGraph();
    secondGraph();
    thirdGraph();
    fourthGraph();
}

semesterSelector.addEventListener('change',function(event){
    currentSemester=event.target.value;
    changeData(currentSemester,currentSchool);
});
schoolSelector.addEventListener('change',function(event){
    currentSchool=event.target.value;
    changeData(currentSemester,currentSchool);
});






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

