const { test, expect } = require("@playwright/test");

// @ts-check
test("Beeceptor callout proxy", async ({ page }) => {
  await navigateToBeeceptor(page);

  const mockUrl = await createMockServer(page);
  console.log("Mock URL:", mockUrl);

  await apiTest(mockUrl);

  await page.locator('a[type="button"][data-target=".allRules"]').click();

  await synchnorousCallout(page);
  await asynchnorousCallout(page);

  await testAPISync(mockUrl);
  await testAPIAsync(mockUrl);

  await page.pause();
});

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

async function createMockServer(page) {
  await page
    .locator("#mockContent")
    .fill('{"status":200,"message":"data route"}');

  await page.locator('[name="action"]').click();

  const mockUrl = await page.locator("#endpointUrl").textContent();
  expect(mockUrl).not.toBeNull();

  return mockUrl.trim();
}

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

async function synchnorousCallout(page) {
  await selectCalloutOption(page);

  await page.locator("#matchPath").nth(0).fill("/synccall");

  await page
    .locator("#targetEndpoint")
    .fill("https://jsonplaceholder.typicode.com/todos/1");

  await page
    .locator("#ruleDescription")
    .nth(0)
    .fill("Synchronous proxy callout");

  await page.locator("#saveProxy").click();

  //const ruleDescription = await page.locator("#ruleDescription").textContent();
  //expect(ruleDescription).toContain("Synchronous proxy callout");
}

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

  await page
    .locator("#targetEndpoint")
    .fill("https://jsonplaceholder.typicode.com/todos/1");

  await page
    .locator("#ruleDescription")
    .nth(0)
    .fill("Asynchronous proxy callout");

  await page.locator("#saveProxy").click();
}

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

async function testAPISync(url) {
  try {
    const response = await fetch(`${url}/synccall`);
    const data = await response.json();

    expect(data).toEqual({
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false,
    });
  } catch (err) {
    console.log("API Unavalialbe:", err);
    throw err;
  }
}

async function testAPIAsync(url) {
  try {
    const response = await fetch(`${url}/asynccall`);
    const data = await response.json();

    expect(data).toEqual({
      status: 202,
      message: "Request in process",
    });
  } catch (err) {
    console.log("API Unavalialbe:", err);
    throw err;
  }
}
