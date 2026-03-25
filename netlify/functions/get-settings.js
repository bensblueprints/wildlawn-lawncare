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
    connectLambda(event);
    const store = getStore("settings");

    let trucks = [];
    let services = [];
    let customers = [];
    let packages = [];
    let contracts = [];

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

    try {
      const customersData = await store.get("customers", { type: "json" });
      if (customersData) customers = customersData;
    } catch (e) {
      // Empty store, return defaults
    }

    try {
      const packagesData = await store.get("packages", { type: "json" });
      if (packagesData) packages = packagesData;
    } catch (e) {
      // Empty store, return defaults
    }

    try {
      const contractsData = await store.get("contracts", { type: "json" });
      if (contractsData) contracts = contractsData;
    } catch (e) {
      // Empty store, return defaults
    }

    if (isPublic) {
      // Public mode: return only active services (limited fields) and active truck count
      // Do NOT expose customer data in public mode
      const activeServices = services
        .filter((s) => s.status === "active")
        .map((s) => ({
          name: s.name,
          description: s.description,
          priceDisplay: s.priceDisplay,
          durationMinutes: s.durationMinutes,
        }));

      const activeTruckCount = trucks.filter((t) => t.status === "active").length;

      const activePackages = packages
        .filter((p) => p.status === "active")
        .map((p) => ({
          name: p.name,
          description: p.description,
          monthlyPrice: p.monthlyPrice,
          frequency: p.frequency,
          servicesIncluded: p.servicesIncluded,
          contractLength: p.contractLength,
        }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          services: activeServices,
          activeTruckCount,
          packages: activePackages,
        }),
      };
    }

    // Authenticated mode: return full data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, trucks, services, customers, packages, contracts }),
    };
  } catch (err) {
    console.error("get-settings error:", err);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, trucks: [], services: [], customers: [], packages: [], contracts: [] }),
    };
  }
};
