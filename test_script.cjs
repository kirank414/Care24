const http = require('http');

const data = JSON.stringify({
  email: 'admin@care24.com',
  password: 'adminpassword'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/users/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      const token = parsed.token;
      console.log('Got token:', token ? 'yes' : 'no');
      
      if (!token) return;
      
      // Now get inquiries
      const getReq = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/inquiries',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      }, (res2) => {
        let b2 = '';
        res2.on('data', (d) => { b2 += d; });
        res2.on('end', () => {
          const inqs = JSON.parse(b2);
          console.log('Inquiries length:', inqs.length);
          if (inqs.length > 0) {
            const first = inqs[0];
            const putData = JSON.stringify({ answer: "Test answer from script!" });
            const putReq = http.request({
              hostname: 'localhost',
              port: 3000,
              path: `/api/inquiries/${first._id}/answer`,
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(putData)
              }
            }, (res3) => {
              console.log('PUT status:', res3.statusCode);
            });
            putReq.write(putData);
            putReq.end();
          }
        });
      });
      getReq.end();
    } catch(e) { console.error('Error:', e); }
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
