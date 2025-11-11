# Editing Guidelines for `weather-dashboard`

This document provides a set of guidelines for editing the code in the `weather-dashboard` project, with a specific focus on maintaining compatibility with legacy devices such as iPad2.

## General Principles
1. **Maintain Compatibility**: Changes should ensure compatibility with legacy devices, particularly the iPad2, which relies on older browser capabilities and ES5-compliant JavaScript.
2. **Test Thoroughly**: Always test changes on target devices or simulators to verify functionality.
3. **Adhere to Best Practices**: Implement edits with modern development standards where possible, without breaking compatibility with older environments.

## Specific Guidelines

### 1. ES5 Compliance
- Use strict ES5 syntax and avoid modern JavaScript features, such as:
  - Arrow functions (`() => {}`)
  - `let` and `const` (use `var` instead)
  - Promises and async/await
  - Default parameters
- Avoid polyfills unless absolutely necessary.

### 2. Vendor Prefixes
- Include vendor-prefixed CSS properties in addition to standard properties to ensure support for legacy browsers:
  ```css
  background: -webkit-linear-gradient(315deg, #fef3c7 0%, #fde68a 100%);
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  ```

### 3. Layout Rules for iPad2
- Ensure that layout rules accommodate the specific resolution and capabilities of older devices:
  ```css
  @media only screen and (max-width: 1024px) and (max-height: 768px) {
      .weather-icon {
          font-size: 40px;
          -webkit-transform: scale(7);
          transform: scale(7);
          margin: 20px 50px 0 0;
      }
  }
  ```
- Use fallback styles when possible to avoid reliance on flexbox or grid layouts.

### 4. Proxy Requirements for Older Browsers
- The iPad2 requires a proxy for certain network requests:
  ```javascript
  var proxyParam = getUrlParameter('proxy');
  var proxyUrl = proxyParam || 'https://weatherproxy.ldmathes.cc/';
  SharedData.setProxyMode(true, proxyUrl);
  ```

### 5. Testing and Validation
- Test thoroughly on an iPad2 or a simulated environment replicating its browser.
- Validate code against older Safari versions to catch compatibility issues early.

## Future Considerations
- Consider introducing progressive enhancements where modern features are used for non-legacy devices.
- Use feature detection to deliver appropriate experiences based on the device's capabilities.
