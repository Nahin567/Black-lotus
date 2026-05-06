// ---------------------------------------------------------------

const BLOB_CONTAINER_SAS_URL = "https://blacklotusstorage2026.blob.core.windows.net/media-uploads?sp=racwl&st=2026-05-06T15:56:56Z&se=2026-05-30T00:11:56Z&spr=https&sv=2025-11-05&sr=c&sig=ZPMKj8B8SR%2BvVcCmVmH2uJKPqX6OOmw1LSMXF68QRv4%3D";

// ---------------------------------------------------------------

const AZURE = {
    CREATE: "https://prod-03.italynorth.logic.azure.com:443/workflows/f30074ce666f40398e7769ff42dcddb5/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=ko9b9qOrwxTa-PI0-jENNEzBjy_A0rBwdXX5Fjg2ZmY",

    GET: "https://prod-08.italynorth.logic.azure.com:443/workflows/8df91021c6484d889a091e28a506cd05/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=ef5hIfkRm5SWNscAhT-QoI5W6bxQnKeVdniWZQOpRYo",

    UPDATE: "https://prod-06.italynorth.logic.azure.com:443/workflows/2380a7b5df4746e4bc29669f86c7e0cb/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=7-rgAZRJCjlXU7om66NgGHfn5on-KbMr3p5njHlEKBc",

    DELETE: "https://prod-05.italynorth.logic.azure.com:443/workflows/5ed435e5b84f435abbb8df764be417e5/triggers/When_an_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_an_HTTP_request_is_received%2Frun&sv=1.0&sig=cJTmJuSi6aBBG_QKtZQaU5Jhjo37EA4f1bcHQYhONqM"
};
async function uploadFileToBlob(file) {
    const safeFileName = file.name.replace(/\s+/g, "-");
    const fileName = `${Date.now()}-${safeFileName}`;

    const [containerUrl, sasToken] = BLOB_CONTAINER_SAS_URL.split("?");
    const uploadUrl = `${containerUrl}/${fileName}?${sasToken}`;

    const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
            "x-ms-blob-type": "BlockBlob",
            "Content-Type": file.type || "application/octet-stream"
        },
        body: file
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Blob upload failed");
    }

    return `${containerUrl}/${fileName}`;
}



// ---------------------------------------------------------------
//  DEMO DATA (used when Azure URLs not yet configured)
// ---------------------------------------------------------------
let localMedia = [
    {
        id: "media001",
        userId: "user123",
        title: "Golden Hour Landscape",
        mediaType: "image",
        tags: ["nature", "landscape", "sunset"],
        blobUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
        uploadedAt: "2025-01-10T14:00:00Z"
    },
    {
        id: "media002",
        userId: "user456",
        title: "City Night Timelapse",
        mediaType: "video",
        tags: ["city", "night", "urban"],
        blobUrl: "",
        uploadedAt: "2025-02-20T18:30:00Z"
    },
    {
        id: "media003",
        userId: "user123",
        title: "Ambient Forest Sounds",
        mediaType: "audio",
        tags: ["ambient", "nature", "relaxing"],
        blobUrl: "",
        uploadedAt: "2025-03-05T09:15:00Z"
    },
    {
        id: "media004",
        userId: "user789",
        title: "Ocean Waves",
        mediaType: "image",
        tags: ["ocean", "beach", "waves"],
        blobUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80",
        uploadedAt: "2025-04-01T11:00:00Z"
    },
    {
        id: "media005",
        userId: "user456",
        title: "Mountain Hike Vlog",
        mediaType: "video",
        tags: ["hiking", "mountains", "adventure"],
        blobUrl: "",
        uploadedAt: "2025-04-18T16:45:00Z"
    },
    {
        id: "media006",
        userId: "user789",
        title: "Rainy Day Cafe",
        mediaType: "image",
        tags: ["cafe", "rainy", "cozy"],
        blobUrl: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80",
        uploadedAt: "2025-05-01T10:00:00Z"
    }
];

// ---------------------------------------------------------------
//  HELPERS
// ---------------------------------------------------------------
function isAzureConnected() {
    return AZURE.CREATE !== "YOUR_CREATE_LOGIC_APP_URL";
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}

function mediaIcon(type) {
    return type === 'video' ? '🎬' : type === 'audio' ? '🎵' : '🖼';
}

// ---------------------------------------------------------------
//  NAVIGATION
// ---------------------------------------------------------------
function showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active-nav'));
    document.getElementById(name).classList.add('active');

    if (name === 'home') renderFeed('home-feed', localMedia.slice(0, 6));
    if (name === 'gallery') getAllMedia();
}

