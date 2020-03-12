console.log("front-end");
console.log(sessionStorage);
let url;

$(document).ready(function(){
  $('#loginForm').hide();
  $('#logoutBtn').hide();
  $('#addProductForm').hide();
  $('#productForm').hide();
  $('#manipulate').hide();
  $('#registerForm').hide();
  $('#viewUserBtn').hide();
  $('#delForm').hide();
  $('#adminPage').hide();

  if (sessionStorage['userName']) {
    console.log('You are logged in');
    $('#manipulate').show();
    $('#loginBtn').hide();
    $('#logoutBtn').show();
    $('#registerBtn').hide();
    $('#viewUserBtn').show();

  } else {
    console.log('Please login');
    $('#logoutBtn').hide();
    $('#viewUserBtn').hide();
  }

  //checking if jquery node_modules work properly when you set up
  $('#heading').click(function(){
    // $(this).css('background', 'teal');
  });

  $('#homeBtn').click(function(){
    $('#adminPage').hide();
    $('#homePage').show();
  });

  $('#adminBtn').click(function(){
    $('#adminPage').show();
    $('#homePage').hide();
    // $('#loginBtn').show();
    // $('#registerBtn').show();
  });



//get url and port from config.json
  $.ajax({
    url :'config.json',
    type :'GET',
    dataType :'json',
    success : function(configData){
      console.log(configData);
      url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
      console.log(url);

    },//success
    error:function(){
      console.log('error: cannot call api');
    }//error
  });//ajax




//view products
  $('#viewProducts').click(function(){
    console.log('viewProducts clicked');//checking if button click responds
    $.ajax({
    url :`${url}/allProductsFromDB`,
    type :'GET',
    dataType :'json',
    success : function(productsFromMongo){
      console.log(productsFromMongo);
      document.getElementById('productCards').innerHTML = "";
      for(let i=0; i<productsFromMongo.length; i++){
        document.getElementById('productCards').innerHTML +=
        `<div class="col-3 border rounded-pill mr-5 mb-5 px-5 py-3">
        <h3 class=""> ${productsFromMongo[i].name}</h3>
        <h4 class="">${productsFromMongo[i].price}</h4>
        <img class="img-thumbnail" src="${productsFromMongo[i].image_url}" alt="Image">
        </div>`;

      }

      },//success
      error:function(){
        console.log('error: cannot call api');
      }//error

    });//ajax
  });//viewProduct button


//add a product

$('#addProductBtn').click(function(){
  $('#addProductForm').show();
  $('#productForm').hide();
  $('#delForm').hide();
});


$('#addProductForm').submit(function(){

  event.preventDefault();

  let name = $('#a-name').val();
  let price = $('#a-price').val();
  let userid = $('#a-userid').val();

  console.log(name,price, userid);

  if (name == '' || price == '' || userid == ''){
    alert('Please enter all details');
  } else {

  $.ajax({
    url :`${url}/addProduct`,
    type :'POST',
    data:{
      name : name,
      price : price,
      userId : sessionStorage['userID']
      },

    success : function(product){
      console.log(product);
      if (!(product == 'name taken already. Please try another one')) {
      alert('added the product');
      } else {
        alert('name taken already. Please try another one');

      }
      $('#a-name').val('');
      $('#a-price').val('');
      $('#a-userid').val('');

    },//success
    error:function(){
      console.log('error: cannot call api');
    }//error


  });//ajax

}//else
});//submit function for addProduct

  //updateProduct
  $('#updateProductBtn').click(function(){
      $('#productForm').show();
      $('#delForm').hide();
      $('#addProductForm').hide();
  });
  $('#productForm').submit(function(){

    event.preventDefault();

    let  productId = $('#productId').val();
    let  productName = $('#productName').val();
    let  productPrice = $('#productPrice').val();
    let  userId = $('#userId').val();

    console.log(productId, productName, productPrice, userId);
    if (productId == '') {
      alert('Please enter product details');
    } else { $.ajax({
            url :`${url}/updateProduct/${productId}`,
            type :'PATCH',
            data:{
              name : productName,
              price :productPrice,
              userId :sessionStorage['userID']
              },
            success : function(data){
              console.log(data);
              if (data == '401 error; user has no permission to update') {
                alert ('401 error; user has no permission to update');
              } else{
                alert('modified');
              }
              $('#productId').val('');
              $('#productName').val('');
              $('#productPrice').val('');
              $('#userId').val('');
            },//success
            error:function(){
              console.log('error: cannot call api');
            }//error


          });//ajax
    }
  });//submit function for update product

//delete a product

$('#deleteProductBtn').click(function(){
    $('#delForm').show();
    $('#productForm').hide();
    $('#addProductForm').hide();
});

$('#delForm').submit(function(){
  event.preventDefault();
  if(!sessionStorage['userID']){
        alert('401, permission denied');
        return;
    };

  let  productId = $('#delProductId').val();

  console.log(productId);

  if (productId == '') {
    alert('Please enter product id');
  } else { $.ajax({
          url :`${url}/deleteProduct/${productId}`,
          type :'DELETE',
          data:{
            userId: sessionStorage['userID']
          },
          success : function(data){
            console.log(data);
            if (data=='deleted'){
              alert('deleted');
              $('#delProductId').val('');
            } else {
              alert('Enter a valid id');
            }

          },//success
          error:function(){
            console.log('error: cannot call api');
          }//error


        });//ajax
  }
});//submit function for delete product


  //view users
    $('#viewUserBtn').click(function(){
      $.ajax({
        url :`${url}/allUsers`,
        type :'GET',
        dataType :'json',
        success : function(usersFromMongo){

          for(let i=0; i<usersFromMongo.length; i++){
            console.log(usersFromMongo[i].username);
          }
        },//success
        error:function(){
          console.log('error: cannot call api');
        }//error
      });//ajax
    });//viewUser button


//register new user
  $('#registerBtn').click(function(){
    $('#registerForm').show();
  });


  $('#registerForm').submit(function(){

    event.preventDefault();

    let username = $('#r-username').val();
    let email = $('#r-email').val();
    let password = $('#r-password').val();

    console.log(username,email, password);
    if (username == '' || email == '' || password == ''){
      alert('Please enter all details');
    } else {

    $.ajax({
      url :`${url}/registerUser`,
      type :'POST',
      data:{
        username : username,
        email : email,
        password : password
        },

      success : function(user){
        console.log(user);
        if (!(user == 'username taken already. Please try another one')) {
        alert('Please login to manipulate the products data');
          $('#loginBtn').show();
          $('#registerBtn').hide();
          $('#registerForm').hide();
        } else {
          alert('username taken already. Please try another one');
          $('#r-username').val('');
          $('#r-email').val('');
          $('#r-password').val('');

        }

      },//success
      error:function(){
        console.log('error: cannot call api');
      }//error


    });//ajax

  }//else
});//submit function for registerForm

//login
$('#loginBtn').click(function(){
  $('#loginForm').show();
});


$('#loginForm').submit(function(){
  event.preventDefault();


  let username = $('#username').val();
  let password = $('#password').val();

  console.log(username, password);

  if (username == '' || password == ''){
    alert('Please enter all details');
  } else {

  $.ajax({
    url :`${url}/loginUser`,
    type :'POST',
    data:{
      username : username,
      password : password
      },

    success : function(user){
      console.log(user);
      if (user == 'user not found. Please register'){
      alert('user not found. Please enter correct data or register a new user');

      } else if (user == 'not authorized'){
        alert('Please try with correct details');
        $('#username').val('');
        $('#password').val('');
      } else{
        $('#loginBtn').hide();
        $('#loginForm').hide();
        $('#registerBtn').hide();
        $('#logoutBtn').show();
        $('#manipulate').show();
        $('#viewUserBtn').show();
        sessionStorage.setItem('userID', user['_id']);
        sessionStorage.setItem('userName',user['username']);
        sessionStorage.setItem('userEmail',user['email']);
        console.log(sessionStorage);
      }
    },//success
    error:function(){
      console.log('error: cannot call api');
    }//error


  });//ajax

}//else
});//submit function for login loginForm


  //logout

$('#logoutBtn').click(function(){
  console.log('You are logged out');
  sessionStorage.clear();
  console.log(sessionStorage);
  $('#manipulate').hide();
  $('#loginBtn').show();
  $('#logoutBtn').hide();
  $('#registerBtn').show();
  $('#viewUserBtn').hide();
  $('#productForm').hide();
  $('#addProductForm').hide();
  $('#delForm').hide();
});


});//document.ready
