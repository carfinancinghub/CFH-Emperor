// Shared action utilities

function resetSellerForm() {
    document.getElementById('seller-form-title').textContent = 'Create New Listing';
    document.getElementById('seller-listing-id').value = '';
    document.getElementById('seller-form').reset();
    document.getElementById('seller-form-submit').textContent = 'Save as Draft';
}

// Export shared functions
window.resetSellerForm = resetSellerForm;