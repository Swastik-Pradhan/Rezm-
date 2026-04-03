export default function ClassicTemplate({ resume }) {
  const { profile = {}, experience = [], education = [], skills = [], projects = [], sectionOrder = [] } = resume;

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'profile':
        return (
          <div key={sectionId} className="text-center border-b-2 border-slate-800 pb-4 mb-6">
            <h1 className="text-4xl font-serif text-slate-900 tracking-wide uppercase">{profile.fullName || 'Your Name'}</h1>
            {profile.jobTitle && <h2 className="text-lg text-slate-700 font-serif mt-2 italic">{profile.jobTitle}</h2>}
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-slate-600 font-serif">
              {profile.email && <span>{profile.email}</span>}
              {profile.email && profile.phone && <span>|</span>}
              {profile.phone && <span>{profile.phone}</span>}
              {profile.phone && profile.linkedin && <span>|</span>}
              {profile.linkedin && <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noreferrer" className="hover:text-slate-900 hover:underline">{profile.linkedin.replace('https://', '')}</a>}
              {profile.linkedin && profile.github && <span>|</span>}
              {profile.github && <a href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`} target="_blank" rel="noreferrer" className="hover:text-slate-900 hover:underline">{profile.github.replace('https://', '')}</a>}
            </div>
            {profile.summary && (
              <div className="mt-6 text-sm text-slate-800 leading-relaxed whitespace-pre-line text-justify text-left">
                {profile.summary}
              </div>
            )}
          </div>
        );

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <div key={sectionId} className="mb-6">
            <h3 className="text-lg font-serif font-bold text-slate-900 border-b border-slate-300 pb-1 mb-3 uppercase tracking-widest">Experience</h3>
            <div className="space-y-4">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-800 text-base">{exp.role}</h4>
                    <span className="text-sm text-slate-600 italic">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-700 mb-2">{exp.company}</div>
                  <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
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
            <h3 className="text-lg font-serif font-bold text-slate-900 border-b border-slate-300 pb-1 mb-3 uppercase tracking-widest">Education</h3>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-slate-800 text-base">{edu.degree}</h4>
                    <span className="text-sm text-slate-600 italic">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-sm text-slate-700">{edu.school}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div key={sectionId} className="mb-6">
            <h3 className="text-lg font-serif font-bold text-slate-900 border-b border-slate-300 pb-1 mb-3 uppercase tracking-widest">Skills</h3>
            <div className="text-sm text-slate-700 leading-relaxed">
              {skills.join(', ')}
            </div>
          </div>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <div key={sectionId} className="mb-6">
            <h3 className="text-lg font-serif font-bold text-slate-900 border-b border-slate-300 pb-1 mb-3 uppercase tracking-widest">Projects</h3>
            <div className="space-y-4">
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-800 text-base">
                      {proj.name}
                      {proj.link && <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} className="text-sm font-normal ml-2 text-slate-500 hover:underline hover:text-slate-800" target="_blank" rel="noreferrer">Link ↗</a>}
                    </h4>
                  </div>
                  <div className="text-sm italic text-slate-600 mb-1">{proj.technologies}</div>
                  <p className="text-sm text-slate-700">{proj.description}</p>
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
              <h3 className="text-lg font-serif font-bold text-slate-900 border-b border-slate-300 pb-1 mb-3 uppercase tracking-widest">{customSection.title}</h3>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed pb-1">{customSection.content}</p>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className="p-10 bg-white text-left font-serif w-[800px] min-h-[1056px] mx-auto shadow-sm">
      {sectionOrder.map(sectionId => renderSection(sectionId))}
    </div>
  );
}
