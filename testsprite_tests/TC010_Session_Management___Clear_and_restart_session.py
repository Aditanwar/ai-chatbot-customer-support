import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3001", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # Trigger the session restart or clear action by clicking the 'New Session' button.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Send a new message to verify that subsequent messages are stored as a new conversation context.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Hello, is this a new session?')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert that the conversation history is cleared on frontend and backend by checking the new_session flag and chat_log length
        assert page_content['session_info']['new_session'] is True
        assert len(page_content['session_info']['chat_log']) == 2  # Only the new message and bot response should be present
        # Assert that the new message is stored as part of the new conversation context
        assert page_content['session_info']['chat_log'][0]['user'] == 'Hello, is this a new session?'
        assert 'bot' in page_content['session_info']['chat_log'][1]
        assert 'session_id' in page_content['session_info'] and page_content['session_info']['session_id'] != ''
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    