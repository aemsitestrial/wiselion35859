/** Highlighted Cards parent/container block. */

function getColumnClass(block) {
  const field = block.querySelector('[data-aue-prop="classes"]');
  const value = field?.getAttribute('data-aue-value') || field?.textContent || '';
  const normalized = value.trim().toLowerCase();

  if (normalized.includes('columns-2') || normalized === '2') return 'columns-2';
  return 'columns-3';
}

export default function decorate(block) {
  const columns = getColumnClass(block);

  block.classList.add('highlighted-cards', columns);

  // The Columns field is authoring metadata only. It must not be rendered.
  const columnsField = block.querySelector('[data-aue-prop="classes"]');
  columnsField?.remove();

  [...block.children].forEach((row) => row.classList.add('highlighted-cards-item'));
}
