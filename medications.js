const catalogRoot = document.querySelector('#product-catalog');
const catalogCount = document.querySelector('#catalog-count');
const paginationContainers = [
  document.querySelector('#catalog-pagination'),
  document.querySelector('#catalog-pagination-bottom'),
];
const searchInput = document.querySelector('#catalog-search');
const categoryFilters = document.querySelector('#category-filters');
const dosageFilters = document.querySelector('#dosage-filters');
const availabilityFilters = document.querySelector('#availability-filters');
const clearButton = document.querySelector('#catalog-clear');
const catalogControls = document.querySelector('#catalog-controls');
const medicationDialog = document.querySelector('#medication-dialog');
const dialogContent = document.querySelector('#medication-dialog-content');
const dialogClose = document.querySelector('#medication-dialog-close');

const makeElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

const makeFilterOption = (name, value, count) => {
  const label = makeElement('label', 'catalog-filter-option');
  const checkbox = makeElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = name;
  checkbox.value = value;

  const text = makeElement('span', 'catalog-filter-label');
  text.append(
    makeElement('span', '', value),
    makeElement('span', 'catalog-filter-count', String(count)),
  );
  label.append(checkbox, text);
  return label;
};

const searchTextFor = (product) => {
  const internalNames = product.detail.available_options
    .flatMap((option) => option.catalog_names || []);
  const strengths = product.detail.available_options
    .flatMap((option) => option.strengths || []);

  return [
    product.name,
    ...product.search_terms,
    ...product.filters.categories,
    ...product.filters.dosage_forms,
    ...product.filters.availability,
    ...internalNames,
    ...strengths,
  ].join(' ').toLocaleLowerCase();
};

const renderProductCard = (product) => {
  const card = makeElement('article', 'medication-card');
  const body = makeElement('div', 'medication-card-body');
  const title = makeElement('h3', 'medication-card-title', product.card.title);
  const category = makeElement(
    'p',
    'medication-card-category',
    product.filters.categories[0] || 'Specialty Medication',
  );
  const forms = makeElement(
    'p',
    'medication-card-forms',
    product.card.dosage_forms.join(' · '),
  );
  const button = makeElement('button', 'medication-card-link', 'View Medication');
  button.type = 'button';
  button.addEventListener('click', () => openMedication(product));

  body.append(title, category, forms);
  card.append(body, button);
  return card;
};

const renderOption = (option) => {
  const optionCard = makeElement('section', 'medication-option');
  const heading = makeElement('div', 'medication-option-heading');
  heading.append(
    makeElement('h3', '', option.dosage_form),
    makeElement('span', 'medication-packaging', option.packaging),
  );

  const meta = makeElement('div', 'medication-option-meta');
  option.availability.forEach((availability) => {
    meta.append(makeElement('span', 'medication-availability-tag', availability));
  });
  if (option.sterile) {
    meta.append(makeElement('span', 'medication-sterile-tag', 'Sterile'));
  }

  const strengthHeading = makeElement('h4', '', 'Available strengths');
  const strengthList = makeElement('ul', 'medication-strength-list');
  if (option.strengths.length) {
    option.strengths.forEach((strength) => {
      strengthList.append(makeElement('li', '', strength));
    });
  } else {
    strengthList.append(makeElement('li', '', 'Contact the pharmacy for available strengths.'));
  }

  optionCard.append(heading, meta, strengthHeading, strengthList);
  return optionCard;
};

const openMedication = (product) => {
  const eyebrow = makeElement('p', 'eyebrow', 'Medication details');
  const title = makeElement('h2', '', product.detail.title);
  title.id = 'medication-dialog-title';
  const intro = makeElement(
    'p',
    'medication-dialog-intro',
    'Available dosage forms, packaging, strengths, and preparation types are listed below.',
  );
  const options = makeElement('div', 'medication-options');
  product.detail.available_options.forEach((option) => {
    options.append(renderOption(option));
  });

  const note = makeElement(
    'p',
    'medication-dialog-note',
    'Availability requires a valid prescription and may vary. Contact Tower Medic Pharmacy for current options.',
  );
  dialogContent.replaceChildren(eyebrow, title, intro, options, note);
  medicationDialog.showModal();
};

