import { processCandidate } from './validator.mjs';

// All data below is invented for this educational example.
const evidence = [
  { id: 'SYN-001', description: 'Fictional cabling RFP', visibility: 'approved', status: 'verified', valid_through: '2027-01-20' },
  { id: 'SYN-002', description: 'Fictional contractor interviews', visibility: 'approved', status: 'verified', valid_through: '2027-01-20' },
  { id: 'SYN-003', description: 'Fictional onboarding metrics', visibility: 'approved', status: 'verified', valid_through: '2027-01-20' }
];
const request = { role: 'pilot_lead', question: 'What three low-risk pilot experiments should we review?' };
const mockModelOutput = {
  actions: [
    { id: '1', owner: 'Research lead', next_step: 'Review source details and confirm project fit', target: 'Review 5 records', evidence_ids: ['SYN-001'], uncertainty: 'Relevance has not been independently assessed' },
    { id: '2', owner: 'Pilot lead', next_step: 'Draft a contact plan for human approval', target: 'Prepare a draft for 3 pilot interviews', evidence_ids: ['SYN-002'], uncertainty: 'Interest level is unknown' },
    { id: '3', owner: 'Analyst', next_step: 'Compare onboarding funnel observations', target: 'Review 4 synthetic events', evidence_ids: ['SYN-003'], uncertainty: 'Sample is too small to generalize' }
  ]
};
const result = processCandidate(request, mockModelOutput, evidence);
console.log('SOUVEX synthetic strategy demonstration');
console.log('All opportunities and model responses are fictional.');
console.log(JSON.stringify(result, null, 2));
console.log('No LLM was called; no real recommendations were executed or stored.');
