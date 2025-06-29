const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (ensure dotenv is loaded in server.js)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateContent = async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res
      .status(400)
      .json({ message: "Title is required to generate content." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Or 'gemini-1.5-flash', 'gemini-1.5-pro' depending on availability and preference

    const prompt = `Generate a detailed document content based on the following title.
        The content should be professional, well-structured, and suitable for a knowledge base or project documentation.
        Aim for a length of about 200-400 words.
        Title: "${title}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text(); // Get the generated text

    res.status(200).json({ content: text });
  } catch (error) {
    console.error("Error generating AI content:", error);
    // More specific error handling for API failures could be added here
    res
      .status(500)
      .json({
        message: "Failed to generate content from AI. Please try again later.",
      });
  }
};

module.exports = {
  generateContent,
};
