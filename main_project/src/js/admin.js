let categories = $('.div-of-categories');
let dishesContainer = $('.div-of-dishes');
let getDivOfDishSettings = () => $('.div-of-dish-settings');
let cat1 = $('.category-1');
let cat2 = $('.category-2');
let cat3 = $('.category-3');
let cat3Html = `<header>Dish settings</header>
                <div class="div-of-dish-settings"></div>
                <div class="input-but">
                <input type="text">
                <button class="add-btn">+</button>
                </div>`;
let selectedCategoryId;
let selectedCategoryDishes;
function renderCategory(categoryId, categoryName, categoryDishes) {
    let divOfCategory = $(`<div class="flex-div"><div class='category'>${categoryName}
    </div><button class="minus-btn">-</button></div>`);
    categories.append(divOfCategory);
    divOfCategory.find('.category').click(function () {
        cat3.html(cat3Html);
        headerChange(cat2, categoryName)
        dishesContainer.html('');
        let dishes = categoryDishes;
        for (let j = 0; j < dishes.length; j++) {
            renderDish(categoryId, dishes[j].id, dishes[j].name, dishes[j]);
        };
        selectedCategoryId = categoryId;
        selectedCategoryDishes = dishes;
    });
    delCategory(categoryId, divOfCategory, categoryName);
}
function fetchCategories() {
    $.get("http://localhost:3001/categories", function (data, textStatus, jqXHR) {
        if (jqXHR.status != 200) return;
        for (let i = 0; i < data.length; i++) {
            renderCategory(data[i].id, data[i].name, data[i].dishes);
        };
    });
    addCategory();
};

fetchCategories();

function renderDish(categoryId, dishId, dishName, dish) {
    divOfDish = $(`<div class="flex-div"><div class='category'>${dishName}
               </div><button class="minus-btn">-</button></div>`);
    dishesContainer.append(divOfDish);
    divOfDish.find('.category').click(function () {
        headerChange(cat3, dishName);
        getDivOfDishSettings().html('');
        let dishOpt = dish;
        for (let n in dishOpt) {
            let divOfDishOpt = $(`<div class='flex-div'><div class='category'>${n} : 
                ${dishOpt[n]}</div><button class="minus-btn">-</button></div>`);
            getDivOfDishSettings().append(divOfDishOpt);
        }
    });
    delDish(categoryId, dishId, divOfDish, dishName);
}

function addCategory() {
    cat1.find('.add-btn').click(function () {
        let inputData = cat1.find('input');
        $.post(`http://localhost:3001/categories/`, { name: `${inputData.val()}` }, function (data, textStatus, jqXHR) {
            if (jqXHR.status != 200) return;
            renderCategory(data.id, data.name, [])
            inputData.val('');
            myTooltip(data.name, 'added');
        });
    });
}

function addDish() {
    cat2.find('.add-btn').click(function () {
        let inputData = cat2.find('input');
        $.post(`http://localhost:3001/categories/${selectedCategoryId}/dishes`,
            { name: `${inputData.val()}` },
            function (data, textStatus, jqXHR) {
                if (jqXHR.status != 200) return;
                renderDish(selectedCategoryId, data.id, data.name, data);
                inputData.val('');
                myTooltip(data.name, 'added');
                selectedCategoryDishes.push(data);
                // del(data.id, divOfCategory, data.name);
                // divOfCategory.find('.category').click(function () {
                //     headerChange(cat3, data.name);
                //     let dishOpt = numId.dishes;
                //     for (let n in dishOpt) {
                //         let divOfDishOpt = $(`<div class='flex-div'><div class='category'>${n} : 
                //                           ${dishOpt[n]}</div><button class="minus-btn">-</button></div>`);
                //         getDivOfDishSettings().append(divOfDishOpt);
                //     }
                // });
            });

    });
}
addDish();

function delCategory(id, divOfData, name, ) {
    divOfData.find('.minus-btn').click(function () {
        $.ajax({
            url: `http://localhost:3001/categories/${id}`,
            type: 'DELETE',
            data: JSON.stringify({ "id": id })
        });
        divOfData.remove();
        myTooltip(name, 'deleted');
    });
}

function delDish(categoryId, dishId, divOfData, name) {
    divOfData.find('.minus-btn').click(function () {
        $.ajax({
            url: `http://localhost:3001/categories/${categoryId}/dishes/${dishId}`,
            type: 'DELETE',
            data: JSON.stringify({ "id": dishId })
        });
        divOfData.remove();
        myTooltip(name, 'deleted');
        for (let i = 0; i < selectedCategoryDishes.length; i++) {
            if (selectedCategoryDishes[i].id == dishId) {
                selectedCategoryDishes.splice(selectedCategoryDishes[i], 1);
                break;
            }
        }
    });
}

function myTooltip(name, action) {
    $('body').append($("<div/>").attr('class', 'tool'));
    $(".tool").html(`<span>${name}</span> ${action}`);
    $(".tool").css({
        opacity: 0.8,
        display: "none"
    }).fadeIn(1000).fadeOut(1000);
}

function headerChange(category, categoryData) {
    let head = `${category.children('header').html()}`;
    let nameOfHeader = head.slice(0, (~head.indexOf(':') ? head.indexOf(':') : head.length));
    category.children('header').html(`${nameOfHeader}`);
    category.children('header').html(`${category.children('header').html()} ${categoryData ? ':' : ''} 
                                     <span class="name-dish-header">${categoryData}</span>`);
}


