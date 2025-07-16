import { getDbConnection } from "./db";

export async function getSummaries(userId: string) {
  const sql = await getDbConnection();
  const summaries = await sql`
    SELECT * 
    FROM pdf_summaries 
    WHERE user_id = ${userId} AND is_deleted = false
    ORDER BY created_at DESC
  `;
  return summaries;
}

export async function getSummaryById(id: string) {
  try {
    const sql = await getDbConnection();
    const [summary] = await sql`
      SELECT * 
      FROM pdf_summaries 
      WHERE id = ${id} AND is_deleted = false
    `;
    return summary;
  } catch (error) {
    console.log("Error fetching summary by id", error);
    return null;
  }
}
