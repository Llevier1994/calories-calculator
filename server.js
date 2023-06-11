import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";

//console.log("before", process.env.DATABASE_URL);
dotenv.config();
//console.log("after", process.env.DATABASE_URL);

const app = express();

// TODO: Replace with process.env.DATABASE_URL
// Format: postgres://USER:PASSWORD@HOST:PORT/DATABASE

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
// const sql = postgres("postgres://localhost/example_db");

app.use(express.static("./public"));
app.use(express.json());
app.use(cors());

app.get("/api/calories", (_, res) => {
  db.query("SELECT * FROM calories").then((data) => {
    console.log(data.rows);
    res.json(data.rows);
  }); 
});

app.get("/api/calories/:id", (req, res) =>{
    const id  = Number(req.params.id);
    if(Number.isNaN(id)){
        res.sendStatus(422);
        return;
    }
    db.query("SELECT * FROM calories WHERE id = $1", [id]).then((result) => {
        if(result.rows.length === 0) {
         res.sendStatus(404);
        }else{
        res.send(result.rows[0]);
        }
    });  
});

app.post("/api/calories", (req, res) => {
  const {date, breakfast, lunch, snack, dinner} = req.body;
  if (isNaN(Date.parse(date))|| 
  Number.isNaN(breakfast) || 
  Number.isNaN(lunch) || 
  Number.isNaN(snack)|| 
  Number.isNaN(dinner)){
      res.sendStatus(422);
      return;
  }

db.query("INSERT INTO calories (date, breakfast, lunch, snack, dinner) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
[date, breakfast, lunch, snack, dinner ]
).then(result => {
    res.status(201).send(result.rows[0]);
  });
});

app.delete("/api/calories/:id", (req, res) =>{
  const id  = Number(req.params.id);
  if(Number.isNaN(id)){
      res.sendStatus(422);
      return;
  }
  db.query("DELETE FROM calories WHERE id = $1 RETURNING *", [id]).then(result =>{
     if(result.rows.length === 0){
      res.sendStatus(404);
     }else{
      res.send(result.rows[0]);
     }
  });
});

app.patch("/api/calories/:id", (req, res) => {
    const id = Number(req.params.id);
    const {date, breakfast, lunch, snack, dinner} = req.body;
    if ((!date && !breakfast && !lunch && !snack && !dinner) ||
   (Number.isNaN(Date.parse(date))|| 
    Number.isNaN(breakfast)|| 
    Number.isNaN(lunch) || 
    Number.isNaN(snack)|| 
    Number.isNaN(dinner))
    ){
      res.sendStatus(422);
        return;
    }

    db.query("UPDATE calories SET date =COALESCE($1, date), breakfast =COALESCE($2, breakfast), lunch =COALESCE($3, lunch), snack =COALESCE($4, snack), dinner =COALESCE($5, dinner) WHERE id = $6 RETURNING *", 
    [date, breakfast, lunch, snack, dinner, id]
    ).then((result) => {
        if(result.rows.length === 0){
            res.sendStatus(404);
        }else{
        res.send(result.rows[0]);
        }
    });
});

// TODO: Replace 3000 with process.env.PORT
app.listen(4000, () => {
  console.log(`listening on Port 4000`);
});