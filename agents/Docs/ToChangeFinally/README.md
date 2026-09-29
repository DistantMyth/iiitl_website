# Production handoff: what must change

This directory records the work required to turn the frontend demonstration into an operational institute website. No backend, real authentication, payment processing, or delivery queue was requested for this phase. AI/LLM integration (including the earlier "Ask IIITL" chatbot and OpenRouter) has been removed by decision and is out of scope.

Read:

1. [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md): services, contracts, permissions, data and release work.
2. [CONTENT_AND_PARITY.md](./CONTENT_AND_PARITY.md): source migration, missing records, and demo limitations.
3. [LOGO_SVG.md](./LOGO_SVG.md): the traced logo SVG, how to recolour and animate it, and why to ship it instead of the PNG.
4. [DEMO_WALKTHROUGH.md](./DEMO_WALKTHROUGH.md): how to demonstrate the current frontend.
5. [VERIFICATION.md](./VERIFICATION.md): checks executed and remaining release validation.

The production work is not implemented merely because its interface appears in the preview. In particular, browser-local data and route-based role selection provide **no security boundary**.
