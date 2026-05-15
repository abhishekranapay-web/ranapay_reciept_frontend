# API Integration Documentation

## Environment Setup

The application uses a single API base URL defined in `.env`:

```env
VITE_API_BASE_URL=https://ranapay-reciept-backend.vercel.app
```

### Files to Configure

- **`.env`** - Local environment variables (git-ignored)
- **`.env.local`** - Alternative env file (also git-ignored)
- **`.env.example`** - Template for team reference

## API Integration Summary

### 1. API Service Layer (`src/lib/api.ts`)

Central location for all API calls with error handling:

- **`fetchReceiptHistory(limit)`** - Get paginated receipts
- **`createReceipt(receipt)`** - Create new receipt via POST
- **`fetchReceiptById(id)`** - Get single receipt by ID
- **`searchReceipts(query)`** - Search receipts by query string

### 2. Zustand Store (`src/store/receipts.ts`)

Enhanced with new methods:

- `setReceipts()` - Update receipts from API
- Maintains backward compatibility with existing `addReceipt()` method

### 3. Create Page (`src/routes/_app/create.tsx`)

**Integration**: `/api/receipts/create`

- Form submission calls `createReceipt()` API
- Creates receipt on backend, stores locally, downloads PDF
- Enhanced error handling with toast notifications
- Loading state during submission

### 4. History Page (`src/routes/_app/history.tsx`)

**Integrations**:

- `/api/receipts/history?limit=100` - Loads all receipts on mount
- `/api/receipts/search?search=<query>` - Enables full-text search
- Filters by DISCOM locally (client-side)
- Real-time search feedback with loading state
- Detail sheet shows all receipt information

### 5. Detail View (Inline in History)

**Integration**: Single receipts fetched via `/api/receipts/:id`

- Displayed in drawer/sheet when viewing receipt details
- Shows all transaction, customer, DISCOM, and agent information
- Direct download capability

## API Response Format

All endpoints follow standard structure:

```json
{
  "data": {
    /* Receipt object */
  }
}
```

## Usage Flow

### Creating a Receipt

1. User fills form on `/create` page
2. Form validates locally
3. **Creates via POST** `/api/receipts/create`
4. Response stored in Zustand + local display
5. PDF generated and downloaded
6. User redirected to history

### Viewing History

1. User navigates to `/history` page
2. **Loads 100 receipts** from `/api/receipts/history?limit=100`
3. Receipts displayed in table with DISCOM filter
4. Search icon searches via `/api/receipts/search?search=<query>`
5. Click row to view details in drawer

### Searching

1. Type search term (e.g., receipt number, customer name, mobile)
2. **Queries `/api/receipts/search?search=<query>`**
3. Results replace table contents
4. Clear to reload all receipts

## Features

✅ **Production-Ready**

- Environment-based configuration
- Comprehensive error handling
- Loading states and user feedback
- Optimistic UI updates
- Type-safe API integration

✅ **API Integration**

- All 4 endpoints integrated
- Proper request/response handling
- Query parameter formatting
- Error messages to users

✅ **User Experience**

- Toast notifications for success/error
- Loading spinners during API calls
- Search debouncing
- Empty states with guidance

## Testing the Integration

### 1. Start Development Server

```bash
npm run dev
```

### 2. Create Page

- Navigate to `/create`
- Fill in receipt form
- Submit to test **create API**
- Verify receipt saves and PDF downloads

### 3. History Page

- Navigate to `/history`
- Wait for receipts to load (tests **history API**)
- Try search functionality (tests **search API**)
- Click a receipt to view details (tests **detail view**)

### 4. Test Different Scenarios

- Empty search
- Invalid search query
- Multiple filter combinations
- DISCOM filtering
- Download receipts

## Error Handling

All API errors are:

- Caught and logged to console
- Displayed to user via toast
- Non-blocking to UI
- Include error message details

## Next Steps

If backend APIs change or new endpoints are needed:

1. Update `src/lib/api.ts` with new functions
2. Update components that use those endpoints
3. Update Zustand store if new state is needed
4. Test in development with `npm run dev`
5. Build and verify: `npm run build`

---

**Status**: ✅ All 4 APIs integrated and production-ready
**Last Updated**: May 15, 2026
