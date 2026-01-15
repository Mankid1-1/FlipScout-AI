import test from "node:test";
import assert from "node:assert/strict";
import { generateSellerMessages } from "../src/engines/messageGenerator.js";

test("generateSellerMessages returns copy-ready templates", () => {
  const messages = generateSellerMessages({ title: "Vintage Chair" }, 80);
  assert.equal(messages.length, 3);
  messages.forEach((message) => {
    assert.ok(message.toLowerCase().includes("vintage chair"));
  });
});
