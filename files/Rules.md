# Rules — Setu

Non-negotiable rules for anyone building on or operating Setu. If a PR or deployment violates one of these, it does not ship.

## 1. Digital Public Good & Licensing Rules
- Core platform license: **Apache-2.0** (permissive, patent grant — easiest for a second government to adopt without legal friction).
- No proprietary, closed-source dependency may sit on the critical ingestion→scoring path.
- Must remain deployable on any cloud or bare-metal k8s — no hard dependency on a single vendor's managed service.
- All methodology behind the priority score must be publicly documented (no secret scoring).

## 2. Data Governance & Privacy Rules
- **Redact before you store**: PII (name, phone, precise home address) is tokenized/redacted at the gateway, before the event bus. If the redaction service is down, ingestion fails closed — never store raw PII "temporarily."
- **Consent is explicit**: every channel must present a one-line consent notice before capturing a report; consent flag travels with the record.
- **Data residency**: a nation's citizen data never leaves that nation's deployment. Only anonymized, aggregate statistics may be shared cross-nation, and only opt-in (see `Architecture.md` §5).
- **Retention limits**: raw voice/text is purged after transcription + a fixed retention window (default 90 days); structured, anonymized demand signals may be retained indefinitely for planning.
- **Right to erasure**: a citizen with a status-tracking ID can request deletion of their submission's identifying link.

## 3. AI/ML Model Governance Rules
- **No silent autonomy**: the model recommends; a human policymaker approves funding. The system must never auto-allocate budget.
- **Explainability required**: every `PriorityScore` must ship with a factor breakdown (demand, demographic weight, infra deficit, budget fit) — no black-box number on the dashboard.
- **Bias audits per language/region**: ASR accuracy and scoring fairness must be evaluated per language cohort before and after every model release; a cohort with materially worse performance blocks release until addressed or flagged.
- **Versioning**: every score stores the `model_version` that produced it; rollbacks must be possible without losing historical scores.

## 4. Engineering & Contribution Rules
- Trunk-based development, short-lived feature branches, conventional commits.
- Every PR touching data-handling, auth, or the scoring engine requires **2 approvals**, one of which is a security/privacy reviewer.
- Definition of Done: code merged **and** tests at the level below satisfied **and** docs updated **and** dashboards/alerts updated if behavior changed.

## 5. Testing Rules (see `Architecture.md` §7 for the full strategy)
| Layer | Minimum gate to merge |
|---|---|
| Unit | ≥ 85% coverage on scoring/redaction modules |
| Integration | Contract tests pass for every channel↔bus↔NLP↔warehouse boundary touched |
| E2E | Relevant channel's happy-path suite green in CI |
| Security | Static analysis + dependency scan clean (no criticals) |

CI must be green before merge — no exceptions for data-handling or scoring code.

## 6. Accessibility & Inclusion Rules
- **WCAG 2.1 AA minimum** on every citizen- and policymaker-facing screen (see `Design.md` for the checklist).
- Voice and SMS intake must work on a basic feature phone — never require a smartphone or app install to file a report.
- Minimum 10 languages/scripts at launch, including at least one non-Latin script (e.g., Devanagari, Cyrillic, Han) rendered correctly across all UI.
- Graceful degradation on 2G/offline: PWA queues submissions locally and syncs when connectivity returns.

## 7. Security Rules
- TLS everywhere in transit; encryption at rest for all data lake and warehouse storage.
- Webhook/callback endpoints (WhatsApp, SMS, IVR providers) must verify provider signatures — no unauthenticated inbound write path.
- Rate-limit per phone/identity-hash to prevent report spam/gaming without requiring hard KYC.
- Secrets in a managed secret store, never in code or config files committed to the repo.
- Incident response SLA: critical data-exposure incident acknowledged within 1 hour, nation's data-protection contact notified within 24 hours.

## 8. Release Gate Checklist
- [ ] PRD acceptance criteria met
- [ ] Architecture ADRs updated if design changed
- [ ] Tests per §5 green in CI
- [ ] Accessibility checklist (`Design.md`) passed
- [ ] Bias/fairness audit run if any model changed
- [ ] Data residency confirmed for target nation's deployment
- [ ] Runbook/on-call docs updated
