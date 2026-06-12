import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Send, Lightbulb, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askBusinessAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/_app/ai-assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — BizPilot AI" }] }),
  component: AIPage,
});

const SUGGESTIONS = [
  "How much profit did I make this month?",
  "Who owes me money?",
  "What products sell the most?",
  "What inventory is running low?",
  "Give me 3 ideas to grow sales this week.",
];

type Msg = { role: "user" | "assistant"; content: string };

function AIPage() {
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ask = useServerFn(askBusinessAI);

  const mut = useMutation({
    mutationFn: async (text: string) => {
      const next: Msg[] = [...messages, { role: "user", content: text }];
      setMessages(next);
      const res = await ask({ data: { messages: next } });
      return res.reply as string;
    },
    onSuccess: (reply) => setMessages((m) => [...m, { role: "assistant", content: reply }]),
    onError: (e: any) => toast.error(e.message || "Failed to ask AI"),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, mut.isPending]);

  const send = (text?: string) => {
    const t = (text ?? q).trim();
    if (!t || mut.isPending) return;
    setQ("");
    mut.mutate(t);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="AI Assistant" subtitle="Ask anything about your business" />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-5 shadow-card min-h-[480px] flex flex-col">
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
            {messages.length === 0 && (
              <div className="h-full grid place-items-center text-center">
                <div className="max-w-md">
                  <span className="grid place-items-center h-14 w-14 rounded-2xl bg-gradient-primary shadow-glow mx-auto">
                    <Sparkles className="h-6 w-6 text-primary-foreground" />
                  </span>
                  <h2 className="font-display text-xl font-semibold mt-4">Hi, I'm your AI Employee 👋</h2>
                  <p className="text-sm text-muted-foreground mt-1">Ask anything about your sales, customers, stock or expenses. I see your live business data.</p>
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                  m.role === "user" ? "bg-gradient-primary text-primary-foreground" : "bg-secondary/60 border border-border/60"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {mut.isPending && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-2.5 text-sm bg-secondary/60 border border-border/60 flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-3 border-t border-border/60 mt-3">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything…"
              className="h-11"
              disabled={mut.isPending}
            />
            <Button onClick={() => send()} disabled={mut.isPending || !q.trim()} className="bg-gradient-primary text-primary-foreground h-11">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card h-fit">
          <div className="flex items-center gap-2 mb-3"><Lightbulb className="h-4 w-4 text-primary" /><h3 className="font-display font-semibold">Try asking</h3></div>
          <div className="space-y-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} disabled={mut.isPending}
                className="w-full text-left text-sm p-3 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-secondary/40 transition disabled:opacity-50">
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
