# Security

Leetflix is a static site. There is no backend, no user data, and no secrets in the deploy.

## Report a vulnerability

Please use [GitHub private vulnerability reporting](https://github.com/jasodeep/leetflix/security/advisories/new) on this repository.

Include:

- A description of the issue
- Steps to reproduce
- The impact you expect
- Any suggested fix

You should hear back within a week. Please do not open a public issue or discussion until we have a fix or have agreed the report is not a vulnerability.

## What is in scope

- XSS or injection in the static pages
- Supply-chain issues in production dependencies
- Accidental exposure of credentials in the repo or CI

## What is out of scope

- Findings that require a compromised GitHub account or a malicious `npm install`
- Issues that only exist in a modified local build
- LeetCode's own site, API, or problem statements
