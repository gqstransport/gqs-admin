import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Plus, Edit2, Trash2, X, Tag } from 'lucide-react';
import ListToolbar from '../../components/ListToolbar';
import { useFilteredPagination } from '../../hooks/useFilteredPagination';

const CATEGORY_MAP = {
  'heavy-transport': 'Heavy Transport Services',
  'heavy-machinery-rental': 'Heavy Machinery Rental',
  'hiab-boom-truck-services': 'Hiab & Boom Truck Services',
  'project-logistics-support': 'Project Logistics Support',
  'industrial-support-services': 'Industrial Support Services'
};

const ServicePage = () => {
  const { services, addService, updateService, deleteService } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState({
    slug: '',
    categorySlug: 'heavy-transport',
    title: '',
    description: '',
    overview: '',
    applications: '',
    features: '',
    fleetTypes: '',
    fleetCapacity: '',
    fleetAvailability: '',
    status: 'Active'
  });

  const handleEdit = (service) => {
    // Parse arrays back into comma separated strings for editing
    setCurrentService({
      ...service,
      applications: Array.isArray(service.applications) ? service.applications.join(', ') : (service.applications || ''),
      features: Array.isArray(service.features) ? service.features.join(', ') : (service.features || ''),
      fleetTypes: Array.isArray(service.fleetDetails?.types) ? service.fleetDetails.types.join(', ') : (service.fleetDetails?.types || ''),
      fleetCapacity: service.fleetDetails?.capacity || '',
      fleetAvailability: service.fleetDetails?.availability || '',
    });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this service?')) {
      deleteService(id);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Map fields back into standard structure with arrays
    const formattedService = {
      id: currentService.id,
      slug: currentService.slug || currentService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      categorySlug: currentService.categorySlug,
      title: currentService.title,
      description: currentService.description,
      overview: currentService.overview,
      applications: currentService.applications.split(',').map(s => s.trim()).filter(Boolean),
      features: currentService.features.split(',').map(s => s.trim()).filter(Boolean),
      fleetDetails: {
        types: currentService.fleetTypes.split(',').map(s => s.trim()).filter(Boolean),
        capacity: currentService.fleetCapacity,
        availability: currentService.fleetAvailability
      },
      status: currentService.status
    };

    if (currentService.id) {
      updateService(currentService.id, formattedService);
    } else {
      addService(formattedService);
    }
    setIsEditing(false);
    resetForm();
  };

  const list = useFilteredPagination(services, {
    searchFields: ['title', 'description', 'slug', 'categorySlug', 'overview'],
    filterFns: {
      status: (item, val) => (item.status || 'Active') === val,
      category: (item, val) => item.categorySlug === val,
    },
    sortFn: (a, b) => (a.title || '').localeCompare(b.title || ''),
    pageSize: 9,
    defaultView: 'table',
  });

  const resetForm = () => {
    setCurrentService({
      slug: '',
      categorySlug: 'heavy-transport',
      title: '',
      description: '',
      overview: '',
      applications: '',
      features: '',
      fleetTypes: '',
      fleetCapacity: '',
      fleetAvailability: '',
      status: 'Active'
    });
  };

  if (isEditing) {
    return (
      <div className="glass p-8 rounded-xl max-w-4xl mx-auto animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[var(--color-primary-navy)]">
            {currentService.id ? 'Edit Service details' : 'New Service Subpage'}
          </h2>
          <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Service Title</label>
              <input 
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                value={currentService.title} 
                onChange={e => setCurrentService({...currentService, title: e.target.value})}
                placeholder="e.g. Flatbed Trailer Rental"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Service Category</label>
              <select 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                value={currentService.categorySlug}
                onChange={e => setCurrentService({...currentService, categorySlug: e.target.value})}
              >
                {Object.entries(CATEGORY_MAP).map(([slug, name]) => (
                  <option key={slug} value={slug}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (auto-generates if empty)</label>
              <input 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                value={currentService.slug} 
                onChange={e => setCurrentService({...currentService, slug: e.target.value})}
                placeholder="e.g. flatbed-trailer-rental"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                value={currentService.status}
                onChange={e => setCurrentService({...currentService, status: e.target.value})}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Short Description (for lists)</label>
            <textarea 
              required
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none resize-none"
              value={currentService.description} 
              onChange={e => setCurrentService({...currentService, description: e.target.value})}
              placeholder="A brief 1-2 sentence description of the service..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Overview</label>
            <textarea 
              required
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none resize-none"
              value={currentService.overview} 
              onChange={e => setCurrentService({...currentService, overview: e.target.value})}
              placeholder="Write a complete, detailed overview of this service..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Applications / Use cases (Comma separated)</label>
              <textarea 
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none resize-none"
                value={currentService.applications} 
                onChange={e => setCurrentService({...currentService, applications: e.target.value})}
                placeholder="Construction material transport, Container logistics, Steel movement"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Key Features / Advantages (Comma separated)</label>
              <textarea 
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none resize-none"
                value={currentService.features} 
                onChange={e => setCurrentService({...currentService, features: e.target.value})}
                placeholder="Standard & Extendable decks, Secure tie-down systems, GPS tracked"
              />
            </div>
          </div>

          <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200/50 space-y-4">
            <h3 className="text-md font-bold text-[var(--color-primary-navy)] border-b border-gray-200 pb-2">Fleet Details (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Fleet Types (Comma separated)</label>
                <input 
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                  value={currentService.fleetTypes} 
                  onChange={e => setCurrentService({...currentService, fleetTypes: e.target.value})}
                  placeholder="e.g. 40ft Flatbed, Extendable Flatbed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Weight Capacity</label>
                <input 
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                  value={currentService.fleetCapacity} 
                  onChange={e => setCurrentService({...currentService, fleetCapacity: e.target.value})}
                  placeholder="e.g. Up to 50 Tons"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Availability / Lead time</label>
              <input 
                className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                value={currentService.fleetAvailability} 
                onChange={e => setCurrentService({...currentService, fleetAvailability: e.target.value})}
                placeholder="e.g. Immediate mobilization across Saudi Arabia"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => { setIsEditing(false); resetForm(); }} className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-[var(--color-primary-navy)] text-white rounded-lg font-medium hover:bg-[var(--color-secondary-blue)] shadow-md">Save Service</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-primary-navy)]">Core Services</h1>
          <p className="text-gray-500 mt-1">Manage all the individual service subpages offered by GQS.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsEditing(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent-gold)] text-[var(--color-primary-navy)] font-bold rounded-lg hover:brightness-110 shadow-md"
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>

      <ListToolbar
        search={list.search}
        onSearchChange={list.setSearch}
        searchPlaceholder="Search services by title, slug, description…"
        filterFields={[
          {
            key: 'status',
            label: 'Status',
            value: list.filters.status || 'all',
            onChange: (v) => list.setFilter('status', v),
            options: [
              { value: 'all', label: 'All statuses' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ],
          },
          {
            key: 'category',
            label: 'Category',
            value: list.filters.category || 'all',
            onChange: (v) => list.setFilter('category', v),
            options: [
              { value: 'all', label: 'All categories' },
              ...Object.entries(CATEGORY_MAP).map(([slug, name]) => ({
                value: slug,
                label: name,
              })),
            ],
          },
        ]}
        page={list.page}
        totalPages={list.totalPages}
        onPageChange={list.setPage}
        pageSize={list.pageSize}
        onPageSizeChange={list.setPageSize}
        totalCount={services.length}
        filteredCount={list.totalCount}
        viewMode={list.viewMode}
        onViewModeChange={list.setViewMode}
      />

      {list.totalCount === 0 ? (
        <div className="glass rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          {services.length === 0 ? 'No services found. Add one!' : 'No services match your filters.'}
        </div>
      ) : list.viewMode === 'table' ? (
        <div className="glass overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-600">Service Name</th>
                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-600">Category</th>
                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-600">Status</th>
                <th className="p-4 text-right text-sm font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.paginated.map((service) => (
                <tr key={service.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="w-2/5 p-4">
                    <div className="font-bold text-[var(--color-primary-navy)]">{service.title}</div>
                    <div className="text-xs text-gray-400">/{service.slug}</div>
                  </td>
                  <td className="w-1/4 p-4">
                    <span className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Tag size={14} className="text-[var(--color-accent-gold)]" />
                      {CATEGORY_MAP[service.categorySlug] || service.categorySlug}
                    </span>
                  </td>
                  <td className="w-1/6 p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        service.status !== 'Inactive'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {service.status || 'Active'}
                    </span>
                  </td>
                  <td className="w-1/6 p-4 text-right">
                    <button
                      onClick={() => handleEdit(service)}
                      className="mr-2 rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.paginated.map((service) => (
            <div
              key={service.id}
              className="glass flex flex-col rounded-xl border border-gray-200 p-5 transition-all hover:shadow-xl"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="flex items-center gap-1 text-xs font-bold text-gray-500">
                  <Tag size={12} className="text-[var(--color-accent-gold)]" />
                  {CATEGORY_MAP[service.categorySlug] || service.categorySlug}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    service.status !== 'Inactive'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {service.status || 'Active'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[var(--color-primary-navy)]">{service.title}</h3>
              <p className="text-xs text-gray-400">/{service.slug}</p>
              <p className="mt-3 line-clamp-3 flex-1 text-sm text-gray-600">{service.description}</p>
              <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 rounded-lg bg-blue-50 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="flex-1 rounded-lg bg-red-50 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicePage;
