const express = require('express');
const Skill = require('../database_handler');

const router = express.Router();

router.get('/skills', async (req, res) => {
  try {
    const allCategories = await Skill.getAllCategories();
    const categorySkillsPromises = allCategories.map(async (category) => {
      const SkillModel = Skill.getModelForCategory(category);
      const skills = await SkillModel.find();
      return { category, skills };
    });

    const categorySkills = await Promise.all(categorySkillsPromises);
    res.status(200).json(categorySkills);
  } catch (error) {
    console.error('Error retrieving categories and skills:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;


router.get('/categories', async (req, res) => {
  try {
    const allCategories = await Skill.getAllCategories();
    res.status(200).json(allCategories);
  } catch (error) {
    console.error('Error retrieving all categories:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
