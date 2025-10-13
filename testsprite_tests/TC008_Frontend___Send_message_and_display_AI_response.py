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
        # Enter a valid message in the chat input and submit it.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Hello, I need help with my order.')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Test sending another message to verify continued chat functionality.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Can you help me change my delivery address?')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert the first user message appears in the chat window
        first_user_message = 'Hello, I need help with my order.'
        first_message_locator = frame.locator(f'text="{first_user_message}"')
        await first_message_locator.wait_for(timeout=5000)
        assert await first_message_locator.is_visible()
          
        # Assert the AI response to the first message appears promptly and contextually
        ai_response_1 = 'You can track your order by logging into your account and going to \'My Orders\', or by using the tracking number sent to your email. You can also track packages directly on the shipping carrier\'s website.'
        ai_response_locator_1 = frame.locator(f'text="{ai_response_1}"')
        await ai_response_locator_1.wait_for(timeout=10000)
        assert await ai_response_locator_1.is_visible()
          
        # Assert the second user message appears in the chat window
        second_user_message = 'Can you help me change my delivery address?'
        second_message_locator = frame.locator(f'text="{second_user_message}"')
        await second_message_locator.wait_for(timeout=5000)
        assert await second_message_locator.is_visible()
          
        # Assert the AI response to the second message appears promptly and contextually
        ai_response_2 = 'You can contact our customer support through this chat, email at support@company.com, or phone at 1-800-SUPPORT. Our support team is available Monday-Friday, 9 AM to 6 PM EST.'
        ai_response_locator_2 = frame.locator(f'text="{ai_response_2}"')
        await ai_response_locator_2.wait_for(timeout=10000)
        assert await ai_response_locator_2.is_visible()
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    