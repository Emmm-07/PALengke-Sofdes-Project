const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

/*-----------------------------------------------LOGIN ----------------------------------------*/
function login(){
    var username = document.getElementById('username');
    var password = document.getElementById('password');

    axios.post('/verify_account/',{
        username:username.value,
        password:password.value
    },{
        headers:{
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response=>{
        if(response.data.success){
            location.href = '/database'
        }else{
            var errorMsg = document.getElementById('error-msg');
            errorMsg.style.display = 'block';
            username.style.border = "2px solid red";
            password.style.border = "2px solid red";
        }
    }).catch(error=>{
        alert(error);
    })

}






/*--------------------------------------ITEM MANAGEMENT / DATABASE ----------------------------------*/
/*  ADD ITEM    */

var confirm = document.getElementById("add_confirm");
confirm.addEventListener('click',function(event){
    var itemName = document.getElementById('item-name').value;
    var itemCateg = document.getElementById('item-category').value;
    var store = document.getElementById('store').value;
    var itemPrice = document.getElementById('item-price').value;
    var per = document.getElementById('per').value;

    var imageUpload = document.getElementById('imageUpload');
    const imageFile = imageUpload.files[0];

    console.log(itemName)
    console.log(itemCateg)
    console.log(store)
    console.log(itemPrice)
    console.log(per)
    console.log(imageFile)

    if(itemName==""||itemCateg==""||store==""||itemPrice==""||per==""||!(imageFile)){
        alert("All fields must be filled");
        return;
    }

    const formData = new FormData();
    formData.append('itemName',itemName);
    formData.append('itemCateg',itemCateg);
    formData.append('store',store);
    formData.append('itemPrice',itemPrice);
    formData.append('per',per);
    formData.append('imageFile',imageFile);

    axios.post('/database/add_item/',
        formData
    ,{
        headers:{
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response=>{
        if(response.data.success){
            location.href = '/database'

        }else{
            console.log("THERE'S AN ERROR")
        }       
    }).catch(error=>{
        alert(error);
    });    
})

var imageUpload = document.getElementById('imageUpload');
var uploadBtn= document.getElementById('upload-btn')
imageUpload.addEventListener('change',(event)=>{
    const imageFile = event.target.files[0];
    if(imageFile){
        uploadBtn.style.backgroundColor = '#333';
        uploadBtn.textContent = "Image selected";
        uploadBtn.style.color = "white"
    }
})

/*  EDIT ITEM    */
let isListenerAdded = false;
function editPrice(){
    var checkrows = document.querySelectorAll('#market-table .select-radio:checked');
    checkrows.forEach(radio=>{
        var row = radio.closest('tr');
        var cells =row.querySelectorAll('td');
        var checkedId = cells[1].textContent.trim();
        var showItemId = document.getElementById('e-item-id');
        showItemId.textContent = "Item ID: "+ checkedId;

        if(!isListenerAdded){
            let confirm = document.getElementById('edit_confirm');
            confirm.addEventListener('click',(event)=>{
             
                var newPrice = document.getElementById('new-price').value;
                console.log(showItemId.textContent)
                console.log(newPrice)   
                axios.post('/database/edit_item/',{
                    newPrice:newPrice,
                    itemId:checkedId
                },{
                    headers:{
                        'X-CSRFToken':csrfToken,
                        'Content-Type':'application/x-www-form-urlencoded'
                    }
                }).then(response=>{
                    // location.href = '/database';
                }).catch(error=>{
                    alert(error);
                })
            })
            isListenerAdded = true;
        }
    })

}


/*  DELETE ITEM    */
let isListenerAdded2 = false;
function deleteItem(){
    var checkrows = document.querySelectorAll('#market-table .select-radio:checked');
    checkrows.forEach(radio=>{
        var row = radio.closest('tr');
        var cells =row.querySelectorAll('td');
        var checkedId = cells[1].textContent.trim();
        var showItemId = document.getElementById('d-item-id');
        showItemId.textContent = "Item ID: "+ checkedId;

        if(!isListenerAdded2){
            let confirm = document.getElementById('delete_confirm');
            confirm.addEventListener('click',(event)=>{
             
                axios.post('/database/delete_item/',{
                    itemId:checkedId
                },{
                    headers:{
                        'X-CSRFToken':csrfToken,
                        'Content-Type':'application/x-www-form-urlencoded'
                    }
                }).then(response=>{
                    location.href = '/database';
                }).catch(error=>{
                    alert(error);
                })
            })
            isListenerAdded2 = true;
        }
    })

}



/*  FILTER TABLE    */
var filterBtn = document.getElementById('filter-button');
filterBtn.addEventListener('click',(event)=>{
    var storeName = document.getElementById('store-select').value;
    console.log("Here in filter")
    console.log(storeName)
    axios.post('/database/filter_table/',{
        storeName:storeName
    },{
        headers:{   
            'X-CSRFToken':csrfToken,
            'Content-Type':'application/x-www-form-urlencoded'
        }
    }).then(response=>{
        location.href ='/database'
    }).catch(error=>{
        alert(error);
    })
})



/*  POPUP IMAGE   */
document.querySelectorAll('#market-table tr').forEach((row, rowIndex) => {
    let lastCellIndex = row.cells.length - 1;
    let lastCell = row.cells[lastCellIndex];
    console.log(lastCell.textContent)
    lastCell.addEventListener('click', function() {
        // Example: Change the value to 'X' when clicked
        // setLastColumnValue(rowIndex + 1, 'X');
        console.log("clicked")
        var imgCell = lastCell.querySelector('a').querySelector('img');
        console.log(imgCell);
        console.log(row.cells[1]);

        var imagePath = imgCell.src;

        var popupImg = document.getElementById("popup-img");
        popupImg.src = imagePath
        console.log(imagePath)
    });
});



/*-----------------------------------------------MENU------ ----------------------------------------*/
/*--------SEARCH WITH AUTOCOMPLETE-----*/
//https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_autocomplete


function searching(itemsList){
    const searchInput = document.getElementById('search');
    const suggestionsList = document.getElementById('suggestions');

    // Data for suggestions
    var suggestions = JSON.parse(itemsList)
    console.log(suggestions)
    // suggestions = [
    //     'Apple', 'Banana', 'Cherry', 'Date', 'Fig', 'Grape', 'Honeydew','Appacus'
    // ];

    searchInput.addEventListener('input', () => {
        console.log("Inputting");
        const query = searchInput.value.toLowerCase();
        suggestionsList.innerHTML = '';
        
        if (query.length === 0) {
            suggestionsList.style.display = 'none';
            return;
        }
        
        const filteredSuggestions = suggestions.filter(item => item.toLowerCase().startsWith(query));
        console.log(filteredSuggestions);

        filteredSuggestions.forEach(item => {
            const listItem = document.createElement('li');
        //  listItem.textContent = item;
        listItem.innerHTML = "<strong>"+item.substring(0,query.length)+"</strong>"+item.substring(query.length,item.length);
            listItem.addEventListener('click', () => {
                searchInput.value = item;
                suggestionsList.style.display = 'none';
            });
            suggestionsList.appendChild(listItem);
        });
        
        suggestionsList.style.display = filteredSuggestions.length > 0 ? 'block' : 'none';
    });

}





























// async function uploadFile() {

//     var csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
//     const fileInput = document.getElementById('fileInput');
//     const file = fileInput.files[0];

//     if (!file) {
//         alert("Please select a file.");
//         return;
//     }

//     const formData = new FormData();
//     formData.append('image', file);

//     await axios.post('/upload/',
//        formData
//     ,{
//         headers:{
//             'X-CSRFToken': csrfToken,
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     }).then(response=>{
//         alert("DONE");

//     }).catch(error=>{
//         alert(error);
//     });

   
// }





// try {
//     const response = await fetch('/upload/', {
//         method: 'POST',
//         body: formData,
//         headers: {
//             'X-CSRFToken': getCookie('csrftoken')  // Add your CSRF token handling here
//         }
//     });

//     if (response.ok) {
//         const data = await response.json();
//         alert("File uploaded successfully!");
//     } else {
//         alert("Failed to upload file.");
//     }
// } catch (error) {
//     console.error("Error:", error);
//     alert("An error occurred while uploading the file.");
// }



// function getCookie(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }