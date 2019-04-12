const fs = require('fs');
module.exports = {
    images: [
        {
            context: "category_1_default",
            content: fs.readFileSync(__dirname + "/images/bg-food1.jpg")
        },
        {
            context: "category_2_default",
            content: fs.readFileSync(__dirname + "/images/bg-food2.jpg")
        },
        {
            context: "category_3_default",
            content: fs.readFileSync(__dirname + "/images/bg-food3.jpg")
        }
    ]
};