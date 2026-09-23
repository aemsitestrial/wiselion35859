import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const FIELD_CLASSES = [
  'highlight-cards-card-image',
  'highlight-cards-card-category',
  'highlight-cards-card-heading',
  'highlight-cards-card-body',
  'highlight-cards-card-cta',
];

export default function decorate(block) {
  let columnCount = 2;

  // Read configuration row and remove it from rendering
  const configRow = block.firstElementChild;

  if (configRow) {
    const value = Number(configRow.textContent.trim());

    if ([2, 3, 4].includes(value)) {
      columnCount = value;
    }

    configRow.remove();
  }

  block.classList.add(`col-${columnCount}`);

  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    moveInstrumentation(row, li);

    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    [...li.children].forEach((div, i) => {
      div.className = FIELD_CLASSES[i] || 'highlight-cards-card-body';
    });

    ul.append(li);
  });

  ul.querySelectorAll('.highlight-cards-card-image a[href]').forEach((link) => {
    const img = document.createElement('img');

    img.src = link.href;
    img.alt = link.title || link.textContent.trim() || '';

    moveInstrumentation(link, img);

    const picture = document.createElement('picture');
    picture.append(img);

    (link.closest('.button-container') || link).replaceWith(picture);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '750' }],
    );

    moveInstrumentation(img, optimizedPic.querySelector('img'));

    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
