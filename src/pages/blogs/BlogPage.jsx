import React, { useState, useRef, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Plus, Edit2, Trash2, X, Calendar } from 'lucide-react';
import JoditEditor from 'jodit-react';
import { getBlogEditorConfig } from '../../lib/joditConfig';
import ListToolbar from '../../components/ListToolbar';
import { useFilteredPagination } from '../../hooks/useFilteredPagination';
import { getItemTimestamp } from '../../lib/activity';

const BlogPage = () => {
  const { blogs, addBlog, updateBlog, deleteBlog, uploadFile } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const editor = useRef(null);
  const [imageUploading, setImageUploading] = useState(false);
  
  const defaultBlog = { 
    title: '', 
    excerpt: '',
    author: 'Admin',
    category: 'General',
    image: '/blog-1.png',
    readingTime: '5 min read',
    tags: '',
    content: '', 
    status: 'Draft' 
  };
  
  const [currentBlog, setCurrentBlog] = useState(defaultBlog);

  const handleEdit = (blog) => {
    // Convert array tags to string if needed for edit
    const editableBlog = { ...blog, tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || '') };
    setCurrentBlog(editableBlog);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteBlog(id);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Format tags back to array
    const formattedBlog = {
      ...currentBlog,
      tags: currentBlog.tags ? currentBlog.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      // Ensure slug is created if it doesn't exist
      slug: currentBlog.slug || currentBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    };

    if (currentBlog.id) {
      updateBlog(currentBlog.id, formattedBlog);
    } else {
      addBlog({ ...formattedBlog, date: new Date().toISOString() });
    }
    setIsEditing(false);
    setCurrentBlog(defaultBlog);
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const url = await uploadFile(file);
      setCurrentBlog((prev) => ({ ...prev, image: url }));
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Upload failed');
    } finally {
      setImageUploading(false);
      e.target.value = '';
    }
  };

  const editorConfig = useMemo(
    () => getBlogEditorConfig('Start typing your rich text blog content here...'),
    []
  );

  const categories = useMemo(
    () => [...new Set(blogs.map((b) => b.category).filter(Boolean))].sort(),
    [blogs]
  );

  const list = useFilteredPagination(blogs, {
    searchFields: ['title', 'excerpt', 'author', 'category'],
    filterFns: {
      status: (item, val) => item.status === val,
      category: (item, val) => item.category === val,
    },
    sortFn: (a, b) => getItemTimestamp(b) - getItemTimestamp(a),
    pageSize: 9,
    defaultView: 'table',
  });

  if (isEditing) {
    return (
      <div className="glass p-8 rounded-xl max-w-5xl mx-auto animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[var(--color-primary-navy)]">
            {currentBlog.id ? 'Edit Blog Post' : 'New Blog Post'}
          </h2>
          <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                  value={currentBlog.title} 
                  onChange={e => setCurrentBlog({...currentBlog, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Short Summary)</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none resize-none"
                  value={currentBlog.excerpt} 
                  onChange={e => setCurrentBlog({...currentBlog, excerpt: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                    value={currentBlog.author} 
                    onChange={e => setCurrentBlog({...currentBlog, author: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input 
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                    value={currentBlog.category} 
                    onChange={e => setCurrentBlog({...currentBlog, category: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                  value={currentBlog.image} 
                  onChange={e => setCurrentBlog({...currentBlog, image: e.target.value})}
                  placeholder="/blog-1.png"
                />
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-[var(--color-primary-navy)] hover:file:bg-gray-200"
                    onChange={handleCoverImageUpload}
                    disabled={imageUploading}
                  />
                  {imageUploading && (
                    <span className="text-sm text-gray-500">Uploading…</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Comma separated)</label>
                <input 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                  value={currentBlog.tags} 
                  onChange={e => setCurrentBlog({...currentBlog, tags: e.target.value})}
                  placeholder="Safety, Logistics, Heavy Transport"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reading Time</label>
                  <input 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                    value={currentBlog.readingTime} 
                    onChange={e => setCurrentBlog({...currentBlog, readingTime: e.target.value})}
                    placeholder="5 min read"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent-gold)] outline-none"
                    value={currentBlog.status}
                    onChange={e => setCurrentBlog({...currentBlog, status: e.target.value})}
                  >
                    <option>Draft</option>
                    <option>Published</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-bold text-[var(--color-primary-navy)] mb-2 uppercase tracking-wide">
              Rich Text Content
            </label>
            <div className="rounded-lg overflow-hidden border border-gray-300 shadow-sm">
              <JoditEditor
                key={currentBlog.id ?? 'new-blog'}
                ref={editor}
                value={currentBlog.content || ''}
                config={editorConfig}
                tabIndex={1}
                onChange={(newContent) =>
                  setCurrentBlog((prev) => ({ ...prev, content: newContent }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-8 py-2 bg-[var(--color-primary-navy)] text-[var(--color-accent-gold)] rounded-lg font-black uppercase tracking-widest hover:bg-[var(--color-secondary-blue)] transition-colors shadow-lg">Save Post</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-primary-navy)]">Blog Posts</h1>
          <p className="text-gray-500 mt-1">Manage your website's blog content.</p>
        </div>
        <button 
          onClick={() => { setCurrentBlog(defaultBlog); setIsEditing(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent-gold)] text-[var(--color-primary-navy)] font-bold rounded-lg hover:brightness-110 transition-all shadow-md"
        >
          <Plus size={20} />
          New Post
        </button>
      </div>

      <ListToolbar
        search={list.search}
        onSearchChange={list.setSearch}
        searchPlaceholder="Search posts by title, author, category…"
        filterFields={[
          {
            key: 'status',
            label: 'Status',
            value: list.filters.status || 'all',
            onChange: (v) => list.setFilter('status', v),
            options: [
              { value: 'all', label: 'All statuses' },
              { value: 'Published', label: 'Published' },
              { value: 'Draft', label: 'Draft' },
            ],
          },
          {
            key: 'category',
            label: 'Category',
            value: list.filters.category || 'all',
            onChange: (v) => list.setFilter('category', v),
            options: [
              { value: 'all', label: 'All categories' },
              ...categories.map((c) => ({ value: c, label: c })),
            ],
          },
        ]}
        page={list.page}
        totalPages={list.totalPages}
        onPageChange={list.setPage}
        pageSize={list.pageSize}
        onPageSizeChange={list.setPageSize}
        totalCount={blogs.length}
        filteredCount={list.totalCount}
        viewMode={list.viewMode}
        onViewModeChange={list.setViewMode}
      />

      {list.totalCount === 0 ? (
        <div className="glass rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          {blogs.length === 0 ? 'No blog posts found. Create one!' : 'No posts match your filters.'}
        </div>
      ) : list.viewMode === 'table' ? (
        <div className="glass overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-600">Title</th>
                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-600">Category</th>
                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-600">Date</th>
                <th className="p-4 text-sm font-semibold uppercase tracking-wider text-gray-600">Status</th>
                <th className="p-4 text-right text-sm font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.paginated.map((blog) => (
                <tr key={blog.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="p-4 font-bold text-[var(--color-primary-navy)]">{blog.title}</td>
                  <td className="p-4 text-sm text-gray-500">{blog.category}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {blog.date ? new Date(blog.date).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        blog.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="mr-2 rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
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
          {list.paginated.map((blog) => (
            <div
              key={blog.id}
              className="glass flex flex-col overflow-hidden rounded-xl border border-gray-200 transition-all hover:shadow-xl"
            >
              <div className="border-b border-gray-100 p-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent-gold)]">
                    {blog.category}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      blog.status === 'Published'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {blog.status}
                  </span>
                </div>
                <h3 className="line-clamp-2 text-lg font-bold text-[var(--color-primary-navy)]">{blog.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">{blog.excerpt}</p>
                {blog.date && (
                  <p className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(blog.date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2 border-t border-gray-100 p-4">
                <button
                  onClick={() => handleEdit(blog)}
                  className="flex-1 rounded-lg bg-blue-50 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
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

export default BlogPage;
