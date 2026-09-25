async function main(params) {
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/users',
    );

    const users = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: users,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        error: error.message,
      },
    };
  }
}

exports.main = main;