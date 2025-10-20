const db = require('./db');
const bcrypt = require('bcrypt');

async function updatePasswords() {
  try {
    const hashedPassword = await bcrypt.hash('defaultpassword', 10); // Use a default password
    await db.query('UPDATE users SET "password" = $1 WHERE "password" IS NULL;', [hashedPassword]);
    console.log('Passwords updated successfully');
  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    process.exit();
  }
}

updatePasswords();
