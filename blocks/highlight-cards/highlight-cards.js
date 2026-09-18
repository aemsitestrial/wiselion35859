export default function decorate(block) {
  const cards = [...block.children];
  const ul = document.createElement('ul');

  cards.forEach((row) => {
    const li = document.createElement('li');
    const cells = [...row.children];

    const image = cells[0];
    const overlay = cells[1]?.textContent?.trim()?.toLowerCase() !== 'false';
    const category = cells[2];
    const text = cells[3];
    const cta = cells[4];

    li.classList.add(overlay ? 'overlay' : 'split');

    if (image) image.classList.add('highlight-card-image');
    if (category) category.classList.add('highlight-card-category');
    if (text) text.classList.add('highlight-card-text');
    if (cta) cta.classList.add('highlight-card-cta');

    if (overlay) {
      const content = document.createElement('div');
      content.className = 'highlight-card-overlay';
      [category, text, cta].forEach((el) => el && content.append(el));
      if (image) li.append(image);
      li.append(content);
    } else {
      [image, category, text, cta].forEach((el) => el && li.append(el));
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
