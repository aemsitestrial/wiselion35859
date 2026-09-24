export default async function decorate(block) {
  block.innerHTML = `
    <div class="loading">
      Loading users...
    </div>
  `;

  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/users',
    );

    const users = await response.json();

    const cards = users.map((user) => `
      <div class="user-card">
        <h3>${user.name}</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Company:</strong> ${user.company.name}</p>
        <p><strong>City:</strong> ${user.address.city}</p>
      </div>
    `);

    block.innerHTML = `
      <div class="users-wrapper">
        ${cards.join('')}
      </div>
    `;
  } catch (error) {
    block.innerHTML = `
      <div class="error">
        Failed to load users.
      </div>
    `;
  }
}
