const express = require('express');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/resumes - Get all resumes for the authenticated user
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId })
      .select('title template profile.fullName profile.jobTitle updatedAt createdAt')
      .sort({ updatedAt: -1 });

    res.json(resumes);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// GET /api/resumes/:id - Get a single resume
router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// POST /api/resumes - Create a new resume
router.post('/', async (req, res) => {
  try {
    const resume = new Resume({
      userId: req.userId,
      title: req.body.title || 'Untitled Resume',
      template: req.body.template || 'modern',
    });

    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

// PUT /api/resumes/:id - Update a resume (auto-save)
router.put('/:id', async (req, res) => {
  try {
    const allowedFields = [
      'title', 'template', 'sectionOrder', 'profile',
      'experience', 'education', 'skills', 'projects', 'atsScore',
      'customSections', 'customTemplateHtml', 'theme',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

// DELETE /api/resumes/:id - Delete a resume
router.delete('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

module.exports = router;
