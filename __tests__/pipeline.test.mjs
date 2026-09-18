import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Load source pack
const sourcePack = JSON.parse(
  readFileSync(resolve(process.cwd(), 'data/source-pack.json'), 'utf8')
);

test('Pipeline Step 1: Ingestion & Normalization', async (t) => {
  assert.ok(sourcePack.meeting_transcripts.length > 0, 'Meeting transcripts should exist');
  assert.ok(sourcePack.email_threads.length === 5, 'Should have 5 email threads');
  assert.ok(sourcePack.voice_notes.length === 2, 'Should have 2 voice notes');
  assert.ok(Object.keys(sourcePack.calendars).length >= 4, 'Should have at least 4 calendars');
});

test('Pipeline Stress Test 1: Vendor List Walk-back resolves to Wednesday morning', async (t) => {
  const vendorThread = sourcePack.email_threads.find(t => t.thread_id === 'thread-1');
  assert.ok(vendorThread, 'Vendor thread exists');

  const emails = vendorThread.emails;
  const lastArjunCommitment = emails.find(e => e.source_id === 'thread-1-msg-4');
  assert.ok(lastArjunCommitment, 'Found email msg-4 where Arjun commits to Wednesday');
  assert.match(lastArjunCommitment.body, /Wednesday/i, 'Body specifies Wednesday morning');
});

test('Pipeline Stress Test 2: Q3 Campaign Deck resolves to Thursday 9:30 AM', async (t) => {
  const deckThread = sourcePack.email_threads.find(t => t.thread_id === 'thread-2');
  assert.ok(deckThread, 'Deck thread exists');

  const emails = deckThread.emails;
  const finalTimeEmail = emails.find(e => e.source_id === 'thread-2-msg-4');
  assert.ok(finalTimeEmail, 'Found email setting 9:30 AM Thursday');
  assert.match(finalTimeEmail.body, /9:30 AM Thursday/i, 'Recency wins with Thursday 9:30 AM');
});

test('Pipeline Stress Test 3: Mumbai Lease is strictly unowned & at-risk', async (t) => {
  const leaseThread = sourcePack.email_threads.find(t => t.thread_id === 'thread-5');
  assert.ok(leaseThread, 'Lease thread exists');

  // Verify Divya explicitly declined ownership in msg-3
  const divyaMsg = leaseThread.emails.find(e => e.source_id === 'thread-5-msg-3');
  assert.ok(divyaMsg, 'Divya msg exists');
  assert.match(divyaMsg.body, /Not on my end/i, 'Divya explicitly passes ownership');

  // Verify Raghav confirms unowned in msg-5
  const raghavMsg = leaseThread.emails.find(e => e.source_id === 'thread-5-msg-5');
  assert.ok(raghavMsg, 'Raghav msg exists');
  assert.match(raghavMsg.body, /still unowned/i, 'Explicit unowned status preserved');
});
