# Booking Flow Documentation

## Overview

This document explains the complete booking flow implementation, from vendor selection to booking confirmation, including how data is passed between pages and components.

---

## Flow Diagram

```
Vendor Detail Page (/categories/[id])
    ↓ (User selects services)
    ↓ (Clicks "Continue to Booking")
Booking Page (/booking?vendorId=...&serviceIds=...)
    ↓ (User fills form and submits)
    ↓ (Data stored in sessionStorage)
Booking Confirmation Page (/booking/confirmation)
```

---

## 1. Vendor Detail Page (`/categories/[id]/page.tsx`)

### Purpose
Displays vendor information and allows users to select services for booking.

### Key Features
- Displays vendor details (name, location, rating, services)
- Service selection with checkboxes
- Real-time price calculation
- Navigation to booking page

### Data Structure
```typescript
// Vendor data from vendorsData.ts
interface Vendor {
  id: string;
  name: string;
  location: string;
  image: string;
  services: Service[];
  // ... other properties
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}
```

### Navigation to Booking Page
**Location:** `src/app/(publicPages)/categories/[id]/page.tsx`

```typescript
const handleBooking = () => {
  if (selectedServices.length === 0) {
    toast.error('Please select at least one service');
    return;
  }
  
  // Create comma-separated list of service IDs
  const serviceIds = selectedServices.join(',');
  
  // Navigate with vendor ID and selected service IDs as URL parameters
  router.push(`/booking?vendorId=${vendorId}&serviceIds=${serviceIds}`);
};
```

**How it works:**
- Collects selected service IDs from state
- Joins them into a comma-separated string
- Navigates to `/booking` with query parameters:
  - `vendorId`: The vendor's unique identifier
  - `serviceIds`: Comma-separated list of selected service IDs

**Example URL:**
```
/booking?vendorId=zuriglow-beauty-hub&serviceIds=natural-styling,box-braids
```

---

## 2. Booking Page (`/booking/page.tsx`)

### Purpose
Main booking form where users:
- Review selected services
- Select date and time
- Enter contact information
- Choose payment method
- Submit booking

### Data Loading from URL Parameters

**Location:** `src/app/(publicPages)/booking/page.tsx`

```typescript
export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const vendorId = searchParams.get('vendorId');
  const serviceIdsParam = searchParams.get('serviceIds');
  
  const [vendor, setVendor] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  
  useEffect(() => {
    // Find vendor from vendorsData using vendorId
    const foundVendor = vendors.find((v) => v.id === vendorId);
    setVendor(foundVendor);
    
    // Parse service IDs from URL
    if (serviceIdsParam) {
      const serviceIds = serviceIdsParam.split(',');
      
      // Filter vendor services to get only selected ones
      const services = foundVendor.services?.filter((service) => 
        serviceIds.includes(service.id)
      ) || [];
      
      setSelectedServices(services);
    }
  }, [vendorId, serviceIdsParam, router]);
}
```

**How it works:**
1. **Extracts URL parameters:**
   - `vendorId` from `?vendorId=...`
   - `serviceIds` from `&serviceIds=...`

2. **Loads vendor data:**
   - Searches `vendorsData` array for matching vendor ID
   - Sets vendor state

3. **Loads selected services:**
   - Splits comma-separated service IDs
   - Filters vendor's services array to get only selected services
   - Sets selected services state

### Component Structure

The booking page is broken down into reusable components:

#### Components Used:
1. **`EmptyState`** - Shows when no services are selected
2. **`SelectedServicesCard`** - Displays selected services with vendor info
3. **`DateTimeSelection`** - Date picker and time slot selection
4. **`ContactInformationForm`** - User contact details form
5. **`PaymentMethodSection`** - Payment method selection (venue/online/wallet)
6. **`BookingSummary`** - Right sidebar with booking summary and submit button
7. **`FundWalletDrawer`** - Modal for adding funds to wallet

### Form State Management

```typescript
// Contact information
const [contactFormData, setContactFormData] = useState({
  name: '',
  email: '',
  phone: '',
  notes: '',
});

// Card payment information (if paying online)
const [cardFormData, setCardFormData] = useState({
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  cardName: '',
});

// Booking details
const [date, setDate] = useState<Date | undefined>(undefined);
const [selectedTime, setSelectedTime] = useState<string>('');
const [paymentMethod, setPaymentMethod] = useState<'venue' | 'online' | 'wallet'>('venue');
```

### Price Calculation

```typescript
// Calculate total from selected services
const totalPrice = selectedServices.reduce((sum, service) => 
  sum + (service.price || 0), 0
);
```

### Form Validation

