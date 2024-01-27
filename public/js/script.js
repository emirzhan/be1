document.addEventListener('DOMContentLoaded', function () {
    const countrySelect = document.getElementById('country');
    const citySelect = document.getElementById('city');
    const hotelSelect = document.getElementById('hotel');
    const adultsInput = document.getElementById('adults');
    const childrenInput = document.getElementById('children');

    // Define city and hotel options based on country
    const cityOptions = {
        usa: ['New York', 'Los Angeles'],
        uk: ['London', 'Manchester'],
        japan: ['Tokyo', 'Osaka'],
    };

    const hotelOptions = {
        usa: ['Sheraton', 'Hilton'],
        uk: ['Marriott', 'Radisson'],
        japan: ['Tokyo Hotel', 'Osaka Resort'],
    };

    // Populate city dropdown based on selected country
    countrySelect.addEventListener('change', function () {
        const selectedCountry = countrySelect.value;
        populateDropdown(citySelect, cityOptions[selectedCountry]);
    });

    // Populate hotel dropdown based on selected city
    citySelect.addEventListener('change', function () {
        const selectedCountry = countrySelect.value;
        const selectedCity = citySelect.value;
        populateDropdown(hotelSelect, hotelOptions[selectedCountry]);
    });

    // Ensure adults input is never less than 1
    adultsInput.addEventListener('input', function () {
        if (adultsInput.value < 1) {
            adultsInput.value = 1;
        }
    });

    // Ensure children input is never less than 0
    childrenInput.addEventListener('input', function () {
        if (childrenInput.value < 0) {
            childrenInput.value = 0;
        }
    });

    // Function to populate a dropdown with options
    function populateDropdown(selectElement, options) {
        // Clear existing options
        selectElement.innerHTML = '';

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = 'default';
        defaultOption.textContent = 'Choose...';
        selectElement.appendChild(defaultOption);

        // Add options from the provided array
        options.forEach(function (option) {
            const newOption = document.createElement('option');
            newOption.value = option.toLowerCase().replace(' ', '_');
            newOption.textContent = option;
            selectElement.appendChild(newOption);
        });
    }

    document.getElementById('travelForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const isValid = validateSelectedValues();

        if (isValid) {
            const formData = new FormData(event.target);
            const response = await fetch('/travelagency/calculateTour', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                displayTourResult(result);
            } else {
                console.error('Error calculating tour');
                alert('Error calculating tour. Please try again.');
            }
        } else {
            alert('Invalid selection. Please choose valid values.');
        }
    });

    function displayTourResult(result) {
        const interpretationElement = document.getElementById('interpretation');
        const reservationElement = document.getElementById('reservationStatus');
        const availabilityElement = document.getElementById('availabilityStatus');
        const availabilityInfoElement = document.getElementById('availability');
        const weatherConditionsInfoElement = document.getElementById('weatherConditions');
        const totalCostInfoElement = document.getElementById('totalCost');

        // Interpretation logic (replace this with your own interpretation)
        const direction = calculateDirection(result.weatherConditions);
        const reservationStatus = result.tourCost > 500 ? 'Confirmed' : 'Pending';
        const availabilityStatus = result.adults + result.children <= 10 ? 'Available' : 'Fully Booked';

        // Display the interpretation
        interpretationElement.textContent = `Direction: ${direction}`;
        reservationElement.textContent = `Reservation: ${reservationStatus}`;
        availabilityElement.textContent = `Availability: ${availabilityStatus}`;

        // Style the result (add your own styles as needed)
        interpretationElement.style.fontWeight = 'bold';
        reservationElement.style.fontWeight = 'bold';
        availabilityElement.style.fontWeight = 'bold';
        interpretationElement.style.color = '#007bff'; // Blue color
        reservationElement.style.color = '#28a745'; // Green color
        availabilityElement.style.color = '#dc3545'; // Red color

        // Display additional information
        availabilityInfoElement.textContent = `Availability: ${availabilityStatus}`;
        weatherConditionsInfoElement.textContent = `Weather Conditions: ${result.weatherConditions}`;
        totalCostInfoElement.textContent = `Total Cost: $${result.tourCost}`;

        // Style the new elements (add your own styles as needed)
        availabilityInfoElement.style.fontWeight = 'bold';
        weatherConditionsInfoElement.style.fontWeight = 'bold';
        totalCostInfoElement.style.fontWeight = 'bold';
        availabilityInfoElement.style.color = '#dc3545'; // Red color
        weatherConditionsInfoElement.style.color = '#007bff'; // Blue color
        totalCostInfoElement.style.color = '#28a745'; // Green color
    }

    function calculateDirection(weatherConditions) {
        // Sample logic for direction interpretation (replace this with your own logic)
        if (weatherConditions.includes('clear')) {
            return 'Sunny';
        } else if (weatherConditions.includes('rain')) {
            return 'Rainy';
        } else {
            return 'Unknown';
        }
    }

    function validateSelectedValues() {
        const countrySelect = document.getElementById('country');
        const citySelect = document.getElementById('city');
        const hotelSelect = document.getElementById('hotel');
        const adultsInput = document.getElementById('adults');
        const childrenInput = document.getElementById('children');

        return (
            countrySelect.value !== 'default' &&
            citySelect.value !== 'default' &&
            hotelSelect.value !== 'default' &&
            adultsInput.value >= 1 &&
            childrenInput.value >= 0
        );
    }
});
