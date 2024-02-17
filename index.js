const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();
app.use(express.json()); // for parsing application/json middleware between req and res

//middleware 1
app.use((req, res, next) => {
    console.log('Hello from middleware');
    next();
});
//logs every request to the console in a pretty format
app.use(morgan('dev')); 
//middleware 2
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})



const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//Tour functions
const getAllTours =  (req, res) => {
    console.log(req.requestTime);

    res.status(200).json({ staus: 'success', results:tours.length, data: tours, reqestedAt:req.requestTime });
  }

const getTour = (req,res)=>{

    const id  = req.params.id * 1;

    if(id > tours.length){
        return res.status(404).json({status:"Failed", message:"cannot find id" });
    }
    const tour = tours.find(tour => tour.id === id);

    res.status(201).json({
        status:"success",
        data : {
            tour
        },
    });
}

const CreateNewTour = (req, res)=>{

    const newId = tours[tours.length  - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err=>{
        res.status(201).json({status: 'created', data: {tour:newTour}});
    });
}

const updateTour = (req, res) => {

    if(req.params.id * 1 > tours.length){
        return res.status(404).json({status:"Failed", message:"invalid id"});
    }

    res.status(201).json({
        status:"success", 
        data:{
            tour:'update goes here'
        },
    })
}

const deleteTour =  (req, res) => {
    if(req.params.id * 1 > tours.length){
        return res.status(404).json({
            status:"failed",
            message:"Invalid id"});
    }

    res.status(204).json({
        status:"success",
        data:{
            tour:null,
        }
    });
}

//user functions
const getAllUsers =  (req, res) => {
    console.log(req.requestTime);

    res.status(200).json({ staus: 'success', results:tours.length, data: tours, reqestedAt:req.requestTime });
  }

const getUser = (req,res)=>{

    const id  = req.params.id * 1;

    if(id > tours.length){
        return res.status(404).json({status:"Failed", message:"cannot find id" });
    }
    const tour = tours.find(tour => tour.id === id);

    res.status(201).json({
        status:"success",
        data : {
            tour
        },
    });
}

const createUser = (req, res)=>{

    const newId = tours[tours.length  - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err=>{
        res.status(201).json({status: 'created', data: {tour:newTour}});
    });
}

const updateUser = (req, res) => {

    if(req.params.id * 1 > tours.length){
        return res.status(404).json({status:"Failed", message:"invalid id"});
    }

    res.status(201).json({
        status:"success", 
        data:{
            tour:'update goes here'
        },
    })
}

const deleteUser =  (req, res) => {
    if(req.params.id * 1 > tours.length){
        return res.status(404).json({
            status:"failed",
            message:"Invalid id"});
    }

    res.status(204).json({
        status:"success",
        data:{
            tour:null,
        }
    });
}

const tourRouter = express.Router();
const userRouter = express.Router();

//Routes
tourRouter.route('/').get(getAllTours).post(CreateNewTour);
tourRouter.route('/:id').get(getTour).delete(deleteTour).patch(updateTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

//3 middleware (custom)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users/', userRouter);


const port = 3000;
app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
