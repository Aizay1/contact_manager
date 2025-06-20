document.addEventListener('DOMContentLoaded', function() {
    const contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
    const contactForm = document.getElementById('contactForm');
    const contactsList = document.getElementById('contactsList');
    const searchInput = document.getElementById('searchInput');
    const saveButton = document.getElementById('saveContact');
    
    let contacts = [];
    let editingId = null;
    
    // Load contacts on page load
    loadContacts();
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        if (searchTerm.length > 0) {
            fetch(`search_contacts.php?q=${encodeURIComponent(searchTerm)}`)
                .then(response => response.json())
                .then(data => {
                    displayContacts(data);
                })
                .catch(error => console.error('Error:', error));
        } else {
            loadContacts();
        }
    });
    
    // Save contact
    saveButton.addEventListener('click', function() {
        const contactData = {
            fullname: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone_number: document.getElementById('phone_number').value,
            extra_phone_number: document.getElementById('extra_phone_number').value,
            city: document.getElementById('city').value,
            house_number: document.getElementById('house_number').value,
            zipcode: document.getElementById('zipcode').value
        };
        
        if (editingId) {
            contactData.id = editingId;
            updateContact(contactData);
        } else {
            createContact(contactData);
        }
    });
    
    function loadContacts() {
        fetch('get_contacts.php')
            .then(response => response.json())
            .then(data => {
                contacts = data;
                displayContacts(data);
            })
            .catch(error => console.error('Error:', error));
    }
    
    function displayContacts(contacts) {
        contactsList.innerHTML = '';
        
        if (contacts.length === 0) {
            contactsList.innerHTML = '<div class="list-group-item">No contacts found</div>';
            return;
        }
        
        contacts.forEach(contact => {
            const contactItem = document.createElement('div');
            contactItem.className = 'list-group-item';
            
            let contactHtml = `
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${contact.fullname}</h5>
                    <div>
                        <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${contact.id}">Edit</button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${contact.id}">Delete</button>
                    </div>
                </div>
                <p class="mb-1"><strong>Phone:</strong> ${contact.phone_number}</p>
            `;
            
            if (contact.email) {
                contactHtml += `<p class="mb-1"><strong>Email:</strong> ${contact.email}</p>`;
            }
            
            if (contact.extra_phone_number) {
                contactHtml += `<p class="mb-1"><strong>Extra Phone:</strong> ${contact.extra_phone_number}</p>`;
            }
            
            if (contact.city || contact.house_number || contact.zipcode) {
                contactHtml += `<p class="mb-1"><strong>Address:</strong> `;
                const addressParts = [];
                if (contact.house_number) addressParts.push(contact.house_number);
                if (contact.city) addressParts.push(contact.city);
                if (contact.zipcode) addressParts.push(contact.zipcode);
                contactHtml += addressParts.join(', ') + `</p>`;
            }
            
            contactItem.innerHTML = contactHtml;
            contactsList.appendChild(contactItem);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                editingId = this.getAttribute('data-id');
                const contact = contacts.find(c => c.id == editingId);
                if (contact) {
                    document.getElementById('modalTitle').textContent = 'Edit Contact';
                    document.getElementById('contactId').value = contact.id;
                    document.getElementById('fullname').value = contact.fullname;
                    document.getElementById('email').value = contact.email || '';
                    document.getElementById('phone_number').value = contact.phone_number;
                    document.getElementById('extra_phone_number').value = contact.extra_phone_number || '';
                    document.getElementById('city').value = contact.city || '';
                    document.getElementById('house_number').value = contact.house_number || '';
                    document.getElementById('zipcode').value = contact.zipcode || '';
                    contactModal.show();
                }
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this contact?')) {
                    const id = this.getAttribute('data-id');
                    deleteContact(id);
                }
            });
        });
    }
    
    function createContact(contactData) {
        fetch('create_contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                contactModal.hide();
                contactForm.reset();
                loadContacts();
            } else {
                alert('Error creating contact: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error creating contact');
        });
    }
    
    function updateContact(contactData) {
        fetch('update_contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                contactModal.hide();
                contactForm.reset();
                editingId = null;
                loadContacts();
            } else {
                alert('Error updating contact: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating contact');
        });
    }
    
    function deleteContact(id) {
        fetch('delete_contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadContacts();
            } else {
                alert('Error deleting contact: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting contact');
        });
    }
    
    // Reset modal when closed
    document.getElementById('contactModal').addEventListener('hidden.bs.modal', function() {
        contactForm.reset();
        document.getElementById('modalTitle').textContent = 'Add New Contact';
        editingId = null;
    });
});