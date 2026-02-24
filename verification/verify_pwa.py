from playwright.sync_api import sync_playwright

def verify_pwa():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to the local preview server
        page.goto("http://localhost:4173/")

        # Wait for content to load
        page.wait_for_load_state("networkidle")

        # Take a screenshot
        page.screenshot(path="verification/pwa_screenshot.png")

        # Check title
        print(f"Page Title: {page.title()}")

        # Check if manifest link exists
        manifest = page.locator("link[rel='manifest']")
        print(f"Manifest link found: {manifest.count() > 0}")
        if manifest.count() > 0:
            print(f"Manifest href: {manifest.get_attribute('href')}")

        browser.close()

if __name__ == "__main__":
    verify_pwa()
