import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function getCellText(cell) {
  return cell?.textContent?.trim() || '';
}
 
function getImageCellPicture(cell) {
  return cell?.querySelector('picture');
}

export default function decorate(block) {
  const rows = [...block.children];
  const ul = document.createElement('ul');

  rows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const [imageCell, tagCell, titleCell, descriptionCell, ctaTextCell, ctaUrlCell] = [...row.children];

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'layout-container-card-image';
    const picture = getImageCellPicture(imageCell);

    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '1200' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrapper.append(optimizedPic);
      }
    }

    const overlay = document.createElement('div');
    overlay.className = 'layout-container-card-overlay';

    const tag = getCellText(tagCell);
    if (tag) {
      const tagEl = document.createElement('p');
      tagEl.className = 'layout-container-card-tag';
      tagEl.textContent = tag;
      moveInstrumentation(tagCell, tagEl);
      overlay.append(tagEl);
    }

    const title = getCellText(titleCell);
    if (title) {
      const titleEl = document.createElement('h3');
      titleEl.className = 'layout-container-card-title';
      titleEl.textContent = title;
      moveInstrumentation(titleCell, titleEl);
      overlay.append(titleEl);
    }

    const description = getCellText(descriptionCell);
    if (description) {
      const descriptionEl = document.createElement('p');
      descriptionEl.className = 'layout-container-card-description';
      descriptionEl.textContent = description;
      moveInstrumentation(descriptionCell, descriptionEl);
      overlay.append(descriptionEl);
    }

    const ctaText = getCellText(ctaTextCell);
    const ctaUrl = getCellText(ctaUrlCell);
    if (ctaText && ctaUrl) {
      const ctaEl = document.createElement('a');
      ctaEl.className = 'layout-container-card-cta';
      ctaEl.href = ctaUrl;
      ctaEl.textContent = ctaText;
      ctaEl.title = ctaText;
      moveInstrumentation(ctaTextCell, ctaEl);
      moveInstrumentation(ctaUrlCell, ctaEl);
      overlay.append(ctaEl);
    }

    li.append(imageWrapper, overlay);
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);

  if (!block.classList.contains('two-columns') && !block.classList.contains('three-columns') && rows.length === 5) {
    block.classList.add('three-two');
  }
}
