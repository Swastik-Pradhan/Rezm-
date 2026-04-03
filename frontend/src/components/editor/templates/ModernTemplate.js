export default function ModernTemplate({ resume }) {
  const { profile = {}, experience = [], education = [], skills = [], projects = [], sectionOrder = [] } = resume;

  const renderSection = (sectionId, index) => {
    switch (sectionId) {
      case 'profile':
      case 'profile':
        return (
          <div key={sectionId} className="border-b pb-6 mb-6">
            <div className="flex gap-6 items-center mb-6">
              {profile.photoUrl && (
                <img src={profile.photoUrl} alt={profile.fullName} className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-sm" />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{profile.fullName || 'Your Name'}</h1>
                {profile.jobTitle && <h2 className="text-xl text-brand font-medium mt-1">{profile.jobTitle}</h2>}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-600">
                  {profile.email && <span className="flex items-center gap-1">✉ {profile.email}</span>}
                  {profile.phone && <span className="flex items-center gap-1">☎ {profile.phone}</span>}
                  {profile.linkedin && <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand hover:underline">in/ {profile.linkedin.replace('https://', '')}</a>}
                  {profile.github && <a href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand hover:underline">gh/ {profile.github.replace('https://', '')}</a>}
                </div>
              </div>
            </div>
            {profile.summary && (
              <div>
                <p className="text-xs leading-loose text-gray-700 flex-1 whitespace-pre-line">{profile.summary}</p>
              </div>
            )}
          </div>
        );

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <div key={sectionId} className="mb-6">
            <h3 className="text-sm font-bold text-brand uppercase tracking-wider border-b-2 border-brand/20 pb-1 mb-3">Experience</h3>
            <div className="space-y-4">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-semibold text-gray-900">{exp.role}</h4>
                    <span className="text-xs text-gray-500 font-medium">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-2">{exp.company}</div>
                  <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 leading-relaxed">
                    {exp.bullets?.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
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
            <h3 className="text-sm font-bold text-brand uppercase tracking-wider border-b-2 border-brand/20 pb-1 mb-3">Education</h3>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                    <span className="text-xs text-gray-500 font-medium">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-sm text-gray-700">{edu.school}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div key={sectionId} className="mb-6">
            <h3 className="text-sm font-bold text-brand uppercase tracking-wider border-b-2 border-brand/20 pb-1 mb-3">Core Skills</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {skills.map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
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
            <h3 className="text-sm font-bold text-brand uppercase tracking-wider border-b-2 border-brand/20 pb-1 mb-3">Projects</h3>
            <div className="space-y-4">
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {proj.name} 
                      {proj.link && <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} className="text-brand ml-2 text-xs font-normal hover:underline" target="_blank" rel="noreferrer">Link ↗</a>}
                    </h4>
                  </div>
                  <div className="text-xs font-medium text-brand/80 mb-1">{proj.technologies}</div>
                  <p className="text-xs text-gray-600 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        // Handle custom sections fallback
        const customSection = (resume.customSections || []).find(s => s.id === sectionId);
        if (customSection) {
          return (
            <div key={sectionId} className="mb-6">
              <h3 className="text-sm font-bold text-brand uppercase tracking-wider border-b-2 border-brand/20 pb-1 mb-3">{customSection.title}</h3>
              <p className="text-xs leading-loose text-gray-700 whitespace-pre-line">{customSection.content}</p>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className="p-8 bg-white text-left font-sans text-sm w-[800px] min-h-[1056px] mx-auto shadow-sm">
      {sectionOrder.map((sectionId, index) => renderSection(sectionId, index))}
    </div>
  );
}
