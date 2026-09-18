import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// the card model emits one div per field, in this order; every text field is
// followed by its "overlay on image" checkbox
const FIELDS = [
  { className: 'highlight-cards-card-image', toggle: false },
  { className: 'highlight-cards-card-category', toggle: true },
  { className: 'highlight-cards-card-heading', toggle: true },
  { className: 'highlight-cards-card-body', toggle: true },
  { className: 'highlight-cards-card-cta', toggle: true },
];

// an unchecked checkbox may be exported as "false" or as an empty cell; treat
// anything that is not an explicit "false" as enabled so cards authored before
// the toggles existed keep the original overlay layout
function isOverlay(cell) {
  return !cell || cell.textContent.trim().toLowerCase() !== 'false';
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    const cells = [...row.children];

    const media = document.createElement('div');
    media.className = 'highlight-cards-card-media';
    const overlay = document.createElement('div');
    overlay.className = 'highlight-cards-card-overlay';
    const content = document.createElement('div');
    content.className = 'highlight-cards-card-content';

    let i = 0;
    FIELDS.forEach((field) => {
      const cell = cells[i];
      i += 1;
      if (!cell) return;
      // classify each field div by its fixed position, not by its content, so
      // empty/unset fields stay visible and editable
      cell.className = field.className;
      if (!field.toggle) {
        media.append(cell);
        return;
      }
      const toggleCell = cells[i];
      i += 1;
      (isOverlay(toggleCell) ? overlay : content).append(cell);
    });

    if (overlay.children.length) {
      media.classList.add('highlight-cards-card-media-overlay');
      media.append(overlay);
    }
    li.append(media);
    if (content.children.length) {
      li.classList.add('highlight-cards-card-split');
      li.append(content);
    }
    ul.append(li);
  });
  // the "image" reference field is authored as a plain link to the asset
  // (e.g. <a href="...avif">title</a>), not as an embedded <picture>, so
  // convert it into a real image before the optimization pass below
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
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
