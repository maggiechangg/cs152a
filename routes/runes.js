// var express = require("express");
// var router = express.Router();
// const RunesHome = require('../models/Runes')


// router.get("/runesHome", function (req, res, next){
//     res.render("runesHome");
// });

// router.post('/runesHome',
//   async (req,res,next) => {
//     try {
//       const championName = req.body.championName;
//       const championObj = {
//         userId:res.locals.user._id,
//         championName: championName,
//       }
//       const championItem = new RunesHome(championObj);
//       await championItem.save(); 
//       res.redirect('/showRunesHome');
//     }catch(err){
//       next(err);
//     }
//   }
// )

// router.get('/showRunesHome',
//   async (req,res,next) => {
//    try {
//     const chapmionitems = await RunesHome.find({userId:res.locals.user._id});
//     res.locals.championitems = chapmionitems
//     res.render('showRunesHome')
//     //res.json(todoitems);
//    }catch(e){
//     next(e);
//    }
//   }
// )

// router.get('/deleteChampionItem/:itemId',
//     async (req,res,next) => {
//       try {
//         const itemId = req.params.itemId;
//         await RunesHome.deleteOne({_id:itemId});
//         res.redirect('/showRunesHome');
//       } catch(e){
//         next(e);
//       }
//     }
// )

// module.exports = router; 




