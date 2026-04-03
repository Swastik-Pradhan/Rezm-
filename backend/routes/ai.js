const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');

const router = express.Router();

// Memory storage for parsing files before sending to Gemini
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });


// POST /api/ai/enhance - Enhance resume summary with Gemini
router.post('/enhance', auth, async (req, res) => {
  try {
    const { text, jobTitle, section } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(503).json({
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env file.',
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let prompt;
    if (section === 'summary') {
      prompt = `You are an expert resume writer and ATS optimization specialist. 
Rewrite the following professional summary to be more impactful, ATS-optimized, and tailored for a "${jobTitle || 'professional'}" role.

Requirements:
- Use strong action-oriented language
- Include relevant industry keywords for ATS scanning
- Keep it concise (3-4 sentences maximum)
- Make it sound professional and compelling
- Do NOT include any labels, headers, or "Summary:" prefix
- Return ONLY the rewritten summary text

Original text:
${text}`;
    } else if (section === 'bullet') {
      prompt = `You are an expert resume writer. Rewrite the following resume bullet point to be more impactful and ATS-friendly.

Requirements:
- Start with a strong action verb
- Include measurable results where possible
- Keep it concise (one line)
- Make it specific and results-oriented
- Return ONLY the rewritten bullet point

Original bullet:
${text}`;
    } else {
      prompt = `You are an expert resume writer. Improve the following resume content to be more professional and ATS-optimized.

Requirements:
- Use professional language
- Include relevant keywords
- Keep it concise and impactful
- Return ONLY the improved text

Original text:
${text}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhanced = response.text().trim();

    res.json({ enhanced });
  } catch (error) {
    console.error('AI Enhancement error:', error);

    if (error.message?.includes('API_KEY')) {
      return res.status(503).json({ error: 'Invalid Gemini API key' });
    }

    res.status(500).json({ error: 'AI enhancement failed. Please try again.' });
  }
});

// POST /api/ai/import - Extract resume data from PDF/Image using Gemini
router.post('/import', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'A file is required' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(503).json({ error: 'Gemini API key not configured.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert resume parser. I am providing you with a document (PDF or Image) containing a resume.
Extract the data perfectly and return a SINGLE raw JSON object containing ONLY the following structure. NO markdown formatting, NO \`\`\`json blocks.

IMPORTANT: If the resume contains sections beyond the standard ones (experience, education, skills, projects), you MUST extract them as "customSections". Common examples include: Certifications, Languages, Volunteer Work, Publications, Awards, Hobbies, References, Interests, Courses, etc.

Schema:
{
  "profile": { "fullName": "", "jobTitle": "", "email": "", "phone": "", "linkedin": "", "github": "", "summary": "" },
  "experience": [ { "id": "exp-1", "role": "", "company": "", "startDate": "", "endDate": "", "location": "", "current": false, "bullets": [""] } ],
  "education": [ { "id": "edu-1", "degree": "", "school": "", "startDate": "", "endDate": "", "gpa": "", "description": "" } ],
  "skills": ["string"],
  "projects": [ { "id": "proj-1", "name": "", "description": "", "technologies": "", "link": "" } ],
  "customSections": [ { "id": "custom-1", "title": "Section Title", "content": "Section content as plain text" } ],
  "sectionOrder": ["profile", "experience", "education", "skills", "projects"]
}

For sectionOrder: List sections in the exact order they appear in the original document. Include the IDs of any custom sections (e.g. "custom-1") in the appropriate position.
Make sure dates are short (e.g. 'Jan 2020'). Keep bullets concise. Generate unique IDs for each item.`;

    const imageParts = [
      {
        inlineData: {
          data: req.file.buffer.toString('base64'),
          mimeType: req.file.mimetype
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = response.text().trim();
    
    // Clean up markdown payload if Gemini ignored instructions
    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsedJson = JSON.parse(text);

    res.json(parsedJson);

  } catch (error) {
    console.error('CV Import error:', error);
    res.status(500).json({ error: 'Failed to import CV file. Make sure it is a valid PDF or Image.' });
  }
});

// POST /api/ai/import-template - Extract exact visual design AND data into a Handlebars template
router.post('/import-template', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'A file is required' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(503).json({ error: 'Gemini API key not configured.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a brilliant Frontend Developer and Regex parser. I am uploading an image or PDF of a resume.
You have exactly TWO objectives:

1) Analyze the visual design (colors, fonts, borders, layouts) and reconstruct it exactly using pure HTML and Tailwind CSS classes.
2) Do NOT hardcode the text content from the resume into the HTML. Instead, output the HTML as a HANDLEBARS template string. Use exactly these handlebars tokens so I can inject the data later:
  - {{profile.fullName}}
  - {{profile.jobTitle}}
  - {{profile.email}}
  - {{profile.phone}}
  - {{profile.linkedin}}
  - {{profile.github}}
  - {{profile.summary}}
  - Lists:
    {{#each experience}} <div>{{this.role}} at {{this.company}}, {{this.startDate}} to {{this.endDate}} - {{this.location}} <ul>{{#each this.bullets}}<li>{{this}}</li>{{/each}}</ul></div> {{/each}}
    {{#each education}} <div>{{this.degree}} at {{this.school}}, {{this.startDate}} to {{this.endDate}}. {{this.description}}</div> {{/each}}
    {{#each skills}} <span>{{this}}</span> {{/each}}
    {{#each projects}} <div>{{this.name}}: {{this.description}} ({{this.technologies}}) - {{this.link}}</div> {{/each}}
    {{#each customSections}} <div><h3>{{this.title}}</h3><p>{{this.content}}</p></div> {{/each}}
    (Map the actual HTML structure required for the design into the inside of these {{#each}} blocks).

IMPORTANT: If the resume has non-standard sections (Certifications, Languages, Volunteer Work, Publications, Awards, etc.), include them in customSections.

Return a strict raw JSON object with exactly these keys:
1) "handlebarTemplate": The complete raw HTML template string with Handlebars variables.
2) "extractedData": The structured raw JSON data representing the actual text values, adhering to this schema: { "profile": { "fullName": "", "jobTitle": "", "email": "", "phone": "", "linkedin": "", "github": "", "summary": "" }, "experience": [ { "id": "exp-1", "role": "", "company": "", "startDate": "", "endDate": "", "location": "", "bullets": [""] } ], "education": [ { "id": "edu-1", "degree": "", "school": "", "startDate": "", "endDate": "", "gpa": "", "description": "" } ], "skills": ["string"], "projects": [ { "id": "proj-1", "name": "", "description": "", "technologies": "", "link": "" } ], "customSections": [ { "id": "custom-1", "title": "", "content": "" } ] }
3) "sectionOrder": An array of section IDs in the order they appear in the original document, e.g. ["profile", "experience", "skills", "education", "custom-1", "projects"]

Do NOT include any markdown blocks or \`\`\`json. Return strictly the raw JSON object.`;

    const imageParts = [
      {
        inlineData: {
          data: req.file.buffer.toString('base64'),
          mimeType: req.file.mimetype
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = response.text().trim();
    
    // Clean up markdown payload if Gemini ignored instructions
    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsedJson = JSON.parse(text);
    
    // Fallback if structured poorly
    if (!parsedJson.handlebarTemplate || !parsedJson.extractedData) {
      throw new Error('Gemini failed to output the proper handlebarTemplate format.');
    }

    res.json(parsedJson);

  } catch (error) {
    console.error('CV Custom Template Import error:', error);
    res.status(500).json({ error: 'Failed to import exact CV design. Try standard extraction instead.' });
  }
});

// POST /api/ai/analyze-ats - Compare Resume JSON context against Job Description
router.post('/analyze-ats', auth, async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: 'Resume data and Job Description are required' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert ATS (Applicant Tracking System) analyst. 
Analyze the provided Resume JSON against the Target Job Description below. Perform a thorough analysis.

Job Description:
${jobDescription}

Resume Data:
${JSON.stringify(resumeData)}

Generate a strict JSON response containing an ATS match analysis. Do NOT wrap in markdown or backticks. Return ONLY raw JSON in this exact structure:
{
  "score": 0,
  "sections": {
    "skills": { "score": 0, "feedback": "one sentence" },
    "experience": { "score": 0, "feedback": "one sentence" },
    "education": { "score": 0, "feedback": "one sentence" },
    "overall": { "score": 0, "feedback": "one sentence" }
  },
  "missingKeywords": ["keyword1", "keyword2"],
  "matchedKeywords": ["keyword1", "keyword2"],
  "feedback": "2-3 short sentences on the most impactful improvements."
}

Scoring rules:
- "score" is 0-100 representing overall match percentage
- Section scores are also 0-100
- "missingKeywords" are critical keywords from the JD not found in the resume
- "matchedKeywords" are JD keywords that ARE present in the resume
- Be honest and precise in scoring. Don't inflate scores.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsedJson = JSON.parse(text);
    res.json(parsedJson);

  } catch (error) {
    console.error('ATS Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze ATS compatibility.' });
  }
});

module.exports = router;
