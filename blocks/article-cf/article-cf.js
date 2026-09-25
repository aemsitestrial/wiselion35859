export default async function decorate(block) {
  block.innerHTML = '<p>Loading offer...</p>';

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
          callToAction
          ctaUrl
          detail {
            plaintext
          }
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
            path: '/content/dam/2026/37/cleverbadger84270/en/offers/fall-in-love-my-barista-subscription',
            variation: 'master',
          },
        }),
      },
    );

    const text = await response.text();

block.innerHTML = `
  <pre>${text}</pre>
`;

return;

    block.innerHTML = `
      <pre>${JSON.stringify(result, null, 2)}</pre>
    `;
  } catch (e) {
    block.innerHTML = `
      <pre>${e.message}</pre>
    `;
  }
}
