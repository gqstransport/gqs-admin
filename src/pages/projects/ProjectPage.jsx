import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Plus, Edit2, Trash2, X, MapPin, Image as ImageIcon } from 'lucide-react';
import ListToolbar from '../../components/ListToolbar';
import { useFilteredPagination } from '../../hooks/useFilteredPagination';
import { getItemTimestamp } from '../../lib/activity';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const ProjectPage = () => {
  const { projects, addProject, updateProject, deleteProject, uploadFile } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    title: '',
    scope: '',
    location: '',
    equipment: '',
    challenge: '',
    image: '',
    status: 'Completed'
  });

  const handleEdit = (project) => {
    setCurrentProject(project);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  const handleProjectImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const url = await uploadFile(file);
      setCurrentProject((prev) => ({ ...prev, image: url }));
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Upload failed');
    } finally {
      setImageUploading(false);
      e.target.value = '';
    }
  };

  const locations = useMemo(
    () => [...new Set(projects.map((p) => p.location).filter(Boolean))].sort(),
    [projects]
  );

  const list = useFilteredPagination(projects, {
    searchFields: ['title', 'scope', 'location', 'equipment', 'challenge', 'status'],
    filterFns: {
      status: (item, val) => item.status === val,
      location: (item, val) => item.location === val,
    },
    sortFn: (a, b) => getItemTimestamp(b) - getItemTimestamp(a),
    pageSize: 6,
    defaultView: 'cards',
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (currentProject.id) {
      updateProject(currentProject.id, currentProject);
    } else {
      addProject(currentProject);
    }
    setIsEditing(false);
    setCurrentProject({
      title: '',
      scope: '',
      location: '',
      equipment: '',
      challenge: '',
      image: '',
      status: 'Completed'
    });
  };

  if (isEditing) {
    return (
      <div className="glass p-8 rounded-xl max-w-4xl mx-auto animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[var(--color-primary-navy)]">
            {currentProject.id ? 'Edit Project Details' : 'New Project Entry'}
          </h2>
          <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Project Title</label>
              <input 
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                value={currentProject.title} 
                onChange={e => setCurrentProject({...currentProject, title: e.target.value})}
                placeholder="e.g. Industrial Plant Mobilization"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location / Site</label>
              <input 
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                value={currentProject.location} 
                onChange={e => setCurrentProject({...currentProject, location: e.target.value})}
                placeholder="e.g. Jubail Industrial Port"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL / Path</label>
              <input 
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                value={currentProject.image} 
                onChange={e => setCurrentProject({...currentProject, image: e.target.value})}
                placeholder="e.g. /project-1.png or https://example.com/image.jpg"
              />
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-[var(--color-primary-navy)] hover:file:bg-gray-200"
                  onChange={handleProjectImageUpload}
                  disabled={imageUploading}
                />
                {imageUploading && (
                  <span className="text-sm text-gray-500">Uploading…</span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Project Status</label>
              <select 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                value={currentProject.status}
                onChange={e => setCurrentProject({...currentProject, status: e.target.value})}
              >
                <option>Completed</option>
                <option>Ongoing</option>
                <option>Planned</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Equipment Deployed (Comma separated)</label>
            <input 
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
              value={currentProject.equipment} 
              onChange={e => setCurrentProject({...currentProject, equipment: e.target.value})}
              placeholder="e.g. Flatbed Trailers, 100T Cranes, Forklifts"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Scope of Work</label>
            <textarea 
              required
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none resize-none"
              value={currentProject.scope} 
              onChange={e => setCurrentProject({...currentProject, scope: e.target.value})}
              placeholder="Describe the main scope and tasks of the project..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Challenge Encountered & Solved</label>
            <textarea 
              required
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none resize-none"
              value={currentProject.challenge} 
              onChange={e => setCurrentProject({...currentProject, challenge: e.target.value})}
              placeholder="Describe the main challenges faced and how the team overcame them..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-[var(--color-primary-navy)] text-white rounded-lg font-medium hover:bg-[var(--color-secondary-blue)] shadow-md">Save Project</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-primary-navy)]">Portfolio Projects</h1>
          <p className="text-gray-500 mt-1">Manage the case studies and major work showcase displayed on GQS website.</p>
        </div>
        <button 
          onClick={() => { 
            setCurrentProject({ 
              title: '', 
              scope: '', 
              location: '', 
              equipment: '', 
              challenge: '', 
              image: '', 
              status: 'Completed' 
            }); 
            setIsEditing(true); 
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent-gold)] text-[var(--color-primary-navy)] font-bold rounded-lg hover:brightness-110 shadow-md"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>

      <ListToolbar
        search={list.search}
        onSearchChange={list.setSearch}
        searchPlaceholder="Search projects by title, location, scope…"
        filterFields={[
          {
            key: 'status',
            label: 'Status',
            value: list.filters.status || 'all',
            onChange: (v) => list.setFilter('status', v),
            options: [
              { value: 'all', label: 'All statuses' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Ongoing', label: 'Ongoing' },
              { value: 'Planned', label: 'Planned' },
            ],
          },
          {
            key: 'location',
            label: 'Location',
            value: list.filters.location || 'all',
            onChange: (v) => list.setFilter('location', v),
            options: [
              { value: 'all', label: 'All locations' },
              ...locations.map((loc) => ({ value: loc, label: loc })),
            ],
          },
        ]}
        page={list.page}
        totalPages={list.totalPages}
        onPageChange={list.setPage}
        pageSize={list.pageSize}
        onPageSizeChange={list.setPageSize}
        pageSizeOptions={[6, 9, 12, 18]}
        totalCount={projects.length}
        filteredCount={list.totalCount}
        viewMode={list.viewMode}
        onViewModeChange={list.setViewMode}
      />

      {list.totalCount === 0 ? (
        <div className="glass col-span-full rounded-xl p-12 text-center text-gray-500">
          {projects.length === 0
            ? 'No projects found. Add your first project!'
            : 'No projects match your filters.'}
        </div>
      ) : list.viewMode === 'cards' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.paginated.map((project) => (
            <div
              key={project.id}
              className="glass flex flex-col overflow-hidden rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-gray-200 bg-gray-100">
              {project.image ? (
                <img 
                    src={
                      project.image.startsWith('/')
                        ? `${API_BASE}${project.image}`
                        : project.image
                    }
                  alt={project.title} 
                    className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
                <div className="absolute inset-0 hidden flex-col items-center justify-center bg-gray-50 text-gray-400">
                <ImageIcon size={40} className="mb-2" />
                <span className="text-xs">No preview available</span>
              </div>
                <div className="absolute left-3 top-3">
                  <span
                    className={`rounded px-2.5 py-1 text-xs font-bold shadow ${
                      project.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                  {project.status}
                </span>
              </div>
            </div>
              <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-accent-gold)]">
                  <MapPin size={14} />
                  {project.location}
                  </div>
                  <h3 className="mb-2 line-clamp-1 text-xl font-bold text-[var(--color-primary-navy)]">
                    {project.title}
                  </h3>
                  <p className="mb-4 line-clamp-3 text-sm text-gray-600">{project.scope}</p>
                </div>
                <div className="flex gap-2 border-t border-gray-100 pt-4">
                  <button
                    onClick={() => handleEdit(project)}
                    className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition-all hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100"
                  >
                    Delete
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      ) : (
        <div className="glass overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-600">Project</th>
                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-600">Location</th>
                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-600">Scope</th>
                <th className="p-4 text-right text-sm font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.paginated.map((project) => (
                <tr key={project.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="p-4 font-bold text-[var(--color-primary-navy)]">{project.title}</td>
                  <td className="p-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-[var(--color-accent-gold)]" />
                      {project.location}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        project.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="max-w-xs p-4 text-sm text-gray-500">
                    <span className="line-clamp-2">{project.scope}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleEdit(project)}
                      className="mr-2 rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
