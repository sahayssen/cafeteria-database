<script>
  let { kicker = '', headline = '', image = '', deck = '', pubDate = '' } = $props();
</script>

<header
  class="story-header"
  style={`background-image: linear-gradient(rgba(80, 80, 80, 0.58), rgba(80, 80, 80, 0.58)), url(${image});`}
>
  <span class="kicker">{kicker}</span>
  <h1>{headline}</h1>
  <p class="deck">{deck}</p>
  <p class="byline">{pubDate}</p>
</header>

<style>
  .kicker {
    display: block;
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-right: 0rem;
    padding: 3rem;
    color: var(--color-white);
    text-align: center;
  }

  .story-header {
    display: block;
    text-align: center;
    min-height: 20rem;
    padding: var(--spacing-2xl) var(--spacing-lg) calc(var(--spacing-2xl) + 8rem);
    background-color: #6f6f6f;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .story-header h1 {
    display: block;
    color: var(--color-white);
    font-family: var(--font-headline);
    font-size: var(--font-size-6xl);
    font-weight: 400;
    text-align: left;
    max-width: 60rem;
    margin: 2rem;
    padding-inline: 2rem;
    padding-left: 2rem;
  }

  
  .deck {
    display: block;
    font-family: var(--font-menu);
    font-size: var(--font-size-lg);
    line-height: var(--leading-normal);
    color: var(--color-white);
    text-align: left;
    max-width: 60rem;
    margin: 2rem;
    padding-inline: 2rem;
    padding-left: 2rem;
  }

  .byline {
    display: block;
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-white);
    text-align: left;
    max-width: 60rem;
    margin: 2rem 2rem 0;
    padding-inline: 2rem;
    padding-left: 2rem;
    padding-bottom: 2.5rem;
  }

</style> 