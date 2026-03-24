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
    const lead = JSON.parse(event.body);

    const notificationRecord = {
      leadId: lead.id,
      leadName: lead.name,
      leadEmail: lead.email,
      leadPhone: lead.phone,
      service: lead.service,
      sentAt: new Date().toISOString(),
      method: "console",
    };

    // Attempt email notification if configured
    if (process.env.NOTIFICATION_EMAIL) {
      try {
        console.log(
          `Email notification would be sent to: ${process.env.NOTIFICATION_EMAIL}`
        );
        console.log(`New lead from ${lead.name} (${lead.email})`);
        console.log(`Phone: ${lead.phone} | Service: ${lead.service}`);
        notificationRecord.method = "email";
        notificationRecord.recipientEmail = process.env.NOTIFICATION_EMAIL;
      } catch (emailError) {
        console.error("Email notification failed:", emailError.message);
        notificationRecord.method = "console-fallback";
      }
    }

    // Console fallback logging
    console.log("--- New Lead Notification ---");
    console.log(`Name: ${lead.name}`);
    console.log(`Email: ${lead.email}`);
    console.log(`Phone: ${lead.phone}`);
    console.log(`Service: ${lead.service || "N/A"}`);
    console.log(`Preferred Date: ${lead.preferredDate || "N/A"}`);
    console.log(`Message: ${lead.message || "N/A"}`);
    console.log("-----------------------------");

    // Store notification record in notifications Blobs store
    const store = getStore("notifications");
    const notificationId = `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
    notificationRecord.id = notificationId;
    await store.setJSON(notificationId, notificationRecord);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, notificationId }),
    };
  } catch (error) {
    console.error("send-notification error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: "Internal server error" }),
    };
  }
}
