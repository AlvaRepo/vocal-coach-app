import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fwfrhoxyeruvdljhlfik.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3ZnJob3h5ZXJ1dmRsamhsZmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzOTUyNDMsImV4cCI6MjA5MTk3MTI0M30.D8LBB3wEgudZyKM1txYFDT_DvB1Z1i1WO9bAry2wKR0'
);

async function createGuest() {
  const randomSuffix = Math.floor(Math.random() * 10000);
  const email = `guest${randomSuffix}@vocalcoach.io`;
  const password = 'guestpassword123';

  console.log(`Intentando crear cuenta invitada: ${email}`);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  } else {
    console.log(`SUCCESS: Cuenta creada.`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  }
}

createGuest();
