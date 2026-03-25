const { getStore, connectLambda } = require("@netlify/blobs");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "PUT, OPTIONS",
  "Content-Type": "application/json",
};

function checkAuth(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization || "";
  const token = authHeader.replace("Bearer ", "");
  return token === process.env.ADMIN_PASSWORD;
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "PUT") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  if (!checkAuth(event)) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ success: false, error: "Unauthorized" }),
    };
  }

  try {
    connectLambda(event);
    const body = JSON.parse(event.body || "{}");

    if (!body.id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Lead ID is required" }),
      };
    }

    const store = getStore("leads");
    const existing = await store.get(body.id, { type: "json" });

    if (!existing) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ success: false, error: "Lead not found" }),
      };
    }

    const updated = {
      ...existing,
      status: body.status || existing.status,
      notes: body.notes || existing.notes,
      updatedAt: new Date().toISOString(),
    };

    await store.setJSON(body.id, updated);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, lead: updated }),
    };
  } catch (err) {
    console.error("update-lead error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: "Internal server error" }),
    };
  }
};
