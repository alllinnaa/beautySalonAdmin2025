document.addEventListener('DOMContentLoaded', () => {
    const masterForm = document.getElementById('masterForm');
    const mastersContainer = document.getElementById('mastersContainer');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const servicesCheckboxes = document.getElementById('servicesCheckboxes');
    const formTitle = document.getElementById('formTitle');

    const scheduleModal = document.getElementById('scheduleModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const scheduleGrid = document.getElementById('scheduleGrid');
    const scheduleDatePicker = document.getElementById('scheduleDatePicker');
    const prevDayBtn = document.getElementById('prevDayBtn');
    const nextDayBtn = document.getElementById('nextDayBtn');
    const addAppointmentBtn = document.getElementById('addAppointmentBtn');
    const modalMasterName = document.getElementById('modalMasterName');

    const appointmentModal = document.getElementById('appointmentModal');
    const closeAppointmentModalBtn = document.querySelector('.close-appointment-modal');
    const appointmentForm = document.getElementById('appointmentForm');
    const clientSelect = document.getElementById('clientSelect');
    const serviceSelect = document.getElementById('serviceSelect');
    const appointmentDateTime = document.getElementById('appointmentDateTime');
    const appointmentNote = document.getElementById('appointmentNote');
    const saveAppointmentBtn = document.getElementById('saveAppointmentBtn');
    const cancelAppointmentBtn = document.getElementById('cancelAppointmentBtn');


    let currentMasterId = null;
    let currentMasterData = null;
    let currentEditingId = null;
    let allServices = [];
    let currentMasterServices = [];
    let selectedServiceDuration = 0;
    let currentAppointmentTime = null;

    loadMasters();
    loadAllServices();

    masterForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(masterForm);
        const masterData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            services: currentMasterServices
        };

        try {
            let response;
            if (currentEditingId) {
                response = await fetch(`http://localhost:3000/api/masters/${currentEditingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(masterData)
                });
            } else {
                response = await fetch('http://localhost:3000/api/masters', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(masterData)
                });
            }

            if (!response.ok) {
                throw new Error(await response.text());
            }

            masterForm.reset();
            currentMasterServices = [];
            renderServicesCheckboxes([]);
            loadMasters();
            resetForm();
            alert(`Master ${currentEditingId ? 'updated' : 'added'} successfully!`);
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    });

    async function loadAllServices() {
        try {
            const response = await fetch('http://localhost:3000/api/services');
            if (!response.ok) {
                throw new Error('Failed to load services');
            }
            allServices = await response.json();
            renderServicesCheckboxes(currentMasterServices);
        } catch (error) {
            console.error('Error loading services:', error);
            servicesCheckboxes.innerHTML = `<p class="error">Error loading services: ${error.message}</p>`;
        }
    }

    function renderServicesCheckboxes(selectedServices) {
        if (allServices.length === 0) {
            servicesCheckboxes.innerHTML = '<p>No services available</p>';
            return;
        }

        servicesCheckboxes.innerHTML = allServices.map(service => `
            <label>
                <input 
                    type="checkbox" 
                    value="${service._id}" 
                    ${selectedServices.includes(service._id) ? 'checked' : ''}
                    onchange="handleServiceSelection(this)"
                >
                <span class="service-name">${service.name}</span>
            </label>
        `).join('');
    }

    window.handleServiceSelection = function (checkbox) {
        if (checkbox.checked) {
            if (!currentMasterServices.includes(checkbox.value)) {
                currentMasterServices.push(checkbox.value);
            }
        } else {
            currentMasterServices = currentMasterServices.filter(id => id !== checkbox.value);
        }
    };


    async function loadMasters() {
        try {
            const response = await fetch('http://localhost:3000/api/masters');
            if (!response.ok) {
                throw new Error('Failed to load masters');
            }

            const masters = await response.json();
            renderMasters(masters);
        } catch (error) {
            console.error('Error:', error);
            mastersContainer.innerHTML = `<p class="error">${error.message}</p>`;
        }
    }


    function renderMasters(masters) {
        mastersContainer.innerHTML = '';

        if (masters.length === 0) {
            mastersContainer.innerHTML = '<p>No masters available</p>';
            return;
        }

        masters.forEach(master => {
            const masterCard = document.createElement('div');
            masterCard.className = 'master-card';

            const masterServices = master.services
                ? master.services.map(serviceId => {
                    const service = allServices.find(s => s._id === serviceId);
                    return service ? service.name : serviceId;
                })
                : [];

            masterCard.innerHTML = `
                <h3>${master.firstName} ${master.lastName}</h3>
                <p><strong>Email:</strong> ${master.email}</p>
                <p><strong>Phone:</strong> ${master.phone}</p>
                <div class="services-list">
                    ${masterServices.length > 0 ?
                    '<strong>Services:</strong> ' + masterServices.map(service =>
                        `<span class="service-badge">${service}</span>`
                    ).join('') :
                    '<p>No services assigned</p>'}
                </div>
                <div class="master-actions">
                    <button class="edit-btn" data-id="${master._id}">Edit</button>
                    <button class="delete-btn" data-id="${master._id}">Delete</button>
                    <button class="schedule-btn" data-id="${master._id}">Schedule</button>
                </div>
            `;

            mastersContainer.appendChild(masterCard);

            masterCard.querySelector('.edit-btn').addEventListener('click', () => editMaster(master));
            masterCard.querySelector('.delete-btn').addEventListener('click', () => deleteMaster(master._id));
        });
    }


    function editMaster(master) {
        currentEditingId = master._id;
        document.getElementById('firstName').value = master.firstName;
        document.getElementById('lastName').value = master.lastName;
        document.getElementById('email').value = master.email;
        document.getElementById('phone').value = master.phone;


        currentMasterServices = master.services || [];
        renderServicesCheckboxes(currentMasterServices);

        formTitle.textContent = 'Edit Master';
        submitBtn.textContent = 'Update Master';
        cancelBtn.style.display = 'inline-block';
    }

    async function deleteMaster(id) {
        if (!confirm('Are you sure you want to delete this master?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/masters/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete master');
            }

            loadMasters();
            if (currentEditingId === id) {
                resetForm();
            }
            alert('Master deleted successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    }

    function resetForm() {
        currentEditingId = null;
        currentMasterServices = [];
        masterForm.reset();
        renderServicesCheckboxes([]);
        formTitle.textContent = 'Add New Master';
        submitBtn.textContent = 'Add Master';
        cancelBtn.style.display = 'none';
    }


    cancelBtn.addEventListener('click', resetForm);

    function openScheduleModal(masterId, masterData) {
        currentMasterId = masterId;
        currentMasterData = masterData;
        modalMasterName.textContent = `${masterData.firstName} ${masterData.lastName}'s Schedule`;
        scheduleDatePicker.valueAsDate = new Date();
        loadMasterSchedule();
        scheduleModal.style.display = 'block';
    }

    function closeScheduleModal() {
        scheduleModal.style.display = 'none';
        currentMasterId = null;
        currentMasterData = null;
    }

    async function loadMasterSchedule() {
        if (!currentMasterId) return;

        const selectedDate = new Date(scheduleDatePicker.value);
        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);

        try {
            const response = await fetch(`http://localhost:3000/api/appointments/master/${currentMasterId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
            const appointments = await response.json();

            if (appointments && appointments.length > 0) {
                renderSchedule(appointments);
            } else {
                console.log('No appointments for this date');
                scheduleGrid.innerHTML = `<p>No appointments for this date.</p>`;
            }
        } catch (error) {
            console.error('Error loading schedule:', error);
            scheduleGrid.innerHTML = `<p class="error">Error loading schedule: ${error.message}</p>`;
        }
    }


    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('schedule-btn')) {
            const masterId = e.target.dataset.id;
            const masterCard = e.target.closest('.master-card');
            const masterData = {
                firstName: masterCard.querySelector('h3').textContent.split(' ')[0],
                lastName: masterCard.querySelector('h3').textContent.split(' ')[1]
            };
            openScheduleModal(masterId, masterData);
        }
    });

    closeModalBtn.addEventListener('click', closeScheduleModal);
    window.addEventListener('click', (e) => {
        if (e.target === scheduleModal) {
            closeScheduleModal();
        }
    });

    scheduleDatePicker.addEventListener('change', loadMasterSchedule);
    prevDayBtn.addEventListener('click', () => {
        const date = new Date(scheduleDatePicker.value);
        date.setDate(date.getDate() - 1);
        scheduleDatePicker.valueAsDate = date;
        loadMasterSchedule();
    });
    nextDayBtn.addEventListener('click', () => {
        const date = new Date(scheduleDatePicker.value);
        date.setDate(date.getDate() + 1);
        scheduleDatePicker.valueAsDate = date;
        loadMasterSchedule();
    });
    addAppointmentBtn.addEventListener('click', async () => {
        try {
            const selectedDate = new Date(scheduleDatePicker.value);
            await openAppointmentForm(selectedDate);
        } catch (error) {
            console.error('Error opening appointment form:', error);
            alert('Failed to open appointment form');
        }
    });

    function updateEndTime() {
        const selectedService = serviceSelect.options[serviceSelect.selectedIndex];
        if (selectedService.value && selectedService.dataset.duration) {
            const duration = parseInt(selectedService.dataset.duration);
            const startTime = new Date(appointmentDateTime.value);
            const endTime = new Date(startTime.getTime() + duration * 60000);
            const formattedEndTime = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            document.getElementById('appointmentEndTime').textContent = formattedEndTime;
        } else {
            document.getElementById('appointmentEndTime').textContent = '--:--';
        }
    }

    async function openAppointmentForm(slotTime = null, appointmentData = null) {
        try {
            appointmentModal.style.display = 'block';
            document.getElementById('appointmentModalTitle').textContent =
                appointmentData ? 'Edit Appointment' : 'New Appointment';

            document.getElementById('appointmentId').value = appointmentData?._id || '';
            appointmentNote.value = appointmentData?.note || '';

            clientSelect.disabled = true;
            serviceSelect.disabled = true;
            appointmentDateTime.disabled = true;

            const [clientsResponse, masterResponse] = await Promise.all([
                fetch('http://localhost:3000/api/users'),
                fetch(`http://localhost:3000/api/masters/${currentMasterId}`)
            ]);

            if (!clientsResponse.ok) throw new Error(`Failed to load clients: ${clientsResponse.status}`);
            if (!masterResponse.ok) throw new Error(`Failed to load master: ${masterResponse.status}`);

            const clientsData = await clientsResponse.json();
            const masterData = await masterResponse.json();

            if (!Array.isArray(clientsData?.data)) {
                console.error('Clients data format error:', clientsData);
                throw new Error('Invalid clients data format');
            }

            const servicesResponse = await fetch('http://localhost:3000/api/services');
            if (!servicesResponse.ok) throw new Error(`Failed to load services: ${servicesResponse.status}`);
            const allServices = await servicesResponse.json();

            const masterServices = allServices.filter(service =>
                masterData.services.includes(service._id)
            );

            const statusField = document.getElementById('statusField');
            if (appointmentData) {
                statusField.style.display = 'block';
                document.getElementById('appointmentStatus').value = appointmentData.status || 'not fullfield';
            } else {
                statusField.style.display = 'none';
            }

            clientSelect.innerHTML = '<option value="">Select client</option>' +
                clientsData.data.map(client =>
                    `<option value="${client._id}" 
                     ${appointmentData?.clientId === client._id ? 'selected' : ''}>
                     ${client.firstName} ${client.lastName}
                    </option>`
                ).join('');
            serviceSelect.innerHTML = '<option value="">Select service</option>' +
                masterServices.map(service =>
                    `<option value="${service._id}" 
                     data-duration="${service.duration}"
                     ${appointmentData?.serviceId === service._id ? 'selected' : ''}>
                     ${service.name} (${service.duration} min)
                    </option>`
                ).join('');

            if (appointmentData) {
                const utcDate = new Date(appointmentData.appointmentDate);
                const localDateTime = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
                appointmentDateTime.value = localDateTime.toISOString().slice(0, 16);
            } else if (slotTime) {
                const localSlotTime = new Date(slotTime.getTime() - slotTime.getTimezoneOffset() * 60000);
                appointmentDateTime.value = localSlotTime.toISOString().slice(0, 16);
            } else {
                appointmentDateTime.value = '';
            }


            updateEndTime();

            serviceSelect.addEventListener('change', updateEndTime);
            appointmentDateTime.addEventListener('change', updateEndTime);

            clientSelect.disabled = false;
            serviceSelect.disabled = false;
            appointmentDateTime.disabled = false;

        } catch (error) {
            console.error('Error preparing appointment form:', error);

            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = `Error: ${error.message}`;

            appointmentForm.innerHTML = '';
            appointmentForm.appendChild(errorElement);

            const retryButton = document.createElement('button');
            retryButton.textContent = 'Try Again';
            retryButton.onclick = () => openAppointmentForm(slotTime, appointmentData);
            appointmentForm.appendChild(retryButton);
        }
    }

    async function createAppointment(appointmentData) {
        try {
            const response = await fetch('http://localhost:3000/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    }

    async function updateAppointment(appointmentId, appointmentData) {
        try {
            const response = await fetch(`http://localhost:3000/api/appointments/${appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating appointment:', error);
            throw error;
        }
    }


    async function deleteAppointment(appointmentId) {
        if (!confirm('Are you sure you want to delete this appointment?')) return;

        try {
            const response = await fetch(`http://localhost:3000/api/appointments/${appointmentId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            loadMasterSchedule();
            alert('Appointment deleted successfully!');
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert(`Error: ${error.message}`);
        }
    }

    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const selectedService = serviceSelect.options[serviceSelect.selectedIndex];
        const duration = parseInt(selectedService.dataset.duration);
        const appointmentStart = new Date(appointmentDateTime.value);
        const appointmentEnd = new Date(appointmentStart.getTime() + duration * 60000);

        const salonOpenHour = 9;
        const salonCloseHour = 19;

        if (
            appointmentStart.getHours() < salonOpenHour ||
            appointmentEnd.getHours() > salonCloseHour ||
            (appointmentEnd.getHours() === salonCloseHour && appointmentEnd.getMinutes() > 0)
        ) {
            alert("Appointments are available only from 09:00 to 19:00. Check the start time and duration of the service.");
            return;
        }


        saveAppointmentBtn.disabled = true;
        saveAppointmentBtn.textContent = 'Processing...';

        try {
            if (!clientSelect.value || !serviceSelect.value || !appointmentDateTime.value) {
                throw new Error('Please fill all required fields');
            }

            const appointmentData = {
                clientId: clientSelect.value,
                masterId: currentMasterId,
                serviceId: serviceSelect.value,
                appointmentDate: new Date(appointmentDateTime.value).toISOString(),
                note: appointmentNote.value
            };

            if (document.getElementById('statusField').style.display !== 'none') {
                appointmentData.status = document.getElementById('appointmentStatus').value;
            }

            const appointmentId = document.getElementById('appointmentId').value;
            let result;

            if (appointmentId) {
                console.log(appointmentData);
                result = await updateAppointment(appointmentId, appointmentData);
                alert('Appointment updated successfully!');
            } else {
                result = await createAppointment(appointmentData);
                alert('Appointment created successfully!');
            }

            closeAppointmentModal();
            loadMasterSchedule();

        } catch (error) {
            console.error('Error saving appointment:', error);
            alert(`Error: ${error.message}`);
        } finally {
            saveAppointmentBtn.disabled = false;
            saveAppointmentBtn.textContent = 'Save';
        }
    });


    function renderSchedule(appointments) {
        scheduleGrid.innerHTML = '';

        for (let hour = 9; hour < 20; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const slotTime = new Date(scheduleDatePicker.value);
                slotTime.setHours(hour, minute, 0, 0);

                const appointment = appointments.find(app => {
                    const appStart = new Date(app.appointmentDate);
                    const appEnd = new Date(app.appointmentEnd ||
                        new Date(appStart.getTime() + app.duration * 60000));
                    return slotTime >= appStart && slotTime < appEnd;
                });

                const slot = document.createElement('div');
                slot.className = `time-slot ${appointment ? 'booked' : 'available'}`;
                slot.textContent = timeString;

                if (appointment) {
                    const service = allServices.find(s => s._id === appointment.serviceId);
                    slot.innerHTML += `
                        <div class="appointment-info">
                            <strong>${service?.name || 'Unknown service'}</strong>
                            <div>Status: ${appointment.status}</div>
                            <div class="appointment-actions">
                                <button class="edit-appointment" data-id="${appointment._id}">Edit</button>
                                <button class="delete-appointment" data-id="${appointment._id}">Delete</button>
                            </div>
                        </div>
                    `;
                } else {
                    slot.addEventListener('click', () => openAppointmentForm(slotTime));
                }

                scheduleGrid.appendChild(slot);
            }
        }

        document.querySelectorAll('.edit-appointment').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const appointmentId = e.target.dataset.id;
                try {
                    const response = await fetch(`http://localhost:3000/api/appointments/${appointmentId}`);
                    if (response.ok) {
                        const appointment = await response.json();
                        openAppointmentForm(null, appointment);
                    }
                } catch (error) {
                    console.error('Error fetching appointment:', error);
                    alert('Failed to load appointment data');
                }
            });
        });

        document.querySelectorAll('.delete-appointment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteAppointment(e.target.dataset.id);
            });
        });
    }

    function closeAppointmentModal() {
        appointmentModal.style.display = 'none';
    }

    closeAppointmentModalBtn.addEventListener('click', closeAppointmentModal);
    cancelAppointmentBtn.addEventListener('click', closeAppointmentModal);
    window.addEventListener('click', (e) => {
        if (e.target === appointmentModal) {
            closeAppointmentModal();
        }
    });
});