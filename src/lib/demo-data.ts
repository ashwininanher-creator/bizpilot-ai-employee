// Demo dataset used across modules until real data flows are wired.
export const currency = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const demoStats = {
  todaysRevenue: 18500,
  todaysSales: 24600,
  todaysSalesCount: 32,
  pendingPayments: 5420,
  pendingInvoices: 8,
  profitToday: 14300,
  profitDeltaPct: 15.8,
  totalCustomers: 1248,
  newCustomersThisMonth: 24,
  monthlyRevenue: 412000,
  monthlyExpenses: 168000,
  monthlyProfit: 244000,
};

export const revenueTrend = [
  { day: "12 May", revenue: 12000, profit: 6200 },
  { day: "13 May", revenue: 15500, profit: 7800 },
  { day: "14 May", revenue: 14200, profit: 7100 },
  { day: "15 May", revenue: 19800, profit: 9900 },
  { day: "16 May", revenue: 17200, profit: 8500 },
  { day: "17 May", revenue: 21500, profit: 11800 },
  { day: "18 May", revenue: 24600, profit: 14300 },
];

export const salesByCategory = [
  { name: "Cakes", value: 40 },
  { name: "Pastries", value: 25 },
  { name: "Bread", value: 15 },
  { name: "Cookies", value: 10 },
  { name: "Others", value: 10 },
];

export const recentInvoices = [
  { no: "INV-10032", customer: "Rahul Verma", amount: 2450, status: "Paid", date: "18 May 2025" },
  { no: "INV-10031", customer: "Priya Sharma", amount: 1850, status: "Paid", date: "18 May 2025" },
  { no: "INV-10030", customer: "Amit Kumar", amount: 3200, status: "Pending", date: "18 May 2025" },
  { no: "INV-10029", customer: "Neha Singh", amount: 950, status: "Pending", date: "18 May 2025" },
  { no: "INV-10028", customer: "Sanjay Mehta", amount: 1690, status: "Paid", date: "18 May 2025" },
];

export const inventoryAlerts = [
  { name: "Milk", note: "Only 5L remaining", level: "Low Stock" },
  { name: "Chocolate", note: "Only 2kg remaining", level: "Low Stock" },
  { name: "Flour", note: "Only 10kg remaining", level: "Low Stock" },
  { name: "Butter", note: "Only 1kg remaining", level: "Low Stock" },
];

export const recentActivity = [
  { title: "Sale created", note: "Invoice INV-10032", time: "18 May, 6:45 PM" },
  { title: "Payment received", note: "₹2,450 from Rahul Verma", time: "18 May, 6:30 PM" },
  { title: "Expense added", note: "₹1,200 for Raw Materials", time: "18 May, 5:15 PM" },
  { title: "New customer added", note: "Amit Kumar", time: "18 May, 4:00 PM" },
];

export const demoProducts = [
  { id: "p1", name: "Chocolate Truffle Cake", sku: "CK-001", category: "Cakes", price: 850, cost: 420, stock: 12, unit: "pcs", min: 5 },
  { id: "p2", name: "Butter Croissant", sku: "PA-014", category: "Pastries", price: 80, cost: 30, stock: 48, unit: "pcs", min: 20 },
  { id: "p3", name: "Sourdough Bread", sku: "BR-007", category: "Bread", price: 220, cost: 110, stock: 18, unit: "pcs", min: 10 },
  { id: "p4", name: "Chocolate Chip Cookies", sku: "CO-022", category: "Cookies", price: 40, cost: 12, stock: 240, unit: "pcs", min: 50 },
  { id: "p5", name: "Red Velvet Cupcake", sku: "CK-019", category: "Cakes", price: 120, cost: 45, stock: 36, unit: "pcs", min: 20 },
  { id: "p6", name: "Whole Milk", sku: "RW-001", category: "Raw Material", price: 60, cost: 50, stock: 5, unit: "L", min: 20 },
];

export const demoCustomers = [
  { id: "c1", name: "Rahul Verma", phone: "+91 98765 43210", email: "rahul@example.com", dues: 0, ltv: 18450, orders: 24 },
  { id: "c2", name: "Priya Sharma", phone: "+91 99880 12345", email: "priya@example.com", dues: 0, ltv: 12300, orders: 17 },
  { id: "c3", name: "Amit Kumar", phone: "+91 97400 99887", email: "amit@example.com", dues: 3200, ltv: 22100, orders: 31 },
  { id: "c4", name: "Neha Singh", phone: "+91 90909 00000", email: "neha@example.com", dues: 950, ltv: 4200, orders: 6 },
  { id: "c5", name: "Sanjay Mehta", phone: "+91 88800 11122", email: "sanjay@example.com", dues: 0, ltv: 9800, orders: 11 },
];

export const demoSales = recentInvoices.map((i) => ({
  ...i,
  payment: i.status === "Paid" ? "UPI" : "Credit",
}));

export const demoExpenses = [
  { id: "e1", date: "18 May 2025", category: "Raw Materials", note: "Flour + sugar restock", amount: 1200 },
  { id: "e2", date: "17 May 2025", category: "Electricity", note: "Monthly bill", amount: 4200 },
  { id: "e3", date: "15 May 2025", category: "Salary", note: "Baker — May", amount: 18000 },
  { id: "e4", date: "12 May 2025", category: "Marketing", note: "Instagram ads", amount: 2500 },
  { id: "e5", date: "10 May 2025", category: "Rent", note: "Shop rent — May", amount: 25000 },
];

export const expenseByCategory = [
  { name: "Rent", value: 25000 },
  { name: "Salary", value: 18000 },
  { name: "Raw Materials", value: 12400 },
  { name: "Electricity", value: 4200 },
  { name: "Marketing", value: 2500 },
  { name: "Misc", value: 1800 },
];

export const subscriptionPlans = [
  { id: "free", name: "Free", price: 0, blurb: "Try BizPilot AI", features: ["Up to 50 invoices/mo", "1 user", "Basic reports"] },
  { id: "starter", name: "Starter", price: 499, blurb: "For new shops", features: ["Unlimited invoices", "2 users", "GST invoicing", "WhatsApp share"] },
  { id: "pro", name: "Pro", price: 999, blurb: "Most popular", features: ["Everything in Starter", "5 users", "AI Assistant", "Advanced reports", "Inventory alerts"], popular: true },
  { id: "business", name: "Business", price: 1999, blurb: "For growing teams", features: ["Everything in Pro", "Unlimited users", "Multi-outlet", "Priority support", "API access"] },
];
