
const class1=document.getElementById('one');
const class2=document.getElementById('two');
const class3=document.getElementById('three');

const swfunc1=()=>{
    class2.style.display='none';
    class3.style.display='none';

    class1.style.display='grid';
};
const swfunc2=()=>{
    class1.style.display='none';
    class3.style.display='none';

    class2.style.display='grid';
};
const swfunc3=()=>{
    class1.style.display='none';
    class2.style.display='none';

    class3.style.display='grid';
};


// Dropdown Selector
const selector=document.getElementsByClassName('one-selector-container')[0];
const selectOptionsContainer=selector.querySelector('.select-options-container');
let currentOpenOptionsContainer;

selectOptionsOne=['Total','SMS','SOP']
selectContents={
    'Total': '全部',
    'SMS': '数学科学学院',
    'SOP':'物理学院',
}

function initializeSelectorOptions(selectOptionsOne){
    selectOptionsOne.forEach(selectOption => {
        const option=document.createElement('option');
        option.classList.add('select-options');
        option.style.value=selectOption;
        option.innerText=selectContents[selectOption];
        selectOptionsContainer.appendChild(option);
    });
}
initializeSelectorOptions(selectOptionsOne);

function closeOptions(){
    currentOpenOptionsContainer.style.display='none';
}
function showOptions(){
    currentOpenOptionsContainer.style.display='flex';
}

function setSelectedOptionTo(option){
    currentOpenOptionsContainer=option.parentElement;
    currentOpenOptionsContainer.previousElementSibling.innerText=selectContents[option.style.value];
    currentOpenOptionsContainer.querySelectorAll('option').forEach(option=>{
        option.classList.remove('select-option-activated');
    })
    option.classList.add('select-option-activated');
}

function selectorHandler1 (event){

    if (event.target.classList.contains('selected')){
        currentOpenOptionsContainer=event.target.nextElementSibling;
        showOptions();
    }
}
function selectorHandler2(event){
    if (event.target===currentOpenOptionsContainer.previousElementSibling){
        return;
    } else if(currentOpenOptionsContainer.contains(event.target)){
        setSelectedOptionTo(event.target);
        closeOptions();
    } else{
        closeOptions();
    }
}

selector.addEventListener('click',selectorHandler1);
document.addEventListener('click',selectorHandler2);

