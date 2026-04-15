import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Settings, FileText, Briefcase, Users, MessageSquare, 
  LogOut, Plus, Edit2, Trash2, Save, X, Image as ImageIcon, 
  Eye, EyeOff, ChevronRight, Search, Filter, AlertCircle, CheckCircle2,
  Palette, Type, Globe, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Camera
} from 'lucide-react';
import { useFirebase } from '../hooks/useFirebase';
import { 
  db, auth, loginWithGoogle, loginWithEmail, logout, collection, doc, getDocs, setDoc, updateDoc, deleteDoc, 
  Timestamp, handleFirestoreError, OperationType 
} from '../firebase';
import { cn, cleanImageUrl } from '../lib/utils';
import { Service, Project, BlogPost, TeamMember, SiteSettings, Message } from '../types';

export default function Admin() {
  const { user, isAdmin, isAuthor, isAuthReady, settings, services, projects, blogPosts, teamMembers, messages, allUsers, loading } = useFirebase();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'services' | 'projects' | 'blog' | 'team' | 'messages' | 'users'>('overview');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isEmailLogin, setIsEmailLogin] = useState(false);

  // New User Form State
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'author'>('author');

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (!isAuthReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-8"
        >
          <div className="bg-primary text-white p-6 rounded-2xl w-fit mx-auto">
            <LayoutDashboard size={48} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold text-primary">Admin Login</h1>
            <p className="text-gray-600">Access the ARKINOX management dashboard.</p>
          </div>

          {isEmailLogin ? (
            <form className="space-y-4 text-left" onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              try {
                await loginWithEmail(loginEmail, loginPassword);
              } catch (err: any) {
                setError(err.message || 'Login failed');
              }
            }}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-accent border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase">Password</label>
                <input 
                  type="password" 
                  required
                  className="w-full bg-accent border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button 
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-secondary transition-all shadow-xl"
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => setIsEmailLogin(false)}
                className="w-full text-gray-500 font-medium hover:text-primary transition-colors"
              >
                Back to Google Login
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <button 
                onClick={loginWithGoogle}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-secondary transition-all shadow-xl"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 bg-white rounded-full p-1" />
                Sign in with Google
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or</span></div>
              </div>
              <button 
                onClick={() => setIsEmailLogin(true)}
                className="w-full bg-white text-primary border border-gray-200 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-accent transition-all shadow-sm"
              >
                <Mail size={20} />
                Sign in with Email
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  if (!isAuthor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-6">
          <AlertCircle size={64} className="text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-primary">Access Denied</h1>
          <p className="text-gray-600">You do not have administrative or author privileges. Please contact the system administrator.</p>
          <button onClick={logout} className="text-secondary font-bold hover:underline">Sign Out</button>
        </div>
      </div>
    );
  }

  const handleSave = async (collectionName: string, data: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const id = data.id || Math.random().toString(36).substring(2, 15);
      const { id: _, ...cleanData } = data;
      await setDoc(doc(collection(db, collectionName), id), cleanData);
      setSuccess('Item saved successfully!');
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error saving item:', err);
      setError('Failed to save item. Please check your permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800000) { // ~800KB limit to stay safe within Firestore 1MB limit
      setError('File is too large. Please upload an image smaller than 800KB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingItem({ ...editingItem, [field]: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const { createNewUser } = await import('../firebase');
      const newUser = await createNewUser(newUserEmail, newUserPassword);
      await setDoc(doc(db, 'users', newUser.uid), {
        uid: newUser.uid,
        email: newUser.email,
        role: newUserRole
      });
      setSuccess(`${newUserRole === 'admin' ? 'Admin' : 'Author'} user created successfully!`);
      setNewUserEmail('');
      setNewUserPassword('');
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.message || 'Failed to create user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetContent = async () => {
    if (!window.confirm('This will delete all current services, projects, blog posts, and team members and replace them with default "cutting-edge" content. This cannot be undone. Proceed?')) return;
    
    setIsSubmitting(true);
    try {
      const { INITIAL_SERVICES, INITIAL_PROJECTS, INITIAL_BLOG_POSTS, INITIAL_TEAM, DEFAULT_SITE_SETTINGS } = await import('../constants');
      
      // Delete existing
      const collections = ['services', 'projects', 'blogPosts', 'teamMembers'];
      for (const collName of collections) {
        const snap = await getDocs(collection(db, collName));
        for (const docItem of snap.docs) {
          await deleteDoc(doc(db, collName, docItem.id));
        }
      }

      // Seed new
      for (const s of INITIAL_SERVICES) await setDoc(doc(collection(db, 'services')), s);
      for (const p of INITIAL_PROJECTS) await setDoc(doc(collection(db, 'projects')), p);
      for (const b of INITIAL_BLOG_POSTS) await setDoc(doc(collection(db, 'blogPosts')), b);
      for (const t of INITIAL_TEAM) await setDoc(doc(collection(db, 'teamMembers')), t);
      
      await setDoc(doc(db, 'settings', 'global'), DEFAULT_SITE_SETTINGS);

      setSuccess('Website content has been reset to cutting-edge defaults!');
    } catch (err) {
      console.error('Error resetting content:', err);
      setError('Failed to reset content.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (uid: string, newRole: 'admin' | 'author' | 'user') => {
    try {
      await setDoc(doc(db, 'users', uid), { role: newRole }, { merge: true });
      setSuccess('User role updated successfully!');
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update user role.');
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteDoc(doc(collection(db, collectionName), id));
      setSuccess('Item deleted successfully!');
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item.');
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} />, roles: ['admin', 'author'] },
    { id: 'services', label: 'Services', icon: <Briefcase size={20} />, roles: ['admin'] },
    { id: 'projects', label: 'Projects', icon: <Briefcase size={20} />, roles: ['admin'] },
    { id: 'blog', label: 'Blog Posts', icon: <FileText size={20} />, roles: ['admin', 'author'] },
    { id: 'team', label: 'Team Members', icon: <Users size={20} />, roles: ['admin'] },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} />, roles: ['admin'] },
    { id: 'users', label: 'User Management', icon: <Users size={20} />, roles: ['admin'] },
    { id: 'settings', label: 'Site Settings', icon: <Settings size={20} />, roles: ['admin'] },
  ].filter(item => item.roles.includes(isAdmin ? 'admin' : 'author'));

  return (
    <div className="min-h-screen bg-accent flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-primary text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/10 flex items-center gap-3">
          <img src={settings.logoUrl} alt="Logo" className="h-10 w-10 rounded-full bg-white p-1" referrerPolicy="no-referrer" />
          <span className="font-display font-bold text-xl">ARKINOX Admin</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium",
                activeTab === item.id ? "bg-secondary text-white shadow-lg" : "hover:bg-white/10 text-gray-400 hover:text-white"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2">
            <img src={user.photoURL || 'https://picsum.photos/seed/admin/100/100'} alt="User" className="h-10 w-10 rounded-full border-2 border-secondary" referrerPolicy="no-referrer" />
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{user.displayName || user.email?.split('@')[0]}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400 transition-all font-medium"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-h-screen">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold text-primary capitalize">{activeTab.replace('-', ' ')}</h2>
            <p className="text-gray-500">Manage your website content and settings.</p>
          </div>
          <div className="flex gap-4">
            {['services', 'projects', 'blog', 'team'].includes(activeTab) && (
              <button 
                onClick={() => { setEditingItem({}); setIsModalOpen(true); }}
                className="bg-secondary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-xl transition-all"
              >
                <Plus size={20} /> Add New
              </button>
            )}
          </div>
        </header>

        {/* Feedback Messages */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-green-100 text-green-700 p-4 rounded-xl mb-6 flex items-center gap-3">
              <CheckCircle2 size={20} /> {success}
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
              <AlertCircle size={20} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl w-fit"><Briefcase size={24} /></div>
                <p className="text-gray-500 font-medium">Total Services</p>
                <p className="text-4xl font-bold text-primary">{services.length}</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="bg-orange-100 text-orange-600 p-3 rounded-xl w-fit"><Briefcase size={24} /></div>
                <p className="text-gray-500 font-medium">Projects</p>
                <p className="text-4xl font-bold text-primary">{projects.length}</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="bg-purple-100 text-purple-600 p-3 rounded-xl w-fit"><FileText size={24} /></div>
                <p className="text-gray-500 font-medium">Blog Posts</p>
                <p className="text-4xl font-bold text-primary">{blogPosts.length}</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                <div className="bg-green-100 text-green-600 p-3 rounded-xl w-fit"><MessageSquare size={24} /></div>
                <p className="text-gray-500 font-medium">Messages</p>
                <p className="text-4xl font-bold text-primary">{messages.length}</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-10">
              {/* Create User Form */}
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-primary">Create New User</h3>
                  <p className="text-gray-500">Add a new administrator or author with email and password access.</p>
                </div>
                <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end" onSubmit={handleCreateUser}>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="user@arkinox.com"
                      className="w-full bg-accent border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary" 
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase">Password</label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full bg-accent border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary" 
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase">Role</label>
                    <select 
                      className="w-full bg-accent border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'author')}
                    >
                      <option value="author">Author (Blog Only)</option>
                      <option value="admin">Administrator (Full Access)</option>
                    </select>
                  </div>
                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create User'}
                  </button>
                </form>
              </div>

              {/* Users List */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-accent text-primary font-bold uppercase text-xs tracking-wider">
                    <tr>
                      <th className="p-6">Email</th>
                      <th className="p-6">Role</th>
                      <th className="p-6">UID</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-accent/50 transition-colors">
                        <td className="p-6 font-bold text-primary">{u.email}</td>
                        <td className="p-6">
                          {u.email === user.email ? (
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">{u.role}</span>
                          ) : (
                            <select 
                              className="bg-accent border border-gray-200 rounded-lg px-3 py-1 text-xs font-bold uppercase text-primary focus:outline-none focus:border-secondary"
                              value={u.role}
                              onChange={(e) => handleUpdateRole(u.uid, e.target.value as any)}
                            >
                              <option value="author">Author</option>
                              <option value="admin">Admin</option>
                              <option value="user">User</option>
                            </select>
                          )}
                        </td>
                        <td className="p-6 text-xs font-mono text-gray-400">{u.uid}</td>
                        <td className="p-6 text-right">
                          {u.email !== user.email && (
                            <button onClick={() => handleDelete('users', u.uid)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-accent text-primary font-bold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-6">Service</th>
                    <th className="p-6">Slug</th>
                    <th className="p-6">Status</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-accent/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={cleanImageUrl(service.imageUrl)} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                          <span className="font-bold text-primary">{service.title}</span>
                        </div>
                      </td>
                      <td className="p-6 text-gray-500">{service.slug}</td>
                      <td className="p-6">
                        {service.isVisible ? 
                          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold">Visible</span> : 
                          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">Hidden</span>
                        }
                      </td>
                      <td className="p-6 text-right space-x-2">
                        <button onClick={() => { setEditingItem(service); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete('services', service.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-accent text-primary font-bold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-6">Project</th>
                    <th className="p-6">Category</th>
                    <th className="p-6">Date</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-accent/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={cleanImageUrl(project.imageUrl)} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                          <span className="font-bold text-primary">{project.title}</span>
                        </div>
                      </td>
                      <td className="p-6 text-gray-500">{project.category}</td>
                      <td className="p-6 text-gray-500">{project.date}</td>
                      <td className="p-6 text-right space-x-2">
                        <button onClick={() => { setEditingItem(project); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete('projects', project.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-accent text-primary font-bold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-6">Article</th>
                    <th className="p-6">Author</th>
                    <th className="p-6">Date</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {blogPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-accent/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={cleanImageUrl(post.imageUrl)} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                          <span className="font-bold text-primary">{post.title}</span>
                        </div>
                      </td>
                      <td className="p-6 text-gray-500">{post.author}</td>
                      <td className="p-6 text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</td>
                      <td className="p-6 text-right space-x-2">
                        <button onClick={() => { setEditingItem(post); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete('blogPosts', post.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-accent text-primary font-bold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-6">Member</th>
                    <th className="p-6">Designation</th>
                    <th className="p-6">Order</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-accent/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={cleanImageUrl(member.imageUrl)} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                          <span className="font-bold text-primary">{member.name}</span>
                        </div>
                      </td>
                      <td className="p-6 text-gray-500">{member.designation}</td>
                      <td className="p-6 text-gray-500">{member.order}</td>
                      <td className="p-6 text-right space-x-2">
                        <button onClick={() => { setEditingItem(member); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete('teamMembers', member.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold text-primary">{msg.subject}</h4>
                      <p className="text-gray-500 text-sm">From: <span className="font-bold">{msg.name}</span> ({msg.email})</p>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-700 bg-accent p-6 rounded-2xl italic leading-relaxed">
                    "{msg.message}"
                  </p>
                  <div className="flex justify-end">
                    <button onClick={() => handleDelete('messages', msg.id)} className="text-red-500 flex items-center gap-2 font-bold hover:underline">
                      <Trash2 size={16} /> Delete Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* General Info */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2"><Globe size={20} /> General Info</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Company Name</label>
                      <input 
                        type="text" 
                        className="w-full bg-accent border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary" 
                        value={settings.companyName}
                        onChange={(e) => setDoc(doc(db, 'settings', 'global'), { ...settings, companyName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Logo URL</label>
                      <input 
                        type="text" 
                        className="w-full bg-accent border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary" 
                        value={settings.logoUrl}
                        onChange={(e) => setDoc(doc(db, 'settings', 'global'), { ...settings, logoUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Global Hero Opacity (0-100)</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          className="flex-1 accent-secondary" 
                          value={settings.heroOpacity ?? 15} 
                          onChange={(e) => setDoc(doc(db, 'settings', 'global'), { ...settings, heroOpacity: parseInt(e.target.value) })} 
                        />
                        <span className="font-mono font-bold text-primary w-12">{settings.heroOpacity ?? 15}%</span>
                      </div>
                      <p className="text-xs text-gray-400 italic">Adjusts the background image opacity for About, Contact, Blog, and Project list pages.</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2"><Mail size={20} /> Contact Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Email</label>
                      <input 
                        type="email" 
                        className="w-full bg-accent border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary" 
                        value={settings.contactEmail}
                        onChange={(e) => setDoc(doc(db, 'settings', 'global'), { ...settings, contactEmail: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Phone</label>
                      <input 
                        type="text" 
                        className="w-full bg-accent border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary" 
                        value={settings.contactPhone}
                        onChange={(e) => setDoc(doc(db, 'settings', 'global'), { ...settings, contactPhone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2"><Globe size={20} /> Social Media Handles</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2"><Facebook size={16} /> Facebook URL</label>
                      <input 
                        type="text" 
                        className="w-full bg-accent border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary" 
                        value={settings.socialLinks?.facebook || ''}
                        onChange={(e) => setDoc(doc(db, 'settings', 'global'), { ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })}
                        placeholder="https://facebook.com/arkinox"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2"><Instagram size={16} /> Instagram URL</label>
                      <input 
                        type="text" 
                        className="w-full bg-accent border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary" 
                        value={settings.socialLinks?.instagram || ''}
                        onChange={(e) => setDoc(doc(db, 'settings', 'global'), { ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })}
                        placeholder="https://instagram.com/arkinox"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2"><Linkedin size={16} /> LinkedIn URL</label>
                      <input 
                        type="text" 
                        className="w-full bg-accent border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary" 
                        value={settings.socialLinks?.linkedin || ''}
                        onChange={(e) => setDoc(doc(db, 'settings', 'global'), { ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })}
                        placeholder="https://linkedin.com/company/arkinox"
                      />
                    </div>
                  </div>
                </div>

                {/* Appearance */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2"><Palette size={20} /> Appearance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Primary Color</label>
                      <div className="flex gap-2">
                        <input type="color" className="h-14 w-14 rounded-xl border-none cursor-pointer" value={settings.primaryColor} onChange={(e) => setDoc(doc(db, 'settings', 'global'), { ...settings, primaryColor: e.target.value })} />
                        <input type="text" className="flex-grow bg-accent border border-gray-200 rounded-xl p-4" value={settings.primaryColor} onChange={(e) => setDoc(doc(db, 'settings', 'global'), { ...settings, primaryColor: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Secondary Color</label>
                      <div className="flex gap-2">
                        <input type="color" className="h-14 w-14 rounded-xl border-none cursor-pointer" value={settings.secondaryColor} onChange={(e) => setDoc(doc(db, 'settings', 'global'), { ...settings, secondaryColor: e.target.value })} />
                        <input type="text" className="flex-grow bg-accent border border-gray-200 rounded-xl p-4" value={settings.secondaryColor} onChange={(e) => setDoc(doc(db, 'settings', 'global'), { ...settings, secondaryColor: e.target.value })} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2"><Search size={20} /> SEO Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Meta Title</label>
                      <input 
                        type="text" 
                        className="w-full bg-accent border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary" 
                        value={settings.seo.metaTitle}
                        onChange={(e) => setDoc(doc(db, 'settings', 'global'), { ...settings, seo: { ...settings.seo, metaTitle: e.target.value } })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Meta Description</label>
                      <textarea 
                        rows={3}
                        className="w-full bg-accent border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-secondary resize-none" 
                        value={settings.seo.metaDescription}
                        onChange={(e) => setDoc(doc(db, 'settings', 'global'), { ...settings, seo: { ...settings.seo, metaDescription: e.target.value } })}
                      />
                    </div>
                  </div>
                </div>

                {/* Maintenance */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-red-600 flex items-center gap-2"><AlertCircle size={20} /> Maintenance</h3>
                  <div className="bg-red-50 p-6 rounded-2xl border border-red-100 space-y-4">
                    <p className="text-sm text-red-700 font-medium">
                      Missing content? Use the button below to populate your site with our professionally written "cutting-edge" defaults.
                    </p>
                    <button 
                      onClick={handleResetContent}
                      disabled={isSubmitting}
                      className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-red-200"
                    >
                      <Trash2 size={18} /> Reset to Default Content
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col"
            >
              <header className="p-8 border-b flex justify-between items-center bg-accent">
                <h3 className="text-2xl font-bold text-primary">
                  {editingItem?.id ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors"><X size={24} /></button>
              </header>
              
              <div className="p-8 overflow-y-auto flex-grow space-y-6">
                {/* Dynamic Form Fields based on activeTab */}
                {activeTab === 'services' && (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Title</label>
                        <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.title || ''} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Slug</label>
                        <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.slug || ''} onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Description</label>
                      <textarea rows={2} className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.description || ''} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Content (Markdown)</label>
                      <textarea rows={10} className="w-full bg-accent border border-gray-200 rounded-xl p-4 font-mono text-sm" value={editingItem?.content || ''} onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Image URL (Card) or Upload</label>
                        <div className="flex flex-col gap-2">
                          <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.imageUrl || ''} onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })} placeholder="/my-image.jpg" />
                          <label className="bg-white border border-gray-200 px-4 py-2 rounded-xl cursor-pointer hover:bg-accent transition-all text-xs font-bold text-primary flex items-center gap-2 w-fit">
                            <Camera size={14} />
                            Upload
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'imageUrl')} />
                          </label>
                        </div>
                        <p className="text-xs text-gray-400">Use /filename.ext or upload (max 800KB).</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Hero Image URL (Background) or Upload</label>
                        <div className="flex flex-col gap-2">
                          <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.heroImageUrl || ''} onChange={(e) => setEditingItem({ ...editingItem, heroImageUrl: e.target.value })} placeholder="/hero-bg.jpg" />
                          <label className="bg-white border border-gray-200 px-4 py-2 rounded-xl cursor-pointer hover:bg-accent transition-all text-xs font-bold text-primary flex items-center gap-2 w-fit">
                            <Camera size={14} />
                            Upload
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'heroImageUrl')} />
                          </label>
                        </div>
                        <p className="text-xs text-gray-400">Use /filename.ext or upload (max 800KB).</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Icon (Lucide Name)</label>
                        <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.icon || ''} onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Hero Image Opacity (0-100)</label>
                        <div className="flex items-center gap-4">
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            className="flex-1 accent-secondary" 
                            value={editingItem?.heroOpacity ?? 15} 
                            onChange={(e) => setEditingItem({ ...editingItem, heroOpacity: parseInt(e.target.value) })} 
                          />
                          <span className="font-mono font-bold text-primary w-12">{editingItem?.heroOpacity ?? 15}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary" checked={editingItem?.isVisible ?? true} onChange={(e) => setEditingItem({ ...editingItem, isVisible: e.target.checked })} />
                        <span className="font-bold text-primary">Visible on Website</span>
                      </label>
                    </div>
                  </>
                )}

                {activeTab === 'projects' && (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Title</label>
                        <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.title || ''} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Slug</label>
                        <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.slug || ''} onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Category</label>
                        <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.category || ''} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Date</label>
                        <input type="date" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.date || ''} onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Description</label>
                      <textarea rows={2} className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.description || ''} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Content (Markdown)</label>
                      <textarea rows={10} className="w-full bg-accent border border-gray-200 rounded-xl p-4 font-mono text-sm" value={editingItem?.content || ''} onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Image URL or Upload</label>
                      <div className="flex flex-col gap-2">
                        <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.imageUrl || ''} onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })} placeholder="/project-image.jpg" />
                        <label className="bg-white border border-gray-200 px-4 py-2 rounded-xl cursor-pointer hover:bg-accent transition-all text-xs font-bold text-primary flex items-center gap-2 w-fit">
                          <Camera size={14} />
                          Upload
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'imageUrl')} />
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">Use /filename.ext or upload (max 800KB).</p>
                    </div>
                  </>
                )}

                {activeTab === 'blog' && (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Title</label>
                        <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.title || ''} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Slug</label>
                        <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.slug || ''} onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Author</label>
                        <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.author || ''} onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Published At</label>
                        <input type="datetime-local" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.publishedAt?.slice(0, 16) || ''} onChange={(e) => setEditingItem({ ...editingItem, publishedAt: new Date(e.target.value).toISOString() })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Excerpt</label>
                      <textarea rows={2} className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.excerpt || ''} onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Content (Markdown)</label>
                      <textarea rows={10} className="w-full bg-accent border border-gray-200 rounded-xl p-4 font-mono text-sm" value={editingItem?.content || ''} onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Image URL or Upload</label>
                      <div className="flex flex-col gap-4">
                        <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.imageUrl || ''} onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })} placeholder="/blog-image.jpg" />
                        <div className="flex items-center gap-4">
                          <label className="bg-white border border-gray-200 px-4 py-2 rounded-xl cursor-pointer hover:bg-accent transition-all text-sm font-bold text-primary flex items-center gap-2">
                            <Camera size={18} />
                            Upload Image
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'imageUrl')} />
                          </label>
                          {editingItem?.imageUrl?.startsWith('data:image') && (
                            <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                              <CheckCircle2 size={14} /> Image Attached
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">Use /filename.ext for images in the public folder, or upload an image directly (max 800KB).</p>
                    </div>
                  </>
                )}

                {activeTab === 'team' && (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Name</label>
                        <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.name || ''} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Designation</label>
                        <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.designation || ''} onChange={(e) => setEditingItem({ ...editingItem, designation: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase">Bio</label>
                      <textarea rows={4} className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.bio || ''} onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Image URL or Upload</label>
                        <div className="flex flex-col gap-2">
                          <input type="text" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.imageUrl || ''} onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })} placeholder="/team-image.jpg" />
                          <label className="bg-white border border-gray-200 px-4 py-2 rounded-xl cursor-pointer hover:bg-accent transition-all text-xs font-bold text-primary flex items-center gap-2 w-fit">
                            <Camera size={14} />
                            Upload
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'imageUrl')} />
                          </label>
                        </div>
                        <p className="text-xs text-gray-400">Use /filename.ext or upload (max 800KB).</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase">Order</label>
                        <input type="number" className="w-full bg-accent border border-gray-200 rounded-xl p-4" value={editingItem?.order || 0} onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) })} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <footer className="p-8 border-t bg-accent flex justify-end gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 rounded-xl font-bold text-gray-500 hover:bg-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={() => handleSave(
                    activeTab === 'blog' ? 'blogPosts' : 
                    activeTab === 'team' ? 'teamMembers' : 
                    activeTab, 
                    editingItem
                  )}
                  className="bg-secondary text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'} <Save size={20} />
                </button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
