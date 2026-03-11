import ContactUs from "../models/ContactUs.js";

//POST:  /api/contact-us/submit
export const PostContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contactUs = new ContactUs({ name, email, message });
    await contactUs.save();
    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit contact form",
      error: error.message,
    });
  }
};

//GET: /api/contact-us/all
export const GetContactForms = async (req, res) => {
  try {
    const contactForms = await ContactUs.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: contactForms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact forms",
      error: error.message,
    });
  }
};

//DELETE: /api/contact-us/:id
export const DeleteContactForm = async (req, res) => {
  try {
    const { id } = req.params;
    await ContactUs.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Contact form deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete contact form",
      error: error.message,
    });
  }
};