# iOS 9 iPad Weather Dashboard - Technical Documentation V2

Extracted from PDF: iOS 9 iPad Weather Dashboard - Technical Documentation V2.pdf

---

iOS 9 iPad Weather Dashboard - Technical Documentation
Device Information
• Device: iPad 2 (Model: MC954LL/A)
• Operating System: iOS 9.3.5 (final supported version)
• Browser: Safari (iOS 9)
• Age: Released 2011, ~13 years old

Core Problems with iOS 9
1. Outdated TLS/SSL Support
Problem: iOS 9 only supports TLS 1.0 and 1.1, which modern APIs have disabled for security reasons. Most
HTTPS endpoints require TLS 1.2+ with modern cipher suites.
Impact: Weather APIs (Open-Meteo), currency APIs (OpenExchangeRates, Frankfurter, etc.) all refuse
connections from iOS 9.
Solution: Cloudflare Worker proxy that acts as a bridge between iOS 9 and modern APIs.

2. JavaScript Limitations
Problem: iOS 9 Safari doesn't support modern JavaScript (ES6+).
Unsupported Features:
• const and let declarations
• Arrow functions () => {}
• Template literals `${variable}`
• async/await
• fetch() API
• Promises (limited support)
• Default parameters
• Spread operators
• Classes
Solution: Rewrote all JavaScript using ES5 syntax:
• Used var instead of const/let
• Used function() instead of arrow functions
• Used string concatenation instead of template literals
• Used XMLHttpRequest instead of fetch()
• Used callbacks instead of async/await

3. CSS Limitations
Problem: iOS 9 Safari has limited CSS support.

Issues:
• Flexbox support is buggy and incomplete
• CSS Grid doesn't exist
• Modern CSS features not supported
• Requires -webkit- prefixes for many properties
Solution:
• Used float-based layouts instead of flexbox/grid
• Added -webkit- prefixes for all transforms, gradients, shadows, etc.
• Avoided modern CSS features like CSS variables

4. Emoji Rendering Limitations
Problem: iOS 9 has a hard maximum size for emoji rendering regardless of font-size.
Solution: Used CSS transforms to scale emojis larger:
javascript

style="font-size: 40px; -webkit-transform: scale(3); transform: scale(3);"

This renders a 40px emoji at 120px actual size by scaling it 3x.

Solution Architecture
Cloudflare Worker Proxy
Purpose: Bridge between iOS 9's old TLS and modern HTTPS APIs
Worker URL: https://weather-worker.dennyrgood.workers.dev
How it works:
1. iPad makes HTTP request to Worker with ?url= parameter
2. Worker validates the target domain (security)
3. Worker fetches data from modern API using TLS 1.3
4. Worker returns data to iPad with CORS headers
5. iPad receives data and displays it
Allowed Domains (whitelist for security):
• api.open-meteo.com (weather data)
• openexchangerates.org (currency rates)
• api.frankfurter.app (currency rates)
• api.exchangerate-api.com (currency rates)
Worker Code Location: Cloudflare Dashboard → Workers & Pages → weather-worker

File Structure
Main Files:

• index_old_ipad.html - Weather dashboard (iOS 9 compatible)
• config.html - Configuration page for setting themes and thresholds (iOS 9 compatible)
URL Parameters:
• ?theme=blue - Color theme (blue, amber, gray, cream, green, blackgreen, amberblack)
• ?low=1.10 - Currency low threshold (green checkmark below)
• ?high=1.20 - Currency high threshold (red X above)
• ?proxy=URL - Override proxy URL (optional)

Troubleshooting Guide
Problem: Weather shows "Weather unavailable" or "Network error"
Possible Causes:
1. Cloudflare Worker is down or deleted
2. Worker URL is incorrect
3. iPad has no internet connection
4. API endpoints have changed
Solutions:
1. Verify Worker is running:
• Go to https://weather-worker.dennyrgood.workers.dev
• You should see "Missing url parameter" (this is correct)
2. Check Worker URL in code:
• Open index_old_ipad.html
• Find line: var PROXY_URL = 'https://weather-worker.dennyrgood.workers.dev';
• Verify URL is correct
3. Test Worker manually:
• Visit: https://weather-worker.dennyrgood.workers.dev/?url=https://api.open-meteo.com/v1/forecast?
latitude=52.3676&longitude=4.9041&current=temperature_2m

• Should return JSON weather data
4. Check iPad internet connection:
• Open Safari and visit any website
• Verify you can access the internet

Problem: Currency rates show "0.00000" or error
Possible Causes:
1. Worker proxy issue (same as weather)
2. Currency APIs are down or changed
3. API rate limits reached
Solutions:

1. Check if weather is working (uses same proxy)
2. Wait 1 hour and try again (may be rate limited)
3. Currency APIs update at different intervals, one may be slow

