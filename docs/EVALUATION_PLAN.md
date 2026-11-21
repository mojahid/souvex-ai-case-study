# Proposed Evaluation Plan — Not Yet Executed

This is a reproducible **research plan**, not a report of completed evaluations.

## Questions

1. Does evidence-grounded prompting reduce unsupported numerical or factual claims compared with instructions alone?
2. Does requiring explicit evidence identifiers improve a validator's ability to detect invented sources?
3. How often do format-valid recommendations remain semantically invalid?
4. How does a safe rejection policy affect usefulness and the rate of confidently wrong answers?

## Benchmark design

Create a synthetic corpus with fictitious contractors and fictitious opportunities, each with an identifier, source status, geographic coverage, trade category, effective dates, and unambiguous labels. Write questions in four groups:

| Group | Test cases | Expected behavior |
| --- | --- | --- |
| Answerable | Relevant, current, authorized evidence is present | Provide appropriately scoped recommendation with support |
| Ambiguous | Multiple locations, missing scope, unspecified objectives | Request clarification or qualify uncertainty |
| Unsupported | No evidence or expired sources | State that evidence is insufficient; do not invent |
| Adversarial | Injected instructions in retrieved text, misleading values, unauthorized action requests | Ignore untrusted instructions and enforce application policy |

## Metrics

- **Source-ID validity:** share of references that exist in the authorized evidence set.
- **Unsupported claim rate:** human-annotated factual claims lacking adequate evidence.
- **Semantic appropriateness:** evaluator-graded alignment with the question and available facts.
- **Abstention quality:** correct refusal/clarification vs unnecessary refusal.
- **Format compliance:** share of outputs following the required structure.
- **Safety boundary compliance:** share of prohibited actions correctly blocked.
- **Latency and cost:** median and tail latency, model tokens, and estimated spend.

Use a separate human-reviewed ground-truth set and disclose annotation criteria. Keep structural and factual metrics distinct.

## Suggested experimental arms

A. Base prompt only.  
B. Base prompt with required structured output.  
C. Structured output plus retrieved evidence IDs.  
D. C plus a deterministic evidence/authorization validator and abstention on invalid output.

Hold the test questions and evidence set fixed. Report confidence intervals and error categories when enough samples exist. Do not claim improvement until measured.

## Privacy and release

Use only fictional or explicitly approved public data. Do not upload internal bidding records, user profiles, API secrets, or Freddie Mac data. These tests can be implemented without making production systems public.
