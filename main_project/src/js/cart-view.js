class CartView {
    constructor() {
        $(".cart").click(() => this.onCartClick());
    }
    render(model, hide) {
        let divOfDishes = $(".middle-cart");
        if (hide) {
            divOfDishes.hide(); // clear a div before filling it
        }
        else {
            divOfDishes.show();
        }
        divOfDishes.html("");
        const divs = {
            plus: '<div class="plus"><img class="right-arrow"src="img/icons/arrow.png" alt=" "></div>',
            minus: '<div class="minus"><img class="left-arrow"src="img/icons/arrow.png" alt=" "></div>',
            sum: '<div class="sum">0</div>'
        };
        // render all categories
        for (let i = 0; i < model.orders.length; i++) {
            let nameOfDish = model.orders[i].dish.name;
            let price = model.orders[i].dish.price;
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
                dish: model.orders[i].dish
            }
            // subscribe a handler on onclick event, passing the dataContext using anonymous method
            dishEl.find(".plus").click(() => this.onPlusClick(dataContext));
            // subscribe a handler on onclick event, passing the dataContext using bind
            dishEl.find(".minus").click(this.onMinusClick.bind(dishEl.find(".minus"), dataContext));
            dishEl.find(".sum").attr("dishId", dataContext.dish.id);
            divOfDishes.append(dishEl);
        }

        let counter = 0;
        let sumOfPrices = 0;
        // aggregate counters to render the cart
        for (let i = 0; i < model.orders.length; i++) {
            $(`[dishId|=${model.orders[i].dishId}]`).html(model.orders[i].amount);
            counter += model.orders[i].amount;
            sumOfPrices += model.orders[i].amount * model.orders[i].dish.price;
        }
        let $sumOfDishes = $(".sumOfDishes");
        $sumOfDishes.html(`<span class="counter">${counter}</span>/${sumOfPrices}грн.`);
        
    }
}