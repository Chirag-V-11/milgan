const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const email = (process.argv[2] || 'info@milganfoods.com').toLowerCase();
  const password = process.argv[3] || 'Milgan@123';

  console.log(`🔐 Creating admin account for: ${email}`);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existingAdmin) {
      // Update password for existing admin
      const { error: updateError } = await supabase
        .from('admins')
        .update({ password: hashedPassword })
        .eq('email', email);

      if (updateError) {
        console.error('❌ Error updating admin:', updateError.message);
      } else {
        console.log('✅ Admin password updated successfully!');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);
      }
      return;
    }

    const { data, error } = await supabase
      .from('admins')
      .insert([{ email, password: hashedPassword }])
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
