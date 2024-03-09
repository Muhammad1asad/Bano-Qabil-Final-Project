// get the data from input field
const UserInput = document.getElementById('user-input');

// get the data from local storage if data is not available in localStorage then  it create a blank Array
let getPrevData = JSON.parse(localStorage.getItem('MyList')) || [] ;

let selectAll = document.querySelector('.Select-all input');
let selectAllcontainer = document.getElementById('select-all-container');

// function to Add data into local storage 
const addItem = () => {

    //create a unique id
    let id = getPrevData.length > 0 ? getPrevData[0].id + 1 : 0;

    if(!UserInput.value){
        alert("Please enter Any Item");
        return
    }    
    // create a new Object to store data 
    let myObj = {
        id: id,
        item: UserInput.value,
        ifChecked: false,
    }
    //if the data fetch succeeded then it push the data to object with first index
    getPrevData.unshift(myObj);

    // set the data in local storage
    localStorage.setItem('MyList', JSON.stringify(getPrevData));
    showData('all');
    UserInput.value='';
}

// Show data function

const showData = (filterData) => {

    let ul = document.querySelector('.listdiv ul');
    ul.innerHTML = '';

    //for last 3 btns   
    let displayData = getPrevData;
    let totalData = getPrevData.length;
    let checkedData = getPrevData.filter(item => item.ifChecked);
    let unCheckedData = getPrevData.filter(item => !item.ifChecked);
    let buttons = document.querySelectorAll('.btn-div button');

    // console.log(originalData);
    if(filterData == 'purchased'){
        displayData = checkedData;
    }
    
    if(filterData == 'remaining'){
        displayData = unCheckedData;
    }
    
    if(displayData && displayData.length > 0){
    displayData.forEach((item) => {
        let newLi = document.createElement('li');
        let newCheckbox = document.createElement('input');
        
        newCheckbox.type = 'checkbox';
        if(item.ifChecked == true){
            newCheckbox.checked = true;
        }
        newCheckbox.value = item.id;
        newCheckbox.onclick = () => {
            let dataArray = getPrevData;
            let checkId = newCheckbox.value;
            let foundData = dataArray.find(item => item.id == checkId);
            
            if(foundData.ifChecked == true){
                foundData.ifChecked = false;
            }else{
                foundData.ifChecked = true;
            }
            localStorage.setItem('MyList', JSON.stringify(dataArray));
            showData('all');
        }
        newLi.appendChild(newCheckbox);
        
        let newSpan = document.createElement('span');
        newSpan.innerHTML = item.item;
        if(item.ifChecked == true){
            newSpan.style.color = 'gray';
            newSpan.style.textDecoration = 'line-through';
        }
        newLi.appendChild(newSpan);

        let dltBtn = document.createElement('button');
        dltBtn.innerHTML = 'Delete';
        dltBtn.onclick = function() {
            displayData.forEach((el,index) => {
                if(el.id === item.id){
                    displayData.splice(index, 1);
                    localStorage.setItem('MyList', JSON.stringify(displayData));
                    showData('all');
                }
            })
        }
        newLi.appendChild(dltBtn);

        ul.appendChild(newLi);
    });
    }
    else{
        let noDatafound = document.createElement('p');
        noDatafound.innerHTML = 'No Records Available';
        ul.appendChild(noDatafound);
    }

    //Show the data in dynamically in last 3 button
    buttons[0].innerHTML = `Total Item ${totalData}`
    buttons[1].innerHTML = `Prchased Item ${checkedData.length}`
    buttons[2].innerHTML = `Remaining Item ${totalData - checkedData.length}`


    //select all logic
    selectAllcontainer.style.display = getPrevData.length > 0 ? 'flex' : 'none';
    selectAll.checked = getPrevData.length > 0 && getPrevData.every(item => item.ifChecked)
    selectAll.onclick = () => {
        const selectAllStatus = selectAll.checked;
        getPrevData.forEach(item => item.ifChecked = selectAllStatus);
        localStorage.setItem('MyList', JSON.stringify(getPrevData));
        showData('all');
    };

}

showData('all');

//Delete All Records
const deleteAllrecords = () => {
    localStorage.clear('MyList');   
    getPrevData = [];
    showData('all');
}

//Delete deleteCheckedRecords
const deleteCheckedRecords = () => {
    let checkedItem = getPrevData.some(item => item.ifChecked);
    if(!checkedItem){
        alert('Please select atleast one item to delete');
        return
    }
    let unCheckedData = getPrevData.filter(item => !item.ifChecked);
    localStorage.setItem("MyList", JSON.stringify(unCheckedData));
    getPrevData = unCheckedData;
    showData('all');
}


