const { getStore, connectLambda } = require("@netlify/blobs");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

  if (event.httpMethod !== "GET") {
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
    const store = getStore("leads");
    const { blobs } = await store.list();

    const statusFilter = event.queryStringParameters?.status || null;
    const leads = [];

    for (const blob of blobs) {
      try {
        const lead = await store.get(blob.key, { type: "json" });
        if (lead) {
          if (!statusFilter || lead.status === statusFilter) {
            leads.push(lead);
          }
        }
      } catch (e) {
        console.error(`Error reading lead ${blob.key}:`, e);
      }
    }

    // Sort by createdAt descending
    leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, leads }),
    };
  } catch (err) {
    console.error("get-leads error:", err);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, leads: [] }),
    };
  }
};
