const comparisons = [
  {"id":"v1i", "title":"Shampoo","comparisonUnit":"Volume",
    details: [
      {id: 'a4r', name: 'Dove', cost: 90, measure: 450, perUnitPrice: 0.2, buyPref: 1, opacity: 1 },
      {id: 'g53', name: 'H&S', cost: 300, measure: 600, perUnitPrice: 0.5, buyPref: 2, opacity: 0.5},
    ]},
  {"id":"c95", "title":"Soap","comparisonUnit":"Weight", details: []}
];

const addComparison = c => comparisons.push({ ...c, details: [] });

const getComparison = id => comparisons.find(c => c.id === id);

const getAllComparison = () => comparisons.map(c => ({...c}));
const _recalculate = cmp => {
  const sortedDetails = cmp.details.sort((a,b) => {
    if(a.perUnitPrice > b.perUnitPrice) return 1;
    if(a.perUnitPrice < b.perUnitPrice) return -1;
    return 0;
  });
  const totalItems = sortedDetails.length;
  const calculatedSortedDetails = sortedDetails.map((sD, index) => ({
    ...sD,
    buyPref: index + 1,
    opacity: (totalItems - index) / totalItems,
  }))
  cmp.details = calculatedSortedDetails;
}
const addDetail = d => {
  const cmp = getComparison(d.comparisonId);
  if (cmp) {
    d.perUnitPrice = parseFloat(d.cost / d.measure).toFixed(3);
    cmp.details.push(d);
    _recalculate(cmp);
  }

}

const deleteDetail = d => {
  const cmp = getComparison(d.comparisonId);
  if (cmp) {
    cmp.details = cmp.details.filter(newD => newD.id !== d.id);
    _recalculate(cmp);
  }
}

export default {
  addComparison,
  getComparison,
  getAllComparison,
  addDetail,
  deleteDetail,
};
