import { getStore } from "@netlify/blobs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  try {
    // Auth check
    const authHeader = event.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token || token !== process.env.ADMIN_PASSWORD) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: "Unauthorized" }),
      };
    }

    const store = getStore("leads");
    const { blobs } = await store.list();

    // Fetch all leads
    const leads = [];
    for (const blob of blobs) {
      try {
        const lead = await store.get(blob.key, { type: "json" });
        if (lead) {
          leads.push(lead);
        }
      } catch (err) {
        console.error(`Failed to fetch lead ${blob.key}:`, err.message);
      }
    }

    // Filter by status if query param provided
    const statusFilter = event.queryStringParameters?.status;
    const filtered = statusFilter
      ? leads.filter((lead) => lead.status === statusFilter)
      : leads;

    // Sort by createdAt descending (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, leads: filtered }),
    };
  } catch (error) {
    console.error("get-leads error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: "Internal server error" }),
    };
  }
}
