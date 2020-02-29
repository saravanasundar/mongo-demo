const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true })
.then(()=> console.log("Connected to MongoDB"))
.catch( err => console.log("Error", err) )

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: {type: Date, default: Date.now},
    isPublished: Boolean
});

async function createCourse(){
    const Course = mongoose.model('Course', courseSchema); //Class
    const course = new Course({
        name: 'Angular course',
        author: 'Mosh',
        tags: ['Angular', 'Frontend'],
        isPublished: true
    });

    const result = await course.save();
    console.log(result)
}

createCourse();

