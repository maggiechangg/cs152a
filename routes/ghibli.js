// var express = require("express");
// var router = express.Router();

// router.get('/ghibli',(req,res,next) => {
//     res.render('ghibli')
//   })
  
// router.post('/ghibli',
//     async (req,res,next) => {
//       try{
//         const movie = req.body.movie;
//         const url="https://ghibliapi.herokuapp.com/films/"+movie
//         const response = await axios.get(url)
//         console.dir(response.data)
//         res.locals.movie = response.data
//         res.render('showGhibli')
//       }
//       catch (err){
//         console.error("Something went wrong")
//         console.error(err)      
//       }
//     })

// module.exports = router; 