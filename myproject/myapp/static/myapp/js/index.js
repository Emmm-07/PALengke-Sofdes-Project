/*
When using multiple javascript parts in 1 file, use try{}catch(e){}
for every part to ensure that the preceding part does not obstruct the succeeding parts in executing


try{
    function part1(){}
}catch(e){
    //pass
}

try{
    function part2(){}
}catch(e){
    //pass
}

*/



const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

try{

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

 
//   var modal = document.getElementById('f_modal')
//   var closePopup = document.getElementsByClassName('f_modal__close')[0];
//   var videoFeed = document.getElementById('video-feed')
 

//   var videoFeedPath = 'http://127.0.0.1:8000/video_feed/'

//   // When the user clicks on .c_modal__close / (x), close the modal

//   closePopup.addEventListener('click',(event)=>{
//       modal.style.display = 'none';
//       console.log("Has been clicked")
//       console.log(videoFeed.src)
//   });
    

}catch(e){
    console.log("Error in login()")
    console.log(e)
    //pass
}


//This is testing for face recognition
function faceRecognition(){
    var modal = document.getElementById('f_modal');
    let = document.getElementById('faceRecogBtn');
    var videoFeed = document.getElementById('video-feed');
    var videoFeedPath = 'http://127.0.0.1:8000/video_feed/';

    videoFeed.src = videoFeedPath;
    modal.style.display = 'block';

    // axios.post('/video_feed/',{
    // },{
    //     headers:{
    //         'X-CSRFToken': csrfToken,
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     }
    // }).then(response=>{
    //     alert(response.data.message)
    // }).catch(error=>{
    //     alert(error);
    // })

    axios.post('/start_camera/',{
    },{
        headers:{
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response=>{
        // alert(response.data.message)
        pollRecognitionStatus();
    }).catch(error=>{
        alert(error);
    })
}

function stopCamera(){
    var modal = document.getElementById('f_modal');
    var videoFeed = document.getElementById('video-feed');
    
    videoFeed.src=""
    modal.style.display = 'none';

    axios.post('/stop_camera/',{
    },{
        headers:{
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response=>{
        // alert(response.data.message)
    }).catch(error=>{
        alert(error);
    })

}

function pollRecognitionStatus(){

    axios.post('/face_recog/',{
    },{
        headers:{
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response=>{
        // alert(response.data.message)
        if(response.data.status=='success'){
            location.href = '/database'
        }else{
            setTimeout(pollRecognitionStatus,1000)
        }
    }).catch(error=>{
        console.error('Error checking recognition status:', error);
        setTimeout(pollRecognitionStatus, 1000);
    })

}




/*--------------------------------------ITEM MANAGEMENT / DATABASE ----------------------------------*/
/*  ADD ITEM    */
try{
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
                const message = response.data.message;
                if(message==""){
                    location.href = '/database'
                }else{
                    alert(message);
                }
                

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
                        location.href = '/database';
                    }).catch(error=>{
                        alert(error);
                    })
                })
                isListenerAdded = true;
            }
        })

    }
}catch(e){
    console.log("Error in ADD ITEM or EDIT ITEM")
    console.log(e)
    //Pass
}

try{
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

}catch(e){
    console.log("Error in DELETE ITEM or FILTER TABLE or POPUP IMAGE");
    console.log(e)
    //Pass
}




/*-----------------------------------------------MENU------ ----------------------------------------*/
/*--------SEARCH WITH AUTOCOMPLETE-----*/
//https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_autocomplete

