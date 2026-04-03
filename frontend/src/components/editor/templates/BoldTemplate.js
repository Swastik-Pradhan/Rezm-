export default function BoldTemplate({ resume }) {
  const { profile = {}, experience = [], education = [], skills = [], projects = [], sectionOrder = [] } = resume;

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'profile':
        return null; // Profile is rendered separately at the top

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <div key={sectionId} className="mb-8">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-[0.3em] mb-4 pb-2 border-b-2 border-amber-400">
              Experience
            </h3>
            <div className="space-y-5">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-base text-white">{exp.role}</h4>
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-4">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm text-amber-400 font-semibold mb-2">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                  <ul className="space-y-1.5">
                    {exp.bullets?.map((bullet, i) => (
                      <li key={i} className="text-sm text-slate-300 leading-relaxed flex gap-2">
                        <span className="text-amber-400 mt-1 shrink-0">▸</span>
                        <span>{bullet}</span>
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
          <div key={sectionId} className="mb-8">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-[0.3em] mb-4 pb-2 border-b-2 border-amber-400">
              Education
            </h3>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-sm text-white">{edu.degree}</h4>
                    <span className="text-xs text-slate-400 font-medium">{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <div className="text-sm text-amber-400 font-semibold">{edu.school}</div>
                  {edu.gpa && <div className="text-xs text-slate-400 mt-1">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div key={sectionId} className="mb-8">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-[0.3em] mb-4 pb-2 border-b-2 border-amber-400">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-700/50 border border-slate-600 text-slate-200 text-xs font-semibold rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <div key={sectionId} className="mb-8">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-[0.3em] mb-4 pb-2 border-b-2 border-amber-400">
              Projects
            </h3>
            <div className="space-y-4">
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-sm text-white">{proj.name}</h4>
                    {proj.link && <span className="text-xs text-amber-400 truncate max-w-[200px]">{proj.link}</span>}
                  </div>
                  <div className="text-xs text-amber-400/80 font-medium mb-1">{proj.technologies}</div>
                  <p className="text-sm text-slate-300 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        const customSection = (resume.customSections || []).find(s => s.id === sectionId);
        if (customSection) {
          return (
            <div key={sectionId} className="mb-8">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-[0.3em] mb-4 pb-2 border-b-2 border-amber-400">
                {customSection.title}
              </h3>
              <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{customSection.content}</p>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className="px-10 py-12 bg-slate-900 text-left font-sans w-[800px] min-h-[1056px] mx-auto">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-slate-700">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
          {profile.fullName || 'Your Name'}
        </h1>
        <h2 className="text-lg text-amber-400 font-bold tracking-widest uppercase mb-4">
          {profile.jobTitle || 'Professional Title'}
        </h2>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          {profile.email && <span className="hover:text-white transition-colors">{profile.email}</span>}
          {profile.phone && <span className="hover:text-white transition-colors">{profile.phone}</span>}
          {profile.linkedin && <span className="hover:text-white transition-colors">{profile.linkedin.replace('https://', '')}</span>}
          {profile.github && <span className="hover:text-white transition-colors">{profile.github.replace('https://', '')}</span>}
        </div>
      </div>

      {/* Summary */}
      {profile.summary && (
        <div className="mb-8 bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {profile.summary}
          </p>
        </div>
      )}

      {/* Sections */}
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
}
