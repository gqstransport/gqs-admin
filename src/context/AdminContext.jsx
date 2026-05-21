import React, { createContext, useContext, useState, useEffect } from 'react';
import { authFetch, API_BASE } from '../lib/auth';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);

  const BLOGS_API = '/api/blogs';
  const PROJECTS_API = '/api/projects';
  const SERVICES_API = '/api/services';

  useEffect(() => {
    if (!isAuthenticated) return;

    authFetch(BLOGS_API)
      .then((res) => res.json())
      .then((data) => setBlogs(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Error fetching blogs:', err));

    authFetch(PROJECTS_API)
      .then((res) => res.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Error fetching projects:', err));

    authFetch(SERVICES_API)
      .then((res) => res.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Error fetching services:', err));
  }, [isAuthenticated]);

  const addBlog = async (blog) => {
    const newBlog = { ...blog, id: Date.now().toString() };
    setBlogs([...blogs, newBlog]);
    try {
      await authFetch(BLOGS_API, {
        method: 'POST',
        body: JSON.stringify(newBlog),
      });
    } catch (err) {
      console.error('Error adding blog:', err);
    }
  };

  const updateBlog = async (id, updatedBlog) => {
    setBlogs(blogs.map((b) => (b.id === id ? { ...b, ...updatedBlog } : b)));
    try {
      await authFetch(BLOGS_API, {
        method: 'PUT',
        body: JSON.stringify({ id, ...updatedBlog }),
      });
    } catch (err) {
      console.error('Error updating blog:', err);
    }
  };

  const deleteBlog = async (id) => {
    setBlogs(blogs.filter((b) => b.id !== id));
    try {
      await authFetch(`${BLOGS_API}?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting blog:', err);
    }
  };

  const addProject = async (project) => {
    const newProject = { ...project, id: Date.now().toString() };
    setProjects([...projects, newProject]);
    try {
      await authFetch(PROJECTS_API, {
        method: 'POST',
        body: JSON.stringify(newProject),
      });
    } catch (err) {
      console.error('Error adding project:', err);
    }
  };

  const updateProject = async (id, updatedProject) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, ...updatedProject } : p)));
    try {
      await authFetch(PROJECTS_API, {
        method: 'PUT',
        body: JSON.stringify({ id, ...updatedProject }),
      });
    } catch (err) {
      console.error('Error updating project:', err);
    }
  };

  const deleteProject = async (id) => {
    setProjects(projects.filter((p) => p.id !== id));
    try {
      await authFetch(`${PROJECTS_API}?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const addService = async (service) => {
    const newService = { ...service, id: Date.now().toString() };
    setServices([...services, newService]);
    try {
      await authFetch(SERVICES_API, {
        method: 'POST',
        body: JSON.stringify(newService),
      });
    } catch (err) {
      console.error('Error adding service:', err);
    }
  };

  const updateService = async (id, updatedService) => {
    setServices(services.map((s) => (s.id === id ? { ...s, ...updatedService } : s)));
    try {
      await authFetch(SERVICES_API, {
        method: 'PUT',
        body: JSON.stringify({ id, ...updatedService }),
      });
    } catch (err) {
      console.error('Error updating service:', err);
    }
  };

  const deleteService = async (id) => {
    setServices(services.filter((s) => s.id !== id));
    try {
      await authFetch(`${SERVICES_API}?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await authFetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return `${API_BASE}${data.url}`;
  };

  return (
    <AdminContext.Provider
      value={{
        blogs,
        addBlog,
        updateBlog,
        deleteBlog,
        projects,
        addProject,
        updateProject,
        deleteProject,
        services,
        addService,
        updateService,
        deleteService,
        uploadFile,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
