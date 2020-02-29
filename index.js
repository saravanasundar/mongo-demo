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
const Course = mongoose.model('Course', courseSchema); //Class

async function createCourse(){
    const course = new Course({
        name: 'Angular course',
        author: 'Mosh',
        tags: ['Angular', 'Frontend'],
        isPublished: true
    });

    const result = await course.save();
    console.log(result)
}

// createCourse();

async function getCourses(){
    const courses = await Course
    .find({author: 'Mosh'})
    .limit(2)
    .sort({name: 1})
    .select({ name: 1, tags: 1 });
    console.log(courses)
}

getCourses()
