(function () {
    const DARK_KEY = 'uade_dark_mode';
    const DARK_CLASS = 'dark-mode';

    function applyDarkMode(enabled) {
        document.documentElement.classList.toggle(DARK_CLASS, !!enabled);
        localStorage.setItem(DARK_KEY, enabled ? '1' : '0');
        document.querySelectorAll('[data-dark-toggle]').forEach(el => {
            if (el.type === 'checkbox') el.checked = !!enabled;
            else el.setAttribute('aria-pressed', !!enabled);
        });
    }

    function initDarkMode() {
        const saved = localStorage.getItem(DARK_KEY);
        const enabled = saved === '1';
        applyDarkMode(enabled);

        document.querySelectorAll('[data-dark-toggle]').forEach(el => {
            el.addEventListener('click', (e) => {
                const next = el.type === 'checkbox' ? el.checked : !document.documentElement.classList.contains(DARK_CLASS);
                applyDarkMode(next);
            });
        });
    }

    function findContactForm() {
        return document.querySelector('[data-contact-form]') ||
                     document.getElementById('contactForm') ||
                     document.getElementById('form-contact') ||
                     document.querySelector('form[name="contact"]') ||
                     document.querySelector('form.contact-form');
    }

    function createErrorNode(msg) {
        const small = document.createElement('div');
        small.className = 'error-message';
        small.textContent = msg;
        return small;
    }

    function showError(input, msg) {
        clearError(input);
        const wrapper = input.closest('.form-control') || input.parentElement;
        const err = createErrorNode(msg);
        wrapper.appendChild(err);
        input.classList.add('invalid');
    }

    function clearError(input) {
        const wrapper = input.closest('.form-control') || input.parentElement;
        const existing = wrapper.querySelector('.error-message');
        if (existing) existing.remove();
        input.classList.remove('invalid');
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    }

    function initContactValidation() {
        const form = findContactForm();
        if (!form) return;

        const nameField = form.querySelector('[name="name"], #name, .name');
        const emailField = form.querySelector('[name="email"], #email, .email');
        const subjectField = form.querySelector('[name="subject"], #subject, .subject');
        const messageField = form.querySelector('[name="message"], #message, textarea[name="message"], .message');

        const fields = { name: nameField, email: emailField, subject: subjectField, message: messageField };

        Object.values(fields).forEach(f => {
            if (!f) return;
            f.addEventListener('input', () => clearError(f));
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let firstInvalid = null;
            let valid = true;

            if (fields.name) {
                if (!fields.name.value.trim()) {
                    showError(fields.name, 'El nombre es obligatorio.');
                    firstInvalid = firstInvalid || fields.name;
                    valid = false;
                }
            }

            if (fields.email) {
                if (!fields.email.value.trim()) {
                    showError(fields.email, 'El correo es obligatorio.');
                    firstInvalid = firstInvalid || fields.email;
                    valid = false;
                } else if (!validateEmail(fields.email.value)) {
                    showError(fields.email, 'Ingrese un correo válido.');
                    firstInvalid = firstInvalid || fields.email;
                    valid = false;
                }
            }

            if (fields.message) {
                if (!fields.message.value.trim()) {
                    showError(fields.message, 'El mensaje no puede estar vacío.');
                    firstInvalid = firstInvalid || fields.message;
                    valid = false;
                }
            }

            if (fields.subject && fields.subject.value.trim() && fields.subject.value.trim().length < 2) {
                showError(fields.subject, 'Asunto demasiado corto.');
                firstInvalid = firstInvalid || fields.subject;
                valid = false;
            }

            if (!valid) {
                if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
                return;
            }

            alert('Mensaje enviado exitosamente.');
            form.reset();
            Object.values(fields).forEach(f => f && clearError(f));
        });

        form.addEventListener('reset', () => {
            setTimeout(() => {
                Object.values(fields).forEach(f => f && clearError(f));
            }, 0);
        });
    }
    document.addEventListener('DOMContentLoaded', () => {
        initDarkMode();
        initContactValidation();
    });

})();