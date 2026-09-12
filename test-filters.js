const fs = require('fs');
fetch('https://solve.ivy.homes/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-api-key': 'IVY26-A196B34278FF' },
  body: JSON.stringify({ email: 'demo1@ivy.homes', password: '14d181752b' })
}).then(res => res.json()).then(data => {
  fetch('https://solve.ivy.homes/v1/listings?bedroom=3&limit=5', {
    headers: { 'Authorization': 'Bearer ' + data.access_token, 'x-api-key': 'IVY26-A196B34278FF' }
  }).then(r => r.json()).then(d => console.log(d.results.map(r => r.bedroom)));
});
