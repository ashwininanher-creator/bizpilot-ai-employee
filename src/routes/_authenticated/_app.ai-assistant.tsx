import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Send, Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/_app/ai-assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — BizPilot AI" }] }),
  component: AIPage,
});

const SUGGESTIONS = [
  "How much profit did I make this month?",
  "Who owes me money?",
  "What products sell the most?",
  "What inventory is running low?",
  "What are my expenses this week?",
];

function AIPage() {
  const [q, setQ] = useState("");
  return (
    <div className="space-y-6">
      <PageHeader title="AI Assistant" subtitle="Ask anything about your business" />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-5 shadow-card min-h-[420px] flex flex-col">
          <div className="flex-1 grid place-items-center text-center">
            <div className="max-w-md">
              <span className="grid place-items-center h-14 w-14 rounded-2xl bg-gradient-primary shadow-glow mx-auto">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </span>
              <h2 className="font-display text-xl font-semibold mt-4">Good evening 👋</h2>
              <p className="text-sm text-muted-foreground mt-1">Your AI Employee is online. Connect Lovable AI to start chatting with live business data.</p>
            </div>
          </div>
          <div className="flex gap-2 pt-3 border-t border-border/60">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask anything…" className="h-11" />
            <Button className="bg-gradient-primary text-primary-foreground h-11"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3"><Lightbulb className="h-4 w-4 text-primary" /><h3 className="font-display font-semibold">Try asking</h3></div>
          <div className="space-y-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => setQ(s)} className="w-full text-left text-sm p-3 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-secondary/40 transition">
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