try{
    var searchBtn = document.getElementById('search-btn');
    var modal = document.getElementById('c_modal')
    var closePopup = document.getElementsByClassName('c_modal__close')[0];
    var c_button = document.getElementsByClassName('c_button')[0];
    var mapImage = document.getElementById('map-image')

    // When the user clicks the button, open the modal 
    searchBtn.addEventListener('click',(event)=>{
        const searchInput = document.getElementById('search').value;
        if(globalSuggestions.includes(searchInput)){
            console.log(mapImage.src)
            // mapImage.src = "http://127.0.0.1:8000/static/myapp/images/media/robin.gif"           //This is based on the host it runs,this (127.0.0.1:8000) can be changed 
            modal.style.display = 'block';
        }else{
            alert("No store / item named \""+searchInput+"\" in this market");
        }
        
    });
    
    c_button.addEventListener('click',(event)=>{
        mapImage.src = "http://127.0.0.1:8000/static/myapp/images/map.png"
        modal.style.display = 'block';
    });

    // When the user clicks on .c_modal__close / (x), close the modal
    closePopup.addEventListener('click',(event)=>{
        modal.style.display = 'none';
    });
      
    



function searching(marketList){
    const searchInput = document.getElementById('search');
    const suggestionsList = document.getElementById('suggestions');

    // Data for suggestions
    var marketList = JSON.parse(marketList)
    // console.log(suggestions)
    // var storesList = [
    //      'Botika ni Mikha', 'Aling Stacey Pharmacy', 'Mang Ben Pork&Chicken', 'Karnihan ni Amihan', 
    //      'Aling Jho\'s Gulayan', 'Manang Sheena Veggies', 'Tita Aiah\'s Prutas','Ninang Gwen\'s Fruit Stand',
    //      'Cong Clothing','MN+LA','Isdaan ni Colet', 'Mary Loi Talipapa'
    //  ];
     var storesList = marketList.map(item=>item.store)
     storesList = new Set(storesList)
     storesList = Array.from(storesList)
     var itemsList = marketList.map(item=>item.item_name)
    
     console.log(storesList)
     console.log(itemsList)
     console.log(marketList)


     var suggestions = itemsList.concat(storesList);

     console.log(suggestions);
     window.globalSuggestions = suggestions;
    
  
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        suggestionsList.innerHTML = '';
        
        if (query.length === 0) {
            suggestionsList.style.display = 'none';
            return;
        }
        
        // const filteredSuggestions = suggestions.filter(item => item.toLowerCase().startsWith(query));
        const filteredSuggestions = marketList.filter(item => item.item_name.toLowerCase().startsWith(query));

        const filteredStoreSuggestions = marketList
                                        .filter(item => item.store.toLowerCase().startsWith(query))
                                        .filter((item, index, self) =>
                                        index === self.findIndex((t) => (
                                          t.store.toLowerCase() === item.store.toLowerCase()
                                        ))
                                      );
    


        console.log(filteredSuggestions);

        //List/loop of filtered Suggestions for item name
        filteredSuggestions.forEach(item => {
            const listItem = document.createElement('li');
        //  listItem.textContent = item;
        listItem.innerHTML = "<strong>"+item.item_name.substring(0,query.length)+"</strong>"+item.item_name.substring(query.length,item.item_name.length);
        listItem.innerHTML += " -  ₱"+item.price+" / "+item.per
        listItem.innerHTML += "<p>"+  item.store  +"</p>"
            listItem.addEventListener('click', () => {
                searchInput.value = item.item_name;
                suggestionsList.style.display = 'none';
                // window.globalMapImgPath = item.map_img;
                mapImage.src = item.map_img;
            });
            suggestionsList.appendChild(listItem);
        });

       

        //List/loop of filtered Suggestions for item name
        filteredStoreSuggestions.forEach(item => {
            const listItem = document.createElement('li');
        //  listItem.textContent = item;
        listItem.innerHTML = "<strong>"+item.store.substring(0,query.length)+"</strong>"+item.store.substring(query.length,item.store.length);
        listItem.innerHTML += "<p>"+"</p>"

            listItem.addEventListener('click', () => {
                searchInput.value = item.store;
                suggestionsList.style.display = 'none';
                // window.globalMapImgPath = item.map_img;
                mapImage.src = item.map_img;
            });
            suggestionsList.appendChild(listItem);
        });
        
        if(filteredSuggestions.length < 1 && filteredStoreSuggestions.length < 1){
            console.log("Entering here")
            const listItemNone = document.createElement('li');
            listItemNone.innerHTML = "<h3 style='font-weight:normal'> Not Found </h3>"
            suggestionsList.appendChild(listItemNone);
            suggestionsList.style.display = 'block';
        }
       
        suggestionsList.style.display = (filteredSuggestions.length > 0 || filteredStoreSuggestions.length > 0) ? 'block' : 'block';
       
    });

    
     //List/loop of filtered Suggestions for store name

}

}catch(e){
    console.log("Error in searching()")
    console.log(e)
    //Pass
}


try{
/*--------GET CATEGORY FROM MENU then TO GO TO CATEGORY.HTML-----*/
function sendCateg(category){

    axios.post('/get_categ/',{
        category:category
    },{
        headers:{
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response=>{
        console.log(response.data.itemNames)
        location.href = '/category'

    }).catch(error=>{
        alert(error)
    });

}

function sendItemName(itemName){
    console.log(itemName)
  

    axios.post('/get_item_name/',{
        itemName:itemName
    },{
        headers:{
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response=>{
        // console.log(response.data.itemNames)
        location.href = '/store'
 

    }).catch(error=>{
        alert(error)
    });

};






}catch(e){
    console.log("Error in sendCateg()")
    console.log(e)
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