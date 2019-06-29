class CartLink {
  blink() {
    $(".cart-img").animate({
      width: '35px',
      heigth: '35px',
    }, 45)
      .animate({
        width: '40px',
        heigth: '40px',
      }, 35)
      .animate({
        width: '35px',
        heigth: '35px',
      }, 45)
      .animate({
        width: '40px',
        heigth: '40px',
      }, 35)
  }
  render(model) {
    let counter = model.orders.reduce((prev, current) => prev + current.amount, 0);
    let sumOfPrices = model.orders.reduce((prev, current) => prev + (current.amount * current.dish.price), 0);
    let $sumOfDishes = $(".sumOfDishes");
    $sumOfDishes.html(`<span class="counter">${counter}</span>/${sumOfPrices}грн.`);
  }
}