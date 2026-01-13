# Clubs and Events API Documentation

This documentation describes the API endpoints for browsing and filtering reading clubs and events.

## Base URL

All endpoints are relative to your application's base URL.

## Endpoints

### GET /api/clubs

Retrieve a list of approved and active reading clubs with filtering, searching, and pagination support.

#### Query Parameters

| Parameter   | Type     | Required | Default | Description                                                  |
| ----------- | -------- | -------- | ------- | ------------------------------------------------------------ |
| `page`      | number   | No       | 1       | Page number for pagination (min: 1)                          |
| `limit`     | number   | No       | 10      | Number of results per page (min: 1, max: 100)                |
| `format`    | string   | No       | -       | Filter by format: `online` or `offline`                      |
| `search`    | string   | No       | -       | Search in title, description, and purpose (case-insensitive) |
| `startDate` | ISO 8601 | No       | -       | Filter clubs starting on or after this date                  |
| `endDate`   | ISO 8601 | No       | -       | Filter clubs starting on or before this date                 |

#### Example Requests

```bash
# Get first page of clubs (default pagination)
GET /api/clubs

# Get online clubs only
GET /api/clubs?format=online

# Search for clubs with "mystery" in title/description
GET /api/clubs?search=mystery

# Get clubs starting in January 2026
GET /api/clubs?startDate=2026-01-01&endDate=2026-01-31

# Combined filters with pagination
GET /api/clubs?format=offline&search=book&page=2&limit=20
```

#### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "clubRequestId": "uuid",
      "title": "Mystery Book Club",
      "purpose": "Discuss classic mystery novels",
      "description": "Join us as we explore the world of classic mystery fiction...",
      "startDate": "2026-02-01T18:00:00.000Z",
      "endDate": "2026-06-01T18:00:00.000Z",
      "capacity": 20,
      "format": "online",
      "address": null,
      "onlineLink": "https://meet.example.com/mystery-club",
      "sessionCount": 8,
      "bookIds": ["uuid1", "uuid2"],
      "creatorId": "uuid",
      "memberIds": ["uuid1", "uuid2"],
      "isActive": true,
      "createdAt": "2026-01-15T10:00:00.000Z",
      "updatedAt": "2026-01-15T10:00:00.000Z",
      "creator": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 45,
    "totalPages": 5
  }
}
```

#### Error Responses

**400 Bad Request** - Invalid parameters

```json
{
  "success": false,
  "message": "Invalid pagination parameters"
}
```

**500 Internal Server Error**

```json
{
  "success": false,
  "message": "Error message"
}
```

---

### GET /api/clubs/:id

Get detailed information about a specific reading club.

#### URL Parameters

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `id`      | UUID | Yes      | The club ID |

#### Example Request

```bash
GET /api/clubs/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "clubRequestId": "uuid",
    "title": "Mystery Book Club",
    "purpose": "Discuss classic mystery novels",
    "description": "Join us as we explore the world of classic mystery fiction...",
    "startDate": "2026-02-01T18:00:00.000Z",
    "endDate": "2026-06-01T18:00:00.000Z",
    "capacity": 20,
    "format": "online",
    "address": null,
    "onlineLink": "https://meet.example.com/mystery-club",
    "sessionCount": 8,
    "bookIds": ["uuid1", "uuid2"],
    "creatorId": "uuid",
    "memberIds": ["uuid1", "uuid2", "uuid3"],
    "isActive": true,
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-15T10:00:00.000Z",
    "creator": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "https://example.com/avatar.jpg"
    }
  }
}
```

#### Error Responses

**404 Not Found**

```json
{
  "success": false,
  "message": "Reading club not found"
}
```

---

### GET /api/events

Retrieve a list of approved and active events with filtering, searching, and pagination support.

#### Query Parameters

| Parameter   | Type     | Required | Default | Description                                                  |
| ----------- | -------- | -------- | ------- | ------------------------------------------------------------ |
| `page`      | number   | No       | 1       | Page number for pagination (min: 1)                          |
| `limit`     | number   | No       | 10      | Number of results per page (min: 1, max: 100)                |
| `format`    | string   | No       | -       | Filter by format: `online` or `offline`                      |
| `search`    | string   | No       | -       | Search in title, description, and purpose (case-insensitive) |
| `startDate` | ISO 8601 | No       | -       | Filter events on or after this date                          |
| `endDate`   | ISO 8601 | No       | -       | Filter events on or before this date                         |

#### Example Requests

```bash
# Get first page of events
GET /api/events

# Get offline events only
GET /api/events?format=offline

# Search for events with "author" in title/description
GET /api/events?search=author

# Get events in February 2026
GET /api/events?startDate=2026-02-01&endDate=2026-02-28

# Combined filters
GET /api/events?format=online&search=fantasy&page=1&limit=15
```

#### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "eventRequestId": "uuid",
      "title": "Author Meet & Greet",
      "purpose": "Meet your favorite author",
      "description": "An exclusive opportunity to meet and discuss with...",
      "eventDate": "2026-03-15T14:00:00.000Z",
      "capacity": 50,
      "format": "offline",
      "address": "123 Library St, City, State 12345",
      "onlineLink": null,
      "bookIds": ["uuid1"],
      "organizerId": "uuid",
      "attendeeIds": ["uuid1", "uuid2"],
      "isActive": true,
      "createdAt": "2026-01-20T10:00:00.000Z",
      "updatedAt": "2026-01-20T10:00:00.000Z",
      "organizer": {
        "id": "uuid",
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 23,
    "totalPages": 3
  }
}
```

