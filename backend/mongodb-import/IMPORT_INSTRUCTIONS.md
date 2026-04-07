# MongoDB Import Instructions

## 📋 Quick Setup for Doctor & Nurse Login

### 🔑 Login Credentials
- **Doctor**: `doctor@hospital.com` / `password`
- **Nurse**: `nurse@hospital.com` / `password`

### 📁 Files to Import
1. `doctors.json` - Import into `doctors` collection
2. `nurses.json` - Import into `nurses` collection

### 🚀 Import Methods

#### Method 1: MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select database `hospital-management`
4. Click "Add Data" → "Import File"
5. Import `doctors.json` into `doctors` collection
6. Import `nurses.json` into `nurses` collection

#### Method 2: MongoDB Shell (Command Line)
```bash
# Navigate to the import folder
cd backend/mongodb-import

# Import doctors
mongoimport --db hospital-management --collection doctors --file doctors.json --jsonArray

# Import nurses  
mongoimport --db hospital-management --collection nurses --file nurses.json --jsonArray
```

#### Method 3: Copy-Paste in MongoDB Shell
1. Open MongoDB shell: `mongosh`
2. Use database: `use hospital-management`
3. Copy and paste the JSON content from the files

### ✅ Verification
After import, you can verify with:
```javascript
// In MongoDB shell
db.doctors.find()
db.nurses.find()
```

### 🎯 Test Login
1. Start your backend server: `cd backend && node server.js`
2. Try logging in with the credentials above
3. Check server logs for detailed authentication info

### 📝 Notes
- Password hash: `$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi` = `password`
- All fields match the MongoDB schemas exactly
- Doctor IDs are unique: DOC001, DOC002
- Ready to use immediately after import
