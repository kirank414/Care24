import axios from 'axios';

async function testAnswer() {
  try {
    const loginRes = await axios.post('http://localhost:3000/api/users/login', {
      email: 'admin@care24.com',
      password: 'adminpassword'
    });
    const token = loginRes.data.token;
    console.log('Admin token:', token);

    const inquiriesRes = await axios.get('http://localhost:3000/api/inquiries', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const inquiries = inquiriesRes.data;
    console.log('Fetched inquiries:', inquiries.length);

    if (inquiries.length > 0) {
      const targetInquiry = inquiries[0];
      const answerRes = await axios.put(`http://localhost:3000/api/inquiries/${targetInquiry._id}/answer`, {
        answer: 'This is a test answer from the script.'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Answer result:', answerRes.data);
    }
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testAnswer();
