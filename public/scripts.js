document.addEventListener('DOMContentLoaded', () => {
    const patientForm = document.getElementById('patientForm');
    const patientList = document.getElementById('patientList');

    // Array to store patient information
    let patients = [];

    // Fetch patients from the server
    fetch('/patients')
        .then(response => response.json())
        .then(data => {
            patients = data;
            updatePatientList();
        })
        .catch(error => console.error('Error loading patients:', error));

    // Handle form submission
    patientForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const patient = {
            name: event.target.name.value,
            firstName: event.target.firstName.value,
            age: event.target.age.value,
            comment: event.target.comment.value,
            number: event.target.number.value,
            consultationDay: event.target.consultationDay.value
        };

        // Add patient to the array
        patients.push(patient);

        // Save to server
        savePatients();

        // Update the patient list
        updatePatientList();

        // Clear the form
        patientForm.reset();
    });
// Function to update the patient list
function updatePatientList() {
    const tbody = document.getElementById('patientList');
    tbody.innerHTML = '';
    
    patients.forEach((patient, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${patient.name}</td>
            <td>${patient.firstName}</td>
            <td>${patient.age}</td>
            <td>${patient.comment}</td>
            <td>${patient.number}</td>
            <td>${patient.consultationDay}</td>
            <td class="action-buttons">
                <button class="edit" onclick="editPatient(${index})">Edit</button>
                <button class="delete" onclick="deletePatient(${index})">Delete</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}



    // Function to save patients to the server
    function savePatients() {
        fetch('/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patients)
        })
        .then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error('Error saving patients:', error));
    }

    // Function to edit a patient
    window.editPatient = (index) => {
        const patient = patients[index];
        patientForm.name.value = patient.name;
        patientForm.firstName.value = patient.firstName;
        patientForm.age.value = patient.age;
        patientForm.comment.value = patient.comment;
        patientForm.number.value = patient.number;
        patientForm.consultationDay.value = patient.consultationDay;

        // Remove the patient from the array
        patients.splice(index, 1);

        // Save to server
        savePatients();

        // Update the patient list
        updatePatientList();
    };

    // Function to delete a patient
    window.deletePatient = (index) => {
        // Remove the patient from the array
        patients.splice(index, 1);

        // Save to server
        savePatients();

        // Update the patient list
        updatePatientList();
    };
});
