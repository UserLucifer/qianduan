"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Edit2, CheckCircle2, XCircle, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ErrorAlert } from "@/components/shared/ErrorAlert";

interface CategoryManagerProps {
  items: BlogCategory[];
  onRefresh: () => void;
  onTranslate?: (item: BlogCategory) => void;
}

export function CategoryManager({ items, onRefresh, onTranslate }: CategoryManagerProps) {
  const t = useTranslations("AdminComponentForms.blogManagers");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createAdminBlogCategory({ categoryName: name });
      setName("");
      onRefresh();
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, currentName: string) => {
    const newName = window.prompt(t("editCategoryPrompt"), currentName);
    if (!newName || newName === currentName) return;
    setError(null);
    try {
      await updateAdminBlogCategory(id, { categoryName: newName });
      onRefresh();
    } catch (err) {
      setError(toErrorMessage(err));
    }
  };

  const toggleStatus = async (item: BlogCategory) => {
    setError(null);
    try {
      if (item.status === 1) {
        await disableAdminBlogCategory(item.id);
      } else {
        await enableAdminBlogCategory(item.id);
      }
      onRefresh();
    } catch (err) {
      setError(toErrorMessage(err));
    }
  };

  return (
    <div className="space-y-4 w-[300px] p-2">
      <div className="flex gap-2">
        <Input 
          placeholder={t("newCategoryName")}
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="h-8 text-sm"
        />
        <Button size="sm" onClick={handleAdd} disabled={loading} className="h-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ErrorAlert message={error} />
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded border border-border bg-card p-2 text-card-foreground">
            <span className={`text-sm ${item.status === 0 ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {item.categoryName}
            </span>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleStatus(item)}>
                {item.status === 1 ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <XCircle className="h-3 w-3 text-muted-foreground" />}
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdate(item.id, item.categoryName)}>
                <Edit2 className="h-3 w-3 text-primary" />
              </Button>
              {onTranslate ? (
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title={t("translate")} aria-label={t("translate")} onClick={() => onTranslate(item)}>
                  <Languages className="h-3 w-3 text-blue-500" />
                </Button>
              ) : null}
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
  onTranslate?: (item: BlogTag) => void;
}

export function TagManager({ items, onRefresh, onTranslate }: TagManagerProps) {
  const t = useTranslations("AdminComponentForms.blogManagers");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createAdminBlogTag({ tagName: name });
      setName("");
      onRefresh();
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, currentName: string) => {
    const newName = window.prompt(t("editTagPrompt"), currentName);
    if (!newName || newName === currentName) return;
    setError(null);
    try {
      await updateAdminBlogTag(id, { tagName: newName });
      onRefresh();
    } catch (err) {
      setError(toErrorMessage(err));
    }
  };

  const toggleStatus = async (item: BlogTag) => {
    setError(null);
    try {
      if (item.status === 1) {
        await disableAdminBlogTag(item.id);
      } else {
        await enableAdminBlogTag(item.id);
      }
      onRefresh();
    } catch (err) {
      setError(toErrorMessage(err));
    }
  };

  return (
    <div className="space-y-4 w-[300px] p-2">
      <div className="flex gap-2">
        <Input 
          placeholder={t("newTagName")}
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="h-8 text-sm"
        />
        <Button size="sm" onClick={handleAdd} disabled={loading} className="h-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ErrorAlert message={error} />
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded border border-border bg-card p-2 text-card-foreground">
            <span className={`text-sm ${item.status === 0 ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {item.tagName}
            </span>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleStatus(item)}>
                {item.status === 1 ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <XCircle className="h-3 w-3 text-muted-foreground" />}
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdate(item.id, item.tagName)}>
                <Edit2 className="h-3 w-3 text-primary" />
              </Button>
              {onTranslate ? (
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title={t("translate")} aria-label={t("translate")} onClick={() => onTranslate(item)}>
                  <Languages className="h-3 w-3 text-blue-500" />
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