```typescript
const isFormValid = () => {
  // Must have at least one service
  if (selectedServices.length === 0) return false;
  
  // Must have date and time selected
  if (!date || !selectedTime) return false;
  
  // Must have contact information
  if (!contactFormData.name || !contactFormData.email || !contactFormData.phone) {
    return false;
  }
  
  // If paying online, must have card details
  if (paymentMethod === 'online') {
    if (!cardFormData.cardNumber || !cardFormData.cardExpiry || 
        !cardFormData.cardCvc || !cardFormData.cardName) {
      return false;
    }
  }
  
  // If using wallet, must have sufficient funds
  if (paymentMethod === 'wallet' && hasInsufficientFunds) {
    return false;
  }
  
  return true;
};
```

### Data Submission and Storage

**Location:** `src/app/(publicPages)/booking/page.tsx` - `handleSubmit` function

```typescript
const handleSubmit = async () => {
  if (!isFormValid()) {
    toast.error('Please fill in all required fields');
    return;
  }

  setIsSubmitting(true);

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Prepare booking data
  const bookingData = {
    vendor: {
      id: vendor.id,
      name: vendor.name,
      location: vendor.location,
      image: vendor.image,
    },
    services: selectedServices.map(service => ({
      id: service.id,
      name: service.name,
      price: Number(service.price) || 0, // Ensure price is a number
      duration: service.duration,
    })),
    date: date ? date.toISOString() : null, // Convert Date to ISO string
    time: selectedTime,
    total: Number(totalPrice) || 0, // Ensure total is a number
    paymentMethod,
    customerInfo: {
      name: contactFormData.name,
      email: contactFormData.email,
      phone: contactFormData.phone,
      notes: contactFormData.notes
    }
  };

  toast.success(`Appointment confirmed...`);

  // Store booking data in sessionStorage
  try {
    sessionStorage.setItem('bookingConfirmationData', JSON.stringify(bookingData));
    
    // Small delay to ensure sessionStorage is written before navigation
    setTimeout(() => {
      router.push('/booking/confirmation');
    }, 100);
  } catch (error) {
    console.error('Error storing booking data:', error);
    toast.error('Failed to save booking data. Please try again.');
    setIsSubmitting(false);
  }
};
```

**Key Points:**
1. **Data Serialization:**
   - Only stores essential vendor properties (id, name, location, image)
   - Only stores essential service properties (id, name, price, duration)
   - Converts Date object to ISO string for JSON serialization
   - Explicitly converts prices to numbers to avoid type issues

2. **sessionStorage Usage:**
   - Stores booking data temporarily in browser's sessionStorage
   - Data persists only for the current browser session
   - Automatically cleared when browser tab/window is closed

3. **Navigation:**
   - Small delay (100ms) ensures sessionStorage write completes
   - Navigates to `/booking/confirmation` route

---

## 3. Booking Confirmation Page (`/booking/confirmation/page.tsx`)

### Purpose
Displays booking confirmation with all booking details after successful submission.

### Data Retrieval from sessionStorage

**Location:** `src/app/(publicPages)/booking/confirmation/page.tsx`

```typescript
export default function BookingConfirmationPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  
  useEffect(() => {
    // Get booking data from sessionStorage
    const storedBookingData = sessionStorage.getItem('bookingConfirmationData');
    
    if (storedBookingData) {
      try {
        // Parse JSON string back to object
        const parsed = JSON.parse(storedBookingData);
        
        // Validate required data exists
        if (!parsed.vendor || !parsed.services || !parsed.date) {
          console.error('Invalid booking data structure:', parsed);
          sessionStorage.removeItem('bookingConfirmationData');
          return; // Show error state instead of redirecting
        }
        
        // Convert date string back to Date object
        if (parsed.date) {
          const dateObj = new Date(parsed.date);
          if (isNaN(dateObj.getTime())) {
            console.error('Invalid date:', parsed.date);
            sessionStorage.removeItem('bookingConfirmationData');
            return;
          }
          parsed.date = dateObj;
        }
        
        // Ensure prices are numbers (not strings)
        if (parsed.services && Array.isArray(parsed.services)) {
          parsed.services = parsed.services.map((service: any) => ({
            ...service,
            price: Number(service.price) || 0,
          }));
        }
        
        // Ensure total is a number
        parsed.total = Number(parsed.total) || 0;
        
        setBookingData(parsed);
        
        // Clear sessionStorage after successful read
        sessionStorage.removeItem('bookingConfirmationData');
        
        // Trigger success animation
        setTimeout(() => setShowAnimation(true), 100);
        
      } catch (error) {
        console.error('Error parsing booking data:', error);
        sessionStorage.removeItem('bookingConfirmationData');
        // Show error state instead of redirecting
      }
    }
    // If no booking data, component shows error state (no automatic redirect)
  }, []);
}
```

**How it works:**
1. **Retrieves data:**
   - Gets `bookingConfirmationData` from sessionStorage
   - Parses JSON string back to JavaScript object

