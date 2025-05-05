document.addEventListener('DOMContentLoaded', () => {
    const serviceForm = document.getElementById('serviceForm');
    const servicesContainer = document.getElementById('servicesContainer');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    let currentEditingId = null;
    
    loadServices();
    
    serviceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(serviceForm);
        const serviceData = {
            name: formData.get('name'),
            description: formData.get('description'),
            duration: parseInt(formData.get('duration')),
            price: parseFloat(formData.get('price'))
        };
        
        try {
            let response;
            if (currentEditingId) {
                response = await fetch(`http://localhost:3000/api/services/${currentEditingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(serviceData)
                });
            } else {
                response = await fetch('http://localhost:3000/api/services', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(serviceData)
                });
            }
            
            if (!response.ok) {
                throw new Error(await response.text());
            }
            
            serviceForm.reset();
            loadServices();
            resetForm();
            alert(`Service ${currentEditingId ? 'updated' : 'added'} successfully!`);
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    });
    
    cancelBtn.addEventListener('click', resetForm);
    
    async function loadServices() {
        try {
            const response = await fetch('http://localhost:3000/api/services');
            if (!response.ok) {
                throw new Error('Failed to load services');
            }
            
            const services = await response.json();
            renderServices(services);
        } catch (error) {
            console.error('Error:', error);
            servicesContainer.innerHTML = `<p class="error">${error.message}</p>`;
        }
    }
    
    function renderServices(services) {
        servicesContainer.innerHTML = '';
        
        if (services.length === 0) {
            servicesContainer.innerHTML = '<p>No services available</p>';
            return;
        }
        
        services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            serviceCard.innerHTML = `
                <h3>${service.name}</h3>
                <p><strong>Description:</strong> ${service.description}</p>
                <p><strong>Duration:</strong> ${service.duration} minutes</p>
                <p><strong>Price:</strong> $${service.price.toFixed(2)}</p>
                <div class="service-actions">
                    <button class="edit-btn" data-id="${service._id}">Edit</button>
                    <button class="delete-btn" data-id="${service._id}">Delete</button>
                </div>
            `;
            
            servicesContainer.appendChild(serviceCard);
            
            serviceCard.querySelector('.edit-btn').addEventListener('click', () => editService(service));
            serviceCard.querySelector('.delete-btn').addEventListener('click', () => deleteService(service._id));
        });
    }
    
    function editService(service) {
        currentEditingId = service._id;
        document.getElementById('name').value = service.name;
        document.getElementById('description').value = service.description;
        document.getElementById('duration').value = service.duration;
        document.getElementById('price').value = service.price;
        
        submitBtn.textContent = 'Update Service';
        cancelBtn.style.display = 'inline-block';
    }
    
    async function deleteService(id) {
        if (!confirm('Are you sure you want to delete this service?')) {
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:3000/api/services/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete service');
            }
            
            loadServices();
            alert('Service deleted successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    }
    
    function resetForm() {
        currentEditingId = null;
        serviceForm.reset();
        submitBtn.textContent = 'Add Service';
        cancelBtn.style.display = 'none';
    }
});