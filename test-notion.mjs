import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

console.log('🔍 Testing Notion Connection...\n');
console.log('Token:', process.env.NOTION_TOKEN ? `${process.env.NOTION_TOKEN.substring(0, 10)}...` : '❌ Missing');
console.log('Database ID:', DATABASE_ID || '❌ Missing');
console.log('');

if (!process.env.NOTION_TOKEN || !DATABASE_ID) {
  console.error('❌ Environment variables are missing!');
  process.exit(1);
}

try {
  console.log('📡 Fetching database structure...\n');

  // まずデータベースの構造を取得
  const database = await notion.databases.retrieve({
    database_id: DATABASE_ID,
  });

  console.log('✅ Database connected successfully!\n');
  console.log('📊 Database properties:');
  console.log(Object.keys(database.properties));
  console.log('\n');

  console.log('📡 Attempting to query database (without sort)...\n');

  const response = await notion.databases.query({
    database_id: DATABASE_ID,
  });

  console.log('✅ Success! Found', response.results.length, 'pages\n');

  if (response.results.length > 0) {
    console.log('📄 First page properties:');
    const first = response.results[0];
    console.log(JSON.stringify(first.properties, null, 2));
  } else {
    console.log('⚠️  No pages found in database. Please:');
    console.log('   1. Add at least one page to your database');
    console.log('   2. Make sure the integration is connected to the database');
    console.log('   3. In Notion, click "..." → "Connect to" → Select your integration');
  }

} catch (error) {
  console.error('❌ Error occurred:\n');
  console.error('Error code:', error.code);
  console.error('Error message:', error.message);
  console.error('\nFull error:', error);

  console.log('\n🔧 Troubleshooting steps:');
  console.log('1. Verify the integration token is correct');
  console.log('2. Verify the database ID is correct (from URL)');
  console.log('3. Make sure you\'ve connected the integration to your database:');
  console.log('   - Open your Notion database');
  console.log('   - Click "..." (more) in the top right');
  console.log('   - Click "Connect to"');
  console.log('   - Select your integration');

  process.exit(1);
}
