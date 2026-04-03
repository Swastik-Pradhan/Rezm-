export default function CreativeTemplate({ resume }) {
  const { profile = {}, experience = [], education = [], skills = [], projects = [], sectionOrder = [] } = resume;

  const renderSection = (sectionId, index) => {
    switch (sectionId) {
      case 'profile':
        if (index !== 0) return null; // Handled separately at top
        return (
          <div key={sectionId} className="bg-emerald-900 text-white p-10 flex flex-col items-start rounded-b-3xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 flex gap-8 items-center w-full">
              {profile.photoUrl && (
                <img src={profile.photoUrl} alt={profile.fullName} className="w-28 h-28 rounded-full object-cover border-4 border-emerald-400 shadow-xl" />
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-extrabold tracking-tight">{profile.fullName || 'Your Name'}</h1>
                <h2 className="text-xl text-emerald-300 font-medium mt-1">{profile.jobTitle || 'Creative Professional'}</h2>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-emerald-100/80 font-medium">
                  {profile.email && <span>{profile.email}</span>}
                  {profile.phone && <span>{profile.phone}</span>}
                  {profile.linkedin && <span>{profile.linkedin.replace('https://', '')}</span>}
                </div>
              </div>
            </div>
            
            {profile.summary && (
              <div className="relative z-10 mt-8 pt-6 border-t border-emerald-700/50 w-full text-sm leading-relaxed text-emerald-50/90 whitespace-pre-line">
                {profile.summary}
              </div>
            )}
          </div>
        );

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <div key={sectionId} className="mb-10 px-10 relative">
            <div className="absolute left-[59px] top-10 bottom-0 w-px bg-emerald-100"></div>
            <h3 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm relative z-10">💼</span>
              Experience
            </h3>
            <div className="space-y-6">
              {experience.map(exp => (
                <div key={exp.id} className="relative pl-8">
                  <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white z-10"></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900 text-base">{exp.role}</h4>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-bold">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-emerald-600 mb-2">{exp.company}</div>
                  <ul className="text-sm text-gray-600 space-y-1.5 list-none">
                    {exp.bullets?.map((bullet, i) => (
                      <li key={i} className="relative pl-3">
                        <span className="absolute left-0 top-2 w-1 h-1 rounded-full bg-emerald-300"></span>
                        {bullet}
                      </li>
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
          <div key={sectionId} className="mb-10 px-10 relative">
            <h3 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">🎓</span>
              Education
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {education.map(edu => (
                <div key={edu.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors">
                  <div className="text-xs bg-emerald-100/50 text-emerald-700 px-2 py-0.5 rounded-md font-bold inline-block mb-2">{edu.startDate} - {edu.endDate}</div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{edu.degree}</h4>
                  <div className="text-sm text-gray-600">{edu.school}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div key={sectionId} className="mb-10 px-10">
            <h3 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">⚡</span>
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-white border border-emerald-100 text-emerald-800 rounded-lg text-xs font-bold shadow-sm whitespace-nowrap">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <div key={sectionId} className="mb-10 px-10">
            <h3 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">🚀</span>
              Selected Projects
            </h3>
            <div className="space-y-4">
              {projects.map(proj => (
                <div key={proj.id} className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="font-bold text-emerald-950 text-base">{proj.name}</h4>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {proj.technologies.split(',').map((tech, i) => (
                      <span key={i} className="text-[10px] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-600 font-bold">{tech.trim()}</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mt-2">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        const customSection = (resume.customSections || []).find(s => s.id === sectionId);
        if (customSection) {
          return (
             <div key={sectionId} className="mb-10 px-10">
              <h3 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">✨</span>
                {customSection.title}
              </h3>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed px-2 border-l-2 border-emerald-200 ml-3">
                {customSection.content}
              </p>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className="bg-white text-left font-sans w-[800px] min-h-[1056px] mx-auto shadow-sm pb-10">
      {renderSection('profile', 0)}
      {sectionOrder.map((sectionId, index) => renderSection(sectionId, index, true))}
    </div>
  );
}
