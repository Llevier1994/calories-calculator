// fetch("/api/calories")
//   .then((res) => res.json())
//   .then((data) => {
//     console.log("calories data", data);
//   });

 // Get the modal element
const modal = document.getElementById('update-modal');

// Get the close button
const closeButton = document.querySelector('.close');

// Get the form element
const updateForm = document.getElementById('update-form');

let mealData;

// Function to open the modal
function openModal() {
    modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    modal.style.display = 'none';
}

// Event listener for close button click
closeButton.addEventListener('click', closeModal);

// Event listener for outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Function to populate the form fields with meal details
function populateFormFields(mealData) {
    const {
        breakfast,
        lunch,
        snack,
        dinner,
        // burned
    } = mealData;

    document.getElementById('update-breakfast').value = breakfast;
    document.getElementById('update-lunch').value = lunch;
    document.getElementById('update-snack').value = snack;
    document.getElementById('update-dinner').value = dinner;
    // document.getElementById('update-burned').value = burned;
}

// Event listener for update button click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-update')) {
        // Get the row element
        const row = e.target.closest('tr');

        // Get the meal details from the row
        mealData = {
            id: e.target.getAttribute('data-id'),
            date: new Date(row.cells[1].textContent),
            breakfast: row.cells[2].textContent,
            lunch: row.cells[3].textContent,
            snack: row.cells[4].textContent,
            dinner: row.cells[5].textContent,
            // burned: row.cells[6].textContent
        };

        console.log(mealData);

        // Populate the form fields with meal details
        populateFormFields(mealData);

        // Open the modal
        openModal();
    }
});

