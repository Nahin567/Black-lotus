# Black Lotus - Multimedia Sharing Platform
## CW2 | Nahin Ahmed Mojumder | B00976705

---

## HOW TO USE RIGHT NOW
Open `index.html` in your browser — works immediately in demo mode with sample media.

---

## CONNECT TO AZURE (3 steps)

### Step 1 — Set up your Azure Logic Apps (4 of them)
In Azure Portal create 4 Logic Apps (all Consumption type):
- `black-lotus-create` → HTTP POST trigger → Cosmos DB "Create or update document"
- `black-lotus-get` → HTTP GET trigger → Cosmos DB "Query documents"  
- `black-lotus-update` → HTTP PUT trigger → Cosmos DB "Create or update document"
- `black-lotus-delete` → HTTP DELETE trigger → Cosmos DB "Delete document"

### Step 2 — Copy the Logic App URLs
Each Logic App has an auto-generated URL shown in the designer under the HTTP trigger.

### Step 3 — Paste URLs into app.js
Open `js/app.js`, find the top section and replace:

```javascript
const AZURE = {
    CREATE: "PASTE_YOUR_POST_URL_HERE",
    GET:    "PASTE_YOUR_GET_URL_HERE",
    UPDATE: "PASTE_YOUR_PUT_URL_HERE",
    DELETE: "PASTE_YOUR_DELETE_URL_HERE"
};
```

Save and refresh — it now talks to Azure!

---

## AZURE RESOURCES TO CREATE (in order)

1. Resource Group: `black-lotus-rg` (UK South)
2. Storage Account: `blacklotusstorage` → containers: `media-uploads`, `thumbnails`
3. Cosmos DB: `black-lotus-cosmos` → DB: `BlackLotusDB` → Container: `MediaMetadata` (partition: /userId)
4. Azure SQL: `BlackLotusSQL` → run the SQL below in Query Editor
5. Function App: `black-lotus-functions` (Node.js, Consumption)
6. Logic Apps x4 (see above)
7. App Insights: `black-lotus-insights` → link to Function App
8. CDN: link to Storage Account
9. Static Web App: upload this entire folder

---

## SQL FOR AZURE SQL DATABASE

```sql
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY,
    Username NVARCHAR(100) NOT NULL,
    Email NVARCHAR(200) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255),
    Role NVARCHAR(50) DEFAULT 'user',
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE MediaFiles (
    MediaID INT PRIMARY KEY IDENTITY,
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    Title NVARCHAR(200),
    MediaType NVARCHAR(50),
    BlobUrl NVARCHAR(500),
    UploadedAt DATETIME DEFAULT GETDATE()
);

INSERT INTO Users (Username, Email, Role) VALUES ('testuser', 'test@blacklotus.com', 'user');
SELECT * FROM Users;
```

---

## FILES
```
black-lotus/
├── index.html      ← Main page (Home, Upload, Gallery, Login)
├── css/style.css   ← Dark luxury styling
├── js/app.js       ← All CRUD + Azure connections
└── README.md       ← This file
```

---

## 5-MINUTE VIDEO STRUCTURE
- 0:00 → Introduce yourself + say "Black Lotus is a cloud-native multimedia sharing platform"
- 0:30 → Show Resource Group in Azure Portal (all services listed)
- 1:30 → Demo CREATE: fill upload form → show record appear in Cosmos DB Data Explorer
- 2:30 → Demo GET: click Gallery → media cards load
- 3:00 → Demo UPDATE: click Edit on a card → change title → save
- 3:30 → Demo DELETE: delete a card
- 4:00 → Show App Insights live metrics + CDN endpoint
- 4:30 → Show Static Web App URL in browser
- 4:50 → Mention advanced features: App Insights, CDN, Azure Monitor
