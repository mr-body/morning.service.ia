const axios = require('axios');

const data = {
  model: "llama3.2",
  messages: [
    {
      role: "user",
      content: "Here is a list of users with their age. Please return only those who are over 18 years old."
    },
    {
      role: "user",
      content: JSON.stringify([
        { name: "Alice", age: 25 },
        { name: "Bob", age: 17 },
        { name: "Charlie", age: 19 },
        { name: "David", age: 15 },
        { name: "Eve", age: 22 }
      ])
    }
  ],
  stream: false,
  tools: [
    {
      type: "function",
      function: {
        name: "filter_users_over_18",
        description: "Filters users who are older than 18.",
        parameters: {
          type: "object",
          properties: {
            users: {
              type: "array",
              description: "A list of users with name and age",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  age: { type: "integer" }
                },
                required: ["name", "age"]
              }
            }
          },
          required: ["users"]
        }
      }
    }
  ]
};

axios.post('http://localhost:11434/api/chat', data)
  .then(response => {
    console.log('Filtered Users:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
