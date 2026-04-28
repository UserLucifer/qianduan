"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  createAdminBlogCategory, 
  updateAdminBlogCategory, 
  disableAdminBlogCategory, 
  enableAdminBlogCategory,
  createAdminBlogTag,
  updateAdminBlogTag,
  disableAdminBlogTag,
  enableAdminBlogTag
} from "@/api/admin";
import { BlogCategory, BlogTag } from "@/api/types";
import { toErrorMessage } from "@/lib/format";

interface CategoryManagerProps {
  items: BlogCategory[];
  onRefresh: () => void;
}

export function CategoryManager({ items, onRefresh }: CategoryManagerProps) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createAdminBlogCategory({ categoryName: name });
      setName("");
      onRefresh();
    } catch (err) {
      alert(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, currentName: string) => {
    const newName = window.prompt("修改分类名称", currentName);
    if (!newName || newName === currentName) return;
    try {
      await updateAdminBlogCategory(id, { categoryName: newName });
      onRefresh();
    } catch (err) {
      alert(toErrorMessage(err));
    }
  };

  const toggleStatus = async (item: BlogCategory) => {
    try {
      if (item.status === 1) {
        await disableAdminBlogCategory(item.id);
      } else {
        await enableAdminBlogCategory(item.id);
      }
      onRefresh();
    } catch (err) {
      alert(toErrorMessage(err));
    }
  };

  return (
    <div className="space-y-4 w-[300px] p-2">
      <div className="flex gap-2">
        <Input 
          placeholder="新分类名称" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="h-8 text-sm"
        />
        <Button size="sm" onClick={handleAdd} disabled={loading} className="h-8 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 rounded bg-[var(--admin-panel-strong)] border border-[var(--admin-border)]">
            <span className={`text-sm ${item.status === 0 ? "text-zinc-500 line-through" : "text-zinc-200"}`}>
              {item.categoryName}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => toggleStatus(item)} className="p-1 hover:bg-white/5 rounded">
                {item.status === 1 ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-zinc-500" />}
              </button>
              <button onClick={() => handleUpdate(item.id, item.categoryName)} className="p-1 hover:bg-white/5 rounded">
                <Edit2 className="h-3 w-3 text-blue-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TagManagerProps {
  items: BlogTag[];
  onRefresh: () => void;
}

export function TagManager({ items, onRefresh }: TagManagerProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createAdminBlogTag({ tagName: name });
      setName("");
      onRefresh();
    } catch (err) {
      alert(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, currentName: string) => {
    const newName = window.prompt("修改标签名称", currentName);
    if (!newName || newName === currentName) return;
    try {
      await updateAdminBlogTag(id, { tagName: newName });
      onRefresh();
    } catch (err) {
      alert(toErrorMessage(err));
    }
  };

  const toggleStatus = async (item: BlogTag) => {
    try {
      if (item.status === 1) {
        await disableAdminBlogTag(item.id);
      } else {
        await enableAdminBlogTag(item.id);
      }
      onRefresh();
    } catch (err) {
      alert(toErrorMessage(err));
    }
  };

  return (
    <div className="space-y-4 w-[300px] p-2">
      <div className="flex gap-2">
        <Input 
          placeholder="新标签名称" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="h-8 text-sm"
        />
        <Button size="sm" onClick={handleAdd} disabled={loading} className="h-8 bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 rounded bg-[var(--admin-panel-strong)] border border-[var(--admin-border)]">
            <span className={`text-sm ${item.status === 0 ? "text-zinc-500 line-through" : "text-zinc-200"}`}>
              {item.tagName}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => toggleStatus(item)} className="p-1 hover:bg-white/5 rounded">
                {item.status === 1 ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-zinc-500" />}
              </button>
              <button onClick={() => handleUpdate(item.id, item.tagName)} className="p-1 hover:bg-white/5 rounded">
                <Edit2 className="h-3 w-3 text-blue-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
