const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  list,
  create,
  update,
  remove,
  summary
} = require("../controllers/transactions.controller");

const router = express.Router();

router.use(authMiddleware);
router.get("/summary", summary);
router.get("/", list);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
