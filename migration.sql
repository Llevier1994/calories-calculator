DROP TABLE IF EXISTS calories;

CREATE TABLE calories(
   id SERIAL PRIMARY KEY,
   date DATE,
   breakfast INTEGER,
   lunch INTEGER,
   snack INTEGER,
   dinner INTEGER,
   
);