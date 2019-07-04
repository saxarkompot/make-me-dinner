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
let arrayOfCategories;
function renderCategory(categoryId, categoryName, categoryDishes) {
    let divOfCategory = $(`<div class="flex-div"><div class='category'>${categoryName}
    <img class="edit-img" src="../../img/icons/n2.png" alt=""></div><button class="minus-btn">-</button></div>`);
    categories.append(divOfCategory);
    divOfCategory.find('.category').click(function () {
        cat3.html(cat3Html);
        headerChange(cat2, categoryName)
        dishesContainer.html('');
        for (let j = 0; j < categoryDishes.length; j++) {
            renderDish(selectedCategoryId, categoryDishes[j].id, categoryDishes[j].name, categoryDishes[j]);
        };
        selectedCategoryId = categoryId;

    });
    delCategory(categoryId, divOfCategory, categoryName);
    editCategory(divOfCategory, categoryName, categoryId);
}
function fetchCategories() {
    $.get("http://localhost.:3001/categories", function (data, textStatus, jqXHR) {
        if (jqXHR.status != 200) return;
        for (let i = 0; i < data.length; i++) {
            renderCategory(data[i].id, data[i].name, data[i].dishes);
        };
        arrayOfCategories = data;
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
    cat1.find('input').click(() => { dishesContainer.html(''); headerChange(cat2, '') });
    cat1.find('.add-btn').click(function () {
        let inputData = cat1.find('input');
        $.post(`http://localhost.:3001/categories/`, { name: `${inputData.val()}` }, function (data, textStatus, jqXHR) {
            if (jqXHR.status != 200) return;
            data.dishes = [];
            renderCategory(data.id, data.name, data.dishes)
            inputData.val('');
            myTooltip('', data.name, 'added');
            arrayOfCategories.push(data);
        });
    });
}

function addDish() {
    cat2.find('.add-btn').click(function () {
        let inputData = cat2.find('input');
        $.post(`http://localhost.:3001/categories/${selectedCategoryId}/dishes`,
            { name: `${inputData.val()}` },
            function (data, textStatus, jqXHR) {
                if (jqXHR.status != 200) return;
                renderDish(selectedCategoryId, data.id, data.name, data);
                inputData.val('');
                myTooltip('', data.name, 'added');
                for (let i = 0; i < arrayOfCategories.length; i++) {
                    if (arrayOfCategories[i].id == selectedCategoryId) {
                        arrayOfCategories[i].dishes.push(data);
                        break;
                    }
                }
            });
    });
}
addDish();

function delCategory(id, divOfData, name, ) {
    divOfData.find('.minus-btn').click(function () {
        $.ajax({
            url: `http://localhost.:3001/categories/${id}`,
            type: 'DELETE',
            data: JSON.stringify({ "id": id })
        });
        dishesContainer.html('');
        headerChange(cat2, '');
        divOfData.remove();
        myTooltip('', name, 'deleted');
        for (let i = 0; i < arrayOfCategories.length; i++) {
            if (arrayOfCategories[i].id == id) {
                arrayOfCategories.splice(i, 1);
                break;
            }
        }
    });
}

function delDish(categoryId, dishId, divOfData, name) {
    divOfData.find('.minus-btn').click(function () {
        $.ajax({
            url: `http://localhost.:3001/categories/${categoryId}/dishes/${dishId}`,
            type: 'DELETE',
            data: JSON.stringify({ "id": dishId })
        });
        divOfData.remove();
        myTooltip('', name, 'deleted');
        for (let i = 0; i < arrayOfCategories.length; i++) {
            if (arrayOfCategories[i].id == categoryId) {
                let dish = arrayOfCategories[i].dishes;
                for (let d = 0; d < dish.length; d++) {
                    if (dish[d].id == dishId) {
                        arrayOfCategories[i].dishes.splice(d, 1);
                        break;
                    }
                }
            }
        }
    });
}

function myTooltip(str, name, action) {
    $('body').append($("<div/>").attr('class', 'tool'));
    $(".tool").html(`${str}<span>${name}</span> ${action}`);
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

function editCategory(divOfCategory, categoryName, categoryId) {
    divOfCategory.find('img').click(function () {
        let inputDiv = $(`<div class="flex-div"><input type='text' placeholder='${categoryName}'></div>`);
        let ok = $(`<img class="ok-img" src="../../img/icons/n2.png" alt="">`);
        divOfCategory.find('.category').replaceWith(inputDiv);
        divOfCategory.find('.minus-btn').replaceWith(ok);
        okey(divOfCategory, categoryId, categoryName, inputDiv, ok);
        dishesContainer.html('');
        headerChange(cat2, '');
    });
}
function protoFetchCategories() {
    for (let i = 0; i < arrayOfCategories.length; i++) {
        renderCategory(arrayOfCategories[i].id, arrayOfCategories[i].name, arrayOfCategories[i].dishes);
    };
    //addCategory();
}
function updateCategory(divOfCategory, categoryId, categoryName) {
    let newValue = divOfCategory.find('input').val();
    $.ajax({
        url: `http://localhost.:3001/categories/${categoryId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ "name": newValue }),
        success: function (data) {
            for (let i = 0; i < arrayOfCategories.length; i++) {
                if (arrayOfCategories[i].id == categoryId) {
                    arrayOfCategories[i] = data;
                    break;
                }
            }
            myTooltip(`Category with name: `, categoryName, 'was updated');
            categories.html('');
            protoFetchCategories();
        }
    });
}
function okey(divOfCategory, categoryId, categoryName) {
    divOfCategory.find('input').focus().focusout(function () {
        if (divOfCategory.find('input').val() == '') {
            categories.html('');
            protoFetchCategories();
            return
        };
        updateCategory(divOfCategory, categoryId, categoryName);
    });
    divOfCategory.find('input').keydown(function (e) {
        if (e.which == 13) {
            updateCategory(divOfCategory, categoryId, categoryName);
        }
        else if (e.which == 27) {
            categories.html('');
            protoFetchCategories();
        }
    })
}

