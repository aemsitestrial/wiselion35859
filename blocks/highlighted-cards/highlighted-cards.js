/** Highlighted Cards parent/container block. */
export default function decorate(block) {
  block.classList.add('highlighted-cards');
  [...block.children].forEach((row) => row.classList.add('highlighted-cards-item'));
}
