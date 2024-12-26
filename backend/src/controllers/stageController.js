const Stage = require("../models/Stage");
const Course = require("../models/Course");

// Create a new stage and add it to the course
exports.createStage = async (req, res) => {
    const { courseId, title, description } = req.body;

    if (!courseId || !title || !description) {
        return res.status(400).json({ status: "failed", message: 'CourseId, title, and description are required.' });
    }

    try {
        // Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ status: "failed", message: 'Course not found.' });
        }

        // Check if the number of stages exceeds the total_stages in the course
        if (course.content.length >= course.total_stages) {
            return res.status(400).json({ status: "failed", message: 'Maximum number of stages reached for this course.' });
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
            status: "success",
            message: 'Stage created successfully.',
            stage: newStage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: 'Server error, please try again later.' });
    }
};

// Update a stage by ID
exports.updateStage = async (req, res) => {
    const { stageId } = req.params; // Extract stageId from URL parameters
    const { title, description } = req.body; // Get fields to update from the body

    if (!title && !description) {
        return res.status(400).json({ status: "failed", message: 'At least one field (title or description) must be provided for update.' });
    }

    try {
        // Find the stage by ID
        const stage = await Stage.findById(stageId);
        if (!stage) {
            return res.status(404).json({ status: "failed", message: 'Stage not found.' });
        }

        // Update the fields if provided
        if (title) stage.title = title;
        if (description) stage.description = description;

        // Save the updated stage
        await stage.save();

        res.status(200).json({
            status: "success",
            message: 'Stage updated successfully.',
            stage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: 'Server error, please try again later.' });
    }
};

// Delete a stage by ID
exports.deleteStage = async (req, res) => {
    const { stageId } = req.params; // Extract stageId from URL parameter

    try {
        // Find the stage by ID
        const stage = await Stage.findById(stageId);
        if (!stage) {
            return res.status(404).json({ status: "failed", message: 'Stage not found.' });
        }

        // Find the associated course and remove the stage from the content array
        const course = await Course.findById(stage.course);
        if (course) {
            course.content = course.content.filter(stageObjId => stageObjId.toString() !== stageId);
            await course.save();
        }

        // Delete the stage
        await Stage.findByIdAndDelete(stageId);

        res.status(200).json({
            status: "success",
            message: 'Stage deleted successfully.',
            stageId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: 'Server error, please try again later.' });
    }
};

exports.getStageById = async (req, res) => {
  const { stageId } = req.params;

  try {
    // Find stage by ID
    const stage = await Stage.findById(stageId);
    if (!stage) {
      return res.status(404).json({ message: "Stage not found." });
    }

    res.status(200).json(stage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};