const Stage = require("../models/Stage");
const Course = require("../models/Course");


// Create a new stage and add it to the course
exports.createStage = async (req, res) => {
    const { courseId, title, description } = req.body;

    if (!courseId || !title || !description) {
        return res.status(400).json({ message: 'CourseId, title, and description are required.' });
    }

    try {
        // Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Check if the number of stages exceeds the total_stages in the course
        if (course.content.length >= course.total_stages) {
            return res.status(400).json({ message: 'Maximum number of stages reached for this course.' });
        }

        // Calculate the stage number (next available number)
        const newStageNumber = course.content.length + 1;

        // Create the new stage
        const newStage = new Stage({
            title,
            description,
            no: newStageNumber,
            course: courseId
        });

        // Save the stage to the database
        await newStage.save();

        // Update the course by adding the new stage's ID to the content array
        course.content.push(newStage._id);
        await course.save();

        res.status(201).json({
            message: 'Stage created successfully.',
            stage: newStage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};