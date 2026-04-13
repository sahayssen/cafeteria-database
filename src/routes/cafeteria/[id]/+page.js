import cafes from '$lib/data/cafes.json';


export function load({ params }) {
  const violations = cafes.filter(c => c.entityid === params.id);
  const cafe = violations[0] ?? null;
  return { cafe, violations, showHeader: false };
}

export function entries() {
  return [...new Set(cafes.map(c => c.entityid))].map(id => ({ id }));
}