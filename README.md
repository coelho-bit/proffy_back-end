# BACK-END **in building**

![logo](https://user-images.githubusercontent.com/61102108/89577781-8f5f9c80-d807-11ea-8607-fc1f8500ef69.png)

back-end of proffy 2.0 project, made along **Next Level Week** #2 @Rocketseat.

## Technologies 

- TypeScript
- Node.JS
- Knex

## Database Help

- The Project uses knex, a query builder, it has something called migrations, this helps the table building process.
- When you open the project run:
```
  yarn knex:migrate
  or
  npm knex:migrate
```
- Now you have all the tables builded.
- If something goes wrong on the database, delete the database.sqlite file inside src/database.Then just run the knex:migrate again.
