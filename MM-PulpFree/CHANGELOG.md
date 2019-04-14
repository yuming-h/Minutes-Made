# PulpFree Changelog (Node Backend)

===============================================================

### New changes go above the last

**0.0.1**

- Add `users/\<userId\>/meetings` endpoint, returning metadata for a user's meetings
- Introduced KnownError object
  - Used to distinguish between errors thrown in a try/catch block with multiple awaited calls that would otherwise all be caught in the main catch, throwing a generic (unknown) error to the FE.
  - TLDR: Enables better error communication for users.
- Added proper error handling to all endpoints.
- Implemented CHANGELOG.md
