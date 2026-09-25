export default async function decorate(block) {
  const usersApi =
    'https://38559-605crimsonvicuna-stage.adobeioruntime.net/api/v1/web/wiselion35859/api-users';

  block.innerHTML = `
    <div class="api-users-loading">
      Loading users...
    </div>
  `;

  try {
    const response = await fetch(usersApi);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const users = await response.json();

    block.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'api-users-container';

    users.forEach((user) => {
      const card = document.createElement('div');
      card.className = 'api-user-card';

      card.innerHTML = `
        <h3>${user.name}</h3>
        <p>${user.email}</p>
        <p>${user.phone}</p>
        <p>${user.company?.name || user.company}</p>
      `;

      wrapper.appendChild(card);
    });

    block.appendChild(wrapper);
  } catch (error) {
    console.error('API Users Error:', error);

    block.innerHTML = `
      <div class="api-users-error">
        Failed to load users.
      </div>
    `;
  }
}
