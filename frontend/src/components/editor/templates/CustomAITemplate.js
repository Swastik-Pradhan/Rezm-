'use client';

import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import Handlebars from 'handlebars';

export default function CustomAITemplate({ resume }) {
  const { customTemplateHtml, profile, experience, education, skills, projects, customSections } = resume;

  const html = useMemo(() => {
    if (!customTemplateHtml) {
      return '<div class="p-10 text-center text-gray-500 font-medium">Loading your cloned format...</div>';
    }

    try {
      const template = Handlebars.compile(customTemplateHtml);
      const raw = template({
        profile: profile || {},
        experience: experience || [],
        education: education || [],
        skills: skills || [],
        projects: projects || [],
        customSections: customSections || [],
      });
      // Sanitize AI-generated HTML to prevent XSS
      return DOMPurify.sanitize(raw, {
        ADD_TAGS: ['style'],
        ADD_ATTR: ['class', 'style'],
      });
    } catch (err) {
      console.error('Handlebars compile error:', err);
      return `
        <div class="p-10 text-center">
          <p class="text-red-500 font-bold mb-2">Error parsing AI Cloned Template</p>
          <pre class="bg-gray-100 p-4 rounded text-left text-sm overflow-auto text-gray-800">
            ${DOMPurify.sanitize(err.message)}
          </pre>
        </div>
      `;
    }
  }, [customTemplateHtml, profile, experience, education, skills, projects, customSections]);

  return (
    <div 
      className="w-full h-full bg-white relative overflow-hidden" 
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}
