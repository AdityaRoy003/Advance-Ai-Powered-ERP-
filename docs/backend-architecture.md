# Backend Architecture Guide

## Structure
- Use a feature-based modular structure under `backend/src/modules`.
- Keep shared infrastructure in `backend/src/core`, `backend/src/shared`, and `backend/src/config`.

## API Versioning
- Prefix all APIs with `/api/v1/...`.
- Example modules: `/api/v1/auth`, `/api/v1/students`, `/api/v1/teachers`, `/api/v1/library`, `/api/v1/finance`.

## Response Format
- Success responses should follow:
  - `success`
  - `message`
  - `data`
  - `errors`
- Error responses should return `success: false` and a structured `errors` array.

## Logging
- Maintain logs in `backend/logs/`:
  - `access.log`
  - `error.log`
  - `security.log`
  - `audit.log`
  - `ai.log`

## Database Naming
- Collections: `users`, `students`, `teachers`, `courses`, `attendance`, `fees`, `payments`, `roles`, `permissions`, `notifications`, `audit_logs`
- Models: `User`, `Student`, `Teacher`, `Attendance`, `Fee`

## Branch Strategy
- Keep `main` and `develop` as long-lived branches.
- Use feature branches such as `feature/auth`, `feature/student`, `feature/attendance`, `feature/library`, `feature/finance`, and `feature/ai`.

## Coding Standards
- ES Modules (`import` / `export`)
- Async/await only
- No callback-based code
- Centralized error handling
- Environment variables for secrets
- Consistent folder and file naming
- Reusable services and utilities
