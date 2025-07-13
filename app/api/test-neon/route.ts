// // app/api/test-neon/route.ts
// import { getDbConnection } from "@/lib/db";

// export async function GET() {
//   try {
//     const sql = await getDbConnection();
//     const result = await sql`SELECT now()`;
//     console.log("Neon response:", result);
//     return new Response(JSON.stringify(result), { status: 200 });
//   } catch (err) {
//     console.error("Neon DB error:", err);
//     return new Response("DB error", { status: 500 });
//   }
// }
