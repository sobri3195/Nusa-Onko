import { useState } from 'react';
import { categories, priorities, statuses, Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function ProjectForm({ initial, onSubmit }: { initial?: Project; onSubmit: (payload: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void }) {
  const [form, setForm] = useState({
    title: initial?.title ?? '', slug: initial?.slug ?? '', shortDescription: initial?.shortDescription ?? '', fullDescription: initial?.fullDescription ?? '',
    category: initial?.category ?? categories[0], status: initial?.status ?? statuses[0], priority: initial?.priority ?? priorities[1],
    tags: initial?.tags.join(', ') ?? '', favorite: initial?.favorite ?? false
  });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.shortDescription) return;
    onSubmit({ ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) });
  };

  return <form className="space-y-3" onSubmit={submit}>
    <Input placeholder="Title" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} required />
    <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} required />
    <Textarea placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm((s) => ({ ...s, shortDescription: e.target.value }))} required />
    <Textarea placeholder="Full description" value={form.fullDescription} onChange={(e) => setForm((s) => ({ ...s, fullDescription: e.target.value }))} required />
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Select value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value as Project['category'] }))}>{categories.map((c) => <option key={c}>{c}</option>)}</Select>
      <Select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as Project['status'] }))}>{statuses.map((s) => <option key={s}>{s}</option>)}</Select>
      <Select value={form.priority} onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value as Project['priority'] }))}>{priorities.map((p) => <option key={p}>{p}</option>)}</Select>
    </div>
    <Input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))} />
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.favorite} onChange={(e) => setForm((s) => ({ ...s, favorite: e.target.checked }))} /> Favorite</label>
    <Button type="submit">Simpan</Button>
  </form>;
}
