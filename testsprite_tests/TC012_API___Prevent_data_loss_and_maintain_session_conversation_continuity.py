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
        # Send the first test message in the chat input and click Send.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Hello, this is message 1.')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Send the second test message in the chat input and click Send.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('This is message 2.')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Send the third test message in the chat input and click Send.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Message 3 here.')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Send the fourth test message in the chat input and click Send.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Fourth message test.')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Send the fifth test message in the chat input and click Send.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Fifth and final message.')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Extract chat messages from the page content
        chat_messages = [
            {"user_message": "Hello, this is message 1.", "bot_response": "Hi there! Thanks for reaching out. How can I help you today?"},
            {"user_message": "This is message 2.", "bot_response": "Hi there! Thanks for your message. Is there anything specific I can help you with today? Let me know!"},
            {"user_message": "Message 3 here.", "bot_response": "Hi there! Thanks for your message. Is there anything specific I can help you with today? Let me know!"},
            {"user_message": "Fourth message test.", "bot_response": "Hi there! Thanks for your message. Is there anything specific I can help you with today? Let me know!"},
            {"user_message": "Fifth and final message.", "bot_response": "Hi there! Thanks for your message. Is there anything specific I can help you with today? Let me know!"}
         ]
        
        # Request conversation history via API
        response = await page.request.get(f"/api/conversation/history?session_id=9136c297...")
        assert response.ok, "Failed to fetch conversation history"
        history = await response.json()
        
        # Verify the history contains all messages in correct order, with no data loss
        assert len(history["chat_messages"]) == len(chat_messages), "Mismatch in number of chat messages"
        for i, msg in enumerate(chat_messages):
            assert history["chat_messages"][i]["user_message"] == msg["user_message"], f"User message mismatch at index {i}"
            assert history["chat_messages"][i]["bot_response"] == msg["bot_response"], f"Bot response mismatch at index {i}"
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    