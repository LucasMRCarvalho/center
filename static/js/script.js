document.addEventListener("DOMContentLoaded", function() {
    // Notificações usando Toastr
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        const category = alert.classList.contains('alert-success') ? 'success' : 'error';
        const message = alert.textContent.trim();

        if (message) {
            if (category === 'success') {
                toastr.success(message);
            } else {
                toastr.error(message);
            }
        }

        alert.remove(); // Remove a div do DOM após mostrar a notificação
    });
});