Problem: Weather icon is too small
Cause: The CSS transform isn't being applied
Solution:
1. Verify this code exists in the HTML:
javascript

style="font-size: 40px; -webkit-transform: scale(3); transform: scale(3);"

2. Clear Safari cache:
• Settings → Safari → Clear History and Website Data

Problem: Layout is broken or stacked vertically
Cause: CSS not loading or being overridden
Solutions:
1. Hard refresh: Hold Shift and reload page
2. Clear cache: Settings → Safari → Clear History and Website Data
3. Verify card width is 48.5% (not 49% or higher)

Problem: Cloudflare Worker stopped working
Possible Causes:
1. Cloudflare free tier limits exceeded (100k requests/day)
2. Worker was accidentally deleted
3. Domain expired
Solutions:
To recreate the Worker:
1. Log into Cloudflare account
2. Go to Workers & Pages
3. Create new Worker called "weather-worker"
4. Replace code with:

javascript

export default {
async fetch(request) {
const url = new URL(request.url);
const targetUrl = url.searchParams.get('url');
if (!targetUrl) {
return new Response('Missing url parameter', { status: 400 });
}
const allowedDomains = [
'api.open-meteo.com',
'openexchangerates.org',
'api.frankfurter.app',
'api.exchangerate-api.com'
];
const targetDomain = new URL(targetUrl).hostname;
if (!allowedDomains.includes(targetDomain)) {
return new Response('Domain not allowed', { status: 403 });
}
try {
const response = await fetch(targetUrl);
const data = await response.text();
return new Response(data, {
headers: {
'Content-Type': 'application/json',
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': 'GET',
'Cache-Control': 'public, max-age=300'
}
});
} catch (error) {
return new Response('Proxy error: ' + error.message, { status: 500 });
}
}
};

5. Deploy and note the new URL
6. Update index_old_ipad.html with new Worker URL

Problem: "Set PROXY_URL in script" error
Cause: The proxy URL placeholder wasn't replaced
Solution:
1. Edit index_old_ipad.html
2. Find: var PROXY_URL = 'YOUR_WORKER_URL_HERE';
3. Replace with: var PROXY_URL = 'https://weather-worker.dennyrgood.workers.dev';

Problem: APIs stop working in the future
Cause: API endpoints deprecated or changed

Solutions:
For Weather API:
• Open-Meteo is generally stable
• Verify API still works: https://api.open-meteo.com/v1/forecast?
latitude=52.3676&longitude=4.9041&current=temperature_2m
• Check documentation: https://open-meteo.com/
For Currency APIs:
• The dashboard uses 3 different APIs for redundancy
• If one fails, others should still work
• OpenExchangeRates requires API key (already included in code)
• Check if API key is still valid: https://openexchangerates.org/account

Problem: Page loads but shows old data
Cause: Browser cache
Solution:
1. Settings → Safari → Clear History and Website Data
2. Or force refresh: reload page multiple times

Problem: JavaScript errors in console
Cause: Modern JavaScript accidentally introduced
Check for these common mistakes:
• Using const or let (use var )
• Using arrow functions => (use function() )
• Using template literals (use string concatenation)
• Using fetch() (use XMLHttpRequest )

Testing Checklist
When making changes, verify:

1. ☐ Weather for Amsterdam loads
2. ☐ Weather for Maspalomas loads
3. ☐ Currency rate displays
4. ☐ Weather icons are large (scaled via transform)
5. ☐ Two weather cards are side-by-side
6. ☐ Currency card spans full width at bottom
7. ☐ Time updates every second
8. ☐ No JavaScript errors in console
9. ☐ Page fits on screen without scrolling
10. ☐ All text is readable from distance

Important Notes
DO NOT:
• Use any npm packages or build tools
• Use modern JavaScript (ES6+)
• Use localStorage or sessionStorage (not supported in artifacts)
• Use CSS Grid or modern Flexbox
• Expect emoji to scale with font-size alone

DO:
• Always use ES5 JavaScript syntax
• Use -webkit- prefixes for CSS
• Use XMLHttpRequest for AJAX calls
• Use transforms to scale emojis
• Test on actual iPad 2 device
• Keep Worker proxy running

Browser Compatibility
This solution is specifically designed for iOS 9 Safari. It will work on modern browsers too, but the code is
intentionally old-fashioned to support the ancient iPad.

Maintenance
Regular Checks (Monthly)
1. Verify Worker is still active
2. Check API endpoints still work
3. Verify currency API key is valid
4. Test on actual device

If Moving to New Hosting
1. Update Worker URL in both HTML files
2. Keep Worker domain or update references
3. Test thoroughly after any changes

