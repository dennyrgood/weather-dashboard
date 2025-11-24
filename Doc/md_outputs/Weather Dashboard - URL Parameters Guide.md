# Weather Dashboard - URL Parameters Guide

Extracted from PDF: Weather Dashboard - URL Parameters Guide.pdf

---

Weather Dashboard - URL Parameters Guide
Base URL
https://dennyrgood.github.io/weather-dashboard/

Available Parameters
1. layout - Display Layout
Controls the visual arrangement of weather information.
Value

Description

Best For

se

Compact side-by-side layout

iPhone SE landscape (default)

horizontal

Larger horizontal layout

Tablets, larger phones

vertical

Traditional stacked layout

Portrait mode, standard displays

Default: se
Example:
?layout=horizontal

2. theme - Color Theme
Changes the color scheme of the entire dashboard.
Value

Description

Colors

amber

Warm and easy on eyes

Beige/yellow gradient, dark brown text (default)

blue

Cool and modern

Pale blue gradient, navy text

gray

Professional high contrast

Light gray gradient, black text

cream

Soft paper-like

Off-white/cream gradient, charcoal text

green

Retro CRT terminal

Bright green text on black, monospace font, glow effects

blackgreen

Modern green

Black text on bright green background

amberblack

High contrast amber

Amber/gold text on black background

Default: amber
Example:
?theme=green

3. low - Currency Low Threshold
Sets the lower limit for favorable EUR/USD exchange rate. When the rate drops below this value, a green
checkmark ✅ appears.
Value Type: Decimal number (e.g., 1.1, 1.15, 1.08)
Default: 1.1

Example:
?low=1.15

4. high - Currency High Threshold
Sets the upper limit for favorable EUR/USD exchange rate. When the rate exceeds this value, a red X ❌
appears.
Value Type: Decimal number (e.g., 1.2, 1.18, 1.25)
Default: 1.2
Example:
?high=1.18

Complete Examples
Example 1: Default Settings
https://dennyrgood.github.io/weather-dashboard/

Equivalent to: ?layout=se&theme=amber&low=1.1&high=1.2

Example 2: Retro CRT Style
https://dennyrgood.github.io/weather-dashboard/?layout=se&theme=green

Perfect for that 1980s terminal aesthetic

Example 3: Custom Thresholds
https://dennyrgood.github.io/weather-dashboard/?layout=se&low=1.15&high=1.18

Tighter range for exchange rate alerts

Example 4: Blue Theme with Custom Thresholds
https://dennyrgood.github.io/weather-dashboard/?layout=se&theme=blue&low=1.12&high=1.17

Example 5: Horizontal Layout, Amber on Black
https://dennyrgood.github.io/weather-dashboard/?layout=horizontal&theme=amberblack

Example 6: All Parameters
https://dennyrgood.github.io/weather-dashboard/?layout=se&theme=blackgreen&low=1.08&high=1.22

Quick Reference URLs

Theme Shortcuts
• Amber (default): ?layout=se&theme=amber
• Blue: ?layout=se&theme=blue
• Gray: ?layout=se&theme=gray
• Cream: ?layout=se&theme=cream
• Retro Green: ?layout=se&theme=green
• Black on Green: ?layout=se&theme=blackgreen
• Amber on Black: ?layout=se&theme=amberblack

Dashboard Features
Weather Information
• Two Locations: Amsterdam and Maspalomas, Gran Canaria
• Current Conditions: Temperature (°F and °C), weather icon, rain probability
• Forecasts: Today's high/low, tomorrow's high/low
• Additional Data: Sunrise/sunset times, humidity, wind speed

Currency Exchange
• Primary Source: OpenExchangeRates (OXR) - Real-time rates
• Backup Sources: European Central Bank (ECB), ExchangeRate-API
• Display: EUR → USD rate with timestamp
• Smart Polling: Active Sunday 21:00 UTC → Friday 21:00 UTC
• Threshold Alerts: Visual indicators when rates are favorable/unfavorable

Auto-Updates
• Weather: Every 10 minutes
• Currency: Every hour (during active polling window only)
• Time/Date: Every second

Technical Notes
• All parameters are optional
• Parameters can be combined in any order
• Invalid parameter values default to standard settings
• Currency updates pause Friday 21:00 UTC → Sunday 21:00 UTC to conserve API quota
• Initial currency fetch occurs on page load regardless of polling window

Last Updated: October 11, 2025

