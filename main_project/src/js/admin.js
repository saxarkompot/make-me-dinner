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
let arrayOfCategories;
let divOfImage = $(".image-picker");
let divImp = $(`<input type="file" name="image" />`);
$('.new-image').on('error', function () {
    $('.new-image').attr('src',"/img/icons/no-image.png");
});

function renderAllCategories() {
    for (let i = 0; i < arrayOfCategories.length; i++) {
        renderCategory(arrayOfCategories[i].id, arrayOfCategories[i].name, arrayOfCategories[i].dishes);
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
        let newImage = `http://localhost:3001${arrayOfCategories.find((e) => e.id == categoryId).imageUrl}`;
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
    $.get("http://localhost:3001/categories", function (data, textStatus, jqXHR) {
        if (jqXHR.status != 200) return;
        arrayOfCategories = data;
        renderAllCategories();
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
        $.post(`http://localhost:3001/categories/`, { name: `${inputData.val()}` }, function (data, textStatus, jqXHR) {
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
        if (inputData.val() == "") return;
        if (cat2.children('header').html().indexOf(':') == -1) return;
        $.post(`http://localhost:3001/categories/${selectedCategoryId}/dishes`,
            { name: `${inputData.val()}` },
            function (data, textStatus, jqXHR) {
                if (jqXHR.status != 200) return;
                renderDish(selectedCategoryId, data.id, data.name, data);
                inputData.val('');
                myTooltip('', data.name, 'added');
                arrayOfCategories.find((e) => e.id == selectedCategoryId).dishes.push(data);
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
            url: `http://localhost:3001/categories/${categoryId}/dishes/${dishId}`,
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

function updateCategory(divOfCategory, categoryId, categoryName) {
    let newValue = divOfCategory.find('input').val();
    $.ajax({
        url: `http://localhost:3001/categories/${categoryId}`,
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
            renderAllCategories();
        }
    });
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
        formData.append('image', this.files[0])
        $.ajax({
            url: `http://localhost:3001/categories/${selectedCategoryId}/images/`,
            type: 'POST',
            data: formData,
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set contentType
            success: function (data) {
                arrayOfCategories.find((e) => e.id == selectedCategoryId).imageUrl = data.imageUrl;
                myTooltip(`In category with name: `, arrayOfCategories.find(e => e.id == selectedCategoryId).name, 'was add image');
                let newImage = `http://localhost:3001${data.imageUrl}`;                
                $('.new-image').attr('src',newImage);
                console.log(data);
            }
        });
    });
}

fileUpload();
