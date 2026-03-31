import { useState } from 'react';
import { modulePriorities, moduleStatuses, AiModule } from '@/types/module';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { createSlug } from '@/lib/project-utils';

export function ModuleForm({ initial, existingSlugs, onSubmit }: { initial?: AiModule; existingSlugs: string[]; onSubmit: (payload: Omit<AiModule, 'id' | 'createdAt' | 'updatedAt'>) => void }) {
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    slug: initial?.slug ?? '',
    summary: initial?.summary ?? '',
    details: initial?.details ?? '',
    status: initial?.status ?? moduleStatuses[0],
    priority: initial?.priority ?? modulePriorities[1],
    owner: initial?.owner ?? 'Tim AI Radioterapi',
    tags: initial?.tags.join(', ') ?? ''
  });

  const duplicateSlug = existingSlugs.includes(form.slug.trim().toLowerCase());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.summary || duplicateSlug) return;
    onSubmit({ ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) });
  };

  return <form className="space-y-3" onSubmit={submit}>
    <Input placeholder="Nama Modul" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value, slug: slugTouched ? s.slug : createSlug(e.target.value) }))} required />
    <Input placeholder="Slug" value={form.slug} onChange={(e) => { setSlugTouched(true); setForm((s) => ({ ...s, slug: createSlug(e.target.value) })); }} required />
    {duplicateSlug ? <p className="text-xs text-destructive">Slug sudah digunakan modul lain.</p> : null}
    <Input placeholder="Owner" value={form.owner} onChange={(e) => setForm((s) => ({ ...s, owner: e.target.value }))} required />
    <Textarea placeholder="Ringkasan" value={form.summary} onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))} required />
    <Textarea placeholder="Detail modul" value={form.details} onChange={(e) => setForm((s) => ({ ...s, details: e.target.value }))} required />
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as AiModule['status'] }))}>{moduleStatuses.map((s) => <option key={s}>{s}</option>)}</Select>
      <Select value={form.priority} onChange={(e) => setForm((s) => ({ ...s, priority: e.target.value as AiModule['priority'] }))}>{modulePriorities.map((p) => <option key={p}>{p}</option>)}</Select>
    </div>
    <Input placeholder="Tags (pisahkan dengan koma)" value={form.tags} onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))} />
    <Button type="submit">Simpan Modul</Button>
  </form>;
}
