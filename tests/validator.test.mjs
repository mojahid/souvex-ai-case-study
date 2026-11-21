import test from 'node:test';
import assert from 'node:assert/strict';
import { processCandidate, validateProposal, validateRequest } from '../demo/validator.mjs';

const evidence = [
  { id: 'SYN-1', status: 'verified', visibility: 'approved', valid_through: '2027-01-01' },
  { id: 'SYN-EXPIRED', status: 'verified', visibility: 'approved', valid_through: '2026-01-01' },
  { id: 'SYN-PRIVATE', status: 'verified', visibility: 'restricted', valid_through: '2027-01-01' }
];
const request = { role: 'analyst', question: 'Prepare three options' };
const sample = () => ({ actions: ['1', '2', '3'].map(id => ({
  id, owner: 'Analyst', next_step: 'Review supporting information',
  target: 'Inspect 2 records', evidence_ids: ['SYN-1'], uncertainty: 'Fictional sample'
})) });

test('accepts a valid, authorized proposal only as awaiting review', () => {
  assert.deepEqual(processCandidate(request, sample(), evidence), { accepted: true, status: 'awaiting_human_review', action_count: 3 });
});
test('rejects unauthorized request', () => {
  assert.equal(validateRequest({ ...request, role: 'anonymous' }).ok, false);
});
test('rejects missing third action', () => {
  const p = sample(); p.actions.pop();
  assert.equal(validateProposal(p, evidence).ok, false);
});
test('rejects unsupported evidence ID', () => {
  const p = sample(); p.actions[0].evidence_ids = ['SYN-UNKNOWN'];
  assert.equal(validateProposal(p, evidence).ok, false);
});
test('rejects expired evidence', () => {
  const p = sample(); p.actions[0].evidence_ids = ['SYN-EXPIRED'];
  assert.equal(validateProposal(p, evidence).ok, false);
});
test('rejects restricted evidence', () => {
  const p = sample(); p.actions[0].evidence_ids = ['SYN-PRIVATE'];
  assert.equal(validateProposal(p, evidence).ok, false);
});
test('rejects operational side effects proposed by a model', () => {
  const p = sample(); p.actions[2].next_step = 'send emails to prospects';
  assert.equal(validateProposal(p, evidence).ok, false);
});
test('rejects duplicate action IDs', () => {
  const p = sample(); p.actions[1].id = '1';
  assert.equal(validateProposal(p, evidence).ok, false);
});
