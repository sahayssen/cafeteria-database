<script>
  import { base } from '$app/paths';
  import DatabaseHeader from '$lib/components/DatabaseHeader.svelte';
  import Dashboard from '$lib/components/Dashboard.svelte';
  import BigNumber from '$lib/components/BigNumber.svelte';
  import Card from '$lib/components/Card.svelte';
  import MethodologyBox from '$lib/components/MethodologyBox.svelte';
  import SplashHeader from '$lib/components/SplashHeader.svelte';
  import LocatorMap from '$lib/components/LocatorMap.svelte';

  let { data } = $props();
  let cafe = data.cafe;
  const violations = data.violations ?? [];
  const visibleViolations = violations
    .filter(v => v.violationdescription?.trim())
    .sort((a, b) => {
      const aTime = new Date(a.inspectiondate).getTime();
      const bTime = new Date(b.inspectiondate).getTime();

      if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;

      return bTime - aTime;
    });
  const borough = cafe.borough;
  const councildistrict = cafe.councildistrict;
  const number = cafe.number;
  const sitetype = cafe.site_type;
  const latitude=cafe.latitude;
  const longitude=cafe.longitude;
  const street = cafe.street;
  const zipcode = cafe.zipcode;
  const ViolationNumber = visibleViolations.length;


  function formatDate(dateStr) {
    if (!dateStr) return 'Date unavailable';

    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return 'Date unavailable';

    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
</script>

<SplashHeader
  headline="NYC's Worst Cafeterias"
  image={`${base}/ankara.jpg`}
/>

<div class="container">
<br/>
<br/>
<button style="margin-top=2rem;">
<a class="a.back" href={`${base}/`}>Back to all schools</a>
</button>

<div class="hero-row">
  <div class="hero-description">
  <h2> <strong> {cafe?.schoolname ?? 'Cafeteria not found'} </strong> </h2>
  <h4> This school cafeteria has <strong> {ViolationNumber} </strong> total violations.</h4>
    <strong> Address: </strong> {number} {street}
    <br/>
      <strong> Borough: </strong> {borough}
      <br/>
      <strong> Zip Code: </strong> {zipcode}
      <br/>
     <strong> Council District: </strong> {councildistrict}
      <br/>
      <strong> Site Type: </strong> {sitetype}
      
      
  </div>

  <div class="hero-map">
    <LocatorMap
      longitude={longitude}
      latitude={latitude}
      zoom={10}
      width={300}
      dot
      caption="The Craig Newmark Graduate School of Journalism is at 219 West 40th Street in Midtown Manhattan."
      credit="OpenFreeMap / OpenStreetMap contributors"
    />
  </div>
</div>



  <div class="card-grid">
    {#each visibleViolations as violation, index (`${violation.entityid}-${violation.inspectiondate}-${index}`)}
      <Card>
        <p class="card-date">{formatDate(violation.inspectiondate)}</p>
        <p> <strong>Grade:</strong> {violation.code}
        <p>{violation.violationdescription}</p>
      </Card>
    {/each}
  </div>
  </div>



<style type="scss">

  .hero-description {
    font-family: var(--font-sans);
    font-size: var(--font-size-2xl);
    line-height: var(--leading-loose);
    line-spacing: var(--spacing-md);
    color: var(--color-dark);
    margin-left: 5rem;
    flex: 1 1 0;
    min-width: 0;
    margin-top: 6rem;
    margin-bottom: 0;
  }

  .hero-row {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: var(--spacing-lg);
    flex-wrap: nowrap;
    margin-bottom: var(--spacing-xs);
  }

  .hero-map {
    flex: 0 0 auto;
    margin-left: auto;
    margin-right: 12rem;
  }

  .container {
    max-width: var(--max-width-wide);
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  :global(.row) {
    margin-top: var(--spacing-sm) !important;
    margin-bottom: var(--spacing-sm) !important;
    justify-content: flex-start !important;
  }

  @media (max-width: 767px) {
    .hero-row {
      flex-direction: column;
      flex-wrap: wrap;
    }

    .hero-map {
      margin-left: 0;
    }

    :global(.row) {
      flex-direction: column;
    }
  }

  :global(.row .big-number .number) {
    font-size: 2.25rem;
  }

  :global(.row .big-number .label) {
    font-size: var(--font-size-sm);
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-md);
    margin: var(--spacing-lg) 0;
  }

  :global(p.card-date) {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    color: var(--color-accent) !important;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-bottom: var(--spacing-xs) !important;
  }

  a.back {
    display: inline-block;
    background-color: var( --color-light-gray);
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    color: var(--color-dark);
    text-decoration: none;
    text-transform: uppercase;
    &:hover {
      text-decoration: underline;
    }
  }
</style>