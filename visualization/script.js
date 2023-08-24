const selectContents=[
    {
    'Math': '数学',
    'Physics':'物理',
    'Computer Science':'信科',
    },
    {
    '2022qiu':'2022秋',
    '2022chun':'2022春',
    }
]





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





// Dropdown Selector
const selectors=document.getElementsByClassName('selector-container');
console.log(selectors);
const selectOptionsContainers=[]
for (let i=0;i<selectors.length;i++){
    selectOptionsContainers.push(
        selectors[i].querySelector('.select-options-container')
    )
}

let currentOpenOptionsContainer;

for (let i=0;i<selectors.length;i++){
    selectors[i].cache=selectContents[i];
}

function initializeSelectorOptions(selectContents){
    for (i=0;i<selectContents.length;i++){
        const selectOptions=Object.keys(selectContents[i]);
        const selectOptionsContainer=selectOptionsContainers[i];
        selectOptions.forEach(selectOption => {
            const option=document.createElement('option');
            option.classList.add('select-options');
            option.style.value=selectOption;
            option.innerText=selectContents[i][selectOption];
            selectOptionsContainer.appendChild(option);
        });
    }

}
initializeSelectorOptions(selectContents);

function closeOptions(){
    currentOpenOptionsContainer.style.display='none';
}
function showOptions(){
    currentOpenOptionsContainer.style.display='inline-block';
}

function setSelectedOptionTo(option){
    currentOpenOptionsContainer.previousElementSibling.innerText=currentOpenOptionsContainer.parentElement.cache[option.style.value];
    currentOpenOptionsContainer.querySelectorAll('option').forEach(option=>{
        option.classList.remove('select-option-activated');
    }
    )
    option.classList.add('select-option-activated');
}

function selectorHandler1(event){

    if (event.target.classList.contains('selected')){
        currentOpenOptionsContainer=event.target.nextElementSibling;
        showOptions();
    }
}
function selectorHandler2(event){
    if (event.target===currentOpenOptionsContainer.previousElementSibling){
        return;
    } else 
    if(currentOpenOptionsContainer.contains(event.target)){
        setSelectedOptionTo(event.target);
        closeOptions();
    } else{
        closeOptions();
    }
}

document.addEventListener('click',selectorHandler2);
for (let i=0;i<selectors.length;i++){
    selectors[i].addEventListener('click',selectorHandler1);
}
selector.addEventListener('click',selectorHandler1);

