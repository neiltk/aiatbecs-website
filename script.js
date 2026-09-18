const CONTACT_EMAIL = 'sthakre@aiatbecs.ca';

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function closeMobileMenu() {
  if (!mobileMenu || !mobileMenuButton) return;

  mobileMenu.classList.add('hidden');
  mobileMenuButton.setAttribute('aria-expanded', 'false');
  mobileMenuButton.setAttribute('aria-label', 'Open navigation menu');
  mobileMenuButton.innerHTML = '<i data-lucide="menu" class="h-6 w-6" aria-hidden="true"></i>';
  if (window.lucide) {
    lucide.createIcons();
  }
}

function openMobileMenu() {
  if (!mobileMenu || !mobileMenuButton) return;

  mobileMenu.classList.remove('hidden');
  mobileMenuButton.setAttribute('aria-expanded', 'true');
  mobileMenuButton.setAttribute('aria-label', 'Close navigation menu');
  mobileMenuButton.innerHTML = '<i data-lucide="x" class="h-6 w-6" aria-hidden="true"></i>';
  if (window.lucide) {
    lucide.createIcons();
  }
}

if (mobileMenuButton) {
  mobileMenuButton.addEventListener('click', function (event) {
    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }

    event.stopPropagation();
  });
}

mobileLinks.forEach(function (link) {
  link.addEventListener('click', closeMobileMenu);
});

document.addEventListener('click', function (event) {
  if (!mobileMenu || !mobileMenuButton) return;

  const clickedInsideMenu = mobileMenu.contains(event.target);
  const clickedButton = mobileMenuButton.contains(event.target);

  if (!clickedInsideMenu && !clickedButton && !mobileMenu.classList.contains('hidden')) {
    closeMobileMenu();
  }
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeMobileMenu();
  }
});

const yearNode = document.getElementById('current-year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);

  if (!field || !error) return;

  if (message) {
    field.setAttribute('aria-invalid', 'true');
    error.textContent = message;
    error.classList.remove('hidden');
  } else {
    field.removeAttribute('aria-invalid');
    error.textContent = '';
    error.classList.add('hidden');
  }
}

function validateContactForm() {
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  const consent = document.getElementById('consent');

  if (!name || !email || !message || !consent) return true;

  let firstInvalidField = null;

  showFieldError('name', '');
  showFieldError('email', '');
  showFieldError('message', '');
  showFieldError('consent', '');

  if (name.value.trim().length < 2) {
    showFieldError('name', 'Please enter your name.');
    firstInvalidField = firstInvalidField || name;
  }

  if (!email.validity.valid) {
    showFieldError('email', 'Please enter a valid email address.');
    firstInvalidField = firstInvalidField || email;
  }

  if (message.value.trim().length < 20) {
    showFieldError('message', 'Please provide at least 20 characters describing your inquiry.');
    firstInvalidField = firstInvalidField || message;
  }

  if (!consent.checked) {
    showFieldError('consent', 'Please provide consent so AIATBECS can respond to your inquiry.');
    firstInvalidField = firstInvalidField || consent;
  }

  if (firstInvalidField) {
    firstInvalidField.focus();
    return false;
  }

  return true;
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const formStatus = document.getElementById('form-status');
  const messageField = document.getElementById('message');
  const characterCount = document.getElementById('character-count');

  if (messageField && characterCount) {
    messageField.addEventListener('input', function () {
      characterCount.textContent = `${messageField.value.length} / ${messageField.maxLength}`;
    });
  }

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!formStatus) {
      return;
    }

    formStatus.classList.add('hidden');

    if (!validateContactForm()) {
      return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const company = document.getElementById('company') ? document.getElementById('company').value.trim() : '';
    const service = document.getElementById('service') ? document.getElementById('service').value : 'General consultation';
    const message = document.getElementById('message').value.trim();

    const subject = `AIATBECS inquiry: ${service}`;
    const emailBody = [
      'Hello AIATBECS,',
      '',
      'I would like to discuss the following consulting requirement.',
      '',
      `Name: ${name}`,
      `Work email: ${email}`,
      `Organization: ${company || 'Not provided'}`,
      `Area of interest: ${service}`,
      '',
      'Project overview:',
      message,
      '',
      'Regards,',
      name,
    ].join('\n');

    const mailtoUrl = `mailto=${encodeURIComponent(CONTACT_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    formStatus.className = 'mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-200';
    formStatus.textContent = 'Your email application should open with the inquiry prepared. Review the message and send it from your email application.';
    formStatus.classList.remove('hidden');
    formStatus.focus();

    window.location.href = mailtoUrl;
  });
}

if (window.lucide) {
  lucide.createIcons();
}
