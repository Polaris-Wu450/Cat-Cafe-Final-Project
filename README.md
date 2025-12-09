# Cat Café Website - Final Project

## Project Overview
A professional and functional cat café website featuring responsive design, user authentication, interactive JavaScript features, shopping cart functionality with validation, and a memory game.

## Team Members
- **[Polaris Wu](https://github.com/Polaris-Wu450)** - HTML structure, MySQL planning, backend integration
- **[Zara Yang](https://github.com/Zara252)** - CSS styling, responsive design
- **[Helen Ji](https://github.com/Helen-Ji)** - JavaScript interactivity, game development

## File Structure

```
Cat-Cafe-Final-Project/
├── index.html             # Entry point (redirects to login/home)
├── login.html             # Login and registration page
├── home.html              # Landing page
├── menu.html              # Menu with items
├── cart.html              # Shopping cart
├── game.html              # Memory game
├── styles/
│   ├── main.css          # Global styles and variables
│   ├── login.css         # Login page styles
│   ├── menu.css          # Menu page styles
│   ├── cart.css          # Cart page styles
│   └── game.css          # Game page styles
├── main.js                # Global JavaScript (auth, cart, utilities)
├── login.js               # Login and registration functionality
├── menu.js                # Menu functionality with search
├── cart.js                # Cart functionality
├── game.js                # Game logic
├── PHP Backend/
│   ├── init_db.php       # Database initialization
│   ├── signup.php        # User registration (SQLite3)
│   ├── login.php         # User authentication (SQLite3)
│   ├── cart.php          # Order processing (SQLite3)
│   ├── order-history.php # Order history retrieval (SQLite3)
│   └── order-details.php # Order details retrieval (SQLite3)
└── cat_cafe.db           # SQLite3 database (created after init)
```

## Features Implemented

### 1. Authentication System
- Login page with email/password authentication
- Registration form with validation
- Guest login option (no registration required)

### 2. Navigation System
- Sticky navigation bar
- Active page highlighting
- Cart badge with item count
- Responsive hamburger menu (mobile)
- Consistent branding across all pages

### 3. Shopping Cart System
- Add items to cart from menu page
- Increase/decrease quantities
- Remove individual items
- Clear entire cart
- Cart validation before checkout
- Order summary with tax calculation (8%)
- Local storage persistence

**Validation Rules:**
- Quantity must be >= 1
- Quantity cannot exceed 99
- Valid price required (positive number, reasonable range)
- Empty cart check before checkout
- Item data integrity validation
- Total amount validation
- User-friendly error messages with visual feedback

### 4. Memory Game
- 8 pairs of cat types (16 cards total): Orange, Tabby, Black, White, Calico, Siamese, Persian, Maine Coon
- Click to flip cards
- Match detection
- Move counter
- Timer (minutes:seconds)
- Hint system (3 hints per game)
- Win modal with stats
- New game button
- Smooth animations (flip, shake, pulse)

**Game Logic:**
- Cards shuffle randomly each game
- 2 cards can be flipped at a time
- Matched pairs stay revealed
- Non-matches flip back after 1 second
- Timer starts on first move
- Win condition: all 8 pairs matched

### 5. Menu System
- 15 menu items across 4 categories
  - Drinks (4 items)
  - Food (4 items)
  - Desserts (4 items)
  - Cat Treats (3 items)
- Category filtering
- "Add to Cart" buttons
- Visual feedback on add
- Price display

### 6. JavaScript Interactivity
- Smooth animations and transitions
- Form validation (cart, login, registration)
- Local storage management
- Dynamic content rendering
- Event handling
- Modal windows
- Notification system
- Responsive mobile menu
- Cart count synchronization across pages

## Deployment Instructions

### 1. Upload to i6 Server
```bash
# Connect via SFTP/SCP
sftp netid@i6.cims.nyu.edu

# Navigate to public_html
cd public_html

# Upload all files maintaining structure
put -r *
```

### 2. Set Permissions
```bash
chmod 755 *.html
chmod 755 styles/
chmod 644 styles/*.css
chmod 644 *.js
```

### 3. Test URLs
- Entry: `https://i6.cims.nyu.edu/~netid/index.html` (auto-redirects)
- Login: `https://i6.cims.nyu.edu/~netid/login.html`
- Home: `https://i6.cims.nyu.edu/~netid/home.html`
- Menu: `https://i6.cims.nyu.edu/~netid/menu.html`
- Cart: `https://i6.cims.nyu.edu/~netid/cart.html`
- Game: `https://i6.cims.nyu.edu/~netid/game.html`

## Design Features

### Responsive Design
- Mobile-first approach
- Breakpoints at 968px and 480px
- Flexible grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

### Professional Styling
- Consistent color scheme (pink, peach, lavender, mint)
- Modern CSS variables for easy theming
- Smooth transitions and animations
- Professional typography (Fredoka & Quicksand fonts)
- Clean, emoji-free design
- Accessible color contrasts

## Backend Integration (PHP + SQLite3)

### Database Setup

#### Local Development
1. **First time only**: Run `php init_db.php` to initialize the SQLite3 database
   - This creates `cat_cafe.db` with tables: `users`, `orders`, `menu_items`
   - **Note**: You only need to run this once. If `cat_cafe.db` already exists, you can skip this step.
2. After database is created, you only need to run: `php -S localhost:8000`

#### Server Deployment (i6)
1. Upload `cat_cafe.db` to the `databases/` directory on the server
2. **Note**: `init_db.php` is **not required** for deployment if the database file already exists
   - You can keep it as a backup/utility script, but it's not needed for normal operation
3. Ensure the `databases/` directory has proper write permissions if you need to create new tables

### PHP Scripts
All PHP scripts use SQLite3 for data storage:

1. **signup.php** - User registration with password hashing
2. **login.php** - User authentication with password verification
3. **cart.php** - Stores shopping cart orders in database
4. **order-history.php** - Retrieves user's order history
5. **order-details.php** - Retrieves specific order details

### JavaScript Validation
- All forms validate data client-side before sending to PHP
- Uses jQuery for AJAX calls to PHP backend
- Real-time validation feedback

### Security Features
- Password hashing using `password_hash()`
- SQL injection prevention with prepared statements
- Input validation on both client and server side
- Email uniqueness enforcement

See `README_PHP.md` for detailed API documentation.