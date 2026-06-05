import axios from 'axios';

async function test() {
  const testEmailUser = `test.user.${Date.now()}@test.com`;
  const testEmailCg = `test.cg.${Date.now()}@test.com`;
  
  console.log('Testing User/Patient Signup...');
  try {
    const resUser = await axios.post('http://localhost:3000/api/auth/signup', {
      name: 'Test Patient',
      email: testEmailUser,
      phone: '+1555019999',
      password: 'Password123!',
      role: 'user'
    });
    console.log('Patient signup response status:', resUser.status);
    console.log('Patient signup response data:', resUser.data);
  } catch (err: any) {
    console.error('Patient signup failed:', err.response?.data || err.message);
  }

  console.log('\nTesting Caregiver Signup...');
  try {
    const resCg = await axios.post('http://localhost:3000/api/auth/signup', {
      name: 'Test Caregiver',
      email: testEmailCg,
      phone: '+1555018888',
      password: 'Password123!',
      role: 'caregiver'
    });
    console.log('Caregiver signup response status:', resCg.status);
    console.log('Caregiver signup response data:', resCg.data);
  } catch (err: any) {
    console.error('Caregiver signup failed:', err.response?.data || err.message);
  }
}

test();
