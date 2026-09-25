export default async function decorate(block) {
  const usersApi = 'https://jsonplaceholder.typicode.com/users';

  block.innerHTML = `
    <div class="api-users-loading">
      Loading users...
    </div>
  `;

  try {
    const response = await fetch(usersApi);
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
        <p>${user.company.name}</p>
      `;

      wrapper.appendChild(card);
    });

    block.appendChild(wrapper);
  } catch (error) {
    block.innerHTML = `
      <div class="api-users-error">
        Failed to load users.
      </div>
    `;
  }
}
