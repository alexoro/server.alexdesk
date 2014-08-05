The tests are expects that the database is already created with required schema.
What to do with *.sql files:
1) _sql_schema.sql - this is just an informational file. It is not used by tests
2) _sql_clear.sql - list of TRUNCATE commands to clear the database state
3) _sql_data.sql - mock data