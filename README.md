# Cat Café Website - Final Project

## Project Overview
A cute and functional cat café website featuring responsive design, interactive JavaScript features, shopping cart functionality, and a memory game.

## Team Members
- **[Polaris Wu](https://github.com/Polaris-Wu450)** - HTML structure, MySQL planning, backend integration
- **[Zara Yang](https://github.com/Zara252)** - CSS styling, responsive design
- **[Helen Ji](https://github.com/Helen-Ji)** - JavaScript interactivity, game development

## File Structure

```
Cat-Cafe-Final-Project/
├── home.html              # Landing page
├── menu.html              # Menu with items
├── cart.html              # Shopping cart
├── game.html              # Memory game
├── reservation.html       # (To be created)
├── cats.html              # (To be created)
├── styles/
│   ├── main.css          # Global styles
│   ├── menu.css          # Menu page styles
│   ├── cart.css          # Cart page styles
│   └── game.css          # Game page styles
├── main.js                # Global JavaScript
├── menu.js                # Menu functionality
├── cart.js                # Cart functionality
└── game.js                # Game logic
```

## Features Implemented

### 1. Navigation System
- Sticky navigation bar
- Active page highlighting
- Cart badge with item count
- Responsive hamburger menu (mobile)

### 2. Shopping Cart System
**Features:**
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
- Valid price required
- Empty cart check before checkout

### 3. Memory Game
**Features:**
- 8 pairs of cat emojis (16 cards total)
- Click to flip cards
- Match detection
- Move counter
- Timer (minutes:seconds)
- Hint system (3 hints per game)
- Win modal with stats
- New game button
- Animations (flip, shake, pulse)

**Game Logic:**
- Cards shuffle randomly each game
- 2 cards can be flipped at a time
- Matched pairs stay revealed
- Non-matches flip back after 1 second
- Timer starts on first move
- Win condition: all 8 pairs matched

### 4. Menu System
**Features:**
- 15 menu items across 4 categories
  - Drinks (4 items)
  - Food (4 items)
  - Desserts (4 items)
  - Cat Treats (3 items)
- Category filtering
- "Add to Cart" buttons
- Visual feedback on add
- Price display

### 5. JavaScript Interactivity
- Smooth animations
- Form validation (cart)
- Local storage management
- Dynamic content rendering
- Event handling
- Modal windows

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
- Home: `https://i6.cims.nyu.edu/~netid/home.html`
- Menu: `https://i6.cims.nyu.edu/~netid/menu.html`
- Cart: `https://i6.cims.nyu.edu/~netid/cart.html`
- Game: `https://i6.cims.nyu.edu/~netid/game.html`

## Future Enhancements (Stage 2)

### Backend Features to Add:
1. **User Authentication**
   - Login/Registration system
   - Session management
   - User profiles

2. **Database Integration**
   - MySQL for menu items
   - Order history storage
   - User preferences

3. **Reservation System**
   - Date/time picker
   - Availability checking
   - Confirmation emails

4. **Admin Panel**
   - Manage menu items
   - View orders
   - Update cat profiles
