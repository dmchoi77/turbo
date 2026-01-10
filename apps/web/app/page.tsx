"use client";
import { useState } from "react";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import {
  capitalize,
  sumAndMultiply,
  deepCloneObject,
  chunk,
  unique,
  flatten,
  groupBy,
  sortBy,
  max,
  min,
  sumArray,
  mean,
  camelCase,
  kebabCase,
  snakeCase,
  pascalCase,
  startCase,
  trim,
  repeat,
  pad,
  formatDate,
  addDays,
  subtractDays,
  diffInDays,
  fromNow,
  isValidDate,
  clamp,
  round,
  floor,
  ceil,
  random,
  inRange,
  abs,
  sqrt,
  pow,
  log,
  merge,
  keys,
  values,
  entries,
  get,
  omit,
  pick,
  isEmpty,
  isEqual,
  isValidEmail,
  isValidUrl,
  isValidPhone,
  checkPasswordStrength,
  isInRange,
  isLength,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatFileSize,
  formatDuration,
  map,
  reduce,
  filter,
  find,
  findIndex,
  every,
  some,
  size,
} from "@repo/utils";
import { Radio, RadioGroup } from "@repo/ui/radio";
import { Modal } from "@repo/ui/modal";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { Table } from "@repo/ui/table";
import { Checkbox } from "@repo/ui/checkbox";
import { Textarea } from "@repo/ui/textarea";
import { Badge } from "@repo/ui/badge";
import { Alert } from "@repo/ui/alert";
import { Spinner } from "@repo/ui/spinner";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@repo/ui/tabs";
import { Progress } from "@repo/ui/progress";
import { Switch } from "@repo/ui/switch";
import { Avatar } from "@repo/ui/avatar";
import { Divider } from "@repo/ui/divider";
import { Pagination } from "@repo/ui/pagination";
export default function Page(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("option1");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [progressValue, setProgressValue] = useState(45);
  const [showAlert, setShowAlert] = useState(true);

  const result = sumAndMultiply(5, 5, 10); // (5 * 5) + 10 = 35

  // Use the function that depends on lodash
  const originalObject = { a: 1, b: { c: 2 } };
  const clonedObject = deepCloneObject(originalObject);

  // Array utilities demo
  const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const chunked = chunk(testArray, 3);
  const uniqueArray = unique([1, 2, 2, 3, 3, 4]);
  const flattened = flatten([
    [1, 2],
    [3, 4],
    [5, 6],
  ]);
  const grouped = groupBy(
    [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
      { name: "Charlie", age: 25 },
    ],
    "age"
  );
  const sorted = sortBy(
    [
      { name: "Bob", age: 30 },
      { name: "Alice", age: 25 },
    ],
    "age"
  );
  const maxValue = max([1, 5, 3, 9, 2]);
  const minValue = min([1, 5, 3, 9, 2]);
  const sumResult = sumArray([1, 2, 3, 4, 5]);
  const meanValue = mean([1, 2, 3, 4, 5]);

  // String utilities demo
  const camelCased = camelCase("hello world");
  const kebabCased = kebabCase("Hello World");
  const snakeCased = snakeCase("Hello World");
  const pascalCased = pascalCase("hello world");
  const startCased = startCase("helloWorld");
  const trimmed = trim("  hello  ");
  const repeated = repeat("hi", 3);
  const padded = pad("5", 3, "0");

  // Date utilities demo
  const now = new Date();
  const formattedDate = formatDate(now, "YYYY-MM-DD HH:mm:ss");
  const futureDate = addDays(now, 7);
  const pastDate = subtractDays(now, 7);
  const daysDiff = diffInDays(futureDate, pastDate);
  const relativeTime = fromNow(pastDate);
  const isValid = isValidDate(now);

  // Math utilities demo
  const clamped = clamp(150, 0, 100);
  const rounded = round(3.14159, 2);
  const floored = floor(3.9);
  const ceiled = ceil(3.1);
  const randomNum = random(1, 100);
  const inRangeCheck = inRange(50, 0, 100);
  const absolute = abs(-42);
  const squareRoot = sqrt(16);
  const power = pow(2, 8);
  const logarithm = log(Math.E);

  // Object utilities demo
  const merged = merge<{ a: number; b: number; c: number }>(
    { a: 1 },
    { b: 2 },
    { c: 3 }
  );
  const objectKeys = keys({ a: 1, b: 2, c: 3 });
  const objectValues = values({ a: 1, b: 2, c: 3 });
  const objectEntries = entries({ a: 1, b: 2 });
  const gotValue = get<string>({ user: { name: "John" } }, "user.name", "");
  const picked = pick({ a: 1, b: 2, c: 3 }, "a", "b");
  const omitted = omit({ a: 1, b: 2, c: 3 }, "c");
  const emptyCheck = isEmpty({});
  const equalCheck = isEqual({ a: 1 }, { a: 1 });

  // Validation utilities demo
  const emailValid = isValidEmail("test@example.com");
  const urlValid = isValidUrl("https://example.com");
  const phoneValid = isValidPhone("123-456-7890");
  const passwordStrength = checkPasswordStrength("Password123!");
  const rangeCheck = isInRange(50, 0, 100);
  const lengthCheck = isLength("hello", 3, 10);

  // Formatting utilities demo
  const currency = formatCurrency(1234.56, "USD");
  const number = formatNumber(1234567);
  const percent = formatPercent(0.75);
  const fileSize = formatFileSize(1024 * 1024 * 5);
  const duration = formatDuration(3661);

  // Collection utilities demo
  const mapped = map([1, 2, 3], (x: number) => x * 2);
  const reduced = reduce([1, 2, 3], (acc: number, x: number) => acc + x, 0);
  const filtered = filter([1, 2, 3, 4, 5], (x: number) => x > 2);
  const found = find([1, 2, 3, 4, 5], (x: number) => x > 3);
  const foundIndex = findIndex([1, 2, 3, 4, 5], (x: number) => x > 3);
  const everyCheck = every([2, 4, 6], (x: number) => x % 2 === 0);
  const someCheck = some([1, 3, 4], (x: number) => x % 2 === 0);
  const collectionSize = size([1, 2, 3, 4, 5]);

  // Table data
  const tableData = [
    { id: 1, name: "Alice", age: 25, email: "alice@example.com" },
    { id: 2, name: "Bob", age: 30, email: "bob@example.com" },
    { id: 3, name: "Charlie", age: 35, email: "charlie@example.com" },
  ];

  const tableColumns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "age", header: "Age" },
    { key: "email", header: "Email" },
  ];

  const selectOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  originalObject.b.c = 99;
  console.log("Original Object:", originalObject);
  console.log("Cloned Object:", clonedObject);
  console.log("All utilities loaded:", {
    chunked,
    uniqueArray,
    flattened,
    grouped,
    sorted,
    maxValue,
    minValue,
    sumResult,
    meanValue,
    camelCased,
    kebabCased,
    snakeCased,
    pascalCased,
    formattedDate,
    clamped,
    rounded,
    merged,
    emailValid,
    currency,
    mapped,
    reduced,
  });

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        {capitalize("web")} <br />
        (5 * 5) + 10 = {result}
      </h1>

      <p className={styles.description}>
        This page uses extensive utilities and components to increase bundle
        size. Check the browser console for utility function outputs!
      </p>

      <div className={styles.grid}>
        <Card
          title="Docs"
          href="https://turbo.build/repo/docs"
          className={styles.card}
        >
          Find in-depth information about Turborepo features and API.
        </Card>
        <Card
          title="Learn"
          href="https://turbo.build/repo/docs/handbook"
          className={styles.card}
        >
          Learn about Turborepo in an interactive course with quizzes!
        </Card>
        <Card
          title="Templates"
          href="https://vercel.com/templates/next.js/turborepo-template"
          className={styles.card}
        >
          Explore a variety of Turborepo templates.
        </Card>
        <Card
          title="Deploy"
          href="https://vercel.com/new"
          className={styles.card}
        >
          Instantly deploy your Turborepo to a shareable URL with Vercel.
        </Card>
      </div>

      <div
        style={{
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Buttons and Controls */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Button appName="web" onClick={() => setIsModalOpen(true)}>
            Open Modal
          </Button>
          <Button appName="web">Primary Button</Button>
          <Badge variant="primary">Primary Badge</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Spinner size="md" />
          <Avatar size="md">JD</Avatar>
        </div>

        {/* Form Controls */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxWidth: "400px",
          }}
        >
          <Input
            label="Text Input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter text..."
            fullWidth
          />
          <Select
            label="Select Option"
            options={selectOptions}
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
            fullWidth
          />
          <Textarea
            label="Textarea"
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
            rows={4}
            fullWidth
          />
          <Checkbox
            label="Check this box"
            checked={checkboxChecked}
            onChange={(e) => setCheckboxChecked(e.target.checked)}
          />
          <Switch
            label="Toggle Switch"
            checked={switchChecked}
            onChange={(e) => setSwitchChecked(e.target.checked)}
          />
        </div>

        {/* Radio Group */}
        <RadioGroup
          value="1"
          onChange={(value) => console.log(value)}
          name="test"
        >
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
          <Radio value="3" label="Option 3" />
        </RadioGroup>

        {/* Progress Bar */}
        <div style={{ maxWidth: "400px" }}>
          <Progress
            value={progressValue}
            showLabel
            variant="default"
            size="md"
          />
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <Button
              appName="web"
              onClick={() => setProgressValue(Math.max(0, progressValue - 10))}
            >
              Decrease
            </Button>
            <Button
              appName="web"
              onClick={() =>
                setProgressValue(Math.min(100, progressValue + 10))
              }
            >
              Increase
            </Button>
          </div>
        </div>

        {/* Alert */}
        {showAlert && (
          <Alert
            variant="info"
            title="Information"
            dismissible
            onClose={() => setShowAlert(false)}
          >
            This is an informational alert that can be dismissed.
          </Alert>
        )}

        {/* Tabs */}
        <Tabs defaultTab="tab1">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="tab1">
              <div style={{ padding: "1rem" }}>
                <h3>Tab 1 Content</h3>
                <p>This is the content for tab 1.</p>
              </div>
            </TabPanel>
            <TabPanel value="tab2">
              <div style={{ padding: "1rem" }}>
                <h3>Tab 2 Content</h3>
                <p>This is the content for tab 2.</p>
              </div>
            </TabPanel>
            <TabPanel value="tab3">
              <div style={{ padding: "1rem" }}>
                <h3>Tab 3 Content</h3>
                <p>This is the content for tab 3.</p>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Divider */}
        <Divider label="Section Divider" />

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <Table
            columns={tableColumns}
            data={tableData}
            striped
            hoverable
            onRowClick={(row) => console.log("Row clicked:", row)}
          />
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          showFirstLast
        />

        {/* Utility Results Display */}
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <h3>Utility Function Results:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>Chunked: {JSON.stringify(chunked)}</li>
            <li>Unique: {JSON.stringify(uniqueArray)}</li>
            <li>
              Max: {maxValue}, Min: {minValue}
            </li>
            <li>
              Sum: {sumResult}, Mean: {meanValue}
            </li>
            <li>
              Camel: {camelCased}, Kebab: {kebabCased}
            </li>
            <li>Date: {formattedDate}</li>
            <li>
              Clamped: {clamped}, Rounded: {rounded}
            </li>
            <li>Email Valid: {emailValid ? "Yes" : "No"}</li>
            <li>Currency: {currency}</li>
            <li>Mapped: {JSON.stringify(mapped)}</li>
            <li>Reduced: {reduced}</li>
            <li>Filtered: {JSON.stringify(filtered)}</li>
            <li>Found: {found}</li>
            <li>Found Index: {foundIndex}</li>
            <li>Every Check: {everyCheck ? "Yes" : "No"}</li>
            <li>Some Check: {someCheck ? "Yes" : "No"}</li>
            <li>Collection Size: {collectionSize}</li>
            <li>Start Case: {startCased}</li>
            <li>Trimmed: {trimmed}</li>
            <li>Repeated: {repeated}</li>
            <li>Padded: {padded}</li>
            <li>Days Diff: {daysDiff}</li>
            <li>Relative Time: {relativeTime}</li>
            <li>Is Valid Date: {isValid ? "Yes" : "No"}</li>
            <li>
              Floored: {floored}, Ceiled: {ceiled}
            </li>
            <li>
              Random: {randomNum}, In Range: {inRangeCheck ? "Yes" : "No"}
            </li>
            <li>
              Absolute: {absolute}, Sqrt: {squareRoot}, Power: {power}, Log:{" "}
              {logarithm}
            </li>
            <li>Object Keys: {JSON.stringify(objectKeys)}</li>
            <li>Object Values: {JSON.stringify(objectValues)}</li>
            <li>Object Entries: {JSON.stringify(objectEntries)}</li>
            <li>Got Value: {String(gotValue)}</li>
            <li>Picked: {JSON.stringify(picked)}</li>
            <li>Omitted: {JSON.stringify(omitted)}</li>
            <li>Empty Check: {emptyCheck ? "Yes" : "No"}</li>
            <li>Equal Check: {equalCheck ? "Yes" : "No"}</li>
            <li>URL Valid: {urlValid ? "Yes" : "No"}</li>
            <li>Phone Valid: {phoneValid ? "Yes" : "No"}</li>
            <li>Password Strength: {passwordStrength.score}/5</li>
            <li>Range Check: {rangeCheck ? "Yes" : "No"}</li>
            <li>Length Check: {lengthCheck ? "Yes" : "No"}</li>
            <li>
              Number: {number}, Percent: {percent}
            </li>
            <li>
              File Size: {fileSize}, Duration: {duration}
            </li>
          </ul>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        size="lg"
      >
        <div>
          <p>
            This is a modal dialog with lots of content to increase bundle size.
          </p>
          <Input label="Modal Input" placeholder="Type here..." fullWidth />
          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <Button appName="web" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button appName="web">Save</Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
