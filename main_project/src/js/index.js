let divOfDishes = $(".middle");

let divs = {
  plus: '<div class="plus">+</div>',
  minus: '<div class="minus">-</div>',
  sum: '<div class="sum">0</div>'
};

let sumOfDishes = $(".sumOfDishes");

function changeDishes() {
  let xmlRequest = new XMLHttpRequest();
  xmlRequest.open("GET", "http://localhost:3001/categories/", true);
  xmlRequest.send();
  xmlRequest.onreadystatechange = function () {
    if (xmlRequest.readyState != 4) return;
    let response = JSON.parse(xmlRequest.responseText);
    for (let i = 0; i < response.length; i++) {
      let dishes = response[i].dishes;
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
  };
}
changeDishes();

let counter = 0;
let sumOfPrices = 0;
function float(dishContext) {
  console.log(this);
  counter++;
  let floatDIsh = dishContext.dish.price;
  let sums = this.parents('.full-dish').find(".sum");
  sums.html(++dishContext.orders);
  sumOfPrices += floatDIsh;
  sumOfDishes.html(counter + "/" + sumOfPrices + "грн.");
}
function substract(dishContext) {
  console.log(this);
  if (dishContext.orders == 0) return;
  counter--;
  let floatDIsh = dishContext.dish.price;
  let sums = this.parents('.full-dish').find('.sum');
  sums.html(--dishContext.orders);
  sumOfPrices -= floatDIsh;
  sumOfDishes.html(counter + "/" + sumOfPrices + "грн.");
}

