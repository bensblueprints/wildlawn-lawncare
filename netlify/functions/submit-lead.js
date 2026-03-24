import { getStore } from "@netlify/blobs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  try {
    const { name, email, phone, service, preferredDate, message, honeypot } =
      JSON.parse(event.body);

    // Spam check — silently accept honeypot submissions
    if (honeypot) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true }),
      };
    }

    // Validate required fields
    if (!name || !email || !phone) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: "Name, email, and phone are required",
        }),
      };
    }

    // Generate unique ID
    const randomHex = Math.random().toString(16).slice(2, 10);
    const leadId = `${Date.now()}-${randomHex}`;

    const lead = {
      id: leadId,
      name,
      email,
      phone,
      service: service || "",
      preferredDate: preferredDate || "",
      message: message || "",
      status: "new",
      createdAt: new Date().toISOString(),
      notes: [],
    };

    // Store lead in Blobs
    const store = getStore("leads");
    await store.setJSON(leadId, lead);

    // Call send-notification function internally
    try {
      const notificationUrl = `${event.rawUrl.replace(/\/submit-lead$/, "/send-notification")}`;
      await fetch(notificationUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch (notifyError) {
      console.error("Notification failed:", notifyError.message);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, leadId }),
    };
  } catch (error) {
    console.error("submit-lead error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: "Internal server error" }),
    };
  }
}
