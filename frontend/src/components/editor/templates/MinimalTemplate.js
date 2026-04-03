export default function MinimalTemplate({ resume }) {
  const { profile = {}, experience = [], education = [], skills = [], projects = [], sectionOrder = [] } = resume;

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'profile':
        return (
          <div key={sectionId} className="mb-10 text-center">
            <h1 className="text-4xl font-light text-gray-900 tracking-tight">{profile.fullName || 'Your Name'}</h1>
            <h2 className="text-lg text-gray-500 font-light mt-1">{profile.jobTitle || 'Professional Title'}</h2>
            <div className="flex justify-center flex-wrap gap-4 mt-4 text-xs text-gray-400 uppercase tracking-widest">
              {profile.email && <span>{profile.email}</span>}
              {profile.phone && <span>{profile.phone}</span>}
              {profile.linkedin && <span>{profile.linkedin.replace('https://', '')}</span>}
            </div>
          </div>
        );

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <div key={sectionId} className="mb-8 flex">
            <div className="w-1/4 pr-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest pt-1">Experience</h3>
            </div>
            <div className="w-3/4 space-y-6">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-medium text-gray-900">{exp.role} — {exp.company}</h4>
                    <span className="text-xs text-gray-400">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1 pl-4 list-square mt-2">
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
          <div key={sectionId} className="mb-8 flex">
            <div className="w-1/4 pr-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest pt-1">Education</h3>
            </div>
            <div className="w-3/4 space-y-4">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-medium text-gray-900">{edu.school}</h4>
                    <span className="text-xs text-gray-400">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-sm text-gray-600">{edu.degree}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div key={sectionId} className="mb-8 flex">
            <div className="w-1/4 pr-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest pt-1">Skills</h3>
            </div>
            <div className="w-3/4 text-sm text-gray-600 leading-relaxed">
              {skills.join(' • ')}
            </div>
          </div>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <div key={sectionId} className="mb-8 flex">
            <div className="w-1/4 pr-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest pt-1">Projects</h3>
            </div>
            <div className="w-3/4 space-y-4">
              {projects.map(proj => (
                <div key={proj.id}>
                  <h4 className="font-medium text-gray-900">{proj.name}</h4>
                  <div className="text-xs text-gray-400 mb-1">{proj.technologies}</div>
                  <p className="text-sm text-gray-600">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        const customSection = (resume.customSections || []).find(s => s.id === sectionId);
        if (customSection) {
          return (
            <div key={sectionId} className="mb-8 flex">
              <div className="w-1/4 pr-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest pt-1">{customSection.title}</h3>
              </div>
              <div className="w-3/4 text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {customSection.content}
              </div>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className="p-12 bg-white text-left font-sans w-[800px] min-h-[1056px] mx-auto shadow-sm">
      {renderSection('profile')}
      
      {profile.summary && (
        <div className="mb-8 flex">
          <div className="w-1/4 pr-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest pt-1">About</h3>
          </div>
          <div className="w-3/4 text-sm text-gray-600 whitespace-pre-line leading-relaxed">
            {profile.summary}
          </div>
        </div>
      )}

      {sectionOrder.map(sectionId => sectionId !== 'profile' && renderSection(sectionId))}
    </div>
  );
}
