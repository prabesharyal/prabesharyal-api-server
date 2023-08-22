const mongoose = require('mongoose');

const mongoURI = process.env.DB;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectionCache = {};

const getModelForCategory = (category) => {
  const formattedCategory = category.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  if (!connectionCache[formattedCategory]) {
    const skillsSchema = new mongoose.Schema({
      skillset: { type: String, required: true },
      rating: { type: Number, required: true },
      experience: { type: Date, default: Date.now },
      proficient: { type: Boolean, required: false, default: false},
      logo: { type: String, required: false},
    });

    connectionCache[formattedCategory] = mongoose.model(formattedCategory, skillsSchema);
  }
  return connectionCache[formattedCategory];
};


const getAllCategories = async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const categoryNames = collections.map(collection => collection.name);
    return categoryNames;
  } catch (error) {
    console.error('Error retrieving all categories:', error);
    throw error;
  }
};

const getAllSkills = async () => {
  try {
    const allSkills = await SkillModel.find();
    return allSkills;
  } catch (error) {
    console.error('Error retrieving all skills:', error);
    throw error;
  }
};
const deleteCategory = async (category) => {
  try {
    const SkillModel = getModelForCategory(category);
    await SkillModel.deleteMany();
    await mongoose.connection.db.dropCollection(category);
  } catch (error) {
    throw error;
  }
};

const deleteSkillById = async (skillId) => {
  try {
    for (const category in connectionCache) {
      const SkillModel = connectionCache[category];
      await SkillModel.deleteOne({ _id: skillId });
    }
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};

module.exports = { getModelForCategory, getAllCategories, getAllSkills,   deleteCategory,
  deleteSkillById};
