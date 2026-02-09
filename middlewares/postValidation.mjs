const postValidation = (req, res, next) => {
    const { title, image, category_id, description, content, status_id } = req.body;
    //check if title is required
    if (!title) {
        return res.status(400).json({ "message": "Title is required" });
    }
    //check if image is required
    if (!image) {
        return res.status(400).json({ "message": "Image is required" });
    }
    //check if category_id is required
    if (!category_id) {
        return res.status(400).json({ "message": "Category is required" });
    }
    //check if description is required
    if (!description) {
        return res.status(400).json({ "message": "Description is required" });
    }
    //check if content is required
    if (!content) {
        return res.status(400).json({ "message": "Content is required" });
    }
    //check if status_id is required
    if (!status_id) {
        return res.status(400).json({ "message": "Status is required" });
    }
    //type validation
    if (typeof title !== "string") {
        return res.status(400).json({ "message": "Title must be a string" });
    }
    if (typeof image !== "string") {
        return res.status(400).json({ "message": "Image must be a string" });
    }
    if (typeof category_id !== "number") {
        return res.status(400).json({ "message": "Category must be a number" });
    }
    if (typeof description !== "string") {
        return res.status(400).json({ "message": "Description must be a string" });
    }
    if (typeof content !== "string") {
        return res.status(400).json({ "message": "Content must be a string" });
    }
    if (typeof status_id !== "number") {
        return res.status(400).json({ "message": "Status must be a number" });
    }
    next();
}

export default postValidation;
