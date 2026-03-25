const { getStore } = require("@netlify/blobs");

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
    const body = JSON.parse(event.body || "{}");
    const store = getStore("settings");

    if (body.trucks) {
      if (!Array.isArray(body.trucks)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: "trucks must be an array" }),
        };
      }

      // Validate each truck has required fields
      for (const truck of body.trucks) {
        if (!truck.id || !truck.name) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: "Each truck must have id and name",
            }),
          };
        }
      }

      await store.setJSON("trucks", body.trucks);
    }

    if (body.services) {
      if (!Array.isArray(body.services)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: "services must be an array" }),
        };
      }

      // Validate each service has required fields
      for (const service of body.services) {
        if (!service.id || !service.name) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: "Each service must have id and name",
            }),
          };
        }
      }

      await store.setJSON("services", body.services);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: "Settings updated" }),
    };
  } catch (err) {
    console.error("update-settings error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: "Internal server error" }),
    };
  }
};
