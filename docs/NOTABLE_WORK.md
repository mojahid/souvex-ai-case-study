# Application / Portfolio Description

**Project:** SOUVEX — Bounded LLM Strategy Recommendations for a Contractor Opportunity Platform

I developed an AI-assisted capability within SOUVEX, an independently built platform for sourcing and evaluating specialty-contractor opportunities. The implementation uses a server-side model integration, domain-specific prompting, authenticated request handling, checks for incomplete or incorrectly structured responses, and Supabase persistence of advisory recommendations. I also included automated tests for key failure cases. The AI proposes actions but does not autonomously execute them.

This engineering work highlighted an important reliability issue: satisfying a prescribed output format is not evidence that a model's recommendation is factually justified. My interest is in evaluating how evidence grounding, semantic checks, and application-enforced boundaries affect the trustworthiness of model-assisted workflows.

**Public evidence:** This repository is a sanitized case study with a synthetic demo and evaluation plan. It is not the private production repository, and no measured model-quality improvement is claimed.

## Short version for a space-limited application

Built an independent LLM-assisted strategy component for SOUVEX using server-side model calls, authenticated inputs, structured-response validation, Supabase logging, and automated tests. Created a public, synthetic case study of the workflow and its reliability limitations; production code remains private.