// Event listener for form submission
updateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get the updated meal details from the form
    const updatedMealData = {
        id: mealData.id,
        date: mealData.date,
        breakfast: document.getElementById('update-breakfast').value,
        lunch: document.getElementById('update-lunch').value,
        snack: document.getElementById('update-snack').value,
        dinner: document.getElementById('update-dinner').value,
        // calories: document.getElementById('update-burned').value
    };

    // TODO: Send updated meal details to the server to update the database
    fetch(`/api/calories/${mealData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMealData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle the response from the backend
            if (!data.error) {
                // Display success message
                showToast('Meal updated successfully!', 'success');
                populateTable();
            } else {
                // Display error message
                showToast(data.error, 'error');
            }
        })
        .catch(error => {
            // Display error message
            showToast('An error occurred. Please try again later.', 'error');
        });

    // Close the modal
    closeModal();
});
 
// Get the DOM elements for the navigation menu items and sections
const homeTab = document.getElementById('home-tab');
const addMealTab = document.getElementById('add-meal-tab');
const viewHistoryTab = document.getElementById('view-history-tab');

const homeSection = document.getElementById('home-section');
const addMealSection = document.getElementById('add-meal-section');
const viewHistorySection = document.getElementById('view-history-section');

homeTab?.classList.add('active');

showToast("Record added successfully!");

// Function to show a specific section and hide the rest
function showSection(section) {
    homeSection.style.display = 'none';
    addMealSection.style.display = 'none';
    viewHistorySection.style.display = 'none';

    section.style.display = 'block';
}

// Event listeners for navigation menu items
homeTab.addEventListener('click', function (event) {
    event.preventDefault();
    homeTab?.classList.add('active');
    addMealTab?.classList.remove('active');
    viewHistoryTab?.classList.remove('active');
    showSection(homeSection);
});

addMealTab.addEventListener('click', function (event) {
    event.preventDefault();
    homeTab?.classList.remove('active');
    addMealTab?.classList.add('active');
    viewHistoryTab?.classList.remove('active');
    showSection(addMealSection);
});

viewHistoryTab.addEventListener('click', function (event) {
    event.preventDefault();
    homeTab?.classList.remove('active');
    addMealTab?.classList.remove('active');
    viewHistoryTab?.classList.add('active');
    showSection(viewHistorySection);
});

// Show the home section by default
showSection(homeSection);

// Add an event listener to the form submit button
document.getElementById('add-meal-form').addEventListener('submit', function (event) {
    console.log("clicked");
    event.preventDefault(); // Prevent form submission

    // Retrieve input values
    const breakfast = parseInt(document.getElementById('breakfast').value);
    const lunch = parseInt(document.getElementById('lunch').value);
    const snack = parseInt(document.getElementById('snack').value);
    const dinner = parseInt(document.getElementById('dinner').value);
    const date = document.getElementById('date').value;
    // const caloriesBurned = parseInt(document.getElementById('calories-burned').value);

    // Perform calculations
    const totalCalories = breakfast + lunch + snack + dinner;
    const netCalories = document.getElementById('net-calories');

    netCalories.style.display = 'block';

    // Update total calories field
    document.getElementById('net-calories-value').textContent = totalCalories;

    // Create an object with the form data
    const formData = {
        breakfast: breakfast,
        lunch: lunch,
        snack: snack,
        dinner: dinner,
        // calories: caloriesBurned,
        totalCalories: totalCalories,
        date: new Date(date),
    };

    // Send the data to the backend
    fetch('/api/calories/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle the response from the backend
            if (!data.error) {
                // Display success message
                showToast('Meal added successfully!', 'success');
                populateTable();
            } else {
                // Display error message
                showToast(data.error, 'error');
            }
        })
        .catch(error => {
            // Display error message
            showToast('An error occurred. Please try again later.', 'error');
        });
});


function populateTable() {
    fetch('/api/calories')
        .then(response => response.json())
        .then(data => {
            console.log("calories data", data);
            // Get the history table element
            const table = document.querySelector('#history-table tbody');

            while (table.firstChild) {
                table.removeChild(table.firstChild);
            }
            // Create table rows for each history entry
            data.forEach((entry, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
        <td>${index + 1}</td>
        <td>${new Date(entry.date).toLocaleDateString()}</td>
        <td>${entry.breakfast}</td>
        <td>${entry.lunch}</td>
        <td>${entry.snack}</td>
        <td>${entry.dinner}</td>
        <td>${entry.breakfast + entry.lunch + entry.snack + entry.dinner}</td>
        <td>
          <button class="btn-update" data-id="${entry.id}">Update</button>
          <button class="btn-delete" data-id="${entry.id}">Delete</button>
        </td>
      `;
                table.appendChild(row);
            });

            // Calculate and add the totals row
            const totalsRow = document.createElement('tr');
            // totalsRow.attributes.setNamedItem('colspan', '2');
            totalsRow.innerHTML = `
      <td >Totals</td>
      <td></td>
      <td>${calculateTotal(data, 'breakfast')}</td>
      <td>${calculateTotal(data, 'lunch')}</td>
      <td>${calculateTotal(data, 'snack')}</td>
      <td>${calculateTotal(data, 'dinner')}</td>
      <td>${calculateOverallTotal(data)}</td>
      <td></td>
    `;
            table.appendChild(totalsRow);
        })
        .catch(error => console.error('Error fetching history:', error));

}

populateTable();

// Make a GET request to fetch the history data

// Helper function to calculate the total for a specific meal type
function calculateTotal(data, mealType) {
    return data.reduce((total, entry) => total + entry[mealType], 0);
}

// Helper function to calculate the overall total (calories - burned)
function calculateOverallTotal(data) {
    return data.reduce((total, entry) => total + entry.breakfast + entry.lunch + entry.snack + entry.dinner, 0);
}

// Event listener for update button click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        // Get the row element

        deleteRow(e.target.getAttribute('data-id'));

    }
});

function deleteRow(id) {
    fetch(`/api/calories/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle the response from the backend
            if (!data.error) {
                // Display success message
                showToast('Data deleted successfully!', 'error');
                populateTable();
            } else {
                // Display error message
                showToast(data.error, 'error');
            }
        })
        .catch(error => {
            // Display error message
            showToast('An error occurred. Please try again later.', 'error');
        });
}

function showToast(message, mode = "success") {
    const toastModal = document.getElementById('toast-modal');
    const toastContent = document.getElementById('toast-content');
    toastContent.textContent = message;

    toastModal.classList.add('show');
    toastContent.classList.remove('success');
    toastContent.classList.remove('error');
    toastContent.classList.remove('info');
    toastContent.classList.remove('warning');
    toastContent.classList.add(mode);



    setTimeout(() => {
        toastModal.classList.remove('show');
        toastContent.classList.remove(mode);
    }, 2000); // Hide the toast modal after 2 seconds
}