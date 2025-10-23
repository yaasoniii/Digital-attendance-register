// LOGIN FORM VALIDATION
const logInForm = document.getElementById('logInForm');

if (logInForm) {
    const studentRadio = document.getElementById('studentRadioLogIn');
    const adminRadio = document.getElementById('adminRadioLogIn');

    const studentFields = document.querySelectorAll('.studentField');
    const adminFields = document.querySelectorAll('.adminField');

    const stNumber_input = document.getElementById('loginNumberSL');
    const password_input = document.getElementById('loginPasswordSL');
    const adminUser_input = document.getElementById('adminUsernameSL');
    const adminPass_input = document.getElementById('adminPasswordSL');

    function toggleFields() {
        if (studentRadio.checked) {
            studentFields.forEach(f => f.style.display = 'flex');
            adminFields.forEach(f => f.style.display = 'none');

            // Enable student inputs and disable admin inputs
            stNumber_input.disabled = false;
            password_input.disabled = false;
            adminUser_input.disabled = true;
            adminPass_input.disabled = true;

            adminUser_input.value = '';
            adminPass_input.value = '';
            clearError(adminUser_input, 'adminUsernameError');
            clearError(adminPass_input, 'adminPasswordError');
        } else {
            studentFields.forEach(f => f.style.display = 'none');
            adminFields.forEach(f => f.style.display = 'flex');

            // Enable admin inputs and disable student inputs
            stNumber_input.disabled = true;
            password_input.disabled = true;
            adminUser_input.disabled = false;
            adminPass_input.disabled = false;

            stNumber_input.value = '';
            password_input.value = '';
            clearError(stNumber_input, 'loginStudentNumberError');
            clearError(password_input, 'loginPasswordError');
        }
    }

    studentRadio.addEventListener('change', toggleFields);
    adminRadio.addEventListener('change', toggleFields);

    // Initialize correct view on page load
    toggleFields();

    // clear errors while typing
    stNumber_input.addEventListener('input', () => {
        if (stNumber_input.value.trim() !== '') clearError(stNumber_input, 'loginStudentNumberError');
    });
    password_input.addEventListener('input', () => {
        if (password_input.value.trim() !== '') clearError(password_input, 'loginPasswordError');
    });
    adminUser_input.addEventListener('input', () => {
        if (adminUser_input.value.trim() !== '') clearError(adminUser_input, 'adminUsernameError');
    });
    adminPass_input.addEventListener('input', () => {
        if (adminPass_input.value.trim() !== '') clearError(adminPass_input, 'adminPasswordError');
    });

    // ===== Form submission validation =====
    logInForm.addEventListener('submit', function (e) {
        toggleFields();

        let errors = [];
        const selectedType = document.querySelector('input[name="S/A"]:checked').value;

        if (selectedType === 'student') {
            errors = validateStudentLogin();
        } else if (selectedType === 'admin') {
            errors = validateAdminLogin();
        }

        if (errors.length > 0) {
            e.preventDefault();
        }
    });

    // ===== Student validation =====
    function validateStudentLogin() {
        let errors = [];

        const studentNumber = stNumber_input.value.trim();
        const password = password_input.value.trim();

        if (!studentNumber) {
            setError(stNumber_input, 'loginStudentNumberError', 'Student number is required');
            errors.push('Student number required');
        } else if (!/^\d+$/.test(studentNumber)) {
            setError(stNumber_input, 'loginStudentNumberError', 'Student number should be digits');
            errors.push('Student number must be digits');
        } else if (studentNumber.length !== 9) {
            setError(stNumber_input, 'loginStudentNumberError', 'Student number should be 9 digits');
            errors.push('Student number must be 9 digits');
        } else {
            clearError(stNumber_input, 'loginStudentNumberError');
        }

        if (!password) {
            setError(password_input, 'loginPasswordError', 'Password is required');
            errors.push('Password required');
        } else {
            clearError(password_input, 'loginPasswordError');
        }

        return errors;
    }

    // ===== Admin validation =====
    function validateAdminLogin() {
        let errors = [];

        const username = adminUser_input.value.trim();
        const password = adminPass_input.value.trim();

        if (!username) {
            setError(adminUser_input, 'adminUsernameError', 'Admin username is required');
            errors.push('Admin username required');
        } else {
            clearError(adminUser_input, 'adminUsernameError');
        }

        if (!password) {
            setError(adminPass_input, 'adminPasswordError', 'Admin password is required');
            errors.push('Admin password required');
        } else {
            clearError(adminPass_input, 'adminPasswordError');
        }

        return errors;
    }
}

function setError(input, errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
    }
    input.classList.add('incorrect');
}

function clearError(input, errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = '';
    }
    input.classList.remove('incorrect');
}