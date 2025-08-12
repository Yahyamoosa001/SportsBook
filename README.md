# 🏟️ **Sports Book**
**Team Number:** 320  
**Members:** Kunal Neamde, Yahya Moosa, Sarvesh Kadam  


**Sports Book** is a comprehensive turf booking platform with **three modules**: **Admin**, **Owner**, and **User**.  

It allows:
- **Users** to browse and book turfs
- **Owners** to manage their turfs and bookings
- **Admins** to oversee and manage the entire system

📂 **Project Resources**  
[Google Drive Link]()

---

## ✨ **Features**

### **User Module**
- **Browse Turfs** – View turf details and available time slots.
- **Slot Booking** – Book slots via **Razorpay**. After payment, receive:
  - Confirmation email
  - Booking details (price, turf name, start/end time)
  - **QR Code** containing booking information
- **Rate Turfs** – Leave ratings for booked turfs.
- **Become Owner** – Apply to become a turf owner; application reviewed by admin.

### **Owner Module**
- **Turf Management** – Add, edit, and manage turfs.
- **Dashboard** – View transactions and booking stats in graphical form.
- **Review Management** – Respond to and manage user reviews.

### **Admin Module**
- **Owner Requests** – Approve/reject ownership applications.
- **User & Owner Management** – View all platform users and owners.
- **Turf Management** – Manage all listed turfs.
- **Transaction Overview** – View monthly transaction analytics.


## 🔐 **Demo Admin Credentials**
Email: admin@gmail.com
Password: rijo.com
---
**.env File**
PORT=your_port
MONGO_URI=your_mongo_uri

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

OWNER_URL=your_owner_url
USER_URL=your_user_url

EMAIL=your_email
PASSWORD=your_email_app_password

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET_KEY=your_razorpay_secret_key

JWT_SECRET=your_jwt_secret
