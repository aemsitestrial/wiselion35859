import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const FIELD_CLASSES = [
  'highlight-cards-card-image',
  'highlight-cards-card-category',
  'highlight-cards-card-body',
];

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    // classify each field div by its fixed position (image, category, text),
    // not by its content, so empty/unset fields stay visible and editable
    [...li.children].forEach((div, i) => {
      div.className = FIELD_CLASSES[i] || 'highlight-cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
