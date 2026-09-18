import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function isOverlay(cell) {
  return !cell || cell.textContent.trim().toLowerCase() !== 'false';
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children];

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const image = cells[0];
    const overlayToggle = cells[1];
    const category = cells[2];
    const heading = cells[3];
    const description = cells[4];
    const cta = cells[5];

    const overlayEnabled = isOverlay(overlayToggle);

    const media = document.createElement('div');
    media.className = 'highlight-cards-card-media';

    const content = document.createElement('div');
    content.className = overlayEnabled ? 'highlight-cards-card-overlay' : 'highlight-cards-card-content';

    if (image) {
      image.className = 'highlight-cards-card-image';
      media.append(image);
    }

    [category, heading, description, cta].forEach((field, index) => {
      if (!field) return;
      const classes = [
        'highlight-cards-card-category',
        'highlight-cards-card-heading',
        'highlight-cards-card-body',
        'highlight-cards-card-cta',
      ];
      field.className = classes[index];
      content.append(field);
    });

    if (overlayEnabled) {
      li.classList.add('overlay');
      media.classList.add('highlight-cards-card-media-overlay');
      media.append(content);
      li.append(media);
    } else {
      li.classList.add('split');
      li.append(media);
      li.append(content);
    }

    ul.append(li);
  });

  ul.querySelectorAll('.highlight-cards-card-image a[href]').forEach((link) => {
    const img = document.createElement('img');
    img.src = link.href;
    img.alt = link.textContent.trim() || '';

    const picture = document.createElement('picture');
    picture.append(img);

    (link.closest('.button-container') || link).replaceWith(picture);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
