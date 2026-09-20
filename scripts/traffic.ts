import http from "node:http";

const calls = [
  { caller: "consumer-ts-1", path: "/v1/products/prod_101" },
  { caller: "consumer-ts-1", path: "/v1/inventory/prod_101" },
  { caller: "consumer-ts-2", path: "/v1/products" },
  { caller: "consumer-ts-2", path: "/v1/categories" },
  { caller: "consumer-ts-3", path: "/v1/pricing/prod_101" },
  { caller: "consumer-ts-3", path: "/v1/loans/loan_101" },
  { caller: "consumer-ts-4", path: "/v1/products/prod_101" },
  { caller: "consumer-ts-4", path: "/v1/loans/loan_101/schedule" },
  { caller: "consumer-java-1", path: "/v1/loans/loan_101" },
  { caller: "consumer-java-2", path: "/v1/rates" },
  { caller: "consumer-java-2", path: "/v1/loans/loan_101/schedule" },
  { caller: "consumer-java-3", path: "/v1/loans/loan_101" },
  { caller: "consumer-java-3", path: "/v1/customers/cust_101" },
  { caller: "consumer-java-4", path: "/v1/loans/loan_101" },
  { caller: "consumer-java-4", path: "/v1/products/prod_101" },
];

async function sendRequest(caller: string, path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: parseInt(process.env.PORT || "8088", 10),
        path,
        method: "GET",
        headers: {
          "x-caller-service": caller,
        },
      },
      (res) => {
        res.on("data", () => {});
        res.on("end", resolve);
      },
    );
    req.on("error", reject);
    req.end();
  });
}

async function runTraffic() {
  console.log(`Sending traffic for ${calls.length} expected calls...`);
  for (const c of calls) {
    await sendRequest(c.caller, c.path);
    console.log(`  Sent: ${c.caller} -> GET ${c.path}`);
  }
  console.log("Traffic generation completed.");
}

runTraffic().catch(console.error);
