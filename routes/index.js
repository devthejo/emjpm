const express = require("express");

const router = express.Router();
const queries = require("../db/queries");

// var csv = require("csvjson");
// var fs = require("fs");

// router.post("/upload", function(req, res, next) {
//   const file = fs.readFileSync("./mandataire.csv", "utf8");
//   const dataObj = csv.toObject(file);
//   queries
//     .uploadAll(dataObj)
//     .then(() => {
//       console.log("Import data done!");
//     })
//     .catch(() => {
//       console.log("Import data failed");
//     });
// });

/* GET home page. */

// function loggedIn(req, res, next) {
//   if (req.user) {
//     next();
//   } else {
//     res.redirect("http://localhost:3000/login");
//   }
// }

// router.get("/loginIn", function(req, res, next) {
//   if (req.user) {
//     next();
//   } else {
//     res.redirect("http://localhost:3000/login");
//   }
// });

router.use("/mandataires", require("./mandataires"));

router.post("/commentaires/index", function(req, res, next) {
  console.log(res);
  queries
    .getAllCommentaire(req.body.mandataire_id, req.body.ti_id)
    .then(function(commentaires) {
      res.status(200).json(commentaires);
    })
    .catch(function(error) {
      next(error);
    });
});
router.get("/commentaires/:id", function(req, res, next) {
  queries
    .getSingleCommentaire(req.params.id)
    .then(function(commentaire) {
      res.status(200).json(commentaire);
    })
    .catch(function(error) {
      next(error);
    });
});

router.post("/commentaires", function(req, res, next) {
  queries
    .addCommentaire(req.body)
    .then(function(commentaireID) {
      return queries.getSingleCommentaire(commentaireID);
    })
    .then(function(commentaire) {
      res.status(200).json(commentaire);
    })
    .catch(function(error) {
      next(error);
    });
});

router.delete("/commentaires", function(req, res, next) {
  queries
    .getSingle(req.body.co_id)
    .then(function(show) {
      queries
        .deleteItem(req.body.co_id)
        .then(function() {
          res.status(200).json(show);
        })
        .catch(function(error) {
          next(error);
        });
    })
    .catch(function(error) {
      next(error);
    });
});

router.put("/commentaires", function(req, res, next) {
  queries
    .updateCommentaire(req.body.co_id, req.body)
    .then(function() {
      return queries.getSingle(req.body.id);
    })
    .then(function(commentaire) {
      res.status(200).json(commentaire);
    })
    .catch(function(error) {
      next(error);
    });
});

router.get("/mesures", function(req, res, next) {
  console.log(res);
  queries
    .getAllCommentaire()
    .then(function(commentaires) {
      res.status(200).json(commentaires);
    })
    .catch(function(error) {
      next(error);
    });
});
router.get("/mesures/:id", function(req, res, next) {
  queries
    .getSingleCommentaire(req.params.id)
    .then(function(commentaire) {
      res.status(200).json(commentaire);
    })
    .catch(function(error) {
      next(error);
    });
});

router.post("/mesures", function(req, res, next) {
  console.log(req.body);
  queries
    .addMesure(req.body)
    .then(function(mesureID) {
      return queries.getSingleMesure(mesureID);
    })
    .then(function(commentaire) {
      res.status(200).json(commentaire);
    })
    .catch(function(error) {
      next(error);
    });
});

router.put("/mesures/:id", function(req, res, next) {
  queries
    .updateCommentaire(req.params.id, req.body)
    .then(function() {
      return queries.getSingle(req.params.id);
    })
    .then(function(commentaire) {
      res.status(200).json(commentaire);
    })
    .catch(function(error) {
      next(error);
    });
});

// router.post("/services", function(req, res, next) {
//   queries
//     .getAllServices(req.body)
//     .then(function(services) {
//       res.status(200).json(services);
//     })
//     .catch(function(error) {
//       next(error);
//     });
// });

router.get("/", function(req, res, next) {
  res.json({ title: "API eMJPM" });
});

module.exports = router;