Future Upgrades
If you get a newer device (iOS 10+), you can:
• Use modern JavaScript (ES6+)
• Remove Worker proxy (iOS 10.3+ supports TLS 1.2)
• Use Flexbox/Grid for layouts
• Use fetch() instead of XMLHttpRequest

Contact Information
Cloudflare Account: dennyrgood subdomain
Worker Name: weather-worker
Worker URL: https://weather-worker.dennyrgood.workers.dev
Device: iPad 2 (MC954LL/A) running iOS 9.3.5

Revision History
• Initial Version: Created functional iOS 9 compatible dashboard with Cloudflare Worker proxy
• Layout Update: Switched to horizontal layout (two cards side-by-side)
• Size Optimization: Increased text sizes for across-the-room readability
• Icon Fix: Implemented transform scaling for large emoji display

Ongoing Improvement
Starting a New Claude Session
If you need to make changes to this setup in a new conversation, use this prompt template:

PROMPT FOR NEW CLAUDE SESSION:

I have a weather dashboard running on an ancient iPad 2 (iOS 9.3.5) that I need help modifying.
CRITICAL CONSTRAINTS:
- Device: iPad 2 (MC954LL/A) running iOS 9.3.5 Safari
- Must use ES5 JavaScript only (no const/let, arrow functions, template literals, fetch, async/await)
- Must use XMLHttpRequest for all API calls
- Must use float-based layouts (no flexbox/grid)
- Must include -webkit- prefixes for all modern CSS
- Emoji icons MUST use transform: scale() to be large (font-size alone doesn't work on iOS 9)
- Example for large emoji: style="font-size: 40px; -webkit-transform: scale(3); transform: scale(3);"
ARCHITECTURE:
- Uses Cloudflare Worker proxy at: https://weather-worker.dennyrgood.workers.dev
- Worker bridges iOS 9's old TLS 1.0/1.1 to modern APIs requiring TLS 1.2+
- Weather data from: api.open-meteo.com
- Currency data from: openexchangerates.org, api.frankfurter.app, api.exchangerate-api.com
CURRENT LAYOUT:
- Horizontal layout: Two weather cards side-by-side (48.5% width each), currency card full-width below
- Large text optimized for viewing from across the room
- Temperature at 7.5em, side info at 2em, all text bold (600-700 weight)
FILES I'M UPLOADING:
- index_old_ipad.html (main dashboard)
- config.html (configuration page, also iOS 9 compatible)
- [optional: worker.js if you have it saved]
WHAT I NEED HELP WITH:
[Describe your specific changes here - e.g., "Add a third location", "Change color theme", "Adjust layout", etc.]
Please maintain ALL iOS 9 compatibility requirements when making changes.

Files to Upload to New Session
When starting a new conversation, upload these files:
1. index_old_ipad.html (Required)
• Main weather dashboard
• Contains all iOS 9 compatible code
• Has Cloudflare Worker proxy URL
2. config.html (Optional but recommended)
• Configuration page for themes/settings
• Also iOS 9 compatible
• Useful if modifying settings interface
3. worker.js (Optional)
• Cloudflare Worker proxy code
• Only needed if modifying API endpoints or security rules
• Can be retrieved from Cloudflare Dashboard if lost

Quick Reference for Common Modifications

Adding a new location:
• Add new card in HTML structure
• Create new fetchWeatherForLocation() call
• Adjust card widths if adding more than 2 locations
Changing themes:
• Modify body.theme-NAME CSS blocks
• Update theme options in config.html
Adjusting text sizes:
• Modify font-size in CSS (use em units)
• Adjust font-weight (600-700 for bold)
• Remember: larger sizes may require layout adjustments
Fixing emoji sizes:
• Always use transform: scale() method
• Format: style="font-size: [base]px; -webkit-transform: scale([multiplier]); transform: scale([multiplier]);"
• Example: font-size: 40px; scale(3) = 120px effective size
Adding new API endpoints:
• Must add to Worker's allowedDomains array
• Update Worker on Cloudflare Dashboard
• Test Worker URL manually before deploying

Testing After Changes
Always test these after modifications:
1. Load page on actual iPad 2 device
2. Verify weather data loads for all locations
3. Verify currency rate displays
4. Check emoji icons are large and visible
5. Confirm layout fits on screen (1024x768)
6. Verify no horizontal scrolling
7. Check readability from 10+ feet away

Emergency Backup
Save these critical values:
• Worker URL: https://weather-worker.dennyrgood.workers.dev
• OpenExchangeRates API Key: 59f0442d524d41608055554519509c57
• Amsterdam coords: 52.3676, 4.9041
• Maspalomas coords: 27.7609, -15.5863

Worker code backup: Available in troubleshooting section above or from Cloudflare Dashboard → Workers &
Pages → weather-worker → Edit Code

