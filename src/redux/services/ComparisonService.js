const comparisons = [
  {"id":"v1i", "title":"Shampoo","comparisonUnit":"Volume", details: [{id: 'a4r', name: 'H&S'}, {id: 'a4r', name: 'Dove'}]},
  {"id":"c95", "title":"Soap","comparisonUnit":"Weight", details: []}
];

const addComparison = c => comparisons.push({ ...c, details: [] });

const getComparison = id => comparisons.find(c => c.id === id);

const getAllComparison = () => comparisons.map(c => ({...c}));

const addDetail = d => {
  const cmp = getComparison(d.comparisonId);
  if (cmp) {
    cmp.details.push(d);
  }
}

export default {
  addComparison,
  getComparison,
  getAllComparison,
  addDetail,
};
