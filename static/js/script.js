document.addEventListener("DOMContentLoaded", function() {
    const alertDanger = document.querySelector('.alert-danger');
    const alertSuccess = document.querySelector('.alert-success');

    // Ocultar alertas de erro
    if (alertDanger) {
        setTimeout(() => {
            alertDanger.style.display = 'none';
        }, 5000); // 5 segundos
    }

    // Ocultar alertas de sucesso
    if (alertSuccess) {
        setTimeout(() => {
            alertSuccess.style.display = 'none';
        }, 5000); // 5 segundos
    }
});
