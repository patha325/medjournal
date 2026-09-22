# MedJournal / Vårdflöde POC

An interactive proof of concept for a safer, interoperable Swedish electronic health record. The repository contains a clinician-facing mock-up, target architecture, canonical data model and a presentation comparing the design approach with lessons from the Swedish Oracle Health Millennium implementation.

## Open the POC

- [Private hosted demonstration](https://vardflode-journal-poc.patha325.chatgpt.site)
- Local: open `site/index.html` in a modern browser. No build step or external dependencies are required.

The demonstration uses synthetic patient information only. It is not approved for clinical use.

## Design principles

- Structured clinical documentation without hiding the narrative
- FHIR R4 APIs with Swedish HL7 base profiles at the integration boundary
- Versioned, signed clinical records and append-only access logging
- Access based on role, organisation, current care relationship and declared purpose
- Terminology bindings for SNOMED CT, ICD-10-SE and KVÅ
- Modular components and exportable data to reduce supplier lock-in
- Clinical safety management, usability testing and staged rollout before scale

## Repository structure

```text
site/index.html                 Interactive, self-contained POC
docs/architecture.md            Target architecture and operational qualities
docs/data-model.md              Canonical data model and FHIR mappings
presentation/medjournal.pptx    Executive presentation
presentation/build-deck.mjs     Editable deck-generation source
```

## Scope

The POC demonstrates product direction, not production readiness. A clinical pilot would require legal assessment, DPIA, information classification, threat modelling, clinical hazard analysis, penetration testing, accessibility verification, regional integration testing, operational continuity exercises and validation with healthcare professionals.

## Reference framework

- Patient Data Act (2008:355) and the Act on Coherent Care and Social Care Documentation (2022:913)
- Socialstyrelsen HSLF-FS 2016:40
- IMY guidance for access control and systematic log review
- HL7 Sweden FHIR R4 base profiles
- E-hälsomyndigheten direction for national digital infrastructure and EHDS

## Licence

No licence has yet been selected. All rights reserved until a licence is added.
