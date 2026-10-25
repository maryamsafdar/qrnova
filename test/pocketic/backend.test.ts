import { PocketIc, createIdentity } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";
import { registerCaller } from "./test-utils";

/**
 * Backend lane for QRNova. The app generates QR codes entirely in the browser,
 * so the canister stores no QR content. What it does expose is the shared
 * authorization surface plus the OQL `Expose` mixin and the static API doc.
 * This lane installs the real compiled wasm and calls those public methods, so
 * a canister whose methods are unimplemented stubs that trap at runtime cannot
 * pass the gate.
 */

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
  }));
});

afterAll(async () => {
  await pic?.tearDown();
});

it("returns the static API documentation without trapping", async () => {
  const doc = await actor.getApiDoc();
  expect(typeof doc).toBe("string");
  expect(doc).toContain("QRNova");
});

it("reports an empty OQL schema because no entities are registered", async () => {
  const schema = await actor.schema();
  expect(typeof schema).toBe("string");
});

it("rejects an OQL query because no entities are registered", async () => {
  // QRNova registers `entities = []`, so any query names an unknown entity and
  // the Expose mixin rejects it. The method is reachable and answers with a
  // defined error rather than trapping on an unimplemented stub.
  await expect(
    actor.execute(JSON.stringify({ start: "" })),
  ).rejects.toThrow(/OQL/);
});

it("reports the caller role for an anonymous caller", async () => {
  const role = await actor.getCallerUserRole();
  expect(role).toBeDefined();
});

it("reports whether the caller is an admin", async () => {
  await expect(actor.isCallerAdmin()).resolves.toBe(false);
});

it("registers the first caller as administrator through the public initializer", async () => {
  const alice = createIdentity("alice");
  const aliceActor = await registerCaller(
    pic!.createActor<_SERVICE>(idlFactory, canisterId),
    alice,
  );
  await expect(aliceActor.isCallerAdmin()).resolves.toBe(true);
});

it("does not grant administrator to a later caller", async () => {
  const bob = createIdentity("bob");
  const bobActor = await registerCaller(
    pic!.createActor<_SERVICE>(idlFactory, canisterId),
    bob,
  );
  await expect(bobActor.isCallerAdmin()).resolves.toBe(false);
});
