# Book Submission Feature Documentation

## Overview
The Book Submission feature allows registered users to suggest books that don't exist in the catalog. Submitted books go through a moderation queue before being added to the catalog.

## Features

### User Features
1. **Search Existing Catalog** - Before submitting, users can search to see if the book already exists
2. **ISBN Lookup** - Automatic book information retrieval using Google Books API
3. **Manual Entry** - Users can manually enter all book details if ISBN lookup fails
4. **Form Validation** - Comprehensive validation for all required fields
5. **Cover Image Upload** - Users can upload book cover images
6. **Category Selection** - Multi-select genre/category picker
7. **Author Autocomplete** - Suggests existing authors from the database
8. **Language Detection** - Automatic language detection based on title
9. **Submission Tracking** - Users can view status of all their submissions

### Advanced Features
- **Google Books API Integration** - Auto-fill book details from ISBN or title search
- **ISBN Database Lookup** - Support for both ISBN-10 and ISBN-13
- **Publisher Information** - Fetch and store publisher details
- **Duplicate Detection** - Alert users if similar books exist in catalog
- **Multi-category Support** - Books can belong to multiple genres

## Database Schema

### BookSubmission Model
```prisma
model BookSubmission {
  id              String               @id @default(dbgenerated("gen_random_uuid()"))
  userId          String               @db.Uuid
  title           String
  author          String
  isbn            String?
  isbn13          String?
  publisher       String?
  publishedDate   String?
  description     String
  pageCount       Int?
  language        String?
  categories      String[]             @default([])
  coverImage      String?
  thumbnailImage  String?
  previewLink     String?
  googleBooksId   String?
  status          BookSubmissionStatus @default(pending)
  rejectionReason String?
  adminNotes      String?
  productId       String?              @db.Uuid
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
  user            User                 @relation(fields: [userId], references: [id])
}

enum BookSubmissionStatus {
  pending
  approved
  rejected
}
```

## API Routes

### User Actions
- `createBookSubmission(data)` - Submit a new book for review
- `getUserBookSubmissions({ page, limit, status })` - Get user's submissions
- `getBookSubmissionById(id)` - Get single submission details
- `updateBookSubmission(id, data)` - Edit pending submission
- `deleteBookSubmission(id)` - Delete pending submission
- `searchAuthors(query)` - Autocomplete author search
- `searchCatalog(query)` - Search existing books

### Google Books Integration
- `searchBookByISBN(isbn)` - Lookup book by ISBN
- `searchBookByTitleAndAuthor(title, author?)` - Search by title/author
- `getBookByGoogleId(googleId)` - Get book by Google Books ID
- `detectLanguageFromTitle(title)` - Detect language from title

## Pages

### `/user/submit-book`
Main submission form with:
- ISBN quick-fill
- Google Books search
- Catalog duplicate check
- Manual entry fields
- Cover image upload
- Category selection

### `/user/book-submissions`
List of user's submissions showing:
- Submission status (pending/approved/rejected)
- Book details
- Cover image
- Categories
- Rejection reason (if rejected)
- Approval confirmation (if approved)

## Configuration

### Environment Variables
```env
# Optional: Increases Google Books API rate limits
NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY=your_api_key_here
```

### Constants (lib/constants/index.ts)
```typescript
export const BOOK_GENRES = [
  'Fiction',
  'Non-Fiction',
  'Mystery & Thriller',
  'Science Fiction',
  'Fantasy',
  'Romance',
  // ... more genres
];

export const BOOK_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  // ... more languages
];
```

## Usage Examples

### Basic Submission Flow
1. User navigates to "Submit Book" from user navigation
2. User enters ISBN (optional)
3. Clicks "Lookup" to auto-fill from Google Books
4. Reviews and edits information
5. Selects categories
6. Uploads cover image (optional)
7. Submits for review
8. Tracks status in "My Submissions"

### Manual Entry Flow
1. User navigates to "Submit Book"
2. Enters title and author
3. System suggests existing authors
4. System checks for duplicates in catalog
5. User fills in description and other details
6. Selects categories
7. Uploads cover image
8. Submits for review

## Validation Rules

### Required Fields
- Title (1-255 characters)
- Author (1-128 characters)
- Description (10-2000 characters)
- At least one category

### Optional Fields
- ISBN (10 or 13 digits)
- ISBN-13 (13 digits)
- Publisher (max 128 characters)
- Published Date (flexible format)
- Page Count (1-10000)
- Language (from predefined list)
- Cover Image (URL)
- Preview Link (URL)

## Admin Moderation (Future)
Admins will be able to:
- View all pending submissions
- Approve submissions (creates Product)
- Reject submissions with reason
- Add admin notes
- Edit submission details before approval

## Technical Implementation

### Key Technologies
- **Next.js 15** - App Router, Server Actions
- **Prisma ORM** - Database management
- **Zod** - Schema validation
- **React Hook Form** - Form management
- **Google Books API** - Book data retrieval
- **Uploadthing** - Image uploads
- **Shadcn/ui** - UI components

### Performance Optimizations
- Debounced search inputs (300-500ms)
- Server-side pagination
- Indexed database queries (userId, status, ISBN)
- Lazy loading of images
- Client-side form validation

### Security Measures
- User authentication required
- User can only edit their own submissions
- Only pending submissions can be edited/deleted
- SQL injection prevention via Prisma
- Input sanitization via Zod schemas

## Future Enhancements
1. Bulk submission via CSV
2. Advanced duplicate detection (fuzzy matching)
3. Integration with more ISBN databases
4. Submission analytics for users
5. Admin dashboard for moderation
6. Email notifications for status changes
7. Book series detection and linking
8. Edition management
9. User reputation system
10. Community voting on submissions

## Troubleshooting

### ISBN Lookup Not Working
- Check Google Books API key (optional but recommended)
- Verify ISBN format (10 or 13 digits)
- Try alternative ISBN if book has multiple
- Fall back to manual entry

### Duplicate Detection Too Sensitive
- Adjust search thresholds in `searchCatalog` function
- Users can dismiss warnings and continue

### Form Validation Errors
- Check all required fields are filled
- Verify ISBN format if provided
- Ensure at least one category is selected
- Check description length (10-2000 chars)

## Support
For issues or questions, contact the development team or submit a bug report.
