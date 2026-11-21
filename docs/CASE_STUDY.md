# Engineering Case Study: Bounded LLM Recommendations for SOUVEX

## Context and problem

SOUVEX is an early-stage procurement-opportunity platform for low-voltage, structured-cabling, fiber, and related specialty contractors. The wider product includes deterministic opportunity matching and source-verification workflows. A separate server-side LLM integration supports **strategy recommendations** for the platform's early pilot.

The LLM component addresses a common engineering challenge: generative models are useful for proposing actions, but their outputs are probabilistic, may be incomplete, and can sound persuasive without adequate evidence.

## Implemented design, based on review of the private repository

1. An authenticated server endpoint receives a strategy question, with input-length and format checks.
2. The backend calls the language model using a domain-specific system instruction and server-held API credentials.
3. The instruction requests three concrete recommendations with an owner, next step, target, and evidence that might change the recommendation.
4. The backend rejects incomplete responses and those missing the expected action structure.
5. When accepted, the recommendation and corresponding request metadata are persisted to Supabase as an auditable proposal.
6. Recommendations remain advisory; the model does not receive an autonomous path to send email, deploy code, or spend funds.

The private repository includes unit tests for rejected requests, incomplete model outputs, and linked record persistence. The reviewed source alone does not prove the live endpoint is operational or that recommendation quality has been empirically measured.

## Architectural choices and tradeoffs

| Decision | Benefit | Residual risk |
| --- | --- | --- |
| Server-side model credentials | Reduces exposure of secrets to browser clients | Backend permissions, logging and rotation still require operational controls |
| Explicit API authentication | Controls access to the strategy endpoint | Authorization is only one layer; misuse and rate limiting need separate attention |
| Domain-specific instructions | Helps guide consistent, relevant recommendations | Prompt instructions do not guarantee truth or correct grounding |
| Format and completion checks | Prevents some malformed or truncated output from being saved | Structurally valid text can still be unsupported or misleading |
| Persisted proposal records | Supports tracing and review | Storage alone does not provide quality evaluation or source provenance |
| Human authorization of actions | Keeps the LLM advisory, not independently operational | Human review can be rushed or overly trusting |

## Key insight

**Validation has multiple layers:**

- **Syntactic validity:** Did the LLM return the required fields and format?
- **Evidence validity:** Are the referenced sources legitimate, current, and permitted?
- **Semantic validity:** Do the actions actually follow from the supplied evidence?
- **Authorization:** Is the user permitted to access the evidence and propose the operation?
- **Execution approval:** Has a trusted human or policy explicitly authorized the action?

The reviewed implementation has meaningful controls for access, request shape, output shape, and persistence. It does **not** currently prove a general solution for validating evidence or semantic accuracy.

## Opportunities for deeper empirical work

1. Compare a simple format validator with evidence-linked structured output on the same set of strategy questions.
2. Assess whether adding retrieval from trusted operational data reduces fabricated statistics or unsupported claims.
3. Test prompt-injection cases where untrusted opportunity descriptions attempt to change model instructions.
4. Measure whether a rejection/abstention policy reduces confidently wrong recommendations without rejecting too many useful outputs.
5. Track evaluation outcomes separately from API availability and response-format compliance.

These are **proposed research directions**, not experiments completed in SOUVEX.

## Project boundaries

- **AI strategy recommendation:** Verified as implemented in the private codebase, subject to deployment-status uncertainty.
- **Contractor/opportunity matching:** Reviewed code uses rules, term patterns, geography, and scores; it should not be described as an LLM matching model.
- **RFP analyzer:** Not located in the reviewed main branch, so no public implementation claim is made.
- **ChatGPT–Gemini conversation bridge:** A proposal and some underlying components exist, but a complete live two-way bridge has not been verified.

## Why it matters for trustworthy AI

The relevant research question is not only whether an LLM can produce useful suggestions. It is whether we can identify *when a suggestion is unsupported, inapplicable, or inappropriate to act on*, and build systems that respond safely to those cases. The project connects applied engineering with empirical evaluation of model reliability, oversight, and constrained execution.
