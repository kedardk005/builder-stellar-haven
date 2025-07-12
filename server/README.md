# ReWear Backend API

A complete Node.js/Express backend for the ReWear sustainable fashion platform with MongoDB, Cloudinary, and Razorpay integration.

## 🚀 Features

- **User Authentication**: JWT-based auth with bcrypt password hashing
- **Item Management**: Complete CRUD operations with image uploads
- **Payment Processing**: Razorpay integration for secure payments
- **Admin Panel**: Full admin controls for content moderation
- **Image Storage**: Cloudinary integration for optimized image handling
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, rate limiting, and input sanitization
- **Points System**: Reward users with points for activities

## 📁 Project Structure

```
server/
├── config/
│   ├── database.js          # MongoDB connection
│   └── cloudinary.js        # Cloudinary configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── upload.js            # File upload handling
│   ├── errorHandler.js      # Global error handling
│   └── notFound.js          # 404 handler
├── models/
│   ├── User.js              # User schema
│   ├── Item.js              # Item schema
│   ├── Order.js             # Order schema
│   ├── PointTransaction.js  # Points tracking
│   ├── Review.js            # Review schema
│   └── Wishlist.js          # Wishlist schema
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── items.js             # Item management
│   ├── orders.js            # Order processing
│   ├── admin.js             # Admin operations
│   └── demo.ts              # Demo endpoints
├── .env                     # Environment variables
├── dev-server.js            # Development server
├── index.ts                 # Vite integration
└── node-build.ts            # Production server
```

## 🔧 Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://ReWear:ReWear@rewear.pakyblh.mongodb.net/?retryWrites=true&w=majority&appName=ReWear
DB_NAME=rewear

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-rewear-app-2024
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=539574461689275
CLOUDINARY_API_SECRET=AMmkAuy0iVgQsBoyrO1_anC5xHM

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_qgR8tVJRU2uNZy
RAZORPAY_KEY_SECRET=J2zzqOxz7ZD0scmKbCYpKNlW

# Server Configuration
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:8080

# Email Configuration (Optional)
EMAIL_FROM=noreply@rewear.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/
```

## 🚀 Getting Started

### Development

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Set up Environment Variables**:

   - Copy the environment variables above to `server/.env`
   - Update Cloudinary cloud name if needed

3. **Start Development Server**:

   ```bash
   # Frontend + Simple Backend (current setup)
   npm run dev

   # Full Backend (separate process)
   npm run dev:backend

   # Both together
   npm run dev:full
   ```

### Production Deployment

1. **Build the Application**:

   ```bash
   npm run build
   ```

2. **Start Production Server**:
   ```bash
   npm start
   ```

## 📋 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint    | Description         | Auth Required |
| ------ | ----------- | ------------------- | ------------- |
| POST   | `/register` | Register new user   | No            |
| POST   | `/login`    | User login          | No            |
| GET    | `/me`       | Get current user    | Yes           |
| PUT    | `/profile`  | Update user profile | Yes           |
| PUT    | `/password` | Change password     | Yes           |
| POST   | `/logout`   | User logout         | Yes           |

### Items (`/api/items`)

| Method | Endpoint         | Description                  | Auth Required |
| ------ | ---------------- | ---------------------------- | ------------- |
| GET    | `/`              | Get all items (with filters) | No            |
| GET    | `/:id`           | Get single item              | No            |
| POST   | `/`              | Create new item              | Yes           |
| PUT    | `/:id`           | Update item                  | Yes (Owner)   |
| DELETE | `/:id`           | Delete item                  | Yes (Owner)   |
| POST   | `/:id/like`      | Like/unlike item             | Yes           |
| POST   | `/:id/flag`      | Flag inappropriate item      | Yes           |
| GET    | `/user/my-items` | Get user's items             | Yes           |

### Orders (`/api/orders`)

| Method | Endpoint          | Description             | Auth Required |
| ------ | ----------------- | ----------------------- | ------------- |
| POST   | `/`               | Create new order        | Yes           |
| POST   | `/verify-payment` | Verify Razorpay payment | Yes           |
| GET    | `/my-orders`      | Get user's orders       | Yes           |
| GET    | `/:id`            | Get single order        | Yes           |
| PUT    | `/:id/cancel`     | Cancel order            | Yes           |

### Admin (`/api/admin`)

| Method | Endpoint              | Description               | Auth Required |
| ------ | --------------------- | ------------------------- | ------------- |
| GET    | `/stats`              | Get admin dashboard stats | Admin         |
| GET    | `/items/pending`      | Get pending items         | Admin         |
| GET    | `/items/flagged`      | Get flagged items         | Admin         |
| GET    | `/users`              | Get users list            | Admin         |
| POST   | `/items/approve`      | Approve item              | Admin         |
| POST   | `/items/reject`       | Reject item               | Admin         |
| POST   | `/items/quality`      | Update quality badge      | Admin         |
| POST   | `/users/grant-points` | Grant points to user      | Admin         |
| POST   | `/content/moderate`   | Moderate flagged content  | Admin         |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **User**: Regular users can buy/sell items
- **Admin**: Full access to admin panel and content moderation
- **Moderator**: Can moderate content but limited admin access

## 💳 Payment Integration

### Razorpay Flow

1. **Create Order**: POST `/api/orders` with item details
2. **Payment**: Use Razorpay SDK on frontend
3. **Verify**: POST `/api/orders/verify-payment` with payment details
4. **Complete**: Order marked as paid, item marked as sold

### Points Payment

Users can pay with accumulated points (10 points = ₹1).

## 🖼️ Image Upload

Images are uploaded to Cloudinary with automatic optimization:

- **Supported formats**: JPEG, PNG, GIF, WebP
- **Max file size**: 10MB
- **Max files per item**: 5 images
- **Automatic optimization**: Quality and format optimization

## 📊 Admin Features

### Item Management

- Approve/reject submitted items
- Assign quality badges (Basic, Medium, High, Premium)
- Content moderation for inappropriate items

### User Management

- View user statistics and activity
- Grant custom points and rewards
- Manage user accounts

### Dashboard

- Real-time statistics
- Pending approvals
- Flagged content alerts

## 🗄️ Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  avatar: String,
  bio: String,
  points: Number,
  level: String,
  role: String (user/admin/moderator),
  isVerified: Boolean,
  isActive: Boolean,
  // ... more fields
}
```

