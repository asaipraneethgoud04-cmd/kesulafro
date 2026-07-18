import React, { useState, memo } from 'react';

const CategorySection = function({ 
  categories, 
  isLoading, 
  error, 
  createCategory, 
  deleteCategory 
}) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    const result = await createCategory(newCategoryName.trim());
    setIsSubmitting(false);

    if (result.success) {
      setNewCategoryName('');
    } else {
      alert(`Failed to add category: ${result.error}`);
    }
  };

  const handleDelete = async (id, name) => {
    if (id.startsWith('static-')) {
      alert('This is a default static category and cannot be deleted until you run the SQL migration script to connect the database categories.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the category "${name}"? Existing events using this category will remain, but the category option will be removed.`)) {
      return;
    }

    const result = await deleteCategory(id);
    if (!result.success) {
      alert(`Failed to delete category: ${result.error}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl font-bold text-primary tracking-tight">Manage Categories</h1>
          <p className="text-sm text-on-surface-variant">Create and delete event categories for the Activities page.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Create Form */}
        <div className="lg:col-span-4 glass-panel border border-white/40 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-primary mb-4 uppercase tracking-wider text-sm">Add Category</h2>
          
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="new-category" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Category Name</label>
              <input
                id="new-category"
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="glass-input rounded-xl p-3 text-sm text-on-surface"
                placeholder="e.g. Health & Safety"
                disabled={isSubmitting}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="clay-btn clay-btn-primary px-6 py-3 text-xs uppercase tracking-wider w-full flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              {isSubmitting ? 'Adding...' : 'Add Category'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Categories List */}
        <div className="lg:col-span-8">
          <div className="glass-panel border border-white/40 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-primary/5 border-b border-secondary/10 uppercase font-bold text-on-surface-variant text-xs tracking-wider">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {isLoading ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-on-surface-variant italic">Loading categories...</td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-on-surface-variant italic">No categories found.</td>
                  </tr>
                ) : (
                  categories.map((cat) => {
                    const isStatic = String(cat.id).startsWith('static-');
                    return (
                      <tr key={cat.id} className="hover:bg-primary/5 transition-all">
                        <td className="p-4 font-semibold text-on-surface">{cat.name}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${isStatic ? 'bg-secondary/10 text-secondary' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                            {isStatic ? 'Default' : 'Custom'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {isStatic ? (
                            <span className="text-xs text-on-surface-variant/50 italic select-none">System Locked</span>
                          ) : (
                            <button
                              onClick={() => handleDelete(cat.id, cat.name)}
                              className="text-error hover:underline font-bold text-xs uppercase tracking-wider"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CategorySection);
