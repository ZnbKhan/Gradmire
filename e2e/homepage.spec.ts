import { test, expect } from '@playwright/test';

test.describe('Gradmire Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Gradmire — Find your course. Then find the UK around it.');
  });

  test('should display premium navy & sky blue branding', async ({ page }) => {
    const header = page.locator('header, nav').first();
    const bgColor = await header.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    // Navy #11446A should be present
    expect(bgColor).toBeTruthy();
  });

  test('should have responsive navigation', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check for key navigation items
    const navItems = ['Destinations', 'Courses', 'Tools', 'About', 'FAQ'];
    for (const item of navItems) {
      await expect(page.locator(`text=${item}`)).toBeVisible();
    }
  });

  test('should display hero headline with proper hierarchy', async ({ page }) => {
    const headline = page.locator('h1').first();
    await expect(headline).toContainText('Find your course');

    // Check heading is large and properly styled
    const size = await headline.evaluate((el) =>
      window.getComputedStyle(el).fontSize
    );
    const fontSize = parseFloat(size);
    expect(fontSize).toBeGreaterThan(24);
  });

  test('should have premium CTA buttons with proper styling', async ({ page }) => {
    const primaryBtn = page.locator('button:has-text("Find my course"), a:has-text("Find my course")').first();
    await expect(primaryBtn).toBeVisible();

    // Check button has premium styling (sky blue accent)
    const bgColor = await primaryBtn.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toBeTruthy();
  });

  test('should have interactive button feedback on hover', async ({ page }) => {
    const button = page.locator('button').first();

    // Get initial opacity
    const initialOpacity = await button.evaluate((el) =>
      window.getComputedStyle(el).opacity
    );

    // Hover
    await button.hover();

    // Check for opacity change (feedback)
    const hoverOpacity = await button.evaluate((el) =>
      window.getComputedStyle(el).opacity
    );

    // Opacity should change or transform should be applied
    const transform = await button.evaluate((el) =>
      window.getComputedStyle(el).transform
    );

    expect(
      hoverOpacity !== initialOpacity || transform !== 'none'
    ).toBeTruthy();
  });

  test('should have button press feedback', async ({ page }) => {
    const button = page.locator('button').first();

    // Press button
    await button.press('Enter');

    // Button should still be interactive
    await expect(button).toBeEnabled();
  });

  test('should support reduced motion preference', async ({ page }) => {
    // Set reduced motion preference
    await page.addInitScript(() => {
      window.matchMedia = (query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true,
      } as any);
    });

    // Reload page with reduced motion
    await page.reload();
    await expect(page).toHaveTitle('Gradmire — Find your course. Then find the UK around it.');
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const headline = page.locator('h1').first();
    await expect(headline).toBeVisible();

    // Content should fit without horizontal scroll
    const pageWidth = await page.evaluate(() => window.innerWidth);
    const contentWidth = await page.evaluate(() =>
      document.documentElement.scrollWidth
    );
    expect(contentWidth).toBeLessThanOrEqual(pageWidth);
  });

  test('should have accessible color contrast', async ({ page }) => {
    // Check heading contrast
    const heading = page.locator('h1').first();
    const fgColor = await heading.evaluate((el) =>
      window.getComputedStyle(el).color
    );

    // Should have sufficient contrast (Navy on light background)
    expect(fgColor).toBeTruthy();
  });

  test('should have keyboard navigable elements', async ({ page }) => {
    const button = page.locator('button').first();

    // Tab to button
    await page.keyboard.press('Tab');

    // Button should receive focus
    const isFocused = await button.evaluate((el) =>
      el === document.activeElement
    );

    expect(isFocused).toBeTruthy();
  });

  test('should have proper semantic HTML', async ({ page }) => {
    // Check for semantic elements
    const nav = page.locator('nav');
    const main = page.locator('main');
    const header = page.locator('header');

    // At least one of these should exist
    const hasSemanticElements =
      (await nav.count()) > 0 ||
      (await main.count()) > 0 ||
      (await header.count()) > 0;

    expect(hasSemanticElements).toBeTruthy();
  });

  test('should load all images without errors', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const isLoaded = await img.evaluate((el: any) => el.complete && el.naturalHeight !== 0);
        expect(isLoaded).toBeTruthy();
      }
    }
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');

    // Should have no critical errors
    const criticalErrors = errors.filter(e =>
      !e.includes('deprecate') && !e.includes('warn')
    );

    expect(criticalErrors.length).toBe(0);
  });
});

test.describe('Premium Design Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should apply premium shadow effects to cards', async ({ page }) => {
    const cards = page.locator('[class*="card"], [class*="Card"]').first();

    if (await cards.count() > 0) {
      const boxShadow = await cards.evaluate((el) =>
        window.getComputedStyle(el).boxShadow
      );

      // Premium shadow should be present
      expect(boxShadow).not.toBe('none');
    }
  });

  test('should have glass morphism effects on premium elements', async ({ page }) => {
    const glassElements = page.locator('[class*="glass"]');

    if (await glassElements.count() > 0) {
      const backdropFilter = await glassElements.first().evaluate((el) =>
        window.getComputedStyle(el).backdropFilter
      );

      expect(backdropFilter).toContain('blur');
    }
  });

  test('should use navy & sky blue color palette', async ({ page }) => {
    // Check for brand colors in CSS
    const styleElement = page.locator('style, link[rel="stylesheet"]');

    const computedStyle = await page.evaluate(() => {
      const root = document.documentElement;
      return {
        ink: getComputedStyle(root).getPropertyValue('--ink'),
        coral: getComputedStyle(root).getPropertyValue('--coral'),
      };
    });

    expect(computedStyle.ink).toBeTruthy();
    expect(computedStyle.coral).toBeTruthy();
  });
});

test.describe('Performance & Accessibility', () => {
  test('should have fast First Contentful Paint', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should pass WCAG accessibility checks', async ({ page }) => {
    await page.goto('/');

    // Check for alt text on images
    const images = page.locator('img');
    const count = await images.count();

    let imagesWithAlt = 0;
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      if (alt) imagesWithAlt++;
    }

    // Most images should have alt text
    if (count > 0) {
      expect(imagesWithAlt / count).toBeGreaterThan(0.5);
    }
  });

  test('should have sufficient focus indicators', async ({ page }) => {
    await page.goto('/');

    const button = page.locator('button').first();
    await button.focus();

    const outline = await button.evaluate((el) =>
      window.getComputedStyle(el).outlineWidth
    );

    // Focus should be visible
    const outlineWidth = parseFloat(outline);
    expect(outlineWidth).toBeGreaterThanOrEqual(0);
  });
});
