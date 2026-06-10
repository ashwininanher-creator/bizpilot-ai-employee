import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Phone, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { db, getUserId, type Customer } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/_app/customers")({
  head: () => ({ meta: [{ title: "Customers — BizPilot AI" }] }),
  component: CustomersPage,
});

type Form = { name: string; phone: string; email: string; address: string; notes: string };
const blank: Form = { name: "", phone: "", email: "", address: "", notes: "" };

function CustomersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<Form>(blank);

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const uid = await getUserId();
      const { data, error } = await db.from("customers").select("*").eq("user_id", uid).order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const uid = await getUserId();
      const payload = {
        user_id: uid,
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        address: form.address.trim() || null,
        notes: form.notes.trim() || null,
      };
      if (!payload.name) throw new Error("Name is required");
      if (editing) {
        const { error } = await db.from("customers").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await db.from("customers").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Customer updated" : "Customer added");
      qc.invalidateQueries({ queryKey: ["customers"] });
      setOpen(false); setEditing(null); setForm(blank);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("customers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["customers"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const openNew = () => { setEditing(null); setForm(blank); setOpen(true); };
  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({ name: c.name, phone: c.phone || "", email: c.email || "", address: c.address || "", notes: c.notes || "" });
    setOpen(true);
  };

  const filtered = customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.phone || "").includes(search)
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" subtitle="Profiles & contact details"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4" /> Add Customer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Edit Customer" : "Add Customer"}</DialogTitle></DialogHeader>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2"><Label>Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div className="sm:col-span-2"><Label>Address</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                <div className="sm:col-span-2"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => save.mutate()} disabled={save.isPending} className="bg-gradient-primary text-primary-foreground">
                  {save.isPending ? "Saving…" : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <div className="relative mb-4 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customer…" className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {isLoading ? (
          <div className="text-sm text-muted-foreground py-8 text-center">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground py-12 text-center">No customers yet.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((c) => (
              <div key={c.id} className="rounded-xl border border-border/60 p-4 hover:border-primary/40">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10"><AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">{c.name.split(" ").map(s => s[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{c.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone || "—"}</div>
                  </div>
                </div>
                {c.email && <div className="mt-2 text-xs text-muted-foreground truncate">{c.email}</div>}
                <div className="mt-3 flex gap-1.5">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(c)}><Pencil className="h-3 w-3" /> Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => { if (confirm("Delete this customer?")) del.mutate(c.id); }}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
