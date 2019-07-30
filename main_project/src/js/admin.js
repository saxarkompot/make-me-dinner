import dataProvider from "./data-provider.js";
let categories = $('.div-of-categories');
let dishesContainer = $('.div-of-dishes');
let getDivOfDishSettings = () => $('.div-of-dish-settings');
let cat1 = $('.category-1');
let cat2 = $('.category-2');
let cat3 = $('.category-3');
let cat3Html = `<input type="file" name="image" />
                <header><div class="title">Dish settings <span class="separator">
                </span> <span class="name-dish-header"></span>
                </div></header>
                <div class="div-of-dish-settings"></div>
                <div class="input-but">
                <input type="text"><div></div>                
                </div>`;
let selectedCategoryId;
let divImp = $(`<input type="file" name="image" />`);
$('.new-image').on('error', function () {
    $('.new-image').attr('src', "/img/icons/no-image.png");
});



function renderAllCategories() {
    for (let i = 0; i < dataProvider.arrayOfCategories.length; i++) {
        renderCategory(dataProvider.arrayOfCategories[i].id, dataProvider.arrayOfCategories[i].name, dataProvider.arrayOfCategories[i].dishes);
    };
}

function renderCategory(categoryId, categoryName, categoryDishes) {
    let divOfCategory = $(`<div class="flex-div"><div class='category'>${categoryName}
    <img class="edit-img" src="../../img/icons/n2.png" alt=""></div><button class="minus-btn">-</button></div>`);
    categories.append(divOfCategory);
    divOfCategory.find('.category').click(function () {
        cat2.find('input').val('');
        cat3.html(cat3Html);
        headerChange(cat2, categoryName);
        let newImage = `http://localhost:3001${dataProvider.arrayOfCategories.find((e) => e.id == categoryId).imageUrl}`;
        $('.new-image').attr("src", newImage);
        selectedCategoryId = categoryId;
        dishesContainer.html('');
        for (let j = 0; j < categoryDishes.length; j++) {
            renderDish(selectedCategoryId, categoryDishes[j].id, categoryDishes[j].name, categoryDishes[j]);
        };
        $('.photo-image').show();
    });
    delCategory(categoryId, divOfCategory, categoryName);
    editCategory(divOfCategory, categoryName, categoryId);
}

function fetchCategories() {
    dataProvider.getAllCategories().then(function () {
        renderAllCategories()
    });
    addCategory();
};

fetchCategories();

function renderDish(categoryId, dishId, dishName, dish) {
    let divOfDish = $(`<div class="flex-div"><div class='category'>${dishName}
    <img class="edit-img" src="../../img/icons/n2.png" alt=""></div><button class="minus-btn">-</button></div>`);
    dishesContainer.append(divOfDish);
    divOfDish.find('.category').click(function () {
        headerChange(cat3, dishName);
        getDivOfDishSettings().html('');
        for (let n in dish) {
            let divOfDishOpt = $(`<div class='flex-div'><div class='dish-opt-1'>${n}</div><div class='dish-opt-2'>${dish[n]}</div></div>`);
            getDivOfDishSettings().append(divOfDishOpt);
        }
    });
    delDish(categoryId, dishId, divOfDish, dishName);
}

function addCategory() {
    cat1.find('input').click(() => {
        dishesContainer.html('');
        headerChange(cat2, '');
        getDivOfDishSettings().html('');
        headerChange(cat3, '');
        cat2.find('input').val('');
    });
    cat1.find('.add-btn').click(function () {
        let inputData = cat1.find('input');
        dataProvider.putCategory(inputData.val()).then(data => {
            renderCategory(data.id, data.name, data.dishes)
            inputData.val('');
            myTooltip('', data.name, 'added');
        });
    });
}

function addDish() {
    cat2.find('.add-btn').click(function () {
        let inputData = cat2.find('input');
        if (inputData.val() == "") return;
        if (cat2.children('header').html().indexOf(':') == -1) return;
        dataProvider.putDish(inputData.val(), selectedCategoryId).then(data => {
            renderDish(selectedCategoryId, data.id, data.name, data);
            inputData.val('');
            myTooltip('', data.name, 'added');
        });
    });
}
addDish();

function delCategory(id, divOfData, name, ) {
    divOfData.find('.minus-btn').click(function () {
        dataProvider.removeCategory(id).then(_ => {
            dishesContainer.html('');
            headerChange(cat2, '');
            divOfData.remove();
            myTooltip('', name, 'deleted');
        });
    });
}

function delDish(categoryId, dishId, divOfData, name) {
    divOfData.find('.minus-btn').click(function () {
        dataProvider.removeDish(categoryId, dishId).then(_ => {
            divOfData.remove();
            myTooltip('', name, 'deleted');
        });
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
    let separator = category.find('.separator');
    let namOfRow = category.find('.name-dish-header');
    namOfRow.html(`${categoryData}`);
    if (namOfRow.html() == '') {
        separator.html("");
    } else {
        separator.html(":");
    }
}

function editCategory(divOfCategory, categoryName, categoryId) {
    divOfCategory.find('img').click(function () {
        let inputDiv = $(`<div class="flex-div"><input type='text' placeholder='${categoryName}'></div>`);
        let ok = $(`<img class="ok-img" src="../../img/icons/n2.png" alt="">`);
        divOfCategory.find('.category').replaceWith(inputDiv);
        divOfCategory.find('.minus-btn').replaceWith(ok);
        handleEventCat1(divOfCategory, categoryId, categoryName, inputDiv, ok);
        dishesContainer.html('');
        headerChange(cat2, '');
        getDivOfDishSettings().html('');
        headerChange(cat3, '');
    });
}

async function updateCategory(divOfCategory, categoryId, categoryName) {
    let newValue = divOfCategory.find('input').val();
    try {
        await dataProvider.updateCategory(categoryId, newValue);
        myTooltip(`Category with name: `, categoryName, 'was updated');
        categories.html('');
        renderAllCategories();
    }
    catch{
        myTooltip(`Error appeared when `, categoryName, 'was updated')
    }
}
function handleEventCat1(divOfCategory, categoryId, categoryName) {
    divOfCategory.find('input').focus().focusout(function () {
        if (divOfCategory.find('input').val() == '') {
            categories.html('');
            renderAllCategories();
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
            renderAllCategories();
        }
    })
}

function photo() {
    let photoImage = $('.photo-image');
    photoImage.click(function () {
        divImp.click();
    });
    photoImage.hide();
}

photo();

function fileUpload() {
    divImp.change(function () {
        var formData = new FormData();
        formData.append('image', this.files[0]);
        dataProvider.updateImage(selectedCategoryId, formData).then(data => {
            myTooltip(`In category with name: `, dataProvider.arrayOfCategories.find(e => e.id == selectedCategoryId).name, 'was add image');
            let newImage = `http://localhost:3001${data.imageUrl}`;
            $('.new-image').attr('src', newImage);
            console.log(data);
        });
    });
}

fileUpload(); 
