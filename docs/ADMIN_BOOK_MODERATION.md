# Admin Book Moderation System Documentation

## Overview
The Admin Book Moderation System allows administrators to review, approve, reject, or merge user-submitted books with existing catalog entries. It includes SLA tracking, duplicate detection, and bulk actions support.

## Features

### Core Functionality
1. **View Pending Submissions** - See all books awaiting moderation
2. **Approve Books** - Add approved books to the catalog with pricing/stock
3. **Reject Submissions** - Reject with detailed reasons sent to users
4. **Merge with Existing** - Link submissions to existing catalog entries
5. **Duplicate Detection** - Search catalog to find potential duplicates
6. **SLA Tracking** - Monitor submission aging and overdue items
7. **Bulk Actions** - Process multiple submissions at once (future enhancement)

## Access & Permissions

### Admin Only
- Only users with `role: 'admin'` can access this feature
- Route: `/admin/book-submissions`
- Unauthorized access redirects to home page

## Page Structure

### Dashboard Metrics
The admin dashboard displays four key metrics:

1. **Total Pending** - All submissions awaiting review
2. **On Time** - Submissions within 3-day SLA (green)
3. **Recent** - Submissions from last 24 hours (blue)
4. **Overdue** - Submissions older than 3 days (red)

### SLA Tracking
- **Green (On Time)**: < 24 hours old
- **Yellow (Attention)**: 24-72 hours old
- **Red (Overdue)**: > 72 hours old

Alert banner appears when overdue submissions exist.

### Submission Cards
Each submission card displays:
- Book cover image (if available)
- Title and author
- Submitter information
- Submission timestamp
- ISBN/ISBN-13
- Publisher and publication date
- Page count and language
- Description
- Categories/genres
- Google Books preview link
- SLA status indicator

## Actions

### 1. Approve Book

**Purpose**: Add the submitted book to the catalog as a new product

**Steps**:
1. Click "Approve" button
2. Set price (USD) - default: $0.00
3. Set stock quantity - default: 0
4. Click "Approve & Add to Catalog"

**What Happens**:
- Creates a new Product in the database
- Generates slug from title
- Uses first category from submission
- Sets cover image if available
- Links submission to created product
- Marks submission as "approved"
- Revalidates relevant pages

**Server Action**: `approveBookSubmission(id, price, stock)`

### 2. Merge with Existing

**Purpose**: Link submission to an existing catalog entry (for duplicates)

**Steps**:
1. Click "Merge with Existing" button
2. Search form pre-fills with title + author
3. Modify search query if needed
4. Click search icon or press Enter
5. Review search results
6. Select the matching book
7. Click "Merge Submission"

**What Happens**:
- Marks submission as "approved"
- Links submission to existing product
- Adds admin note about merge
- Does NOT create new product
- Revalidates relevant pages

**Server Action**: `mergeBookSubmission(submissionId, productId)`

**Use Cases**:
- Book already exists in catalog
- User submitted duplicate
- Different edition of same book

### 3. Reject Submission

**Purpose**: Decline the submission with explanation

**Steps**:
1. Click "Reject" button (red)
2. Enter detailed rejection reason
3. Click "Reject Submission"

**What Happens**:
- Marks submission as "rejected"
- Stores rejection reason
- User can view reason in their submissions
- Does NOT create product
- Revalidates relevant pages

**Server Action**: `rejectBookSubmission(id, reason)`

**Common Rejection Reasons**:
- Already exists in catalog (suggest merge instead)
- Incomplete or inaccurate information
- Not appropriate for catalog
- Copyright concerns
- Duplicate submission by same user

## API Routes & Actions

### Admin Actions

#### `getPendingBookSubmissions({ page, limit, sortBy })`
- Get paginated list of pending submissions
- Sort options: 'oldest' (default), 'newest', 'priority'
- Returns submissions with user info
- Admin only

#### `getAllBookSubmissions({ page, limit, status })`
- Get all submissions (any status)
- Filter by status: 'pending', 'approved', 'rejected'
- Returns paginated results with user info
- Admin only

#### `approveBookSubmission(id, price?, stock?)`
- Approve submission and create product
- Optional price and stock parameters
- Creates slug from title
- Links submission to new product
- Admin only

#### `rejectBookSubmission(id, reason)`
- Reject submission with reason
- Reason is visible to user
- Marks submission as rejected
- Admin only

#### `mergeBookSubmission(submissionId, productId)`
- Link submission to existing product
- Marks as approved without creating new product
- Adds admin note
- Admin only

#### `bulkApproveSubmissions(ids[])`
- Approve multiple submissions at once
- Processes each sequentially
- Returns success count
- Admin only (ready for future UI)

#### `bulkRejectSubmissions(ids[], reason)`
- Reject multiple submissions with same reason
- Processes each sequentially
- Returns success count
- Admin only (ready for future UI)

#### `getBookSubmissionSLAMetrics()`
- Get dashboard metrics
- Returns total, overdue, recent, onTime counts
- Admin only

## Database Schema

### BookSubmission Updates
No schema changes needed - existing model supports moderation:

