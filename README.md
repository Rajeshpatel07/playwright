# Playwright Automation for Beeceptor

This project automates the testing of API callouts using [Playwright](https://playwright.dev/) and [Beeceptor](https://beeceptor.com/). The automation script creates mock servers, performs synchronous and asynchronous API callouts, and verifies the responses.

## Prerequisites

- Node.js (version 18 or later)
- npm (Node package manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Rajeshpatel07/playwright.git
   cd playwright
   ```

2. Install dependencies

   ```bash
   npm install
   ```

## Testing

1. Before running the test change the `Browser`.This test will run in `firefox` by default to change `Browser`. Go to `playwright.config.js` and uncomment the below code.

   ```bash
   projects: [
    //{
    //  name: "chromium",
    //  use: { ...devices["Desktop Chrome"] },
    //},

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    //{
    //  name: "webkit",
    //  use: { ...devices["Desktop Safari"] },
    //},
    ]


   ```


2. To run the tests, use the following command.

   ```bash
   npx playwright test
   ```

3. To run the tests in `UI mode` use the following command.
   
   ```bash
   npx playwright test --ui
   ```

4. To run the tests with local browser, use the following command.

   ```bash
   npx playwright test --headed
   ```
