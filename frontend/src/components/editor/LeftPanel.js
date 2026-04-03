'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { localUpdateResume } from '@/store/resumeSlice';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { LayoutTemplate, Layers, Palette, GripVertical, Plus, Trash2 } from 'lucide-react';

const templates = [
  { id: 'modern', name: 'Modern', color: 'bg-brand/10 text-brand border-brand/20' },
  { id: 'classic', name: 'Classic', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'minimal', name: 'Minimal', color: 'bg-gray-50 text-gray-600 border-gray-200' },
  { id: 'bold', name: 'Bold', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'professional', name: 'Professional', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  { id: 'creative', name: 'Creative', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
];

const availableSections = [
  { id: 'profile', label: 'Personal Info' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
];

const colorThemes = [
  { id: 'brand', name: 'Default Blue', hex: '#534AB7' },
  { id: 'emerald', name: 'Emerald', hex: '#10b981' },
  { id: 'rose', name: 'Rose', hex: '#f43f5e' },
  { id: 'amber', name: 'Amber', hex: '#f59e0b' },
  { id: 'slate', name: 'Slate', hex: '#334155' },
  { id: 'violet', name: 'Violet', hex: '#8b5cf6' },
];

const fontFamilies = [
  { id: 'var(--font-inter)', name: 'Inter (Sans)' },
  { id: 'var(--font-merriweather)', name: 'Merriweather (Serif)' },
  { id: 'var(--font-fira)', name: 'Fira Code (Mono)' },
  { id: 'var(--font-roboto-slab)', name: 'Roboto Slab' },
];

export default function LeftPanel() {
  const dispatch = useDispatch();
  const { currentResume } = useSelector((state) => state.resume);
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'sections'
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!currentResume) return null;

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(currentResume.sectionOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch(localUpdateResume({ sectionOrder: items }));
  };

  const handleTemplateChange = (templateId) => {
    dispatch(localUpdateResume({ template: templateId }));
  };

  const handleAddCustomSection = () => {
    const newId = `custom-${Date.now()}`;
    const newSection = {
      id: newId,
      title: 'New Custom Section',
      content: ''
    };
    
    // Add to customSections array AND sectionOrder
    const updatedCustomSections = [...(currentResume.customSections || []), newSection];
    const updatedSectionOrder = [...currentResume.sectionOrder, newId];
    
    dispatch(localUpdateResume({ 
      customSections: updatedCustomSections,
      sectionOrder: updatedSectionOrder 
    }));
  };

  const handleRemoveCustomSection = (id) => {
    const updatedCustomSections = (currentResume.customSections || []).filter(s => s.id !== id);
    const updatedSectionOrder = currentResume.sectionOrder.filter(sId => sId !== id);
    
    dispatch(localUpdateResume({ 
      customSections: updatedCustomSections,
      sectionOrder: updatedSectionOrder 
    }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-surface-200 shrink-0">
        <button
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'templates' 
              ? 'border-brand text-brand bg-brand/5' 
              : 'border-transparent text-surface-500 hover:text-surface-700 hover:bg-surface-50'
          }`}
          onClick={() => setActiveTab('templates')}
        >
          <LayoutTemplate className="w-4 h-4" />
          Templates
        </button>
        <button
           className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'sections' 
              ? 'border-brand text-brand bg-brand/5' 
              : 'border-transparent text-surface-500 hover:text-surface-700 hover:bg-surface-50'
          }`}
          onClick={() => setActiveTab('sections')}
        >
          <Layers className="w-4 h-4" />
          Sections
        </button>
        <button
           className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'design' 
              ? 'border-brand text-brand bg-brand/5' 
              : 'border-transparent text-surface-500 hover:text-surface-700 hover:bg-surface-50'
          }`}
          onClick={() => setActiveTab('design')}
        >
          <Palette className="w-4 h-4" />
          Design
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'templates' ? (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Available Templates</h3>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleTemplateChange(tpl.id)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                    ${currentResume.template === tpl.id 
                      ? 'border-brand bg-brand/5 shadow-sm ring-2 ring-brand/20 ring-offset-1' 
                      : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'}
                  `}
                >
                  <div className={`w-8 h-10 mb-2 rounded border shadow-sm ${tpl.color}`}></div>
                  <span className={`text-sm font-medium ${currentResume.template === tpl.id ? 'text-brand' : 'text-surface-700'}`}>
                    {tpl.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : activeTab === 'design' ? (
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Color Theme</h3>
              <div className="flex flex-wrap gap-3">
                {colorThemes.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => dispatch(localUpdateResume({ theme: { ...(currentResume.theme || {}), colorTheme: color.hex } }))}
                    className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center
                      ${(currentResume.theme?.colorTheme || '#534AB7') === color.hex ? 'border-surface-900 ring-2 ring-offset-2 ring-surface-300' : 'border-transparent'}
                    `}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Typography</h3>
              <div className="space-y-2">
                {fontFamilies.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => dispatch(localUpdateResume({ theme: { ...(currentResume.theme || {}), fontFamily: font.id } }))}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors
                      ${(currentResume.theme?.fontFamily || 'var(--font-inter)') === font.id ? 'border-brand bg-brand/5 text-brand' : 'border-surface-200 hover:border-surface-300 text-surface-700 hover:bg-surface-50'}
                    `}
                    style={{ fontFamily: font.id }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Layout Editor</h3>
              <p className="text-xs text-surface-400">Drag items to reorder resume sections.</p>
            </div>
            
            {isMounted && (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {currentResume.sectionOrder.map((sectionId, index) => {
                        let sectionInfo = availableSections.find(s => s.id === sectionId);
                        let isCustom = false;
                        
                        // If not a default section, check if it's custom
                        if (!sectionInfo) {
                          const customSection = (currentResume.customSections || []).find(s => s.id === sectionId);
                          if (customSection) {
                            sectionInfo = { id: sectionId, label: customSection.title || 'Custom Section' };
                            isCustom = true;
                          } else {
                            return null;
                          }
                        }

                        return (
                          <Draggable key={sectionId} draggableId={sectionId} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`
                                  flex items-center p-3 rounded-lg border transition-all text-sm font-medium
                                  ${snapshot.isDragging 
                                    ? 'bg-brand text-white border-brand shadow-lg scale-105 z-50' 
                                    : 'bg-white text-surface-700 border-surface-200 hover:border-surface-300 hover:shadow-sm'}
                                `}
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className={`mr-3 p-1 rounded hover:bg-black/5 -ml-1 ${snapshot.isDragging ? 'text-white/80' : 'text-surface-400'}`}
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>
                                <button 
                                  className="flex-1 truncate text-left focus:outline-none" 
                                  onClick={() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                >
                                  {sectionInfo.label}
                                </button>
                                {isCustom && (
                                  <button
                                    onClick={() => handleRemoveCustomSection(sectionId)}
                                    className={`p-1 rounded transition-colors ${snapshot.isDragging ? 'text-white hover:bg-white/20' : 'text-surface-400 hover:text-red-500 hover:bg-red-50'}`}
                                    title="Remove Section"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}

            <button
              onClick={handleAddCustomSection}
              className="mt-6 w-full py-2.5 border border-dashed border-brand/50 bg-brand/5 text-brand rounded-lg text-sm font-medium hover:bg-brand/10 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Custom Section
            </button>
          </div>

        )}
      </div>
    </div>
  );
}