```prisma
model BookSubmission {
  id              String               @id
  userId          String
  title           String
  author          String
  // ... other fields ...
  status          BookSubmissionStatus @default(pending)
  rejectionReason String?
  adminNotes      String?
  productId       String?              // Links to Product when approved/merged
  createdAt       DateTime
  updatedAt       DateTime
}

enum BookSubmissionStatus {
  pending
  approved
  rejected
}
```

## SLA (Service Level Agreement)

### Target Response Times
- **New submissions**: Review within 24 hours
- **Standard SLA**: Complete review within 3 days (72 hours)
- **Overdue threshold**: > 3 days

### Priority Sorting
Default sort is "oldest first" to ensure FIFO processing and SLA compliance.

### Metrics Tracking
- Real-time dashboard metrics
- Overdue alert banner
- Color-coded status indicators
- Timestamp display with relative time

## Workflow Examples

### Example 1: Approving a New Book

1. Admin navigates to `/admin/book-submissions`
2. Reviews submission card for "The Great Gatsby"
3. Verifies it doesn't exist in catalog
4. Clicks "Approve"
5. Sets price: $12.99
6. Sets stock: 50
7. Clicks "Approve & Add to Catalog"
8. Book appears in `/admin/products`
9. User sees "approved" status in their submissions
10. Book is available for club/event selection

### Example 2: Merging a Duplicate

1. Admin sees submission for "1984"
2. Clicks "Merge with Existing"
3. Search pre-filled with "1984 George Orwell"
4. Clicks search
5. Sees existing "1984" in results
6. Selects the existing product
7. Clicks "Merge Submission"
8. Submission marked approved, linked to existing product
9. No new product created
10. User sees "approved" in their submissions

### Example 3: Rejecting Invalid Submission

1. Admin sees submission with incomplete info
2. Clicks "Reject"
3. Enters reason: "Missing required information. Please provide complete book description and verify ISBN."
4. Clicks "Reject Submission"
5. User sees rejection with reason
6. User can submit corrected version

## Best Practices

### For Admins

1. **Check for Duplicates First**
   - Always search catalog before approving
   - Use merge feature for duplicates
   - Check for different editions

2. **Provide Clear Rejection Reasons**
   - Be specific and helpful
   - Suggest corrections if applicable
   - Explain policy violations clearly

3. **Review Completeness**
   - Verify required fields
   - Check description quality
   - Confirm ISBN if provided
   - Validate categories

4. **Set Appropriate Pricing**
   - Research market prices
   - Consider used/new distinction
   - Set stock to 0 if unavailable

5. **Monitor SLA**
   - Prioritize overdue submissions (red)
   - Review recent submissions daily
   - Keep queue under 3-day threshold

### Quality Guidelines

**Approve When**:
- All required information is complete
- Description is detailed and accurate
- Categories are appropriate
- No duplicate exists (or merge instead)
- ISBN is valid (if provided)
- Content is appropriate

**Reject When**:
- Critical information is missing
- Description is inadequate
- Duplicate and user didn't check
- Inappropriate content
- Copyright concerns
- Multiple submissions of same book

**Merge When**:
- Exact duplicate exists
- Same book, different edition (user's choice)
- User submitted after checking
- Better to consolidate than split

## Performance Considerations

- Pagination (20 items per page)
- Indexed database queries
- Server-side filtering
- Efficient image loading
- Cached SLA metrics

## Security

- Admin role verification on every request
- Server-side action validation
- CSRF protection via Next.js
- SQL injection prevention via Prisma
- XSS protection in rendered content

## Future Enhancements

1. **Bulk Actions UI**
   - Select multiple submissions
   - Approve/reject in batch
   - Set common price/stock

2. **Advanced Filtering**
   - Filter by submitter
   - Filter by category
   - Filter by age
   - Full-text search

3. **Email Notifications**
   - Notify users on approval
   - Send rejection reasons
   - Alert admin on new submissions

4. **Detailed Analytics**
   - Average processing time
   - Approval/rejection rates
   - User submission patterns
   - Popular categories

5. **Auto-Merge Suggestions**
   - ML-based duplicate detection
   - Suggest likely matches
   - Confidence scoring

6. **Submission Notes**
   - Add private admin notes
   - Track processing history
   - Assign to specific admin

## Troubleshooting

### Submission Not Appearing
- Check status filter (pending only by default)
- Verify user completed submission
- Check database for entry
- Revalidate paths

### Merge Not Working
- Verify product exists in catalog
- Check product ID is correct
- Ensure submission is still pending
- Check admin permissions

### SLA Metrics Incorrect
- Check server timezone
- Verify database timestamps
- Review metric calculations
- Refresh page for latest data

## Support

For issues or questions:
1. Check this documentation
2. Review server logs
3. Test in development environment
4. Contact development team

## Related Documentation

- [Book Submission Feature](./BOOK_SUBMISSION_FEATURE.md)
- [User Guide: Book Submission](./USER_GUIDE_BOOK_SUBMISSION.md)
- [Admin Guide (General)](./ADMIN_GUIDE.md)
