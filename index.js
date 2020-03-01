const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true })
.then(()=> console.log("Connected to MongoDB"))
.catch( err => console.log("Error", err) )

const courseSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 5, maxlength: 20},
    category: {type: String, enum: ['web', 'mobile', 'network'], required: true, lowercase: true, trim: true}, 
    author: String,
    // tags: [String],
    //Custom Validation
    // tags: {type: Array, validate:{
    //     validator: function(v){
    //         return v && v.length > 0;
    //     },
    //     message: 'A course should have atleast one tag'
    // }},

    //Async Validation
    tags: {type: Array, validate:{
        isAsync: true,
        validator: function(v, cb){
            setTimeout(()=>{
                const result = v && v.length > 0;
                cb(result)
            }, 4000)            
        },
        message: 'A course should have atleast one tag'
    }},

    date: {type: Date, default: Date.now},
    isPublished: Boolean,
    price: {type: Number, required: function(){return this.isPublished;}, min: 10, max: 200, get: v=>Math.round(v), set: v=>Math.round(v)} //price required if the ispublished is true
});
const Course = mongoose.model('Course', courseSchema); //Class

async function createCourse(){
    const course = new Course({
        name: 'Node js course',
        category: 'WEB',
        author: 'Mosh Hamedani',
        tags: ['Backend'],
        isPublished: true,
        price: 25.2525
    });

    try{
        //manually trigger validation in mongoose
        // course.validate((err)=>{
        //     if(err){
        //         console.log(err);
        //         return;
        //     }
        // })
        const result = await course.save();
        console.log(result)
    }catch(ex){
        // console.log(ex.message) //normal validation
        
        //Validation errors
        for( field in ex.errors) console.log(ex.errors[field].message)
    }    
}

createCourse();

async function getCourses(){

    //paging
    const pageNumber = 1;
    const pageSize = 10;

    const courses = await Course
    .find() //{author: {$in: ['Mosh']}}
    // .or({author: 'Mosh'}, {isPublished: false})
    //author starts with mosh
    // .find({author: /^mosh/i})

    //author ends with Hamedani
    // .find({author: /hamedani$/i}) //i indicates no casesensitive

    //Contains
    // .find({author: /.*Mosh.*/i})
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({name: 1})
    .select({ name: 1, tags: 1, author: 1 })
    // .count(); //gets the coun of the collecion 
    console.log(courses)
}

// getCourses()