2. **Validates data:**
   - Checks for required properties (vendor, services, date)
   - Validates date conversion

3. **Type conversion:**
   - Converts date ISO string back to Date object
   - Ensures all prices are numbers (not strings)
   - Ensures total is a number

4. **Cleanup:**
   - Removes data from sessionStorage after successful read
   - Prevents data from persisting unnecessarily

5. **Error handling:**
   - Shows user-friendly error state if data is missing/invalid
   - Does NOT automatically redirect (user can choose to go back)

### Display Structure

The confirmation page displays:

1. **Success Animation:**
   - Green checkmark icon with animation
   - "Booking Confirmed!" heading
   - Confirmation message with vendor name and appointment date/time
   - Email confirmation notice

2. **Booking Details Card:**
   - **Services Section:** Lists all booked services with duration and price
   - **Appointment Details Grid:**
     - DATE: Full date (e.g., "Tuesday, December 30, 2025")
     - TIME: Selected time slot
     - DURATION: Combined service durations
     - PAYMENT: Payment method used
   - **Total Amount:** Sum of all service prices
   - **Customer Notes:** Special requests (if provided)

3. **Action Buttons:**
   - **"View Appointment Details"** - Primary button (navigates to dashboard)
   - **"Book Another Service"** - Secondary button (navigates back to vendor page)
   - **"Go to Wallet"** - Shown only if payment method was wallet

---

## Data Flow Summary

### Step-by-Step Data Journey

1. **Vendor Data Source:**
   ```
   vendorsData.ts (static data)
   ↓
   Vendor Detail Page loads vendor by ID
   ↓
   User selects services (stored in component state)
   ```

2. **Service Selection:**
   ```
   User clicks checkboxes
   ↓
   selectedServices state updated
   ↓
   User clicks "Continue to Booking"
   ↓
   Service IDs extracted: ["service1", "service2"]
   ↓
   URL created: /booking?vendorId=xxx&serviceIds=service1,service2
   ```

3. **Booking Page Load:**
   ```
   URL parameters extracted
   ↓
   Vendor found in vendorsData by vendorId
   ↓
   Services filtered by serviceIds
   ↓
   State initialized with vendor and selected services
   ```

4. **Form Submission:**
   ```
   User fills form and clicks "Confirm Booking"
   ↓
   Form validated
   ↓
   Booking data object created
   ↓
   Data serialized to JSON
   ↓
   Stored in sessionStorage as 'bookingConfirmationData'
   ↓
   Navigate to /booking/confirmation
   ```

5. **Confirmation Page Load:**
   ```
   Page loads
   ↓
   Read from sessionStorage
   ↓
   Parse JSON
   ↓
   Validate and convert types
   ↓
   Set bookingData state
   ↓
   Clear sessionStorage
   ↓
   Display confirmation
   ```

---

## Key Implementation Details

### Why sessionStorage?

**Advantages:**
- ✅ Data persists during navigation
- ✅ Automatically cleared when tab closes
- ✅ No server-side storage needed for demo
- ✅ Simple implementation

**Limitations:**
- ❌ Lost if user closes tab before viewing confirmation
- ❌ Not accessible across browser tabs
- ❌ Limited storage size (~5-10MB)

### Why URL Parameters for Booking Page?

**Advantages:**
- ✅ Shareable URLs
- ✅ Bookmarkable
- ✅ Browser back/forward works
- ✅ No state management needed for initial load

**Alternative Considered:**
- Could use sessionStorage for vendor/service IDs, but URL params are more reliable and shareable

### Data Serialization Considerations

**Date Handling:**
- Date objects cannot be directly JSON stringified
- Solution: Convert to ISO string (`date.toISOString()`)
- Convert back on retrieval (`new Date(isoString)`)

**Number Handling:**
- JSON preserves numbers, but explicit conversion ensures type safety
- Solution: `Number(price)` when storing and retrieving

**Object Filtering:**
- Only store essential properties to avoid serialization issues
- Solution: Map objects to include only needed fields

---

## Component Architecture

### Booking Page Components

```
BookingPage (Main Page)
├── EmptyState (if no services)
└── Main Content
    ├── SelectedServicesCard
    │   ├── Vendor Info
    │   ├── Service List
    │   └── Add Service Button
    ├── DateTimeSelection
    │   ├── DatePicker (Calendar)
    │   └── TimeSlotSelector
    ├── ContactInformationForm
    │   ├── Name Input
    │   ├── Phone Input
    │   ├── Email Input
    │   └── Notes Textarea
    ├── PaymentMethodSection
    │   ├── Payment Method Radio Buttons
    │   ├── Cancellation Policy (if venue)
    │   └── Card Form (if online)
    ├── BookingSummary (Sidebar)
    │   ├── Services List
    │   ├── Date/Time/Payment Display
    │   └── Submit Button
    └── FundWalletDrawer (Modal)
```

