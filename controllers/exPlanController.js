const mongoose = require('mongoose');
const ExPlan = mongoose.model('ExPlan');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  filefilter(req, file, next) {
    const isPhoto = file.mimetype.startswith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({message: 'File type is not allowed!'}, false);
    }
  }
};


exports.homePage = (req, res) => {
  res.render('index');
};

exports.addExPlan = (req, res) => {
  res.render('editExPlan', {title: 'Add Exercise'});
  //console.log('Add ExPlan');
};

//  Photo Stuff here
exports.upload = multer(multerOptions).single('photo');

exports.resize = async(req, res, next) => {
  // Check Photo
  if (!req.file) {
    next(); // skip function if no file, to next middle ware with next
    return;
  }
  // Set new file name UUID + extension
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // REsize photo
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800,jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  next();
  // console.log(req.file);
}

// Create a new Store
exports.createExPlan = async (req, res) => {
  //console.log(req.body);
  //res.json(req.body);
  const exPlan = await(new ExPlan(req.body)).save();
  //  await exPlan.save();
  req.flash('success', `${exPlan.exercise} successfully Created...`);
  //console.log(exPlan);
  res.redirect(`/exPlan/${exPlan.slug}`);
};

exports.getExPlan = async (req, res) => {
  //res.send('Hi');
  const exPlans = await ExPlan.find();
  res.render('exPlans', {title: 'Exercise Plans', exPlans});
};

exports.editExPlan = async (req, res) => {
  const exPlan = await ExPlan.findOne({_id: req.params.id });
  //res.json(exPlan);
  res.render('editExPlan', {title: `Edit ${exPlan.exercise}`, exPlan});
};

exports.updateExPlan = async (req, res) => {
  const exPlan = await ExPlan.findOneAndUpdate(
    {_id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).exec();

  req.flash('success', `Successfully updated ${exPlan.exercise}. <a href="/store/${exPlan.slug}">View Exercise</a>`);

  //res.json(exPlan);
  res.redirect(`/exPlan/${exPlan._id}/edit`);
};

exports.getExPlanBySlug = async (req, res, next) => {
  const exPlan = await ExPlan.findOne({slug: req.params.slug});
  if (!exPlan) return next();
  res.render('exPlan', {exPlan, title: exPlan.exercise});
}
