## what this script do?

 I have automated the process of configuring a `proxy rule` for   `synchnorous & asynchnorous callout` in Beeceptor using Playwright. This automation streamlines the setup process by simulating user interactions with the Beeceptor interface. which help us to test and debug the process.

## Automation script

- The script will automatically open `Beeceptor dashboard` and create a `Mock server` with `/data` route with some data.

- After creating the `Mock server` it will get the `url` of the server and test it with the `/data` path and check if the data is equal to our assertion.

- Then it will go to the `Mock Rules` and open `proxy configuration window`.

- The `Synchnorous callout` will set path to `/synccall` and then it will set the other endpoint with `jsonplaceholder` url.

- Then the description is been setted. The `synchnorous callout` will be saved.

- The script will again open the `proxy configuration window`.

- It set's the path to `/asynccall` and then it will make it asynchnorous. Then it will create a `Custom payload response` to be returned to the original requested user.

- it will set the target endpoint with `jsonplaceholder` url and set the description and save the proxy rule.

- After the setup the script will test the both the  endpoints with the `mock server url` and make assertion.

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
