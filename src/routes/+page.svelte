<!--
@component
This is your page!
-->
<script>
  // Import all the news furniture components
  import ArticleHeader from '$lib/components/ArticleHeader.svelte';
  import ArticleBody from '$lib/components/ArticleBody.svelte';
  import Blockquote from '$lib/components/Blockquote.svelte';
  import Image from '$lib/components/Image.svelte';
  import RelatedLinks from '$lib/components/RelatedLinks.svelte';
  import DropdownInput from '$lib/components/DropdownInput.svelte';
  import BigNumber from '$lib/components/BigNumber.svelte';
  import RankingCard from '$lib/components/RankingCard.svelte';
  import SearchInput from '$lib/components/SearchInput.svelte';
  import SplashHeader from '$lib/components/SplashHeader.svelte';
  import MethodologyBox from '$lib/components/MethodologyBox.svelte';
  import { base } from '$app/paths';

  let { data } = $props();

  const cafes = data.cafes;

  const schools = cafes.map(cafe => cafe.schoolname);

  const uniqueSchools = [...new Set(schools)];

  const schoolSummary = cafes.reduce((groups, cafe) => {
  const school = cafe.schoolname;
  const borough = cafe.borough;
  const violation = cafe.violationdescription?.trim();

  if (!groups.has(school)) {
    groups.set(school, { school, borough, count: 0, entityid: cafe.entityid });
  }

  if (violation) {
    groups.get(school).count += 1;
  }

  return groups;
}, new Map());

const SchoolViolationCounts = cafes.reduce((groups, cafe) => {
  const school = cafe.schoolname;
  const violation = cafe.violationdescription?.trim();

  if (!groups.has(school)) {
    groups.set(school, 0);
  }

  if (violation) {
    groups.set(school, groups.get(school) + 1);
  }

  return groups;
}, new Map());

 const sortedSchools = [...schoolSummary.values()]
  .sort((a, b) => b.count - a.count || a.school.localeCompare(b.school))
  .filter(item => item.count > 0);
  
  let currentPage = $state(0);
  let searchQuery = $state('');
  let selectedBorough = $state('');
  const itemsPerPage = 20;
  const minViolationLimit = 1;
  const maxViolationCount = Math.max(...sortedSchools.map(item => item.count));
  const violationSpan = Math.max(1, maxViolationCount - minViolationLimit);
  let minViolations = $state(minViolationLimit);
  let maxViolations = $state(maxViolationCount);
  let minViolationPercent = $derived(((minViolations - minViolationLimit) / violationSpan) * 100);
  let maxViolationPercent = $derived(((maxViolations - minViolationLimit) / violationSpan) * 100);

  const boroughOptions = [...new Set(sortedSchools.map(item => item.borough))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .map(borough => ({
      label: borough,
      value: borough
    }));

  const totalSchoolsWithViolations = sortedSchools.length;
  const totalViolations = sortedSchools.reduce((sum, school) => sum + school.count, 0);
  const totalBoroughs = boroughOptions.length;

  let filteredSchools = $derived(
    sortedSchools.filter(item => {
      const matchesSearch = item.school.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesBorough = !selectedBorough || item.borough === selectedBorough;
      const matchesViolationRange = item.count >= minViolations && item.count <= maxViolations;

      return matchesSearch && matchesBorough && matchesViolationRange;
    })
  );
  
  let topSchools = $derived(filteredSchools.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage));
  let hasNextPage = $derived((currentPage + 1) * itemsPerPage < filteredSchools.length);
  let totalPages = $derived(Math.max(1, Math.ceil(filteredSchools.length / itemsPerPage)));

  function handleSearchInput() {
    currentPage = 0;
  }

  function handleBoroughChange(event) {
    selectedBorough = event.currentTarget.value;
    currentPage = 0;
  }

  function handleMinViolationsInput(event) {
    const nextValue = Number(event.currentTarget.value);
    minViolations = Math.min(nextValue, maxViolations);
    currentPage = 0;
  }

  function handleMaxViolationsInput(event) {
    const nextValue = Number(event.currentTarget.value);
    maxViolations = Math.max(nextValue, minViolations);
    currentPage = 0;
  }
  
  function nextPage() {
    if (hasNextPage) {
      currentPage += 1;
    }
  }
  
  function previousPage() {
    if (currentPage > 0) {
      currentPage -= 1;
    }
  }

  // Article metadata
  let headline = 'NYC Worst Cafeterias.';
  let byline = 'Sophie Hayssen';
  let pubDate = '2026-01-31';
</script>

<SplashHeader
  headline="NYC's Worst Cafeterias"
  image={`${base}/ankara.jpg`}
  deck="This is a project for Coding the News at the CUNY Newmark Journalism School showcasing cafeterias across all five buroughs with the most health violations."
  pubDate="Sophie Hayssen | April 12, 2026"
/>

