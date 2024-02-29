const inputBar = document.getElementById('inputBar');
const suggestionsContainer = document.getElementById('suggestions');

const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur',
    'Kanpur', 'Lucknow', 'Nagpur', 'Patna', 'Indore', 'Thane', 'Bhopal', 'Ludhiana', 'Agra', 'Vadodara',
    'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
    'Navi Mumbai', 'Allahabad', 'Howrah', 'Ranchi', 'Gwalior', 'Jabalpur', 'Coimbatore', 'Vijayawada', 'Jodhpur',
    'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli', 'Dharwad', 'Bareilly', 'Moradabad',
    'Mysore', 'Gurgaon', 'Aligarh', 'Jalandhar', 'Tiruchirappalli', 'Bhubaneswar', 'Salem', 'Mira-Bhayandar',
    'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur',
    'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela',
    'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar',
    'Jammu', 'Sangli-Miraj & Kupwad', 'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya',
    'Jalgaon', 'Udaipur', 'Maheshtala', 'Tirupur', 'Davanagere', 'Kozhikode', 'Akbarpur', 'Bardhaman', 'Kulti', 'Nizamabad',
    'Parbhani', 'Tumkur', 'Hisar', 'Ozhukarai', 'Bihar Sharif', 'Panipat', 'Darbhanga', 'Bally', 'Aizawl', 'Dewas',
    'Ichalkaranji', 'Karnal', 'Bathinda', 'Jalna', 'Eluru', 'Kirari Suleman Nagar', 'Barasat', 'Purnia', 'Satna', 'Mau',
    'Sonipat', 'Farrukhabad', 'Sagar', 'Rourkela', 'Durg', 'Imphal', 'Ratlam', 'Hapur', 'Arrah', 'Anantapur', 'Karimnagar',
    'Etawah', 'Ambarnath', 'North Dumdum', 'Bharatpur', 'Begusarai', 'New Delhi', 'Gandhidham', 'Baranagar', 'Tiruvottiyur',
    'Pondicherry', 'Sikar', 'Thoothukudi', 'Rewa', 'Mirzapur', 'Raichur', 'Pali', 'Ramagundam', 'Silchar', 'Haridwar',
    'Vijayanagaram', 'Tenali', 'Nagercoil', 'Sri Ganganagar', 'Karawal Nagar', 'Mango', 'Thanjavur', 'Bulandshahr', 'Uluberia',
    'Katni', 'Sambhal', 'Singrauli', 'Nadiad', 'Secunderabad', 'Naihati', 'Yamunanagar', 'Bidhan Nagar', 'Pallavaram',
    'Bidar', 'Munger', 'Panchkula', 'Burhanpur', 'Raurkela Industrial Township', 'Kharagpur', 'Dindigul', 'Gandhinagar',
    'Hospet', 'Nangloi Jat', 'Malda', 'Ongole', 'Deoghar', 'Chapra', 'Haldia', 'Khandwa', 'Nandyal', 'Morena', 'Amroha',
    'Anand', 'Bhind', 'Bhalswa Jahangir Pur', 'Madhyamgram', 'Bhiwani', 'Berhampur', 'Ambala', 'Morbi', 'Fatehpur',
    'Raebareli', 'Khora', 'Vellore', 'Mahesana', 'Sambalpur', 'Raiganj', 'Sirsa', 'Danapur', 'Serampore', 'Sultan Pur Majra',
    'Guna', 'Jaunpur', 'Panvel', 'Shivpuri', 'Surendranagar Dudhrej', 'Unnao', 'Chinsurah', 'Alappuzha', 'Kottayam',
    'Machilipatnam', 'Shimla', 'Adoni', 'Udupi', 'Katihar', 'Proddatur', 'Jehanabad', 'Hugli-Chinsurah', 'Bhimavaram',
    'Kakinada', 'Saharsa', 'Dibrugarh', 'Kamarhati', 'Gandhidham', 'Naihati', 'English Bazar', 'Eluru', 'Begusarai',
    'Chhapra', 'Dharmavaram', 'Barasat', 'Adilabad', 'Tenali', 'Hooghly', 'Karimnagar', 'Baramula', 'Hazaribagh', 'Raiganj',
    'Uluberia', 'Katihar', 'Baharampur', 'Srirampur', 'Madhyamgram', 'Fatehpur', 'Sasaram', 'Hajipur', 'Bettiah', 'Purulia',
    'Jagdalpur', 'Balurghat', 'Champdani', 'Medinipur', 'Baidyabati', 'Darjeeling', 'Chakradharpur', 'Jharia', 'Bhatpara',
    'Bahadurgarh', 'Gangtok', 'Bongaon', 'Bakreswar', 'Baduria', 'Araku Valley', 'Amlagora', 'Arambag', 'Alipurduar',
    'Arambagh', 'Anakapalle', 'Amalapuram',
];

inputBar.addEventListener('input', function() {
    const inputText = this.value.toLowerCase();
    const filteredCities = cities.filter(city => city.toLowerCase().startsWith(inputText));
    showSuggestions(filteredCities);
});

function showSuggestions(filteredCities) {
    if (filteredCities.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    suggestionsContainer.innerHTML = '';
    filteredCities.forEach(city => {
        const suggestionElement = document.createElement('div');
        suggestionElement.classList.add('suggestion');
        suggestionElement.textContent = city;
        suggestionElement.addEventListener('click', function() {
            inputBar.value = city;
            suggestionsContainer.style.display = 'none';
        });
        suggestionsContainer.appendChild(suggestionElement);
    });

    suggestionsContainer.style.display = 'block';
}

document.addEventListener('click', function(e) {
    if (!suggestionsContainer.contains(e.target) && e.target !== inputBar) {
        suggestionsContainer.style.display = 'none';
    }
});
