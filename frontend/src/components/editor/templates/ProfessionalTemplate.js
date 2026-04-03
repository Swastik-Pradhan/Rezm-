export default function ProfessionalTemplate({ resume }) {
  const { profile = {}, experience = [], education = [], skills = [], projects = [], sectionOrder = [] } = resume;

  const renderSection = (sectionId, index) => {
    switch (sectionId) {
      case 'profile':
        if (index !== 0) return null; // Force profile to top
        return (
          <div key={sectionId} className="flex flex-col items-center border-b-4 border-slate-700 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-slate-800 tracking-wide uppercase">{profile.fullName || 'Your Name'}</h1>
            <h2 className="text-md text-slate-600 font-semibold mt-1 uppercase tracking-widest">{profile.jobTitle || 'Professional Title'}</h2>
            <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm text-slate-600">
              {profile.email && <span>{profile.email}</span>}
              {profile.phone && <span>{profile.phone}</span>}
              {profile.linkedin && <span>{profile.linkedin.replace('https://', '')}</span>}
            </div>
          </div>
        );

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <div key={sectionId} className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest whitespace-nowrap">Professional Experience</h3>
              <div className="h-px bg-slate-300 w-full"></div>
            </div>
            <div className="space-y-4">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-sm text-slate-800">{exp.company}</h4>
                    <span className="text-sm text-slate-600 font-medium">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-700 mb-2 italic">{exp.role}</div>
                  <ul className="list-disc list-outside ml-5 text-sm text-slate-700 space-y-1">
                    {exp.bullets?.map((bullet, i) => (
                      <li key={i} className="pl-1 leading-relaxed">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (education.length === 0) return null;
        return (
          <div key={sectionId} className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest whitespace-nowrap">Education</h3>
              <div className="h-px bg-slate-300 w-full"></div>
            </div>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-sm text-slate-800">{edu.school}</h4>
                    <span className="text-sm text-slate-600 font-medium">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-sm text-slate-700 italic">{edu.degree}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div key={sectionId} className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest whitespace-nowrap">Core Competencies</h3>
              <div className="h-px bg-slate-300 w-full"></div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700">
              {skills.map((skill, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <div key={sectionId} className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest whitespace-nowrap">Key Projects</h3>
              <div className="h-px bg-slate-300 w-full"></div>
            </div>
            <div className="space-y-4">
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-sm text-slate-800">{proj.name}</h4>
                  </div>
                  <div className="text-sm italic text-slate-600 mb-1">{proj.technologies}</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        const customSection = (resume.customSections || []).find(s => s.id === sectionId);
        if (customSection) {
          return (
            <div key={sectionId} className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest whitespace-nowrap">{customSection.title}</h3>
                <div className="h-px bg-slate-300 w-full"></div>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{customSection.content}</p>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className="px-10 py-12 bg-white text-left font-sans w-[800px] min-h-[1056px] mx-auto shadow-sm">
      {renderSection('profile', 0)}
      
      {profile.summary && (
        <div className="mb-6">
          <p className="text-sm text-slate-700 leading-relaxed text-justify whitespace-pre-line">
            {profile.summary}
          </p>
        </div>
      )}

      {sectionOrder.map((sectionId, index) => renderSection(sectionId, index))}
    </div>
  );
}
