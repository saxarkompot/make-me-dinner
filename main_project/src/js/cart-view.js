class CartView {
    constructor() {
        $(".cart,.go-to-menu").click(() => { this.onCartClick(); return false });
        
    }
    render(model, hide) {
        let divOfDishes = $(".middle-cart");
        let link = $(`.go-to-menu`);
        link.html('');
        let divOfCartLink = $(".menu-logotip");
        link.html(`<a href="#"><--back to menu</a>`);
        link.insertAfter(divOfCartLink);
        if (hide) {
            divOfDishes.hide(); // clear a div before filling it
            link.hide();
        }
        else {
            divOfDishes.show();
            link.show();
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

        // aggregate counters to render the cart
        for (let i = 0; i < model.orders.length; i++) {
            $(`[dishId|=${model.orders[i].dishId}]`).html(model.orders[i].amount);
        }        
    }
}