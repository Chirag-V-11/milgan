const supabase = require('./src/config/supabase');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const email = process.argv[2] || 'admin@milganfoods.com';
  const password = process.argv[3] || 'admin123';

  console.log(`🔐 Creating admin account for: ${email}`);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('admins')
      .insert([{ email: email.toLowerCase(), password: hashedPassword }])
      .select();

    if (error) {
      console.error('❌ Error creating admin:', error.message);
    } else {
      console.log('✅ Admin account created successfully!');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${password}`);
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

createAdmin();
