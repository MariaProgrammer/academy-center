document.addEventListener('DOMContentLoaded', () => {
    async function handleFormSubmit(event) {
        event.preventDefault(); // Предотвращаем стандартную отправку формы

        // <<< НАЧАЛО ДОБАВЛЕННОГО БЛОКА ДЛЯ ВЫВОДА В КОНСОЛЬ >>>

        console.log('--- Начинаем сбор данных из формы ---');

        const formElement = event.target;

        // 1. Собираем все поля, кроме файлов, в простой JavaScript объект
        const simpleFormData = new FormData(formElement);
        const jsonData = {};
        for (const [key, value] of simpleFormData.entries()) {
            if (key !== 'files') {
                jsonData[key] = value;
            }
        }

        // 2. Получаем массив с файлами, который мы собирали отдельно
        const filesArray = formElement.formData.files;

        // 3. Выводим собранные данные в консоль в удобном виде
        console.log('Собранные данные (объект JSON):', jsonData);
        console.log('Прикрепленные файлы (массив):', filesArray);

        // <<< КОНЕЦ ДОБАВЛЕННОГО БЛОКА >>>


        // --- Дальнейший код для отправки на бэкенд остается без изменений ---

        console.log('Форма отправляется на бэкенд...');

        const formDataForBackend = new FormData();
        formDataForBackend.append('data', JSON.stringify(jsonData));

        if (filesArray && filesArray.length > 0) {
            filesArray.forEach(file => {
                formDataForBackend.append('attachments', file);
            });
        }

        // --- Блок отправки fetch ---
        // Пока что мы его закомментируем, чтобы форма реально не отправлялась
        // Когда будете готовы, можете раскомментировать его.
        /*
        try {
            const response = await fetch('/api/calculate-price', { // Замените на ваш URL
                method: 'POST',
                body: formDataForBackend,
            });
    
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
    
            const result = await response.json();
            console.log('Успешный ответ от сервера:', result);
            
            alert(`Ваша заявка принята! Примерная стоимость: ${result.price} руб.`);
    
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
        }
        */

        // Временно добавим alert, чтобы было понятно, что отправка сработала
        alert('Форма "отправлена"! Проверьте консоль разработчика (F12), чтобы увидеть собранные данные.');
    }


    // --- 1. АНИМАЦИЯ ЗАГРУЗКИ HERO-БЛОКА ---
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        setTimeout(() => { heroSection.classList.add('skeleton-visible'); }, 500);
        setTimeout(() => { heroSection.classList.add('content-loaded'); }, 2000);
        setTimeout(() => { heroSection.classList.add('highlight-visible'); }, 2500);
    }

    // --- 2. ПАРАЛЛАКС-ЭФФЕКТ ДЛЯ СТИКЕРОВ ---
    const stickers = document.querySelectorAll('.hero__sticker');
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (isDesktop && stickers.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const moveX = e.clientX - centerX;
            const moveY = e.clientY - centerY;
            window.requestAnimationFrame(() => {
                stickers.forEach(sticker => {
                    const speed = parseFloat(sticker.dataset.parallaxSpeed) || 2;
                    const offsetX = -moveX / 100 * speed;
                    const offsetY = -moveY / 100 * speed;
                    sticker.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                });
            });
        });
    }

    // --- 3. ЛОГИКА МОБИЛЬНОГО МЕНЮ ---
    const burgerBtn = document.querySelector('.header__burger-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuCloseBtn = document.querySelector('.mobile-menu__close-btn');
    const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu__nav a, .mobile-menu__footer button');
    const toggleMenu = () => {
        burgerBtn.classList.toggle('is-open');
        mobileMenu.classList.toggle('is-open');
        document.body.classList.toggle('no-scroll');
    };
    if (burgerBtn && mobileMenu && mobileMenuCloseBtn) {
        burgerBtn.addEventListener('click', toggleMenu);
        mobileMenuCloseBtn.addEventListener('click', toggleMenu);
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!e.currentTarget.hasAttribute('data-modal-open')) {
                    toggleMenu();
                }
            });
        });
    }

    // --- 4. УНИВЕРСАЛЬНАЯ ЛОГИКА МОДАЛЬНЫХ ОКОН ---
    // const openModalButtons = document.querySelectorAll('[data-modal-open]');
    // const modals = document.querySelectorAll('.modal');
    // openModalButtons.forEach(button => {
    //     button.addEventListener('click', (e) => {
    //         const modalId = e.currentTarget.dataset.modalOpen;
    //         const modal = document.getElementById(modalId);
    //         if (modal) {
    //             if (mobileMenu.classList.contains('is-open')) {
    //                 toggleMenu();
    //             }
    //             modal.classList.add('is-active');
    //             document.body.classList.add('no-scroll');
    //         }
    //     });
    // });
    // modals.forEach(modal => {
    //     modal.addEventListener('click', (e) => {
    //         if (e.target === modal || e.target.closest('[data-modal-close]')) {
    //             modal.classList.remove('is-active');
    //             if (!document.querySelector('.modal.is-active') && !mobileMenu.classList.contains('is-open')) {
    //                 document.body.classList.remove('no-scroll');
    //             }
    //         }
    //     });
    // });
    // document.addEventListener('keydown', (e) => {
    //     if (e.key === 'Escape') {
    //         const activeModal = document.querySelector('.modal.is-active');
    //         if (activeModal) {
    //             activeModal.classList.remove('is-active');
    //             if (!mobileMenu.classList.contains('is-open')) {
    //                 document.body.classList.remove('no-scroll');
    //             }
    //         }
    //     }
    // });

    // --- 4. УНИВЕРСАЛЬНАЯ ЛОГИКА МОДАЛЬНЫХ ОКОН (ФИНАЛЬНАЯ ИСПРАВЛЕННАЯ ВЕРСИЯ) ---
    const openModalButtons = document.querySelectorAll('[data-modal-open]');
    const modals = document.querySelectorAll('.modal');
    const body = document.body;

    // Универсальная функция для закрытия любого модального окна
    const closeModal = (modal) => {
        if (modal) {
            modal.classList.remove('is-active');
            if (!document.querySelector('.modal.is-active')) {
                body.classList.remove('no-scroll');
            }
        }
    };

    // Универсальная функция для открытия любого модального окна
    const openModal = (modal) => {
        if (modal) {
            modal.classList.add('is-active');
            body.classList.add('no-scroll');
        }
    };

    // 1. Открытие окон по кнопкам [data-modal-open]
    openModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = e.currentTarget.dataset.modalOpen;
            const modal = document.getElementById(modalId);
            openModal(modal);
        });
    });

    // 2. Закрытие окон
    modals.forEach(modal => {
        const overlay = modal.querySelector('.modal__overlay');
        const closeButtons = modal.querySelectorAll('[data-modal-close]');

        // Закрытие по клику на фон (оверлей)
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                // ✅ ГЛАВНОЕ ИСПРАВЛЕНИЕ:
                // Закрываем, только если клик был ТОЧНО по оверлею, а не по его дочерним элементам.
                if (e.target === overlay) {
                    closeModal(modal);
                }
            });
        }

        // Закрытие по клику на любую кнопку с атрибутом [data-modal-close]
        closeButtons.forEach(button => {
            button.addEventListener('click', () => closeModal(modal));
        });
    });

    // 3. Закрытие по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.is-active');
            closeModal(activeModal);
        }
    });




    // --- 5. ЛОГИКА ФОРМЫ РЕГИСТРАЦИИ (МАСКА + ВАЛИДАЦИЯ + ОКНО УСПЕХА) ---
    const regForm = document.getElementById('registration-form');

    if (regForm) {
        // --- Получаем ссылки на элементы ---
        const phoneInput = document.getElementById('reg-phone');
        const emailInput = document.getElementById('reg-email');
        const registerModal = document.getElementById('modal-register');
        const successModal = document.getElementById('modal-success');

        // --- Подключаем маску к полю телефона ---
        const phoneMask = IMask(phoneInput, {
            mask: '(000) 000-00-00'
        });

        // --- Обработчик отправки формы ---
        regForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Предотвращаем стандартную отправку

            let isFormValid = true;

            // --- Валидация Email ---
            const emailField = emailInput.closest('.form-field');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailField.classList.add('is-error');
                isFormValid = false;
            } else {
                emailField.classList.remove('is-error');
            }

            // --- Валидация телефона ---
            const phoneField = phoneInput.closest('.form-field');
            if (phoneMask.unmaskedValue.length !== 10) {
                phoneField.classList.add('is-error');
                isFormValid = false;
            } else {
                phoneField.classList.remove('is-error');
            }

            // --- Если вся форма валидна ---
            if (isFormValid) {
                console.log('Форма валидна! Отправляем данные:');
                console.log('Email:', emailInput.value);
                console.log('Телефон:', `+7${phoneMask.unmaskedValue}`);

                // ⭐ НОВАЯ ЛОГИКА ПОСЛЕ УСПЕШНОЙ ВАЛИДАЦИИ ⭐

                // 1. Закрываем окно регистрации
                if (registerModal) {
                    registerModal.classList.remove('is-active');
                }

                // 2. Открываем окно "Успешно"
                if (successModal) {
                    successModal.classList.add('is-active');
                }

                // 3. Очищаем форму
                regForm.reset();
                // Сбрасываем маску телефона
                phoneMask.value = '';
            }
        });
    }
    // --- 6. АНИМАЦИЯ БЛОКА ШАГОВ (STEPS) ПРИ СКРОЛЛЕ ---
    // ⭐ Логика для блока ADVANTAGES ⭐
    const advantagesSection = document.querySelector('.advantages');
    if (advantagesSection) {
        const advantagesObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                        const advantageCards = entry.target.querySelectorAll('.advantage-card');
                        advantageCards.forEach(card => {
                            const delay = card.dataset.aosDelay || '0';
                            card.style.transitionDelay = `${delay}ms`;
                        });
                    }, 2);
                    advantagesObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        advantagesObserver.observe(advantagesSection);
    }

    // --- 6. АНИМАЦИЯ БЛОКА ШАГОВ (STEPS) ПРИ СКРОЛЛЕ (ИСПРАВЛЕННАЯ ВЕРСИЯ) ---
    const stepsSection = document.querySelector('.steps');

    // Запускаем логику только если блок существует и мы на десктопе
    if (stepsSection && window.matchMedia('(min-width: 992px)').matches) {

        const stepIcons = document.querySelectorAll('.step-icon-wrapper');

        const animateOnScroll = () => {
            const triggerPoint = window.innerHeight * 0.6;

            stepIcons.forEach((icon, index) => {
                const rect = icon.getBoundingClientRect();
                const currentItem = icon.closest('.step-item');

                // Если иконка прошла триггерную точку
                if (rect.top < triggerPoint) {
                    // 1. Делаем видимым текущий шаг (карточка + иконка)
                    currentItem.classList.add('is-visible');

                    // ✅ ИЗМЕНЕНИЕ:
                    // Теперь мы СРАЗУ ЖЕ добавляем класс для роста линии ТЕКУЩЕМУ элементу.
                    // Проверяем, что это не последний элемент, так как от него линия расти не должна.
                    if (index < stepIcons.length - 1) {
                        currentItem.classList.add('line-grows');
                    }

                }
                // Если пользователь скроллит обратно вверх
                else {
                    // Убираем оба класса, чтобы анимация работала в обратную сторону
                    currentItem.classList.remove('is-visible');
                    currentItem.classList.remove('line-grows');
                }
            });
        };

        // Вешаем обработчик на событие скролла
        window.addEventListener('scroll', animateOnScroll);

        // Вызываем функцию один раз при загрузке страницы
        animateOnScroll();
    }

    // --- 8. АНИМАЦИЯ ФИНАЛЬНОГО CTA-БЛОКА ---
    const finalCtaSection = document.querySelector('.final-cta');

    if (finalCtaSection) {
        const expandingCircle = finalCtaSection.querySelector('.expanding-circle');
        const ctaContent = finalCtaSection.querySelector('.final-cta__text-wrapper');
        const ctaButton = finalCtaSection.querySelector('.cta-button');

        // Функция, которая будет выполняться при скролле
        const handleScrollAnimation = () => {
            // Получаем "прямоугольник" секции со всеми ее позициями
            const rect = finalCtaSection.getBoundingClientRect();

            // Расстояние, за которое анимация должна пройти от 0 до 100%
            // В нашем случае - это высота окна браузера
            const animDuration = window.innerHeight;

            // Вычисляем прогресс. rect.top будет уменьшаться от высоты окна до 0,
            // а затем уходить в минус. Нам нужен прогресс от 0 до 1.
            let progress = 1 - (rect.top / animDuration);

            // Ограничиваем прогресс в диапазоне [0, 1], чтобы избежать странных значений
            progress = Math.max(0, Math.min(1, progress));

            // --- Управляем анимациями на основе прогресса ---

            // 1. Масштабируем круг
            // Множитель 40 - это "магическое число", подобранное, чтобы круг
            // гарантированно перекрыл экран любого размера по диагонали.
            const scale = progress * 40;
            expandingCircle.style.transform = `translate(-50%, -50%) scale(${scale})`;

            // 2. Показываем контент
            // Контент начинает плавно появляться, когда круг уже немного вырос
            let opacity = (progress - 0.2) * 2; // Начинает появляться с 20% прогресса
            ctaContent.style.opacity = Math.max(0, Math.min(1, opacity));

            // 3. Запускаем анимацию кнопки
            // Когда фон почти полностью залит, запускаем "дразнилку"
            if (progress > 0.95) {
                ctaButton.classList.add('is-animating');
            } else {
                ctaButton.classList.remove('is-animating');
            }
        };
        // ✅ НАЧАЛО ДОБАВЛЕННОГО КОДА
        // Добавляем слушатели событий наведения мыши на кнопку

        // Когда курсор входит в область кнопки - удаляем класс анимации
        ctaButton.addEventListener('mouseenter', () => {
            ctaButton.classList.remove('is-animating');
        });

        // Когда курсор покидает область кнопки - снова запускаем логику анимации,
        // чтобы проверить, нужно ли возобновить "дразнилку".
        ctaButton.addEventListener('mouseleave', () => {
            handleScrollAnimation();
        });
        // ✅ КОНЕЦ ДОБАВЛЕННОГО КОДА

        // Наблюдатель, который включает/выключает обработчик скролла
        // для экономии ресурсов
        const authorObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Если секция в поле зрения - начинаем слушать скролл
                    window.addEventListener('scroll', handleScrollAnimation);
                } else {
                    // Если секция ушла из поля зрения - перестаем слушать
                    window.removeEventListener('scroll', handleScrollAnimation);
                }
            });
        }, {
            // Запас сверху и снизу, чтобы обработчик включался/выключался заранее
            rootMargin: '100px 0px 100px 0px'
        });

        // Начинаем наблюдать за секцией
        authorObserver.observe(finalCtaSection);
    }
    // --- 9. СЛАЙДЕР АВТОРОВ С АККОРДЕОНОМ (ИСПРАВЛЕННАЯ ВЕРСИЯ) ---

