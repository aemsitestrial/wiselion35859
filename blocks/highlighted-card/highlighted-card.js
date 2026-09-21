/**
 * Highlighted Card block.
 *
 * The Universal Editor model groups the card fields into three containers:
 * imageSettings, contentSettings and ctaSettings. The decorator is deliberately
 * tolerant of the serialized DOM shape so the component works in preview and
 * with Universal Editor instrumentation.
 */

function text(value) {
  return (value || '').trim();
}

function findByProp(block, prop) {
  return block.querySelector(`[data-aue-prop="${prop}"]`);
}

function findValue(block, prop, fallback = '') {
  const node = findByProp(block, prop);
  if (node) return text(node.textContent);
  return fallback;
}

function findRichValue(block, prop) {
  const node = findByProp(block, prop);
  if (node) return node.innerHTML.trim();
  return '';
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

function getGroupedValues(block) {
  const props = {
    image: findReference(block, 'image'),
    alt: findValue(block, 'alt'),
    useAsBackground: findValue(block, 'useAsBackground'),
    category: findValue(block, 'category'),
    content: findRichValue(block, 'content'),
    ctaText: findValue(block, 'ctaText'),
    ctaLink: findValue(block, 'ctaLink'),
  };

  // Fallback for preview markup where data-aue-prop is not present.
  if (!props.image && !props.category && !props.content && !props.ctaText && !props.ctaLink) {
    const groups = [...block.children];
    const imageGroup = groups[0];
    const contentGroup = groups[1];
    const ctaGroup = groups[2];
    const cells = (group) => (group ? [...group.querySelectorAll(':scope > div, :scope > p, :scope > a, :scope > img')] : []);
    const imageCells = cells(imageGroup);
    const contentCells = cells(contentGroup);
    const ctaCells = cells(ctaGroup);

    const imageCell = imageCells[0];
    const altCell = imageCells[1];
    const bgCell = imageCells[2];
    props.image = imageCell?.querySelector('a[href]')?.href || imageCell?.querySelector('img[src]')?.src || text(imageCell?.textContent);
    props.alt = text(altCell?.textContent);
    props.useAsBackground = text(bgCell?.textContent);
    props.category = text(contentCells[0]?.textContent);
    props.content = contentCells[1]?.innerHTML?.trim() || '';
    props.ctaText = text(ctaCells[0]?.textContent);
    props.ctaLink = text(ctaCells[1]?.textContent);
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
    ctaText,
    ctaLink,
  } = getGroupedValues(block);

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

  if (ctaText && ctaLink) {
    const cta = document.createElement('a');
    cta.className = 'highlighted-card__cta';
    cta.href = ctaLink;
    cta.textContent = ctaText;
    body.append(cta);
  }

  block.append(media, body);
}
