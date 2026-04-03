'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { localUpdateResume } from '@/store/resumeSlice';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function EducationSection() {
  const dispatch = useDispatch();
  const { currentResume } = useSelector((state) => state.resume);
  const education = currentResume.education || [];
  
  const [expandedId, setExpandedId] = useState(education[0]?.id || null);

  const updateEducationList = (newList) => {
    dispatch(localUpdateResume({ education: newList }));
  };

  const addEducation = () => {
    const newId = `edu-${Date.now()}`;
    updateEducationList([
      ...education,
      {
        id: newId,
        degree: '',
        school: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: ''
      }
    ]);
    setExpandedId(newId);
  };

  const removeEducation = (id) => {
    updateEducationList(education.filter(edu => edu.id !== id));
  };

  const updateItem = (id, field, value) => {
    updateEducationList(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(education);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateEducationList(items);
  };

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="education">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {education.map((edu, index) => (
                <Draggable key={edu.id} draggableId={edu.id} index={index}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                        snapshot.isDragging ? 'shadow-lg border-brand scale-[1.02] bg-white' : 'border-surface-200 bg-white hover:border-surface-300'
                      }`}
                    >
                      {/* Header */}
                      <div 
                        className={`p-4 flex items-center justify-between cursor-pointer ${expandedId === edu.id ? 'bg-surface-50/50 border-b border-surface-100' : ''}`}
                        onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div {...provided.dragHandleProps} className="text-surface-400 hover:text-brand cursor-grab pb-1" onClick={e => e.stopPropagation()}>
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <div className="truncate">
                            <h4 className="font-semibold text-surface-900 truncate">{edu.degree || '(Not specified)'}</h4>
                            <p className="text-sm text-surface-500 truncate">{edu.school || 'School'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                            className="p-1.5 text-surface-400 hover:text-red-600 rounded"
                            onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {expandedId === edu.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>

                      {/* Content */}
                      {expandedId === edu.id && (
                        <div className="p-5 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                              <label className="label-text">Degree</label>
                              <input
                                type="text"
                                className="input-field"
                                value={edu.degree}
                                onChange={(e) => updateItem(edu.id, 'degree', e.target.value)}
                                placeholder="e.g. Master of Business Administration"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="label-text">School / University</label>
                              <input
                                type="text"
                                className="input-field"
                                value={edu.school}
                                onChange={(e) => updateItem(edu.id, 'school', e.target.value)}
                                placeholder="e.g. Stanford University"
                              />
                            </div>
                            <div>
                              <label className="label-text">Start Date</label>
                              <input
                                type="text"
                                className="input-field"
                                value={edu.startDate}
                                onChange={(e) => updateItem(edu.id, 'startDate', e.target.value)}
                                placeholder="e.g. Sep 2018"
                              />
                            </div>
                            <div>
                              <label className="label-text">End Date / Expected</label>
                              <input
                                type="text"
                                className="input-field"
                                value={edu.endDate}
                                onChange={(e) => updateItem(edu.id, 'endDate', e.target.value)}
                                placeholder="e.g. Jun 2020"
                              />
                            </div>
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
        onClick={addEducation}
        className="w-full py-3 mt-4 border-2 border-dashed border-surface-300 rounded-xl text-surface-600 font-medium hover:border-brand hover:text-brand hover:bg-brand/5 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" /> Add Education
      </button>
    </div>
  );
}