### Item Model

```javascript
{
  title: String,
  description: String,
  category: String,
  brand: String,
  size: String,
  condition: String,
  price: Number,
  images: [{ url, publicId, isPrimary }],
  seller: ObjectId (User),
  status: String (pending/approved/active/sold/flagged),
  qualityBadge: String,
  // ... more fields
}
```

### Order Model

```javascript
{
  buyer: ObjectId (User),
  seller: ObjectId (User),
  item: ObjectId (Item),
  amount: Number,
  paymentMethod: String,
  status: String,
  shippingAddress: Object,
  razorpayOrderId: String,
  // ... more fields
}
```

## 🚨 Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [...] // Validation errors (if applicable)
}
```

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request / Validation Error
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

## 🔒 Security Features

- **Helmet**: Security headers
- **Rate Limiting**: Prevent abuse
- **Input Sanitization**: MongoDB injection prevention
- **CORS**: Cross-origin request configuration
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds

## 📈 Performance

- **Compression**: Gzip compression enabled
- **Database Indexing**: Optimized queries
- **Image Optimization**: Cloudinary automatic optimization
- **Connection Pooling**: MongoDB connection optimization

## 🧪 Testing

```bash
# Run tests
npm test

# Type checking
npm run typecheck
```

## 📦 Production Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set up production Cloudinary account
4. Configure production Razorpay keys
5. Set secure JWT secret

## 🔧 Maintenance

### Database Maintenance

```javascript
// Clean up expired reservations
Item.updateMany(
  {
    status: "reserved",
    reservedUntil: { $lt: new Date() },
  },
  {
    status: "active",
    $unset: { reservedBy: 1, reservedUntil: 1 },
  },
);
```

### Backup Strategy

- **Database**: Automated MongoDB Atlas backups
- **Images**: Cloudinary automatic backup
- **Code**: Git repository with tags for releases

## 📞 Support

For backend-related issues:

1. Check logs in production: `pm2 logs` or container logs
2. Verify database connection and indices
3. Check API endpoints with Postman/Insomnia
4. Monitor Cloudinary and Razorpay dashboards

## 🔄 Version History

- **v2.0.0**: Complete backend with all integrations
- **v1.0.0**: Basic Express server with mock data

---

Built with ❤️ for sustainable fashion by the ReWear team.
