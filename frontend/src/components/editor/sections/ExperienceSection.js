'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { localUpdateResume } from '@/store/resumeSlice';
import api from '@/lib/api';
import { Plus, Trash2, GripVertical, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function ExperienceSection() {
  const dispatch = useDispatch();
  const { currentResume } = useSelector((state) => state.resume);
  const experiences = currentResume.experience || [];
  const jobTitle = currentResume.profile?.jobTitle || '';
  
  const [expandedId, setExpandedId] = useState(experiences[0]?.id || null);
  const [enhancingBullet, setEnhancingBullet] = useState({ expId: null, index: null });

  const updateExperiences = (newExperiences) => {
    dispatch(localUpdateResume({ experience: newExperiences }));
  };

  const addExperience = () => {
    const newId = `exp-${Date.now()}`;
    updateExperiences([
      ...experiences,
      {
        id: newId,
        role: '',
        company: '',
        startDate: '',
        endDate: '',
        location: '',
        current: false,
        bullets: ['']
      }
    ]);
    setExpandedId(newId);
  };

  const removeExperience = (id) => {
    updateExperiences(experiences.filter(exp => exp.id !== id));
  };

  const updateItem = (id, field, value) => {
    updateExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const updateBullet = (expId, index, value) => {
    updateExperiences(experiences.map(exp => {
      if (exp.id === expId) {
        const newBullets = [...exp.bullets];
        newBullets[index] = value;
        return { ...exp, bullets: newBullets };
      }
      return exp;
    }));
  };

  const addBullet = (expId) => {
    updateExperiences(experiences.map(exp => 
      exp.id === expId ? { ...exp, bullets: [...exp.bullets, ''] } : exp
    ));
  };

  const removeBullet = (expId, index) => {
    updateExperiences(experiences.map(exp => {
      if (exp.id === expId) {
        return { ...exp, bullets: exp.bullets.filter((_, i) => i !== index) };
      }
      return exp;
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(experiences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateExperiences(items);
  };

  const enhanceBulletWithAI = async (expId, index, text) => {
    if (!text || text.trim().length < 5) return;
    
    setEnhancingBullet({ expId, index });
    try {
      const res = await api.post('/ai/enhance', {
        text,
        jobTitle,
        section: 'bullet'
      });
      updateBullet(expId, index, res.data.enhanced);
    } catch (err) {
      console.error(err);
      alert('Failed to enhance bullet point');
    } finally {
      setEnhancingBullet({ expId: null, index: null });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-surface-500 text-sm mb-6">Detail your roles, responsibilities, and achievements.</p>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="experiences">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {experiences.map((exp, index) => (
                <Draggable key={exp.id} draggableId={exp.id} index={index}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`border rounded-xl bg-white overflow-hidden transition-all duration-200 ${
                        snapshot.isDragging ? 'shadow-lg border-brand scale-[1.02]' : 'border-surface-200 hover:border-surface-300'
                      }`}
                    >
                      {/* Header (Collapsed View) */}
                      <div 
                        className={`p-4 flex items-center justify-between cursor-pointer ${expandedId === exp.id ? 'bg-surface-50/50 border-b border-surface-100' : ''}`}
                        onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div {...provided.dragHandleProps} className="text-surface-400 hover:text-brand cursor-grab pb-1" onClick={e => e.stopPropagation()}>
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <div className="truncate">
                            <h4 className="font-semibold text-surface-900 truncate">{exp.role || '(Not specified)'}</h4>
                            <p className="text-sm text-surface-500 truncate">{exp.company || 'Company'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                            className="p-1.5 text-surface-400 hover:text-red-600 rounded transition-colors"
                            onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {expandedId === exp.id ? <ChevronUp className="w-5 h-5 text-surface-400" /> : <ChevronDown className="w-5 h-5 text-surface-400" />}
                        </div>
                      </div>

                      {/* Expanded Form */}
                      {expandedId === exp.id && (
                        <div className="p-5 space-y-4 bg-white">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="label-text">Job Title</label>
                              <input
                                type="text"
                                className="input-field"
                                value={exp.role}
                                onChange={(e) => updateItem(exp.id, 'role', e.target.value)}
                                placeholder="e.g. Senior Product Designer"
                              />
                            </div>
                            <div>
                              <label className="label-text">Company</label>
                              <input
                                type="text"
                                className="input-field"
                                value={exp.company}
                                onChange={(e) => updateItem(exp.id, 'company', e.target.value)}
                                placeholder="e.g. Vertex Creative Systems"
                              />
                            </div>
                            <div>
                              <label className="label-text">Start Date</label>
                              <input
                                type="text"
                                className="input-field"
                                value={exp.startDate}
                                onChange={(e) => updateItem(exp.id, 'startDate', e.target.value)}
                                placeholder="e.g. Jan 2021"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="label-text !mb-0">End Date</label>
                                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-surface-600">
                                  <input
                                    type="checkbox"
                                    className="rounded border-surface-300 text-brand focus:ring-brand"
                                    checked={exp.current}
                                    onChange={(e) => {
                                      updateItem(exp.id, 'current', e.target.checked);
                                      if (e.target.checked) updateItem(exp.id, 'endDate', 'Present');
                                    }}
                                  />
                                  Current Role
                                </label>
                              </div>
                              <input
                                type="text"
                                className="input-field"
                                value={exp.endDate}
                                disabled={exp.current}
                                onChange={(e) => updateItem(exp.id, 'endDate', e.target.value)}
                                placeholder="e.g. Present"
                              />
                            </div>
                          </div>

                          <div className="pt-2">
                            <label className="label-text mb-3">Description Bullets</label>
                            <div className="space-y-3">
                              {exp.bullets.map((bullet, i) => (
                                <div key={i} className="flex gap-2 items-start group">
                                  <div className="flex-1 relative">
                                    <textarea
                                      className="input-field min-h-[60px] resize-y py-2 pr-28 text-sm"
                                      value={bullet}
                                      onChange={(e) => updateBullet(exp.id, i, e.target.value)}
                                      placeholder="Describe your responsibilities and achievements..."
                                    />
                                    {/* AI Enhance Button Absolute Position */}
                                    <button
                                      onClick={() => enhanceBulletWithAI(exp.id, i, bullet)}
                                      disabled={enhancingBullet.expId === exp.id && enhancingBullet.index === i || !bullet.trim()}
                                      className={`absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors
                                        ${bullet.trim().length > 0 
                                          ? 'bg-brand/10 text-brand hover:bg-brand/20' 
                                          : 'bg-surface-100 text-surface-400 opacity-50 cursor-not-allowed hidden group-hover:flex'}`}
                                      title="Revise with AI"
                                    >
                                      {enhancingBullet.expId === exp.id && enhancingBullet.index === i ? (
                                        <div className="w-3 h-3 border-2 border-brand/30 border-t-brand rounded-full animate-spin"></div>
                                      ) : (
                                        <Sparkles className="w-3 h-3" />
                                      )}
                                      Enhance
                                    </button>
                                  </div>
                                  <button
                                    className="p-2 mt-1 bg-surface-100 text-surface-500 hover:bg-red-50 hover:text-red-600 text-sm rounded transition-colors opacity-0 group-hover:opacity-100"
                                    onClick={() => removeBullet(exp.id, i)}
                                    title="Remove Bullet"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <button
                              className="mt-3 flex items-center gap-1 text-sm text-brand font-medium hover:text-brand-light transition-colors"
                              onClick={() => addBullet(exp.id)}
                            >
                              <Plus className="w-4 h-4" /> Add another bullet
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button
        onClick={addExperience}
        className="w-full py-3 mt-4 border-2 border-dashed border-surface-300 rounded-xl text-surface-600 font-medium hover:border-brand hover:text-brand hover:bg-brand/5 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" /> Add Experience
      </button>
    </div>
  );
}
