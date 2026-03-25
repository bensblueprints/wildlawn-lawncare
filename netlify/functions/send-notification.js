const { getStore, connectLambda } = require("@netlify/blobs");

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
    connectLambda(event);
    const body = JSON.parse(event.body || "{}");

    console.log("Lead notification:", JSON.stringify(body, null, 2));

    const id = `notif-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    const notification = {
      id,
      leadId: body.leadId || "",
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
      service: body.service || "",
      message: body.message || "",
      createdAt: new Date().toISOString(),
    };

    const store = getStore("notifications");
    await store.setJSON(id, notification);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, id }),
    };
  } catch (err) {
    console.error("send-notification error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: "Internal server error" }),
    };
  }
};
