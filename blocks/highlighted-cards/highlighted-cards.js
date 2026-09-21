/**
 * Highlighted Cards
 *
 * The parent block is a container. The `classes` model field supplies
 * columns-2 or columns-3 directly on the block, so no authoring-data parsing
 * is required here.
 */
export default function decorate(block) {
  block.classList.add('highlighted-cards');

  // The XWalk container model allows Highlighted Card children.
  // The CSS grid is intentionally owned by this parent block.
  [...block.children].forEach((row) => {
    row.classList.add('highlighted-cards-item');
  });
}
