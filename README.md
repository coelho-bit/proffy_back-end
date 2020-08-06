# BACK-END

![logo](https://user-images.githubusercontent.com/61102108/89577781-8f5f9c80-d807-11ea-8607-fc1f8500ef69.png)

back-end of proffy project, made along **Next Level Week** #2 @Rocketseat.

## Technologies 

- TypeScript
- Node.JS
- Knex

## How to run

- Clone this repo
- Open project in some code editor
- Install dependencies with npm install
- Read the database section bellow for setting up database if some problem exists
- Run npm start or yarn start
- Now the server is running on **localhost:3333** 

## Database Help

- The Project uses knex, a query builder, it has something called migrations, this helps the table building process.
- When you open the project run:
```
  yarn knex:migrate
  or
  npm knex:migrate
```
- Now you have all the tables are built.
- If something goes wrong on the database, delete the database.sqlite file inside src/database.Then just run the knex:migrate again.

## End points

### Creating new class

- Make a post request to the **/classes** route passing through the body those data
#### **INPUT** 
  
```
  {
    "name": "Lorem Ipsum",
    "avatar":
    "https://qsdqsdfrawe.asdasd.com/u/2254731?s=400&u=eqdsqdasdqwesacdasd&v=4",
    "whatsapp": "+551691434124",
    "bio": "",
    "subject": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
    "cost": 80,
    "schedule": [
      { "week_day": 1, "from": "9:00", "to": "16:00" },
      { "week_day": 3, "from": "10:00", "to": "18:00" },
      { "week_day": 5, "from": "7:00", "to": "15:00" }
     ]
  }
```
  
### Filtering class by subject, day and time.
- Make a get request to the **/classes** route passing through query params the subject, day and time.
  
#### **INPUT** 
  
key             |  value
:-------------------------:|:-------------------------:
week_day |  5
subject |  Matemática
time |  9:00
  
- the Url will look like these :  
  
```
 http://localhost:3333/classes?week_day=5&subject=Matemática&time=9:00
```
  
#### **OUTPUT** 
- this returns a list

```
  [
    {
      "id": 4,
      "subject": "Matemática",
      "cost": 120,
      "user_id": 4,
      "name": "Joel Coelho",
      "avatar": "https://avatars1.324sgcwad.com/u/asdqw1?s=460&v=4",
      "whatsapp": "+55164343356614",
      "bio": "Professor de Matemática."
    }
  ]
```
  
### Creating a new connection
- Make a post request to **/connections** sending the user_id through the body
    
#### **INPUT** 
```
  {
    "user_id": 1
  }
```
    
### Getting connections quantity
    
- Make a get request to **/connections**
    
#### **OUTPUT**
```
  {
    "total": 259
  }
```
    
    
    
