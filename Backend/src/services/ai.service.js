const { GoogleGenerativeAI } = require("@google/generative-ai");

const ai = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

// Professional system-level instructions for consistent responses
const systemInstruction = `
You are a professional code reviewer with 7+ years of experience.
Your job is to:
- Detect issues in JavaScript code.
- Suggest clean, production-ready fixes.
- Use markdown formatting for all code snippets.
- Be brief, clear, and constructive.
`;

async function generateContent(userCode) {
  if (!userCode || typeof userCode !== "string") {
    throw new Error("Invalid or missing user code.");
  }

  try {
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });

    const prompt = `
Review the following JavaScript code and respond in the following structure:

---

### ❌ Problems
- Briefly list issues or bad practices.

### ✅ Suggested Fixes
\`\`\`javascript
// Corrected code goes here
\`\`\`

### 💡 Why It’s Better
- Explain the improvements made (performance, readability, best practices, etc.)

---

**Code to review:**
\`\`\`javascript
${userCode}
\`\`\`
`;

    const result = await model.generateContent([prompt]);

    const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      throw new Error("No text returned from Gemini API.");
    }

    return text;
  } catch (err) {
    console.error("AI Service Error:", err.message);
    throw new Error("Failed to generate code review. Please try again.");
  }
}

module.exports = generateContent;