const showMessage = (message) => {
  catalogRoot.replaceChildren(makeElement('p', 'catalog-message', message));
};

const catalogData = window.MEDICATION_CATALOG;

if (catalogData && Array.isArray(catalogData.products)) {
  const products = catalogData.products
    .slice()
    .sort((a, b) => a.card.title.localeCompare(b.card.title));
  products.forEach((product) => {
    product.searchText = searchTextFor(product);
  });

  const filterConfig = [
    ['category', categoryFilters, catalogData.catalog.filter_options.categories, 'categories'],
    ['dosage', dosageFilters, catalogData.catalog.filter_options.dosage_forms, 'dosage_forms'],
    ['availability', availabilityFilters, catalogData.catalog.filter_options.availability, 'availability'],
  ];

  filterConfig.forEach(([name, container, values, field]) => {
    values.forEach((value) => {
      const count = products.filter((product) => product.filters[field].includes(value)).length;
      container.append(makeFilterOption(name, value, count));
    });
  });

  const selectedValues = (name) => [
    ...document.querySelectorAll(`input[name="${name}"]:checked`),
  ].map((input) => input.value);

  const pageSize = 12;
  let currentPage = 1;

  const renderPagination = (pageCount) => {
    paginationContainers.forEach((container) => container.replaceChildren());
    if (pageCount <= 1) return;

    paginationContainers.forEach((container) => {
      for (let page = 1; page <= pageCount; page += 1) {
        const button = makeElement('button', 'catalog-page-button', String(page));
        button.type = 'button';
        button.setAttribute('aria-label', `Page ${page}`);
        if (page === currentPage) {
          button.classList.add('active');
          button.setAttribute('aria-current', 'page');
        }
        button.addEventListener('click', () => {
          currentPage = page;
          renderCatalog();
        });
        container.append(button);
      }
    });
  };

  const renderCatalog = () => {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const selectedCategories = selectedValues('category');
    const selectedDosages = selectedValues('dosage');
    const selectedAvailability = selectedValues('availability');

    const matches = products.filter((product) => {
      const matchesSearch = !query || product.searchText.includes(query);
      const matchesCategory = !selectedCategories.length
        || selectedCategories.some((value) => product.filters.categories.includes(value));
      const matchesDosage = !selectedDosages.length
        || selectedDosages.some((value) => product.filters.dosage_forms.includes(value));
      const matchesAvailability = !selectedAvailability.length
        || selectedAvailability.some((value) => product.filters.availability.includes(value));
      return matchesSearch && matchesCategory && matchesDosage && matchesAvailability;
    });

    const pageCount = Math.max(1, Math.ceil(matches.length / pageSize));
    currentPage = Math.min(currentPage, pageCount);
    const pageStart = (currentPage - 1) * pageSize;
    const visibleProducts = matches.slice(pageStart, pageStart + pageSize);

    catalogRoot.replaceChildren(...visibleProducts.map(renderProductCard));
    catalogCount.textContent = `${matches.length} ${matches.length === 1 ? 'medication' : 'medications'}`;
    renderPagination(pageCount);

    if (!matches.length) {
      showMessage('No medications match those filters. Try another search or clear the filters.');
    }
  };

  searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderCatalog();
  });
  catalogControls.addEventListener('change', () => {
    currentPage = 1;
    renderCatalog();
  });
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    catalogControls.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.checked = false;
    });
    currentPage = 1;
    renderCatalog();
  });

  renderCatalog();
  catalogRoot.setAttribute('aria-busy', 'false');
} else {
  catalogCount.textContent = 'Catalog unavailable';
  showMessage('We could not load the medication catalog. Please call 817-710-8027 for product information.');
  catalogRoot.setAttribute('aria-busy', 'false');
}

dialogClose.addEventListener('click', () => medicationDialog.close());
medicationDialog.addEventListener('click', (event) => {
  if (event.target === medicationDialog) medicationDialog.close();
});
