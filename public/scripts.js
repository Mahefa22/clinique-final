document.addEventListener('DOMContentLoaded', () => {
    const patientForm = document.getElementById('patientForm');
    const patientList = document.getElementById('patientList');

    const popupForm = document.getElementById('popupForm');
    const editPatientForm = document.getElementById('editPatientForm');

    const editName = document.getElementById('editName');
    const editFirstName = document.getElementById('editFirstName');
    const editAge = document.getElementById('editAge');
    const editComment = document.getElementById('editComment');
    const editNumber = document.getElementById('editNumber');
    const editConsultationDay = document.getElementById('editConsultationDay');
    const closePopup = document.getElementById('closePopup');

    // matrice hi-stockena patients
    let patients = [];
    let currentEditIndex = null;

    // maka patients   avy @ serveur
    fetch('/patients')
        .then(response => response.json())
        .then(data => {
            patients = data;
            updatePatientList();
        })
        .catch(error => console.error('Error loading patients:', error));

    if (patientForm) {
        // modifier, submit
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

            //ajouter un patient
            patients.push(patient);

            //sauvegarde sur le server
            savePatients();

            // effacer
            patientForm.reset();

            // mise a jour de la liste
            updatePatientList();
        });
    }

    // sauvegarger l'inscription
    editPatientForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const updatedPatient = {
            name: editName.value,
            firstName: editFirstName.value,
            age: editAge.value,
            comment: editComment.value,
            number: editNumber.value,
            consultationDay: editConsultationDay.value
        };

        // mampiditra patient
        patients[currentEditIndex] = updatedPatient;

        // mienregistré any @ serveur
        savePatients();

        // mise a jour ana patietns
        updatePatientList();

        // manakatona popup
        closePopupForm();
    });

    closePopup.addEventListener('click', closePopupForm);

    function openPopupForm(index) {
        const patient = patients[index];
        currentEditIndex = index;
        editName.value = patient.name;
        editFirstName.value = patient.firstName;
        editAge.value = patient.age;
        editComment.value = patient.comment;
        editNumber.value = patient.number;
        editConsultationDay.value = patient.consultationDay;

        popupForm.classList.add('active');
    }

    function closePopupForm() {
        popupForm.classList.remove('active');
    }

    // mise a jour des patients
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
                <td class="action-buttons" >
                    <button class="edit" onclick="editPatient(${index})">Editer</button>
                    <button class="delete" onclick="deletePatient(${index})">Supprimer</button>
                </td>
            `;

            tbody.appendChild(row);
        });
    }

    // fonction mi-enregistrer anaty serveur
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

    // Function pour editer un patient
    window.editPatient = (index) => {
        openPopupForm(index);
    };

    // Function pour supprimer un patient
    window.deletePatient = (index) => {
        // manala patients anaty matrice
        patients.splice(index, 1);

        // sauvegarde
        savePatients();

        // mise a jour de la liste
        updatePatientList();
    };
});
