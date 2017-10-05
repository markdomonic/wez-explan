const express = require('express');
const router = express.Router();

const exPlanController = require('../controllers/exPlanController');

const {catchErrors} = require('../handlers/errorHandlers');

router.get('/', exPlanController.getExPlan);
router.get('/explans', catchErrors(exPlanController.getExPlan));
router.get('/add', exPlanController.addExPlan);
router.post('/add',
  exPlanController.upload,
  catchErrors(exPlanController.resize),
  catchErrors(exPlanController.createExPlan)
);
router.post('/add/:id',
  exPlanController.upload,
  catchErrors(exPlanController.resize),
  catchErrors(exPlanController.updateExPlan)
);
router.get('/explan/:id/edit', catchErrors(exPlanController.editExPlan));

router.get('/explan/:slug', catchErrors(exPlanController.getExPlanBySlug));

module.exports = router;
