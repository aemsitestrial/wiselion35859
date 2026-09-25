export default async function decorate(block) {
  block.innerHTML = '<p>Loading offer...</p>';

  const cfPath = block.textContent.trim();

  if (!cfPath) {
    block.innerHTML = '<p>No Content Fragment path configured.</p>';
    return;
  }

  const query = `
    query offerByPath(
      $path: String!,
      $variation: String!
    ) {
      offerByPath(
        _path: $path,
        variation: $variation
      ) {
        item {
          headline
          detail {
            plaintext
          }
          callToAction
          ctaUrl
        }
      }
    }
  `;

  try {
    const response = await fetch(
      'https://author-p153710-e1614654.adobeaemcloud.com/content/cq:graphql/aem-boilerplate-frescopa/endpoint.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            path: cfPath,
            variation: 'master',
          },
        }),
      },
    );

    const result = await response.json();

    const offer = result?.data?.offerByPath?.item;

    if (!offer) {
      block.innerHTML = '<p>No offer found.</p>';
      return;
    }

    const {
      headline,
      detail,
      callToAction,
      ctaUrl,
    } = offer;

    block.innerHTML = `
      <div class="article-cf-card">
        <h2>${headline}</h2>

        <p>${detail?.plaintext || ''}</p>

        ${ctaUrl}
          ${callToAction}
        </a>
      </div>
    `;
  } catch (error) {
    block.innerHTML = '<p>Failed to load offer.</p>';
  }
}
