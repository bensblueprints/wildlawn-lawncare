const { getStore } = require("@netlify/blobs");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    // Honeypot check
    if (body.website) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    // Validate required fields
    if (!body.name || !body.email || !body.phone) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Name, email, and phone are required",
        }),
      };
    }

    const id = `lead-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    const lead = {
      id,
      name: body.name,
      email: body.email,
      phone: body.phone,
      service: body.service || "",
      preferredDate: body.preferredDate || "",
      message: body.message || "",
      status: "new",
      notes: [],
      createdAt: new Date().toISOString(),
    };

    const store = getStore("leads");
    await store.setJSON(id, lead);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, id }),
    };
  } catch (err) {
    console.error("submit-lead error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: "Internal server error" }),
    };
  }
};