// Инициализация Swiper.js
const authorsSwiper = new Swiper('.authors-slider', {
    // ✅ ОСНОВНОЕ ИСПРАВЛЕНИЕ: Убираем direction: 'vertical' (по умолчанию он 'horizontal')
    
    // Основные параметры
    direction: 'horizontal',
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 3, // 'auto' - лучший вариант для адаптивности
    loop: true,

    // Параметры эффекта Coverflow
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 200,      // Увеличиваем глубину для эффекта перспективы
        modifier: 1,
        slideShadows: false,
    },

    // Пагинация (точки)
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

    // Навигация (стрелки)
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // Адаптивность (Breakpoints)
    breakpoints: {
        // Настройки для мобильных (до 992px)
        320: {
            slidesPerView: 1, // Показываем 1 слайд на мобильных
            spaceBetween: 20,
        },
        // Настройки для десктопа (от 992px и выше)
        992: {
            slidesPerView: 3, // Показываем 3 слайда
            spaceBetween: -80, // ✅ ВАЖНО: Отрицательное значение для "наезда" слайдов
        }
    }
});

// Логика для аккордеона (остается без изменений)
const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-item__header');
    header.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        const parentSlide = item.closest('.swiper-slide');
        parentSlide.querySelectorAll('.accordion-item').forEach(sibling => {
            sibling.classList.remove('is-open');
        });
        if (!isOpen) {
            item.classList.add('is-open');
        }
    });
});

    // --- 10. ВЕРТИКАЛЬНЫЙ 3D-СЛАЙДЕР С ДВУСТОРОННЕЙ БЛОКИРОВКОЙ СКРОЛЛА ---
    const reasonsSliderElement = document.querySelector('.reasons-slider');

    if (reasonsSliderElement) {
        // --- ШАГ 1: CSS-КЛАСС ДЛЯ БЛОКИРОВКИ ---
        // Добавляем стиль для блокировки скролла прямо из JS
        const style = document.createElement('style');
        style.innerHTML = `body.scroll-lock { overflow: hidden; }`;
        document.head.appendChild(style);

        // --- ШАГ 2: КОНФИГУРАЦИЯ SWIPER ---
        const reasonsSwiper = new Swiper(reasonsSliderElement, {
            centeredSlides: true,
            slidesPerView: 1,
            direction: 'vertical',
            speed: 800,
            grabCursor: true,
            watchSlidesProgress: true,
            loop: false,
            mousewheel: false,
            keyboard: {
                enabled: true,
            },
            effect: 'creative',
            creativeEffect: {
                prev: {
                    translate: [0, '-20%', -200],
                    rotate: [45, 0, 0],
                    opacity: 0,
                },
                next: {
                    translate: [0, '100%', 0],
                    rotate: [0, 0, 0],
                    opacity: 1,
                },
                transformOrigin: 'bottom',
            },
        });

        // --- ШАГ 3: ЛОГИКА БЛОКИРОВКИ СКРОЛЛА ---
        let lastAnimationTime = 0;

        // "Наблюдатель", который следит, когда слайдер входит в зону активации
        const reasonsObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Если слайдер достаточно виден на экране
                    if (entry.isIntersecting) {
                        // БЛОКИРУЕМ скролл страницы. Это работает при движении в любую сторону.
                        document.body.classList.add('scroll-lock');
                    } else {
                        // Если слайдер полностью ушел с экрана, на всякий случай снимаем блокировку
                        document.body.classList.remove('scroll-lock');
                    }
                });
            },
            {
                // Активировать, когда 80% слайдера видно.
                // Это хороший компромисс для разных размеров экрана.
                threshold: 0.9,
            }
        );
        reasonsObserver.observe(reasonsSliderElement);

        // --- ШАГ 4: "УМНЫЙ" ОБРАБОТЧИК СКРОЛЛА ---
        window.addEventListener('wheel', (e) => {
            // Если скролл не заблокирован, значит, мы не в зоне слайдера. Ничего не делаем.
            if (!document.body.classList.contains('scroll-lock')) {
                return;
            }

            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;

            // УСЛОВИЕ 1: ВЫХОД ИЗ СЛАЙДЕРА ВНИЗ
            // Если мы на последнем слайде и скроллим ВНИЗ...
            if (reasonsSwiper.isEnd && isScrollingDown) {
                // ...мы "отпускаем" скролл, убирая класс блокировки.
                document.body.classList.remove('scroll-lock');
                return;
            }

            // УСЛОВИЕ 2: ВЫХОД ИЗ СЛАЙДЕРА ВВЕРХ
            // Если мы на первом слайде и скроллим ВВЕРХ...
            if (reasonsSwiper.isBeginning && isScrollingUp) {
                // ...мы также "отпускаем" скролл.
                document.body.classList.remove('scroll-lock');
                return;
            }

            // Если мы дошли до сюда, значит, мы внутри слайдера.
            // Захватываем скролл, отменяя стандартное поведение страницы.
            e.preventDefault();

            // Защита от слишком частых переключений
            const now = Date.now();
            if (now - lastAnimationTime < reasonsSwiper.params.speed + 100) {
                return;
            }
            lastAnimationTime = now;

            // Переключаем слайд
            if (isScrollingDown) {
                reasonsSwiper.slideNext();
            } else if (isScrollingUp) {
                reasonsSwiper.slidePrev();
            }
        }, { passive: false });
    }
    // --- 11. МНОГОШАГОВЫЙ КАЛЬКУЛЯТОР ЦЕНЫ (ИСПРАВЛЕННАЯ ВЕРСИЯ) ---
