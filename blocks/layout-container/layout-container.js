export default function decorate(block) {
  const rows = [...block.children];

  const title = rows[0]?.textContent?.trim();
  const description = rows[1]?.textContent?.trim();
  const ctaText = rows[2]?.textContent?.trim();

  block.innerHTML = `
    <div class="layout-container-wrapper">
      <div class="layout-container-header">
        <div>
          <h2>${title}</h2>
          <p>${description}</p>
        </div>

        #
          ${ctaText}
          <span>→</span>
        </a>
      </div>

      <div class="layout-container-content"></div>
    </div>
  `;
}