---

### GET /api/events/:id

Get detailed information about a specific event.

#### URL Parameters

| Parameter | Type | Required | Description  |
| --------- | ---- | -------- | ------------ |
| `id`      | UUID | Yes      | The event ID |

#### Example Request

```bash
GET /api/events/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "eventRequestId": "uuid",
    "title": "Author Meet & Greet",
    "purpose": "Meet your favorite author",
    "description": "An exclusive opportunity to meet and discuss with...",
    "eventDate": "2026-03-15T14:00:00.000Z",
    "capacity": 50,
    "format": "offline",
    "address": "123 Library St, City, State 12345",
    "onlineLink": null,
    "bookIds": ["uuid1"],
    "organizerId": "uuid",
    "attendeeIds": ["uuid1", "uuid2", "uuid3"],
    "isActive": true,
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-20T10:00:00.000Z",
    "organizer": {
      "id": "uuid",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "image": "https://example.com/avatar.jpg"
    }
  }
}
```

#### Error Responses

**404 Not Found**

```json
{
  "success": false,
  "message": "Event not found"
}
```

---

## Data Models

### ReadingClub

| Field         | Type                | Description                       |
| ------------- | ------------------- | --------------------------------- |
| id            | UUID                | Unique identifier                 |
| clubRequestId | UUID                | Reference to the original request |
| title         | string              | Club title                        |
| purpose       | string              | Club purpose                      |
| description   | string              | Detailed description              |
| startDate     | Date                | Club start date                   |
| endDate       | Date\|null          | Club end date (optional)          |
| capacity      | number              | Maximum number of members         |
| format        | 'online'\|'offline' | Meeting format                    |
| address       | string\|null        | Physical address (for offline)    |
| onlineLink    | string\|null        | Meeting link (for online)         |
| sessionCount  | number              | Number of planned sessions        |
| bookIds       | UUID[]              | Array of book IDs                 |
| creatorId     | UUID                | Club creator's user ID            |
| memberIds     | UUID[]              | Array of member user IDs          |
| isActive      | boolean             | Whether the club is active        |
| createdAt     | Date                | Creation timestamp                |
| updatedAt     | Date                | Last update timestamp             |
| creator       | User                | Creator details (when included)   |

### Event

| Field          | Type                | Description                       |
| -------------- | ------------------- | --------------------------------- |
| id             | UUID                | Unique identifier                 |
| eventRequestId | UUID                | Reference to the original request |
| title          | string              | Event title                       |
| purpose        | string              | Event purpose                     |
| description    | string              | Detailed description              |
| eventDate      | Date                | Event date and time               |
| capacity       | number              | Maximum number of attendees       |
| format         | 'online'\|'offline' | Event format                      |
| address        | string\|null        | Physical address (for offline)    |
| onlineLink     | string\|null        | Meeting link (for online)         |
| bookIds        | UUID[]              | Array of related book IDs         |
| organizerId    | UUID                | Organizer's user ID               |
| attendeeIds    | UUID[]              | Array of attendee user IDs        |
| isActive       | boolean             | Whether the event is active       |
| createdAt      | Date                | Creation timestamp                |
| updatedAt      | Date                | Last update timestamp             |
| organizer      | User                | Organizer details (when included) |

---

## Usage Examples

### JavaScript/TypeScript

```typescript
// Fetch online clubs with pagination
async function fetchOnlineClubs(page = 1) {
  const response = await fetch(
    `/api/clubs?format=online&page=${page}&limit=20`,
  );
  const data = await response.json();

  if (data.success) {
    return data.data;
  }
  throw new Error(data.message);
}

// Search for events by keyword
async function searchEvents(keyword: string) {
  const response = await fetch(
    `/api/events?search=${encodeURIComponent(keyword)}`,
  );
  const data = await response.json();

  if (data.success) {
    return {
      events: data.data,
      pagination: data.pagination,
    };
  }
  throw new Error(data.message);
}

// Get club details
async function getClubDetails(clubId: string) {
  const response = await fetch(`/api/clubs/${clubId}`);
  const data = await response.json();

  if (data.success) {
    return data.data;
  }
  throw new Error(data.message);
}
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

function useClubs(filters: {
  format?: 'online' | 'offline';
  search?: string;
  page?: number;
}) {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.format) params.append('format', filters.format);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());

      const response = await fetch(`/api/clubs?${params}`);
      const data = await response.json();

      if (data.success) {
        setClubs(data.data);
        setPagination(data.pagination);
      }
      setLoading(false);
    };

    fetchClubs();
  }, [filters.format, filters.search, filters.page]);

  return { clubs, loading, pagination };
}
```

---

## Notes

- All dates are returned in ISO 8601 format
- All endpoints return JSON responses
- Pagination starts at page 1
- Maximum limit per page is 100 items
- Search is case-insensitive and searches across title, description, and purpose fields
- Only approved and active clubs/events are returned
- UUIDs must be valid RFC 4122 format
