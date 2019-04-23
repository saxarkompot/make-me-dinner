$.ajaxSetup({
  crossDomain: true,
  xhrFields: {
    withCredentials: true
  },
  headers: {
    "Content-Type": "application/json"
  },
  dataType: "json"
});

let divOfDishes = $(".middle");

let divs = {
  plus: '<div class="plus"><img class="right-arrow"src="img/icons/arrow.png" alt=" "></div>',
  minus: '<div class="minus"><img class="left-arrow"src="img/icons/arrow.png" alt=" "></div>',
  sum: '<div class="sum">0</div>'
};

let sumOfDishes = $(".sumOfDishes");

$.get("http://localhost:3001/categories/", function (data) {
  for (let i = 0; i < data.length; i++) {
    let dishes = data[i].dishes;
    let category = $("<div class='category'/>");
    for (let k = 0; k < dishes.length; k++) {
      let nameOfDish = dishes[k].name;
      let price = dishes[k].price;
      let dishEl = $(`<div class="full-dish">
                      <div class="dish-price">
                      <div class="dish">${nameOfDish}</div>                              
                      <div class="price">${price}грн.</div>
                      </div>                              
                      
                      <div class="operator">
                      ${divs.minus}
                      ${divs.sum}
                      ${divs.plus}
                      </div>                              
                                                    
                      </div>`);
      let dataContext = {
        dish: dishes[k],
        orders: 0
      }
      dishEl.find(".plus").click(float.bind(dishEl.find(".plus"), dataContext));
      dishEl.find(".minus").click(substract.bind(dishEl.find(".minus"), dataContext));
      category.append(dishEl);
    }
    divOfDishes.append(category);
  }
})



let counter = 0;
let sumOfPrices = 0;
function float(dishContext) {
  console.log(this);
  counter++;
  let floatDIsh = dishContext.dish.price;
  let sums = this.parents('.full-dish').find(".sum");
  sums.html(++dishContext.orders);
  sumOfPrices += floatDIsh;
  sumOfDishes.html(`<span class="counter">${counter}</span>/${sumOfPrices}грн.`);
}
function substract(dishContext) {
  console.log(this);
  if (dishContext.orders == 0) return;
  counter--;
  let floatDIsh = dishContext.dish.price;
  let sums = this.parents('.full-dish').find('.sum');
  sums.html(--dishContext.orders);
  sumOfPrices -= floatDIsh;
  sumOfDishes.html(`<span class="counter">${counter}</span>/${sumOfPrices}грн.`);
}

let $email = $("#exampleInputEmail1");
let $password = $("#exampleInputPassword1");
let $buttonSend = $("#btn-send");

function login() {
  $.post(
    "http://localhost:3001/auth/",
    JSON.stringify({ "username": $email.val(), "password": $password.val() }),
    function (data, textStatus, jqXHR) {
      if (jqXHR.status != 200) return;
      getPersonData();
    })
}

function getPersonData() {
  $.get("http://localhost:3001/users/me", function (data, textStatus, jqXHR) {
    if (jqXHR.status != 200) return;
    let $helloDiv = $("<div class='hello-text'/>");
    $(".form").replaceWith($helloDiv.html(`Hello <span class="person-name">${data.name} ${data.lastName}</span> !`))
  });

};

getPersonData();


$buttonSend.click(login);