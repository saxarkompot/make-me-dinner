/**
 * Set on onMinusClick and onPlusClick properties to handle minus/plus events
 */
class MainView {
    constructor() {
    }
    render(model) {
        let divOfDishes = $(".middle");
        divOfDishes.html(""); // clear a div before filling it
        const divs = {
            plus: '<div class="plus"><img class="right-arrow"src="img/icons/arrow.png" alt=" "></div>',
            minus: '<div class="minus"><img class="left-arrow"src="img/icons/arrow.png" alt=" "></div>',
            sum: '<div class="sum">0</div>'
        };

        // render all categories
        for (let i = 0; i < model.categories.length; i++) {
            let dishes = model.categories[i].dishes;
            let nameOfCategory = model.categories[i].name;
            let imageOfCategory = model.categories[i].imageUrl;
            let category = $(`<div class='category'>
                              <div class="category-name-image">
                              <div class="category-name">${nameOfCategory}</div>
                              <div class="category-image"><img src="${imageOfCategory}" alt=" "</div>
                              </div></div>`);
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
                    dish: dishes[k]
                }
                // subscribe a handler on onclick event, passing the dataContext using anonymous method
                dishEl.find(".plus").click(() => this.onPlusClick(dataContext));
                // subscribe a handler on onclick event, passing the dataContext using bind
                dishEl.find(".minus").click(this.onMinusClick.bind(dishEl.find(".minus"), dataContext));
                dishEl.find(".sum").attr("dishId", dataContext.dish.id);
                category.append(dishEl);
            }
            divOfDishes.append(category);
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