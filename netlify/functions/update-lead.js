import { getStore } from "@netlify/blobs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "PUT, OPTIONS",
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "PUT") {
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

    const { id, status, notes } = JSON.parse(event.body);

    if (!id) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: "Lead ID is required" }),
      };
    }

    const store = getStore("leads");
    const lead = await store.get(id, { type: "json" });

    if (!lead) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: "Lead not found" }),
      };
    }

    // Update status if provided
    if (status) {
      lead.status = status;
    }

    // Append to notes array if provided
    if (notes) {
      lead.notes = lead.notes || [];
      lead.notes.push({
        text: notes,
        addedAt: new Date().toISOString(),
      });
    }

    lead.updatedAt = new Date().toISOString();

    // Save back to Blobs
    await store.setJSON(id, lead);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, lead }),
    };
  } catch (error) {
    console.error("update-lead error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: "Internal server error" }),
    };
  }
}
