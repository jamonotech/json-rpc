// src/service/JsonRpcRequest.js

export async function JsonRpcRequest(method, params, id = 1) {
  const response = await fetch("/jsonrpc/person", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.result;
}
