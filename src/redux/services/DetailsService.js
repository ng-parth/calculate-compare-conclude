const details = [
  {"comparisonId":"v1i", "title":"Shampoo","comparisonUnit":"Volume"},
  {"comparisonId":"c95", "title":"Soap","comparisonUnit":"Weight"}
];

const addDetail = d => details.push(d);

const getDetails = cId => details.find(d => d.comparisonId === cId);

// const getAllComparison = () => comparisons.map(c => ({...c}));

export default {
  addDetail,
  getDetails,
};
