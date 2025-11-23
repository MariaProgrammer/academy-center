const openModalButtons = document.querySelectorAll('[data-modal-open]');
const closeModalButtons = document.querySelectorAll('[data-modal-close]');
const modals = document.querySelectorAll('.modal');

// Открытие модальных окон
openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.dataset.modalOpen;
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('is-active');
            document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
        }
    });
});

// Закрытие модальных окон (по кнопке)
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
            modal.classList.remove('is-active');
            if (document.querySelectorAll('.modal.is-active').length === 0) {
                 document.body.style.overflow = ''; // Возвращаем скролл
            }
        }
    });
});

// Закрытие по клику на оверлей и по клавише Esc
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // Клик был именно по оверлею
            modal.classList.remove('is-active');
            if (document.querySelectorAll('.modal.is-active').length === 0) {
                 document.body.style.overflow = '';
            }
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.is-active');
        if (activeModal) {
            activeModal.classList.remove('is-active');
            document.body.style.overflow = '';
        }
    }
});
