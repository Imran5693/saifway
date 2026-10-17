# Saif Way Technology SEO review

Reviewed 17 October 2026. Canonical domain: https://saifwaytech.com.

## Findings

- Live homepage and professional profile were returned by web search. This establishes discoverability in that search tool, not a Google ranking position or full Google index coverage. Search Console access is needed to diagnose specific queries.
- Homepage title and H1 previously emphasized a broad cybersecurity portfolio rather than Imran Sarwar and network automation. The profile had no H1. Both now foreground the intended identity and technical focus.
- Existing Netmiko and multi-vendor project content provides a useful foundation. A dedicated automation hub now connects that evidence to the profile and contact path.
- Existing student support was tied to an individual bug hunting project. A general Pakistan student help desk now covers project requirements, debugging, design and demonstrations, with a request form that prepares project details for WhatsApp, using the existing bug hunting project support number.
- Canonical URLs, social cards and jekyll-sitemap were already configured. Added explicit robots.txt sitemap discovery, stable Person identity and ProfilePage markup. Removed the meta-keywords output; Google does not use that tag for rankings.
- Live robots.txt and sitemap.xml could not be inspected with the web research tool. Check their deployed HTTP responses and Search Console status after release; do not interpret the tool failure as proof that the files are missing.
- Existing unrelated edits in solutions/wcaman/index.html were preserved.

## Keyword map

These are intent-based candidates, not measured search-volume or keyword-difficulty results. Research surfaced competing training pages for broad Python network automation searches and competing FYP services for Pakistan. Narrower project and tool phrases are hypotheses to validate, not proven low-competition terms.

| Page | Main intent / keyword candidates |
| --- | --- |
| Home and professional profile | Imran Sarwar; Imran Sarwar network engineer; Imran Sarwar Python developer; Imran Sarwar network automation |
| /network-automation-python/ | network automation with Python; Python network automation projects; Netmiko multi-vendor automation; network infrastructure automation |
| Existing multi-vendor project | Python network device user management; Netmiko configuration auditing; multi-vendor network automation project |
| Existing Netmiko article | Python network automation with Netmiko; Cisco Juniper Fortinet user management Python |
| /student-project-support/ | student project help Pakistan; final year project support Pakistan; Virtual University project guidance; VU FYP Python help; network automation final year project help |

Validate country-specific demand using Google Ads Keyword Planner for Pakistan and global English markets separately. Use Search Console country and query reports for actual impressions and positions. Paid advertising competition is not organic SEO difficulty. Avoid stuffing every variation or misspelling into page copy.

## Release and measurement

1. Deploy this checkout through the site's existing hosting process. No deployment or Git push was performed in this task.
2. Confirm the canonical domain, HTTPS and redirect behavior for www and alternate hostnames. Keep the existing URLs for current projects and articles.
3. Verify a Google Search Console domain property through DNS. Submit https://saifwaytech.com/sitemap.xml. Inspect the home, profile and both new landing pages; review indexing eligibility, selected canonical and crawl errors before requesting indexing.
4. Test the student WhatsApp handoff after release on mobile and desktop. It prepares a message to +92 314 6809271 with student name, student ID, university, project, phase and requested support; the student reviews and sends it in WhatsApp. No test inquiry was sent. The homepage contact form still uses its existing Formspree endpoint.
5. Run Google Rich Results Test on the profile and inspect markup with Schema.org Validator. Valid markup does not guarantee a special search appearance.
6. Record a baseline of impressions, clicks, CTR and average position for branded, automation and Pakistan student queries. Compare over 28-day windows after recrawling; account for country, device and changes in search demand.
7. Run PageSpeed Insights on desktop and mobile after publishing. Prioritize measured issues: image size, hero loading, layout shifts, font delivery and unused third-party CSS. No Core Web Vitals pass is claimed by this review.

## Next content and authority work

- Expand real case studies with sanitized code, device platforms, architecture, error handling, test method and measured outcomes where available. Clearly distinguish proposals, labs and production experience.
- Publish original walkthroughs: a read-only Netmiko inventory collector; multi-vendor automation failure handling; choosing a manageable network automation FYP; debugging a Flask student project. Link each to the appropriate hub. Do not create near-duplicate city or university landing pages.
- Keep LinkedIn, GitHub and the website consistent in name, role and URLs. Link relevant repositories and genuine technical posts back to their case studies. Pursue relevant mentions through useful contributions rather than purchased links.
- Add student FAQs based on real questions, clarify support scope and pricing once agreed, and publish student outcomes only with permission. Do not imply official university affiliation.
- Consider an original Urdu guide only if it can be maintained; add hreflang only when genuine translated equivalents exist.

## Sources

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google supported meta tags (including ignored keywords tag): https://developers.google.com/search/docs/crawling-indexing/special-tags
- Google ProfilePage structured data: https://developers.google.com/search/docs/appearance/structured-data/profile-page

Search ranking and index inclusion cannot be guaranteed. The remaining account-level checks require Search Console and hosting access.

## Follow-up verification

The updated Jekyll build passed. All 33 generated HTML pages contain the shared automation and student help links; no broken root-relative internal links were found. WhatsApp message generation passed checks for recipient, every field, special characters and invalid-form blocking. No live message was sent and no visual browser verification was performed. An existing trailing whitespace issue in solutions/wcaman/index.html was left untouched.

## Niche and authority update — 17 October 2026

The current positioning is Network Infrastructure & Python Automation. See SEO-POSITIONING.md for current qualitative keyword research, evidence boundaries and the page map. Added a client engineering-support page, an interface comparison guide, topic-relevant links for all articles/projects, stronger linked identity markup, and three original SVG diagrams across five placements. Removed five references to unavailable lab screenshots and retained the actual lab video/project links. The final Jekyll build passed: 35 HTML pages, 107 parsed JSON-LD blocks, zero broken internal links and zero missing image references. Browser checks covered the new service page and guide at a narrow viewport. Search volume, live Google ranking, external AI citations and post-deployment indexing remain unverified. Existing WCAMAN edits were preserved.

## International client service update

Added USA/UK/English-language Europe competitor research, a dedicated remote infrastructure support page, clearer remote delivery copy and a structured business inquiry form. The latest build contains 36 pages, 110 valid JSON-LD blocks, zero broken internal links and zero missing image references. Form structure and browser layout were checked without sending an inquiry. The site has not been deployed.

## Email delivery update

The earlier Formspree integration has been replaced in both email forms by FormSubmit, with the owner-provided personal Gmail address as sole recipient. See EMAIL-DELIVERY.md for deployment, activation and receipt testing. Student WhatsApp submissions are unchanged. Delivery is not yet verified.
