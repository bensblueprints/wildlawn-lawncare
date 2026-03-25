const { getStore } = require("@netlify/blobs");

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

  const mode = event.queryStringParameters?.mode || null;
  const isPublic = mode === "public";

  if (!isPublic && !checkAuth(event)) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ success: false, error: "Unauthorized" }),
    };
  }

  try {
    const store = getStore("settings");

    let trucks = [];
    let services = [];

    try {
      const trucksData = await store.get("trucks", { type: "json" });
      if (trucksData) trucks = trucksData;
    } catch (e) {
      // Empty store, return defaults
    }

    try {
      const servicesData = await store.get("services", { type: "json" });
      if (servicesData) services = servicesData;
    } catch (e) {
      // Empty store, return defaults
    }

    if (isPublic) {
      // Public mode: return only active services (limited fields) and active truck count
      const activeServices = services
        .filter((s) => s.status === "active")
        .map((s) => ({
          name: s.name,
          description: s.description,
          priceDisplay: s.priceDisplay,
          durationMinutes: s.durationMinutes,
        }));

      const activeTruckCount = trucks.filter((t) => t.status === "active").length;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          services: activeServices,
          activeTruckCount,
        }),
      };
    }

    // Authenticated mode: return full data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, trucks, services }),
    };
  } catch (err) {
    console.error("get-settings error:", err);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, trucks: [], services: [] }),
    };
  }
};
