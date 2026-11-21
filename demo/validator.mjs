/**
 * Synthetic demonstration of application-side checks for model-generated
 * strategy proposals. Not copied from SOUVEX production code.
 *
 * IMPORTANT: Checking a referenced ID does NOT prove that its associated
 * narrative recommendation is semantically correct.
 */
const allowedRoles = new Set(['pilot_lead', 'researcher', 'analyst']);
const requiredActionIds = ['1', '2', '3'];

export function validateRequest(request) {
  if (!request || typeof request !== 'object') return { ok: false, reason: 'Request must be an object' };
  if (!allowedRoles.has(request.role)) return { ok: false, reason: 'Role not authorized for proposal requests' };
  if (typeof request.question !== 'string' || !request.question.trim() || request.question.length > 4000) {
    return { ok: false, reason: 'Question must be between 1 and 4000 characters' };
  }
  return { ok: true };
}
export function validateProposal(proposal, evidence, referenceDate = '2026-11-21') {
  if (!proposal || !Array.isArray(proposal.actions) || proposal.actions.length !== 3) {
    return { ok: false, reason: 'Exactly three actions are required' };
  }
  if (!Array.isArray(evidence)) return { ok: false, reason: 'Evidence must be a list' };
  const allowed = new Map(evidence
    .filter(x => x && x.visibility === 'approved' && x.status === 'verified' && x.valid_through >= referenceDate)
    .map(x => [x.id, x]));
  const seen = new Set();
  for (const action of proposal.actions) {
    if (!action || typeof action !== 'object') return { ok: false, reason: 'Action must be an object' };
    if (!requiredActionIds.includes(action.id) || seen.has(action.id)) return { ok: false, reason: 'Invalid or duplicate action ID' };
    seen.add(action.id);
    for (const key of ['owner', 'next_step', 'target', 'uncertainty']) {
      if (typeof action[key] !== 'string' || !action[key].trim()) return { ok: false, reason: `Missing ${key} in action ${action.id}` };
    }
    if (!Array.isArray(action.evidence_ids) || !action.evidence_ids.length) {
      return { ok: false, reason: `Action ${action.id} needs evidence IDs` };
    }
    if (action.evidence_ids.some(id => !allowed.has(id))) {
      return { ok: false, reason: `Action ${action.id} references unavailable, expired, or unapproved evidence` };
    }
    // Simple illustrative rule; not comprehensive natural-language semantic validation.
    if (/(?:^|\b)(send\s+emails?|deploy\s+code|charge\s+a\s+card|purchase\s+ads)(?:\b|$)/i.test(action.next_step)) {
      return { ok: false, reason: `Action ${action.id} requests an operational side effect` };
    }
  }
  return { ok: true, status: 'proposed', note: 'Passes structural and evidence-ID checks only; human review is still required' };
}
export function processCandidate(request, proposal, evidence, date = '2026-11-21') {
  const requestCheck = validateRequest(request);
  if (!requestCheck.ok) return { accepted: false, reason: requestCheck.reason };
  const responseCheck = validateProposal(proposal, evidence, date);
  if (!responseCheck.ok) return { accepted: false, reason: responseCheck.reason };
  return { accepted: true, status: 'awaiting_human_review', action_count: proposal.actions.length };
}
