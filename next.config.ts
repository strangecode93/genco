// next.config.js
import dotenv from "dotenv";
dotenv.config();
module.exports = {
  async headers() {
    return [
      {
        // Apply headers to all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" }, // Allow all origins
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};
