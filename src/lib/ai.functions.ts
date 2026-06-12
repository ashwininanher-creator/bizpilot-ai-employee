import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export const askBusinessAI = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const v = input as { messages?: ChatMessage[] };
    if (!v?.messages || !Array.isArray(v.messages)) throw new Error("messages required");
    return { messages: v.messages.slice(-12) };
  })
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY missing");
    const { supabase, userId } = context;

    // Gather lightweight business context
    const [biz, sales, products, customers, expenses] = await Promise.all([
      supabase.from("businesses").select("business_name,business_type,gstin").eq("owner_id", userId).maybeSingle(),
      supabase.from("sales").select("invoice_no,customer_name,total,status,payment_method,sale_date").eq("user_id", userId).order("created_at", { ascending: false }).limit(30),
      supabase.from("products").select("name,sku,stock,min_stock,price,cost").eq("user_id", userId).limit(50),
      supabase.from("customers").select("name,phone").eq("user_id", userId).limit(50),
      supabase.from("expenses").select("category,amount,note,expense_date").eq("user_id", userId).order("expense_date", { ascending: false }).limit(30),
    ]);

    const totalRevenue = (sales.data || []).reduce((s: number, r: any) => s + Number(r.total || 0), 0);
    const pending = (sales.data || []).filter((r: any) => r.status !== "Paid");
    const totalPending = pending.reduce((s: number, r: any) => s + Number(r.total || 0), 0);
    const totalExpenses = (expenses.data || []).reduce((s: number, r: any) => s + Number(r.amount || 0), 0);
    const lowStock = (products.data || []).filter((p: any) => Number(p.stock) <= Number(p.min_stock));

    const ctx = {
      business: biz.data,
      summary: {
        totalRevenue, totalExpenses, totalPending,
        netProfit: totalRevenue - totalExpenses,
        productsCount: (products.data || []).length,
        customersCount: (customers.data || []).length,
        lowStockCount: lowStock.length,
      },
      recentSales: sales.data || [],
      products: products.data || [],
      lowStock,
      recentExpenses: expenses.data || [],
    };

    const system = `You are "BizPilot AI", an AI employee for a small business owner in India. Currency is INR (₹). Be concise, friendly, and actionable. Use markdown lists/bold where helpful. Always answer using the live business context JSON below — do not invent numbers. If data is missing, say so and suggest what to record.\n\nBUSINESS CONTEXT:\n${JSON.stringify(ctx)}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, ...data.messages],
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      if (res.status === 429) throw new Error("AI rate limit hit. Please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in workspace billing.");
      throw new Error(`AI error (${res.status}): ${t.slice(0, 200)}`);
    }
    const json: any = await res.json();
    const reply = json?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    return { reply };
  });