<div class="intro" style="background-color: #f5f5f5;">
<div class="container">
<h2 style="text-align:center;">
Introduction
</h2>
<h3> 
The Health Department inspects all New York City school cafeterias. Health inspectors check to make sure that food is prepared, handled and stored safely to prevent food-related illness (<a href=https://www.nyc.gov/site/doh/health/health-topics/school-cafeteria-inspection-results.page> Source </a>).
<br/>
<br/>
NYC laws requires a minimum of 2 inspections in a school building, each school year. Inspections are unannounced, therefore, the Department of Education, including the kitchen staff, will not know when the cafeteria will be inspected (<a href=https://www.opt-osfns.org/schoolfoodny/meals/dohsearch.aspx> Source </a>).
</h3>
</div>
</div> 

<div style="padding:2rem; margin-top: 0 rem;">
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; max-width: 900px; margin: 0 auto 2rem;">
    <BigNumber number={totalSchoolsWithViolations} label="Schools with violations" />
    <BigNumber number={totalViolations} label="Total violations" />
    <BigNumber number={totalBoroughs} label="Boroughs covered" />
  </div>


  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; max-width: 900px; margin: 0 auto 2rem; align-items: end;">
    <SearchInput
      label="Search Schools"
      placeholder="Search schools with violations"
      bind:value={searchQuery}
      oninput={handleSearchInput}
    />
    <DropdownInput
      label="Filter Borough"
      options={boroughOptions}
      value={selectedBorough}
      placeholder="All boroughs"
      onchange={handleBoroughChange}
    />
  </div>

  <div style="max-width: 900px; margin: 0 auto 2rem; background: #f8f8f8; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem 1.25rem;">
    <div style="display: flex; align-items: center; gap: 1rem;">
      <p style="margin: 0; font-weight: 600; min-width: 140px;">Violation range</p>
      <div style="flex: 1; display: flex; align-items: center; gap: 0.75rem;">
        <span style="min-width: 3.5rem;">Min {minViolations}</span>
        <div
          class="dual-range"
          style={`--min-percent: ${minViolationPercent}%; --max-percent: ${maxViolationPercent}%;`}
        >
          <div class="range-track"></div>
          <div class="range-fill"></div>
          <input
            type="range"
            min={minViolationLimit}
            max={maxViolationCount}
            value={minViolations}
            oninput={handleMinViolationsInput}
            aria-label="Minimum violations"
          />
          <input
            type="range"
            min={minViolationLimit}
            max={maxViolationCount}
            value={maxViolations}
            oninput={handleMaxViolationsInput}
            aria-label="Maximum violations"
          />
        </div>
        <span style="min-width: 3.5rem; text-align: right;">Max {maxViolations}</span>
      </div>
    </div>
  </div>

  <div class="container">

  {#if topSchools.length === 0}
    <p style="text-align:center; margin: 2rem 0;">No schools with violations match your search.</p>
  {/if}

  {#each topSchools as item, index}
  <RankingCard rank={(currentPage * 20) + index + 1} 
  title={item.school}
  description={item.borough}
  value={item.count}
  valueLabel="violations"
  href={`cafeteria/${item.entityid}`}
   />
  {/each}
</div>
</div>

    <div style="display: flex; gap: 2rem; justify-content: center; align-items: center; margin-top: 2rem; margin-bottom: 2rem;">
    <button onclick={previousPage} disabled={currentPage === 0} style="display:flex-box; padding: 1rem;">
      ← Previous
    </button>
      <span>Page {currentPage + 1} of {totalPages}</span>
    <button onclick={nextPage} disabled={!hasNextPage} style="display:flex-box; padding: 1rem;">
      Next →
    </button>
    <br/>
    <br/>
  </div>
  <br/>
  <br>
  <div style="display: flex; justify-content: center; margin: 0 auto 2rem;">
    <MethodologyBox style="max-width: 60rem; width: 100%;">
    To report this story I got an API from NYC Open Data's collection of cafeterias inspection data. I also filtered the data to group violations by school and removed any school's that had no violations. I sorted the cafeterias by number of violations and linked them to a secondary pages, which show a profile of the school as well as a list of violations in reverse chronological order. I updated the header from the template website and included a search bar/drop down menu to help search. The coding for this assignment was largely based on previous assignments from CUNY Newmark's Coding the News class scripts. It was created with the assistance of GitHub's AI agent, CoPilot, as well as premade components.
    </MethodologyBox>
  </div>

<style>
  .dual-range {
    position: relative;
    flex: 1;
    height: 1.75rem;
  }

  .range-track,
  .range-fill {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 0.35rem;
    border-radius: 999px;
  }

  .range-track {
    left: 0;
    right: 0;
    background: #d9d9d9;
  }

  .range-fill {
    left: var(--min-percent);
    right: calc(100% - var(--max-percent));
    background: var(--color-accent);
  }

  .dual-range input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1.75rem;
    margin: 0;
    background: transparent;
    pointer-events: none;
  }

  .dual-range input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: var(--color-accent);
    border: 2px solid #fff;
    box-shadow: 0 0 0 1px var(--color-accent);
    cursor: pointer;
    pointer-events: auto;
  }

  .dual-range input[type='range']::-moz-range-thumb {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: var(--color-accent);
    border: 2px solid #fff;
    box-shadow: 0 0 0 1px var(--color-accent);
    cursor: pointer;
    pointer-events: auto;
  }
</style>