### Confirmation Page Structure

```
BookingConfirmationPage
├── Success Animation
│   ├── Checkmark Icon
│   ├── Heading
│   └── Confirmation Message
├── Booking Details Card
│   ├── Services Section
│   ├── Appointment Details Grid
│   ├── Total Amount
│   └── Customer Notes (if any)
└── Action Buttons
    ├── View Appointment Details
    ├── Book Another Service
    └── Go to Wallet (conditional)
```

---

## Error Handling

### Booking Page Errors

1. **Missing Vendor ID:**
   - Shows error toast
   - Redirects to `/categories`

2. **Vendor Not Found:**
   - Shows error toast
   - Redirects to `/categories`

3. **No Services Selected:**
   - Shows `EmptyState` component
   - Provides button to go back to vendor page

4. **Form Validation Errors:**
   - Shows error toast with specific message
   - Prevents submission

5. **sessionStorage Write Error:**
   - Catches error
   - Shows error toast
   - Prevents navigation
   - Allows user to retry

### Confirmation Page Errors

1. **No Booking Data:**
   - Shows error state (not automatic redirect)
   - Displays "Booking Not Found" message
   - Provides "Browse Categories" button

2. **Invalid Data Structure:**
   - Logs error to console
   - Clears invalid data from sessionStorage
   - Shows error state

3. **Invalid Date:**
   - Validates date conversion
   - Shows error state if date is invalid

---

## Future Improvements

### Potential Enhancements

1. **Backend Integration:**
   - Replace sessionStorage with API calls
   - Store bookings in database
   - Generate booking IDs
   - Send confirmation emails

2. **URL-based Confirmation:**
   - Use booking ID in URL: `/booking/confirmation/[bookingId]`
   - Fetch booking data from API
   - More reliable than sessionStorage

3. **State Management:**
   - Use Context API or Zustand for global state
   - Avoid sessionStorage for critical data
   - Better error handling

4. **Booking History:**
   - Store bookings in localStorage or database
   - Allow users to view past bookings
   - Enable booking modifications/cancellations

5. **Real-time Updates:**
   - WebSocket for booking status updates
   - Real-time availability checking
   - Instant confirmation

---

## Testing the Flow

### Manual Testing Steps

1. **Start at Vendor Page:**
   - Navigate to `/categories/[vendorId]`
   - Verify vendor details load correctly

2. **Select Services:**
   - Click service checkboxes
   - Verify services are selected
   - Verify total price updates

3. **Navigate to Booking:**
   - Click "Continue to Booking"
   - Verify URL contains `vendorId` and `serviceIds`
   - Verify booking page loads with correct services

4. **Fill Booking Form:**
   - Select date and time
   - Enter contact information
   - Choose payment method
   - Verify form validation works

5. **Submit Booking:**
   - Click "Confirm Booking"
   - Verify loading state
   - Verify navigation to confirmation page

6. **View Confirmation:**
   - Verify all booking details display correctly
   - Verify prices are correct (not multiplied)
   - Verify action buttons work

7. **Test Error Cases:**
   - Try accessing confirmation page directly (should show error)
   - Try booking with invalid data
   - Test form validation

---

## Code Locations

### Main Files

- **Vendor Detail Page:** `src/app/(publicPages)/categories/[id]/page.tsx`
- **Booking Page:** `src/app/(publicPages)/booking/page.tsx`
- **Confirmation Page:** `src/app/(publicPages)/booking/confirmation/page.tsx`

### Components

- **EmptyState:** `src/components/booking/EmptyState.tsx`
- **SelectedServicesCard:** `src/components/booking/SelectedServicesCard.tsx`
- **DateTimeSelection:** `src/components/booking/DateTimeSelection.tsx`
- **ContactInformationForm:** `src/components/booking/ContactInformationForm.tsx`
- **PaymentMethodSection:** `src/components/booking/PaymentMethodSection.tsx`
- **BookingSummary:** `src/components/booking/BookingSummary.tsx`
- **FundWalletDrawer:** `src/components/booking/FundWalletDrawer.tsx`

### Data

- **Vendors Data:** `src/data/vendorsData.ts`

---

## Summary

The booking flow is a three-step process:

1. **Selection** (Vendor Detail Page) → User selects services
2. **Booking** (Booking Page) → User fills form and submits
3. **Confirmation** (Confirmation Page) → User views booking details

**Data is passed via:**
- **URL Parameters:** Vendor ID and Service IDs (for booking page)
- **sessionStorage:** Complete booking data (for confirmation page)

**Key Features:**
- ✅ Modular component architecture
- ✅ Type-safe data handling
- ✅ Error handling and validation
- ✅ User-friendly error states
- ✅ Responsive design
- ✅ Accessible (screen reader support)

This implementation provides a solid foundation that can be easily extended with backend integration and additional features.


