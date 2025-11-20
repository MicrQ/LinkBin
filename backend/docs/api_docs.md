# LinkBin API Documentation

Simple API reference for the LinkBin backend.

## Overview

This service provides a minimal links management API. All endpoints require authentication via a Supabase-style JWT presented in the `Authorization: Bearer <token>` header. The JWT must be signed with the shared secret configured in the environment variable `SUPABASE_JWT_SECRET`.

Base path: `/links`

Authentication: Bearer JWT

Environment variables

- `SUPABASE_JWT_SECRET` (required) — secret used to validate incoming JWTs. If missing the server will not start.

## Authentication

All endpoints use a FastAPI dependency that extracts the token from the `Authorization` header and validates it. The dependency returns the authenticated user's id , which is used to scope link resources to the owner.

Header example:

Authorization: Bearer <JWT>

If the token is missing or invalid the API responds with HTTP 401 Unauthorized.

## Models

Link input (create)

- title: string (required)
- url: HTTP URL (required)

Example JSON body:

{
	"title": "My link",
	"url": "https://example.com"
}

Link output (response)

- id: int
- title: str
- url: str
- created_at: str (ISO timestamp)

## Endpoints

### GET /links

Description: Return all links owned by the authenticated user.

Authentication: required (Bearer JWT)

Response: 200 OK with an array of link objects (see model above).

Success example (HTTP 200):

[
	{
		"id": 1,
		"title": "Example",
		"url": "https://example.com",
		"created_at": "2025-11-20T12:34:56Z"
	},
	{
		"id": 2,
		"title": "Another link",
		"url": "https://another.example",
		"created_at": "2025-11-20T13:01:02Z"
	}
]

Errors:

- 401 Unauthorized — missing or invalid Authorization header / token.

### POST /links

Description: Create a new link for the authenticated user.

Authentication: required (Bearer JWT)

Request body: JSON described in Link input model. `title` and `url` required.

Response: 201 Created with the created link object.

Success example (HTTP 201):

{
	"id": 3,
	"title": "My link",
	"url": "https://example.com",
	"created_at": "2025-11-20T14:00:00Z"
}


## Examples

Curl example — list links

```bash
curl -H "Authorization: Bearer <JWT>" \
	-H "Accept: application/json" \
	https://localhost:8000/links
```

Curl example — create a link

```bash
curl -X POST \
	-H "Authorization: Bearer <JWT>" \
	-H "Content-Type: application/json" \
	-d '{"title": "Docs", "url": "https://example.com/docs"}' \
	https://localhost:8000/links
```

Replace the endpoint with your deployment hostname (or `http://localhost:8000` when running locally) and `<JWT>` with a valid token.