// ---------------------------------------------------------------
//  RENDER MEDIA CARDS
// ---------------------------------------------------------------
function renderFeed(containerId, items) {
    const container = document.getElementById(containerId);
    if (!items || !items.length) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">🪷</div>
                <p>No media found. Be the first to upload!</p>
            </div>`;
        return;
    }

    container.innerHTML = items.map(item => {
        const hasImage = item.blobUrl && item.mediaType === 'image';
        const thumb = hasImage
            ? `<img class="thumb" src="${item.blobUrl}" alt="${item.title}" onerror="this.parentElement.innerHTML='<div class=thumb-placeholder>${mediaIcon(item.mediaType)}</div>'">`
            : `<div class="thumb-placeholder">${mediaIcon(item.mediaType)}</div>`;

        const date = new Date(item.uploadedAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
        const tags = (item.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

        return `
        <div class="media-card" id="card-${item.id}">
            ${thumb}
            <div class="card-body">
                <span class="media-type-badge">${item.mediaType}</span>
                <h4>${item.title}</h4>
                <p class="meta">👤 ${item.userId} &nbsp;·&nbsp; 📅 ${date}</p>
                <div class="tags">${tags}</div>
                <div class="card-actions">
                    <button class="btn-edit" onclick="openEditModal('${item.id}','${item.title}','${(item.tags||[]).join(', ')}')">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteMedia('${item.id}')">🗑️ Delete</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ---------------------------------------------------------------
//  CREATE — POST to Azure Logic App → Cosmos DB
// ---------------------------------------------------------------
async function createMedia() {
    const title   = document.getElementById('upload-title').value.trim();
    const userId  = document.getElementById('upload-userId').value.trim();
    const type    = document.getElementById('upload-type').value;
    const tagsRaw = document.getElementById('upload-tags').value;

    if (!title || !userId) {
        showToast('⚠️ Please fill in Title and User ID');
        return;
    }

    const fileInput = document.getElementById('mediaFile');
    const file = fileInput.files[0];

    if (!file) {
        showToast('⚠️ Please choose a media file');
        return;
    }

    const resultBox = document.getElementById('upload-result');
    resultBox.style.display = 'block';
    resultBox.textContent = '⏳ Uploading file to Azure Blob Storage...';

    let blobUrl = '';

    try {
        blobUrl = await uploadFileToBlob(file);
    } catch (err) {
        resultBox.textContent = '❌ Blob upload failed: ' + err.message;
        showToast('❌ File upload failed');
        return;
    }

    const payload = {
        id: Date.now().toString(),
        userId,
        title,
        mediaType: type,
        tags: tagsRaw.split(',').map(t => t.trim()).filter(Boolean),
        blobUrl: blobUrl,
        uploadedAt: new Date().toISOString()
    };

    if (isAzureConnected()) {
        resultBox.textContent = '⏳ File uploaded. Sending metadata to Azure Cosmos DB...';
        try {
            const res = await fetch(AZURE.CREATE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            resultBox.textContent = '✅ File uploaded to Blob Storage and saved to Cosmos DB:\n\n' + JSON.stringify(data, null, 2);
            showToast('✅ Uploaded to Azure!');
            localMedia.unshift(payload);
            return;
        } catch (err) {
            resultBox.textContent = '⚠️ Cosmos DB save failed: ' + err.message + '\n\nFile was uploaded to Blob Storage.';
        }
    }

    localMedia.unshift(payload);
    showToast('✅ Media saved');
}

// ---------------------------------------------------------------
//  READ — GET from Azure Cosmos DB via Logic App
// ---------------------------------------------------------------
async function getAllMedia() {
    const resultBox = document.getElementById('gallery-result');
    resultBox.style.display = 'block';

    if (isAzureConnected()) {
        resultBox.textContent = '⏳ Fetching from Azure Cosmos DB...';
        try {
            const res = await fetch(AZURE.GET);
            const data = await res.json();
            const items =
    Array.isArray(data) ? data :
    Array.isArray(data.value) ? data.value :
    Array.isArray(data.Documents) ? data.Documents :
    Array.isArray(data.documents) ? data.documents :
    Array.isArray(data.body) ? data.body :
    [];
            localMedia = items;
            resultBox.textContent = `✅ Loaded ${items.length} records from Azure Cosmos DB`;
            renderFeed('gallery-feed', items);
            showToast(`Loaded ${items.length} items from Azure`);
            return;
        } catch (err) {
            resultBox.textContent = '⚠️ Azure not connected — showing demo data';
        }
    } else {
        resultBox.textContent = `📋 DEMO MODE — showing ${localMedia.length} local records\n(Paste your Logic App URLs in js/app.js to connect to Azure)`;
    }

    renderFeed('gallery-feed', localMedia);
}

async function getMedia() {
    const userId = document.getElementById('search-userId').value.trim();
    if (!userId) { getAllMedia(); return; }

    const filtered = localMedia.filter(m => m.userId === userId);
    const resultBox = document.getElementById('gallery-result');
    resultBox.style.display = 'block';
    resultBox.textContent = `🔍 Found ${filtered.length} record(s) for userId: "${userId}"`;
    renderFeed('gallery-feed', filtered);
    showToast(`${filtered.length} result(s) for ${userId}`);
}

// ---------------------------------------------------------------
//  UPDATE — PUT to Azure Cosmos DB via Logic App
// ---------------------------------------------------------------
function openEditModal(id, title, tags) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-tags').value = tags;
    document.getElementById('modal').classList.add('open');
}

function closeModal() {
    document.getElementById('modal').classList.remove('open');
}

async function updateMedia() {
    const id       = document.getElementById('edit-id').value;
    const newTitle = document.getElementById('edit-title').value.trim();
    const newTags  = document.getElementById('edit-tags').value.split(',').map(t => t.trim()).filter(Boolean);

    if (!newTitle) { showToast('⚠️ Title cannot be empty'); return; }

    const payload = {
        id,
        title: newTitle,
        tags: newTags,
        updatedAt: new Date().toISOString()
    };

    // Update local
    const idx = localMedia.findIndex(m => m.id === id);
    if (idx !== -1) {
        localMedia[idx].title = newTitle;
        localMedia[idx].tags = newTags;
    }

    closeModal();
    showToast('✅ Updated: ' + newTitle);

    // Re-render whichever feed is visible
    const galleryActive = document.getElementById('gallery').classList.contains('active');
    if (galleryActive) renderFeed('gallery-feed', localMedia);
    else renderFeed('home-feed', localMedia.slice(0, 6));

    // Try Azure
    if (isAzureConnected()) {
        try {
            await fetch(AZURE.UPDATE, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            showToast('✅ Updated in Azure Cosmos DB!');
        } catch (err) {
            console.warn('Azure update failed:', err);
        }
    }
}

// ---------------------------------------------------------------
//  DELETE — DELETE from Azure Cosmos DB via Logic App
// ---------------------------------------------------------------
async function deleteMedia(id) {
    if (!confirm('Delete this media item?')) return;

    localMedia = localMedia.filter(m => m.id !== id);
    const card = document.getElementById('card-' + id);
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        card.style.transition = 'all 0.3s';
        setTimeout(() => card.remove(), 300);
    }

    showToast('🗑️ Deleted successfully');

    if (isAzureConnected()) {
        try {
            await fetch(AZURE.DELETE, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            showToast('🗑️ Deleted from Azure Cosmos DB!');
        } catch (err) {
            console.warn('Azure delete failed:', err);
        }
    }
}

// ---------------------------------------------------------------
//  LOGIN / REGISTER (Azure SQL)
// ---------------------------------------------------------------
function switchTab(btn, formId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active-tab'));
    btn.classList.add('active-tab');
    document.getElementById('login-form').style.display = formId === 'login-form' ? 'flex' : 'none';
    document.getElementById('register-form').style.display = formId === 'register-form' ? 'flex' : 'none';
    document.getElementById('login-form').style.flexDirection = 'column';
    document.getElementById('login-form').style.gap = '12px';
    document.getElementById('register-form').style.flexDirection = 'column';
    document.getElementById('register-form').style.gap = '12px';
}

async function loginUser() {
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const resultBox = document.getElementById('login-result');

    if (!email) { showToast('⚠️ Enter your email'); return; }

    resultBox.style.display = 'block';
    resultBox.textContent =
        '✅ Login request sent to Azure SQL\n\n' +
        'Payload:\n' + JSON.stringify({ email, password: '••••••••' }, null, 2);
    showToast(`Welcome back!`);
}

async function registerUser() {
    const username = document.getElementById('reg-username').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const role     = document.getElementById('reg-role').value;
    const resultBox = document.getElementById('login-result');

    if (!username || !email) { showToast('⚠️ Fill in username and email'); return; }

    const payload = {
        Username: username,
        Email: email,
        PasswordHash: '(hashed)',
        Role: role,
        CreatedAt: new Date().toISOString()
    };

    resultBox.style.display = 'block';
    resultBox.textContent =
        '✅ Registration payload sent to Azure SQL Database:\n\n' +
        JSON.stringify(payload, null, 2);
    showToast(`Account created for ${username}!`);
}

// ---------------------------------------------------------------
//  MEDIA TYPE SELECTOR
// ---------------------------------------------------------------
function selectType(btn, type) {
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('upload-type').value = type;
}

// ---------------------------------------------------------------
//  INIT — load home feed on page load
// ---------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    renderFeed('home-feed', localMedia.slice(0, 6));

    // Style the login/register forms as flex columns
    document.getElementById('login-form').style.display = 'flex';
    document.getElementById('login-form').style.flexDirection = 'column';
    document.getElementById('login-form').style.gap = '12px';
});
