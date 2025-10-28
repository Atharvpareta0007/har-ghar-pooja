# Har Ghar Pooja - AsthaSetu UI Redesign

## Overview
This document outlines the complete redesign of the Har Ghar Pooja frontend to the new AsthaSetu UI theme with white background and saffron/orange (#FF9933) accent colors.

## Branch Information
- **Branch Name**: `feat/ui/asthasetu-redesign`
- **Base Branch**: main
- **Status**: In Progress

## Design System

### Colors
- **Primary**: #FF9933 (Saffron/Orange)
- **Background**: White (#FFFFFF)
- **Text**: Dark Gray (#333333)
- **Success**: #22c55e
- **Warning**: #f59e0b
- **Error**: #ef4444
- **Info**: #3b82f6

### Typography
- **Font Family**: Poppins, Nunito (sans-serif)
- **Headings**: Bold, variable weights
- **Body**: Regular, 16px base size
- **Line Height**: 1.5-1.75

### Spacing
- **Section Gaps**: 20-32px
- **Component Padding**: 16-24px
- **Text Line Height**: 12-16px

## Components Created

### Core UI Components (`src/components/ui/`)
1. **ButtonNew.jsx** - Enhanced button with variants (primary, secondary, outline, ghost, danger, success, link)
2. **Input.jsx** - Form input with label, error states, and icons
3. **Select.jsx** - Dropdown select with custom styling
4. **Textarea.jsx** - Multi-line text input
5. **Card.jsx** - Flexible card component with sub-components (Header, Title, Description, Content, Footer)
6. **Modal.jsx** - Accessible modal dialog with animations
7. **Badge.jsx** - Status badges with color variants
8. **Alert.jsx** - Alert messages with icons (success, error, warning, info)
9. **LoadingSpinner.jsx** - Loading indicator with size variants
10. **Container.jsx** - Max-width container for consistent layout

### Layout Components (`src/components/layout/`)
1. **Footer.jsx** - Comprehensive footer with links, social media, newsletter signup
2. **Layout.jsx** - Main layout wrapper with navbar and footer (created earlier)

### Section Components (`src/components/sections/`)
1. **PricingGrid.jsx** - Pricing cards with all 15 Hindi puja names and prices
2. **Services.jsx** - Service cards showcasing 6 main services
3. **Testimonials.jsx** - Testimonial carousel with ratings and reviews

### Card Components (`src/components/cards/`)
1. **PujaCard.jsx** - Individual puja service card
2. **TestimonialCard.jsx** - Testimonial display card

### Other Components
1. **Hero.jsx** - Landing page hero section
2. **NavbarNew.jsx** - Updated navigation bar with mobile menu

## Puja Services (Pricing Data)

All 15 pujas with Hindi names as specified:

1. पितृ शांति - ₹5,100
2. नारायण बली - ₹21,000
3. काल सर्प दोष - ₹4,100
4. रुद्राभिषेक - ₹1,100-₹11,000
5. मंगल शांति - ₹3,100
6. भात पूजन - ₹2,100
7. ग्रहण दोष शांति - ₹2,100
8. नवग्रह शांति - ₹2,500
9. चांडाल दोष शांति - ₹2,500
10. कुंभ विवाह - ₹3,500
11. अर्क विवाह - ₹3,100
12. वास्तु पूजन - ₹11,000
13. ग्रह शांति - ₹1,100
14. जप - ₹1,000-₹51,000
15. वैवाहिक एवं मांगलिक पूजन - ₹11,000

## Utilities (`src/utils.js`)

Enhanced utility functions:
- `cn()` - Tailwind class name merger
- `formatCurrency()` - INR currency formatting
- `formatDate()` - Date formatting
- `formatDateTime()` - Date and time formatting
- `validateEmail()` - Email validation
- `validatePhone()` - Indian phone number validation
- `scrollToSection()` - Smooth scroll to section
- `debounce()` - Debounce function

## Theme Configuration (`src/styles/theme.js`)

Comprehensive theme tokens including:
- Color palette with shades
- Font families and sizes
- Spacing scale
- Border radius values
- Box shadow definitions
- Z-index scale

## Dependencies Added

```json
{
  "react-hot-toast": "^2.4.1",
  "react-hook-form": "^7.49.2",
  "@hookform/resolvers": "^3.3.3",
  "yup": "^1.3.3",
  "date-fns": "^2.30.0",
  "react-datepicker": "^4.21.0",
  "@tailwindcss/forms": "^0.5.7",
  "@tailwindcss/typography": "^0.5.10",
  "@tailwindcss/aspect-ratio": "^0.4.2",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.2.0",
  "@headlessui/react": "^1.7.17",
  "@heroicons/react": "^2.1.1",
  "react-intersection-observer": "^9.5.3"
}
```

## Pages to Update (TODO)

### Completed
- ✅ Core UI components
- ✅ Layout components (Footer, partial Navbar)
- ✅ Pricing Grid with all Hindi puja names
- ✅ Services section
- ✅ Testimonials section
- ✅ Hero section

### Pending
- ⏳ Complete Home page integration
- ⏳ Booking Form modal with validation
- ⏳ User Dashboard redesign
- ⏳ Pandit Dashboard redesign
- ⏳ Login/Register pages
- ⏳ Admin Dashboard styling
- ⏳ About section
- ⏳ Contact form
- ⏳ FAQ section
- ⏳ Chatbot integration
- ⏳ Virtual Pooja join functionality

## Backend Integration Notes

### API Endpoints (No Changes Required)
All existing API endpoints remain unchanged:
- `GET /api/pujas` - Fetch puja types
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `PATCH /api/bookings/:id` - Update booking status
- `GET /api/pandits` - Get pandits list
- `POST /api/pandits` - Create pandit profile
- `POST /api/payments/create` - Create payment order
- `POST /api/payments/verify` - Verify payment

### Data Shape Adapters
If needed, create adapters in `src/api/adapters.js` to transform backend responses to match UI requirements.

## Accessibility Features

- ✅ Semantic HTML (header, main, nav, footer, section, article)
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus visible styles
- ✅ Alt text for images
- ✅ Color contrast ratios meet WCAG AA standards
- ✅ Screen reader friendly

## Performance Optimizations

- ✅ Lazy loading for heavy components
- ✅ Image optimization
- ✅ Code splitting
- ✅ Framer Motion animations (GPU accelerated)
- ✅ Debounced search/filter functions
- Target: Lighthouse score >90 on mobile

## Responsive Design

All components are mobile-first and responsive:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Animation Guidelines

Using Framer Motion for:
- Page transitions
- Scroll-triggered animations (fade-in, slide-up)
- Hover effects
- Modal/dialog animations
- Carousel transitions

All animations are subtle and performant (60fps target).

## How to Run Locally

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing Checklist

### Functionality
- [ ] All navigation links work
- [ ] Booking form submits correctly
- [ ] Payment flow works
- [ ] Virtual puja join opens stream
- [ ] Pandit profile creation works
- [ ] User dashboard displays bookings
- [ ] Admin dashboard functions properly

### UI/UX
- [ ] Colors match design system
- [ ] Typography is consistent
- [ ] Spacing is uniform
- [ ] Animations are smooth
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] Desktop layout correct

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] ARIA labels present

### Performance
- [ ] Page load time < 3s
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Images optimized
- [ ] Bundle size reasonable

## Git Commits

```bash
# Commit 1: Setup and core utilities
git add src/utils.js src/styles/theme.js tailwind.config.js
git commit -m "chore: add design tokens & tailwind config"

# Commit 2: Core UI components
git add src/components/ui/
git commit -m "feat(ui): add core UI components (Button, Input, Card, Modal, etc.)"

# Commit 3: Layout components
git add src/components/layout/
git commit -m "feat(ui): add layout components (Footer, Container)"

# Commit 4: Section components
git add src/components/sections/
git commit -m "feat(ui): implement PricingGrid, Services, and Testimonials sections"

# Commit 5: Hero and Navbar
git add src/components/Hero.jsx src/components/NavbarNew.jsx
git commit -m "feat(ui): add Hero and updated Navbar with new theme"

# Commit 6: Documentation
git add REDESIGN_NOTES.md
git commit -m "docs: add REDESIGN_NOTES.md and migration checklist"
```

## Known Issues / TODOs

1. **Booking Form**: Need to create comprehensive booking modal with multi-step form
2. **Image Uploads**: Pandit profile image upload needs backend endpoint
3. **Virtual Pooja**: Stream URL embedding needs implementation
4. **Chatbot**: API endpoint `/api/chatbot` needs to be created or mocked
5. **Recommendation Tool**: `/api/recommend` endpoint needs implementation
6. **Payment UI**: Razorpay integration UI needs completion
7. **Admin Dashboard**: Styling updates needed
8. **Error Boundaries**: Add React error boundaries for better error handling

## Migration from Old UI

### Component Mapping

| Old Component | New Component | Status |
|--------------|---------------|--------|
| `Navbar.jsx` | `NavbarNew.jsx` | ✅ Updated |
| `PujaCard.jsx` | `cards/PujaCard.jsx` | ✅ Updated |
| `Home.jsx` | Needs integration | ⏳ Pending |
| `Dashboard.jsx` | Needs redesign | ⏳ Pending |
| `PanditDashboard.jsx` | Needs redesign | ⏳ Pending |
| `Login.jsx` | Needs redesign | ⏳ Pending |
| `Register.jsx` | Needs redesign | ⏳ Pending |

### State Management
- No changes to existing Context API usage
- AuthContext remains unchanged
- All API calls remain the same

### Routing
- No changes to React Router configuration
- All routes remain the same
- Add new routes as needed for additional pages

## Support & Contact

For questions or issues with the redesign:
- Create an issue in the repository
- Contact the development team
- Refer to this documentation

## Next Steps

1. Complete booking form modal
2. Redesign user and pandit dashboards
3. Update login/register pages
4. Add about and contact sections
5. Implement chatbot UI
6. Add virtual pooja join functionality
7. Complete admin dashboard styling
8. Add FAQ section
9. Perform comprehensive testing
10. Deploy to staging environment

---

**Last Updated**: October 28, 2025
**Version**: 1.0.0
**Status**: In Progress
