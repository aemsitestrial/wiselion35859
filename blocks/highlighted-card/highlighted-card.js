/**
 * Highlighted Card
 *
 * XWalk serializes model fields as block rows. This decorator normalizes those
 * rows into semantic card markup and supports both image and background-image
 * presentations.
 *
 * Expected authoring field order:
 * 0 image
 * 1 alt
 * 2 useAsBackground
 * 3 category
 * 4 content
 * 5 ctaText
 * 6 ctaLink
 */

function getRow(block, index) {
  return block.children[index] || null;
}

function getValue(row) {
  if (!row) return '';
  return row.textContent.trim();
}

function getRichValue(row) {
  if (!row) return '';
  const html = row.innerHTML.trim();
  return html;
}

function getBoolean(row) {
  if (!row) return false;
  const value = getValue(row).toLowerCase();
  return value === 'true' || value === '1' || value === 'yes' || value === 'on';
}

function getImageReference(row) {
  if (!row) return '';
  const link = row.querySelector('a[href]');
  if (link?.href) return link.href;

  const image = row.querySelector('img[src]');
  if (image?.src) return image.src;

  const value = getValue(row);
  return value;
}

function buildImage(src, alt, background) {
  if (!src) return null;

  const image = document.createElement('img');
  image.src = src;
  image.alt = background ? '' : alt;
  image.loading = 'lazy';
  image.decoding = 'async';
  return image;
}

export default function decorate(block) {
  const imageSrc = getImageReference(getRow(block, 0));
  const alt = getValue(getRow(block, 1));
  const background = getBoolean(getRow(block, 2));
  const category = getValue(getRow(block, 3));
  const contentHtml = getRichValue(getRow(block, 4));
  const ctaText = getValue(getRow(block, 5));
  const ctaLink = getValue(getRow(block, 6));

  block.classList.add('highlighted-card');

  if (background) {
    block.classList.add('highlighted-card--background');
  }

  block.replaceChildren();

  const media = document.createElement('div');
  media.className = 'highlighted-card__media';

  const image = buildImage(imageSrc, alt, background);
  if (image) media.append(image);

  const body = document.createElement('div');
  body.className = 'highlighted-card__body';

  if (category) {
    const categoryEl = document.createElement('div');
    categoryEl.className = 'highlighted-card__category';
    categoryEl.textContent = category;
    body.append(categoryEl);
  }

  if (contentHtml) {
    const content = document.createElement('div');
    content.className = 'highlighted-card__content';
    content.innerHTML = contentHtml;
    body.append(content);
  }

  if (ctaText && ctaLink) {
    const cta = document.createElement('a');
    cta.className = 'highlighted-card__cta';
    cta.href = ctaLink;
    cta.textContent = ctaText;
    body.append(cta);
  }

  block.append(media, body);
}
