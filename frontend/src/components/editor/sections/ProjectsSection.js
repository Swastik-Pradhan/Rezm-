'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { localUpdateResume } from '@/store/resumeSlice';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function ProjectsSection() {
  const dispatch = useDispatch();
  const { currentResume } = useSelector((state) => state.resume);
  const projects = currentResume.projects || [];
  
  const [expandedId, setExpandedId] = useState(projects[0]?.id || null);

  const updateProjectsList = (newList) => {
    dispatch(localUpdateResume({ projects: newList }));
  };

  const addProject = () => {
    const newId = `proj-${Date.now()}`;
    updateProjectsList([
      ...projects,
      {
        id: newId,
        name: '',
        description: '',
        technologies: '',
        link: ''
      }
    ]);
    setExpandedId(newId);
  };

  const removeProject = (id) => {
    updateProjectsList(projects.filter(proj => proj.id !== id));
  };

  const updateItem = (id, field, value) => {
    updateProjectsList(projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateProjectsList(items);
  };

  return (
    <div className="space-y-4">
      <p className="text-surface-500 text-sm mb-6">Showcase your best work, side projects, or open-source contributions.</p>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="projects">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {projects.map((proj, index) => (
                <Draggable key={proj.id} draggableId={proj.id} index={index}>
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
                        className={`p-4 flex items-center justify-between cursor-pointer ${expandedId === proj.id ? 'bg-surface-50/50 border-b border-surface-100' : ''}`}
                        onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div {...provided.dragHandleProps} className="text-surface-400 hover:text-brand cursor-grab pb-1" onClick={e => e.stopPropagation()}>
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <div className="truncate">
                            <h4 className="font-semibold text-surface-900 truncate">{proj.name || '(Untitled Project)'}</h4>
                            <p className="text-sm text-surface-500 truncate">{proj.technologies || 'No tech stack defined'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                            className="p-1.5 text-surface-400 hover:text-red-600 rounded"
                            onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {expandedId === proj.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>

                      {/* Content */}
                      {expandedId === proj.id && (
                        <div className="p-5 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="label-text">Project Title</label>
                              <input
                                type="text"
                                className="input-field"
                                value={proj.name}
                                onChange={(e) => updateItem(proj.id, 'name', e.target.value)}
                                placeholder="e.g. EcoTrack Dashboard"
                              />
                            </div>
                            <div>
                              <label className="label-text">Project Link (URL)</label>
                              <input
                                type="url"
                                className="input-field"
                                value={proj.link}
                                onChange={(e) => updateItem(proj.id, 'link', e.target.value)}
                                placeholder="e.g. https://github.com/alex"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="label-text">Technologies Used</label>
                              <input
                                type="text"
                                className="input-field"
                                value={proj.technologies}
                                onChange={(e) => updateItem(proj.id, 'technologies', e.target.value)}
                                placeholder="e.g. React, D3.js, Node.js, AWS"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="label-text">Description</label>
                              <textarea
                                className="input-field min-h-[100px] resize-y"
                                value={proj.description}
                                onChange={(e) => updateItem(proj.id, 'description', e.target.value)}
                                placeholder="Describe what the project is, what you built, and the impact..."
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
        onClick={addProject}
        className="w-full py-3 mt-4 border-2 border-dashed border-surface-300 rounded-xl text-surface-600 font-medium hover:border-brand hover:text-brand hover:bg-brand/5 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" /> Add Project
      </button>
    </div>
  );
}
