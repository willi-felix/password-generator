$(document).ready(function() {
    // Update the displayed length value based on the range input
    $('#length').on('input', function() {
        const lengthValue = $(this).val();
        $('#length-value').text(lengthValue);
    });

    // Handle the click event for the "Generate" button
    $('#generate-btn').click(function() {
        const length = $('#length').val();
        const include_uppercase = $('#uppercase').is(':checked');
        const include_digits = $('#digits').is(':checked');
        const include_special = $('#special').is(':checked');
        const password_name = $('#password_name').val();

        // Make AJAX call to generate password
        $.ajax({
            url: '/generate',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                length: parseInt(length),
                include_uppercase: include_uppercase,
                include_digits: include_digits,
                include_special: include_special,
                password_name: password_name
            }),
            success: function(response) {
                $('#password').val(response.password);

                // Show success alert
                Swal.fire({
                    title: 'Password Created!',
                    html: 'Your password has been saved in password-created.txt in your <a href="https://github.com/willi-felix/password-generator" target="_blank">GitHub project</a>.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    background: '#fff',
                    customClass: {
                        popup: 'swal-popup'
                    }
                });

                // Enable the "Copy Password" button after generation
                $('#copyPasswordBtn').prop('disabled', false);
            }
        });
    });

    // Handle the click event for the "Copy Password" button
    $('#copyPasswordBtn').click(function() {
        const password = $('#password').val();
        if (password) {
            // Create a temporary textarea element to copy the text
            const tempInput = document.createElement('textarea');
            tempInput.value = password;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);

            // Show copy confirmation alert
            Swal.fire({
                title: 'Copied!',
                text: 'The password has been copied to your clipboard.',
                icon: 'success',
                confirmButtonText: 'OK',
                background: '#fff',
                customClass: {
                    popup: 'swal-popup'
                }
            });
        } else {
            Swal.fire({
                title: 'No Password!',
                text: 'Please generate a password first.',
                icon: 'warning',
                confirmButtonText: 'OK',
                background: '#fff',
                customClass: {
                    popup: 'swal-popup'
                }
            });
        }
    });

    // Handle the click event for the "Restart" button
    $('#restart-btn').click(function() {
        $('#generate-btn').click();
    });
});

// Create or update a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + ";" + expires + ";path=/";
}

// Read a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Delete a cookie
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

// On page load, delete old cookies and set a new one
$(document).ready(function() {
    eraseCookie('lastVisit');
    const now = new Date();
    const dateString = `${now.getHours()}:${now.getMinutes()} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    setCookie('lastVisit', dateString, 1);
});
