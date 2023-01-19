const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
    brand: {type: String, required: [true, 'title is required'], unique: true},
    price: {type: String, required: [true, 'title is required']},
    image: {type: String, required: [true, 'image is required']},
},
{
    timeStamps: true
}
)


const Posts = new mongoose.model('Posts', PostSchema)

module.exports =  Posts