const form = document.getElementById('price-calculator');
if (form) { // ✅ ИЗМЕНЕНО: Проверка на `form` теперь здесь, а не `!form return`

    // --- 1. DOM-ЭЛЕМЕНТЫ ---
    const steps = form.querySelectorAll('.form-step');
    const prevBtn = form.querySelector('#prev-btn');
    const nextBtn = form.querySelector('#next-btn');
    const submitBtn = form.querySelector('#submit-btn');
    const progressBarFill = form.querySelector('.progress-bar__fill');
    // ✅ 1. Находим наш span для текста
    const progressBarTextSpan = form.querySelector('.progress-bar__text span');


    // --- 2. УПРАВЛЕНИЕ СОСТОЯНИЕМ ---
    let currentStep = 1;
    const formData = {
        files: []
    };
    form.formData = formData;

    // ✅ 2. Создаем массив с текстами для каждого шага
    const stepTexts = [
        "Достигни 80% и получи 1000 руб", // Текст для шага 1
        "Уже 55%! Набери 80% и получи 1000 рублей", // Текст для шага 2
        "Отлично! Вы получите скидку 1000 рублей" // Текст для шага 3
    ];

    const updateStep = () => {
        steps.forEach(step => {
            step.style.display = step.dataset.step == currentStep ? 'block' : 'none';
        });

        // ✅ 3. Обновляем текст в span
        // Проверяем, что элемент найден, чтобы избежать ошибок
        if (progressBarTextSpan) {
            // Берем текст из массива. Так как массив начинается с 0, а шаги с 1, используем `currentStep - 1`
            progressBarTextSpan.textContent = stepTexts[currentStep - 1];
        }

        progressBarFill.style.width = `${(currentStep / steps.length) * 100}%`;
        prevBtn.style.display = currentStep > 1 ? 'inline-block' : 'none';
        nextBtn.style.display = currentStep < steps.length ? 'inline-block' : 'none';
        submitBtn.style.display = currentStep === steps.length ? 'inline-block' : 'none';

        form.dataset.currentStep = currentStep;
    };

    // --- 3. ИНИЦИАЛИЗАЦИЯ КОМПОНЕНТОВ ---
    // ... (весь ваш код для Flatpickr и бегунков остается без изменений) ...
    // ✅ ИСПРАВЛЕНИЕ ДЛЯ КАЛЕНДАРЯ
    const deadlineInput = document.getElementById('deadline');
    // Проверяем, что Flatpickr загрузился, прежде чем его использовать
    if (typeof flatpickr === 'function') {
        flatpickr(deadlineInput, {
            mode: "range",
            dateFormat: "d.m.Y", // Формат, который видит пользователь
            minDate: "today",
            locale: "ru", // Говорим библиотеке использовать русскую локализацию
            onClose: function (selectedDates) { // Используем onClose для надежности
                if (selectedDates.length === 2) {
                    const [start, end] = selectedDates;
                    const diffTime = Math.abs(end - start);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 чтобы включить оба дня

                    let daysString = "дней";
                    if (diffDays % 10 === 1 && diffDays % 100 !== 11) {
                        daysString = "день";
                    } else if ([2, 3, 4].includes(diffDays % 10) && ![12, 13, 14].includes(diffDays % 100)) {
                        daysString = "дня";
                    }

                    deadlineInput.value = `${diffDays} ${daysString}`;
                }
            }
        });
    } else {
        console.error('Библиотека Flatpickr не загружена!');
    }


    // ✅ ПРОВЕРЕННЫЙ КОД ДЛЯ БЕГУНКОВ (он у вас был правильный)
    ['pages', 'originality'].forEach(id => {
        const range = document.getElementById(`${id}-range`);
        const valueDisplay = document.getElementById(`${id}-value`);

        // Проверяем, что элементы найдены, прежде чем вешать обработчик
        if (range && valueDisplay) {
            range.addEventListener('input', () => {
                valueDisplay.textContent = `${range.value}${id === 'originality' ? '%' : ' стр'}`;
            });
        }
    });


    // --- 4. НАВИГАЦИЯ ПО ШАГАМ ---
    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length) {
            currentStep++;
            updateStep();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStep();
        }
    });


    // --- 5. ОБРАБОТКА ФАЙЛОВ (DRAG & DROP) ---
    // ... (весь ваш код для Drag & Drop остается без изменений) ...
    const dropzone = document.getElementById('file-dropzone');
    const fileInput = document.getElementById('files');
    const fileList = document.getElementById('file-list');

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('is-dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragover'));
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('is-dragover');
        handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', () => handleFiles(fileInput.files));

    const handleFiles = (files) => {
        for (const file of files) {
            formData.files.push(file);
        }
        renderFileList();
    };

    const renderFileList = () => {
        fileList.innerHTML = '';
        formData.files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-list-item';
            fileItem.innerHTML = `<span>${file.name}</span><button type="button" data-index="${index}">&times;</button>`;
            fileList.appendChild(fileItem);
        });
    };

    fileList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const index = e.target.dataset.index;
            formData.files.splice(index, 1);
            renderFileList();
        }
    });


    // --- 6. ОТПРАВКА ФОРМЫ ---
    form.addEventListener('submit', handleFormSubmit);

    updateStep(); // Инициализация начального состояния
}
    

    

    // --- 12. ЛОГИКА МОДАЛЬНОГО ОКНА С ПРОМОКОДОМ (ОБНОВЛЕННАЯ ВЕРСИЯ) ---
    const promoForm = document.getElementById('promo-form');

    if (promoForm) {
        const promoModal = document.getElementById('modal-promo');
        const successModal = document.getElementById('modal-promo-success');
        const promoInput = document.getElementById('promo-input');
        const feedbackEl = promoForm.querySelector('.modal-form__feedback');
        const fieldWrapper = promoForm.querySelector('.modal-form__field');

        const VALID_PROMO_CODE = 'LETO2025';
        console.log('Тестовый промокод:', VALID_PROMO_CODE);

        promoForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const userInput = promoInput.value.trim().toUpperCase();
            fieldWrapper.classList.remove('is-success', 'is-error');

            if (userInput === VALID_PROMO_CODE) {
                // Состояние успеха
                fieldWrapper.classList.add('is-success');
                feedbackEl.textContent = 'промокод применен';

                // ✅ НОВАЯ ЛОГИКА: Переход на окно "Успешно"
                // Ждем 1 секунду, чтобы пользователь увидел галочку
                setTimeout(() => {
                    if (promoModal) closeModal(promoModal); // Закрываем окно промокода
                    if (successModal) successModal.classList.add('is-active'); // Открываем окно успеха
                }, 1000);

            } else {
                // Состояние ошибки
                fieldWrapper.classList.add('is-error');
                feedbackEl.textContent = 'неверный промокод';
            }
        });

        promoInput.addEventListener('input', () => {
            fieldWrapper.classList.remove('is-success', 'is-error');
        });
    }
    // --- 13. ЛОГИКА МОДАЛЬНОГО ОКНА ВЫБОРА ГОРОДА ---
    const cityModal = document.getElementById('modal-city');
    if (cityModal) {
        const searchInput = document.getElementById('city-search-input');
        const cityList = document.getElementById('city-list');
        const cityItems = cityList.querySelectorAll('li');
        const cityButton = document.querySelector('.header__city span'); // Элемент, где отображается город

        // Функция поиска
        const filterCities = () => {
            const query = searchInput.value.toLowerCase().trim();

            cityItems.forEach(item => {
                const cityName = item.textContent.toLowerCase();
                if (cityName.includes(query)) {
                    item.classList.remove('is-hidden');
                } else {
                    item.classList.add('is-hidden');
                }
            });
        };

        // Вешаем обработчик на ввод в поле поиска
        searchInput.addEventListener('input', filterCities);

        // Функция выбора города
        cityList.addEventListener('click', (e) => {
            // Проверяем, что клик был по ссылке внутри списка
            if (e.target.tagName === 'A') {
                const selectedCity = e.target.textContent;
                
                // Обновляем текст на кнопке в шапке
                if (cityButton) {
                    cityButton.textContent = selectedCity;
                }
                
                // Логика закрытия окна уже встроена в HTML через data-modal-close,
                // поэтому дополнительно ничего делать не нужно.
            }
        });
    }
    
    // --- 7. ЛОГИКА ПЕРЕКЛЮЧАТЕЛЯ УСЛУГ (SERVICES TOGGLE) ---
    const toggleContainer = document.querySelector('.services-toggle');

    if (toggleContainer) {
        const toggleButtons = toggleContainer.querySelectorAll('.toggle-button');
        const glider = toggleContainer.querySelector('.toggle-glider');
        const contentBlocks = document.querySelectorAll('.services-content');

        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const currentButton = e.currentTarget;
                const view = currentButton.dataset.view;

                // --- 1. Перемещаем ползунок ---
                if (view === 'subjects') {
                    glider.style.transform = 'translateX(100%)';
                } else {
                    glider.style.transform = 'translateX(0%)';
                }

                // --- 2. Обновляем активную кнопку ---
                toggleButtons.forEach(btn => btn.classList.remove('is-active'));
                currentButton.classList.add('is-active');

                // --- 3. Переключаем контент ---
                const targetContent = document.getElementById(`view-${view}`);
                
                contentBlocks.forEach(block => block.classList.remove('is-active'));
                if (targetContent) {
                    targetContent.classList.add('is-active');
                }
            });
        });
    }
  // --- 8. ЛОГИКА PROMO BANNER ---
const promoBanner = document.querySelector('.promo-banner');


if (promoBanner) {
    const closeBannerBtn = promoBanner.querySelector('.promo-banner__close');

    closeBannerBtn.addEventListener('click', () => {
        promoBanner.classList.remove('is-visible');
    });
}
  

});
