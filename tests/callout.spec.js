const { test, expect } = require("@playwright/test");

// @ts-check
test("Beeceptor callout proxy", async ({ page }) => {
  await navigateToBeeceptor(page);

  const mockUrl = await createMockServer(page);
  console.log("Mock URL:", mockUrl);

  await apiTest(mockUrl);

  await page.locator('a[type="button"][data-target=".allRules"]').click();

  await page.screenshot();

  await synchnorousCallout(page);
  await asynchnorousCallout(page);

  await page.screenshot();

  await testAPISync(mockUrl);
  await testAPIAsync(mockUrl);

  await page.pause();
});

// Navigation to the Beeceptor
async function navigateToBeeceptor(page) {
  await page.goto("https://beeceptor.com");
  await page
    .locator(
      "body > div.navbar.navbar-default.navbar-fixed-top.navbar-inverse2 > div > div.collapse.navbar-collapse > ul:nth-child(1) > li:nth-child(2) > a",
    )
    .click();
  await page
    .locator(
      "body > div.navbar.navbar-default.navbar-fixed-top.navbar-inverse2 > div > div.collapse.navbar-collapse > ul:nth-child(1) > li.dropdown.open > ul > li:nth-child(1) > a",
    )
    .click();
}

//Create a Mock server
async function createMockServer(page) {
  await page
    .locator("#mockContent")
    .fill('{"status":200,"message":"data route"}');

  await page.locator('[name="action"]').click();

  const mockUrl = await page.locator("#endpointUrl").textContent();
  expect(mockUrl).not.toBeNull();

  await page.screenshot();

  return mockUrl.trim();
}

//Open rules window
async function selectCalloutOption(page) {
  await page
    .getByRole("button", {
      name: "Additional Rule Types",
      exact: true,
    })
    .click();

  await page
    .locator(
      "#rulesList > div:nth-child(3) > div > div > div > ul > li:nth-child(2) > a",
    )
    .click();
}

// set synchnorous callout proxy
async function synchnorousCallout(page) {
  await selectCalloutOption(page);

  await page.locator("#matchPath").nth(0).fill("/synccall");

  await page.locator("#targetEndpoint").fill("https://reqres.in/api/users/2");

  await page
    .locator("#ruleDescription")
    .nth(0)
    .fill("Synchronous proxy callout");

  await page.screenshot();

  await page.locator("#saveProxy").click();
}

// set asynchnorous callout proxy
async function asynchnorousCallout(page) {
  await selectCalloutOption(page);

  await page.locator("#matchPath").nth(0).fill("/asynccall");

  const selectElement = page.locator('xpath=//*[@id="proxyEdit.behavior"]');

  await selectElement.selectOption("no-wait");

  //await page.locator('xpath=//*[@id="status"]').fill("202");

  await page
    .locator("#resBody")
    .nth(0)
    .fill('{"status":202,"message": "Request in process"}');

  await page.locator("#targetEndpoint").fill("https://reqres.in/api/users/2");

  await page
    .locator("#ruleDescription")
    .nth(0)
    .fill("Asynchronous proxy callout");

  await page.screenshot();

  await page.locator("#saveProxy").click();
}

// Test the newly created Mock server
async function apiTest(url) {
  try {
    const response = await fetch(`${url}/data`);
    const data = await response.json();

    expect(data).toEqual({ status: 200, message: "data route" });
    console.log("API Response ==>", data);
  } catch (err) {
    console.error("API Unavailable ==> ", err);
    throw err;
  }
}

//Test synchnorous api
async function testAPISync(url) {
  try {
    const response = await fetch(`${url}/synccall`);
    const data = await response.json();
    console.log("Data from synchnorous callout ==> ", data);

    expect(data).toEqual({
      data: {
        id: 2,
        email: "janet.weaver@reqres.in",
        first_name: "Janet",
        last_name: "Weaver",
        avatar: "https://reqres.in/img/faces/2-image.jpg",
      },
      support: {
        url: "https://contentcaddy.io?utm_source=reqres&utm_medium=json&utm_campaign=referral",
        text: "Tired of writing endless social media content? Let Content Caddy generate it for you.",
      },
    });

    return;
  } catch (err) {
    console.log("API Unavalialbe:", err);
    throw err;
  }
}

//Test asynchnorous api
async function testAPIAsync(url) {
  try {
    const response = await fetch(`${url}/asynccall`);
    const data = await response.json();
    console.log("Data from synchnorous callout ==> ", data);

    expect(data).toEqual({
      status: 202,
      message: "Request in process",
    });

    return;
  } catch (err) {
    console.log("API Unavalialbe:", err);
    throw err;
  }
}
