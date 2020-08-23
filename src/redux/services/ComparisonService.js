const comparisons = [];

const addComparison = c => comparisons.push(c);

const getComparison = id => comparisons.find(c => c.id === id);

const getAllComparison = () => comparisons.map(c => ({...c}));

export default {
  addComparison,
  getComparison,
  getAllComparison,
};
