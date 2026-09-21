/**
 * Highlighted Card block.
 *
 * Fields: image, alt, useAsBackground, category, content.
 */

function text(value) {
  return (value || '').trim();
}

function findByProp(block, prop) {
  return block.querySelector(`[data-aue-prop="${prop}"]`);
}

function findValue(block, prop) {
  const node = findByProp(block, prop);
  return node ? text(node.textContent) : '';
}

function findRichValue(block, prop) {
  const node = findByProp(block, prop);
  return node ? node.innerHTML.trim() : '';
}

function findReference(block, prop) {
  const node = findByProp(block, prop);
  if (!node) return '';
  const link = node.querySelector('a[href]');
  if (link?.href) return link.href;
  const image = node.querySelector('img[src]');
  if (image?.src) return image.src;
  return text(node.textContent);
}

function getValues(block) {
  const props = {
    image: findReference(block, 'image'),
    alt: findValue(block, 'alt'),
    useAsBackground: findValue(block, 'useAsBackground'),
    category: findValue(block, 'category'),
    content: findRichValue(block, 'content'),
  };

  // Fallback for preview markup without Universal Editor data attributes.
  if (!props.image && !props.category && !props.content) {
    const cells = [...block.children];
    props.image = cells[0]?.querySelector('a[href]')?.href
      || cells[0]?.querySelector('img[src]')?.src
      || text(cells[0]?.textContent);
    props.alt = text(cells[1]?.textContent);
    props.useAsBackground = text(cells[2]?.textContent);
    props.category = text(cells[3]?.textContent);
    props.content = cells[4]?.innerHTML?.trim() || '';
  }

  return props;
}

function isTrue(value) {
  return ['true', '1', 'yes', 'on'].includes(text(value).toLowerCase());
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
  const {
    image,
    alt,
    useAsBackground,
    category,
    content,
  } = getValues(block);

  const background = isTrue(useAsBackground);
  block.classList.add('highlighted-card');
  block.classList.toggle('highlighted-card--background', background);

  block.replaceChildren();

  const media = document.createElement('div');
  media.className = 'highlighted-card__media';
  const imageElement = buildImage(image, alt, background);
  if (imageElement) media.append(imageElement);

  const body = document.createElement('div');
  body.className = 'highlighted-card__body';

  if (category) {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'highlighted-card__category';
    categoryElement.textContent = category;
    body.append(categoryElement);
  }

  if (content) {
    const contentElement = document.createElement('div');
    contentElement.className = 'highlighted-card__content';
    contentElement.innerHTML = content;
    body.append(contentElement);
  }

  block.append(media, body);
}
