import express from 'express';
import indexRouter from './routes/index';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.Router());
app.use(cors({
  origin:'*'
}));

// app.all('*', (req, res) => {
//   res.send('CORS is enabled for all routes and methods');
// })

app.use('/api/v1', indexRouter);



app.listen(3000,()=>{
    console.log("Server is running at http://localhost:3000/api/v1/");
})
