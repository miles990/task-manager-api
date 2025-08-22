#!/usr/bin/env node

/**
 * Database Reset Script
 * Resets the database to a clean state
 */

import migrations from '../src/core/database/migrations.js';

console.log('Resetting database...');
migrations.resetDatabase();
console.log('Database reset complete!');