"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Select } from "@repo/ui/select";
import { Textarea } from "@repo/ui/textarea";
import { Checkbox } from "@repo/ui/checkbox";
import { Switch } from "@repo/ui/switch";
import { Radio, RadioGroup } from "@repo/ui/radio";
import { Modal } from "@repo/ui/modal";
import { Badge } from "@repo/ui/badge";
import { Alert } from "@repo/ui/alert";
import { Spinner } from "@repo/ui/spinner";
import { Progress } from "@repo/ui/progress";
import { Avatar } from "@repo/ui/avatar";
import { Divider } from "@repo/ui/divider";
import { Card } from "@repo/ui/card";
import { DataVisualization } from "@repo/ui/data-visualization";

export default function Test1Page(): JSX.Element {
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("option1");
  const [textareaValue, setTextareaValue] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [progressValue, setProgressValue] = useState(50);

  const selectOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1
        style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: "bold" }}
      >
        Test Page 1 - Form Components
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Buttons Section */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Buttons</h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Button appName="web">Primary Button</Button>
            <Button appName="web" onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
            <Button appName="web" onClick={() => setShowAlert(true)}>
              Show Alert
            </Button>
          </div>
        </section>

        <Divider label="Form Controls" />

        {/* Form Controls Section */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Form Controls
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              maxWidth: "500px",
            }}
          >
            <Input
              label="Text Input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter text..."
              fullWidth
            />

            <Input
              label="Input with Error"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              error="This field is required"
              fullWidth
            />

            <Input
              label="Input with Helper Text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="This is helpful information"
              fullWidth
            />

            <Select
              label="Select Dropdown"
              options={selectOptions}
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              fullWidth
            />

            <Textarea
              label="Textarea"
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              rows={5}
              placeholder="Enter your message..."
              fullWidth
            />

            <Checkbox
              label="Check this checkbox"
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
            />

            <Checkbox
              label="Indeterminate checkbox"
              checked={checkboxChecked}
              indeterminate
              onChange={(e) => setCheckboxChecked(e.target.checked)}
            />

            <Switch
              label="Toggle switch"
              checked={switchChecked}
              onChange={(e) => setSwitchChecked(e.target.checked)}
            />

            <RadioGroup
              value={radioValue}
              onChange={setRadioValue}
              name="test-radio"
            >
              <Radio value="option1" label="Radio Option 1" />
              <Radio value="option2" label="Radio Option 2" />
              <Radio value="option3" label="Radio Option 3" />
            </RadioGroup>
          </div>
        </section>

        <Divider label="UI Components" />

        {/* UI Components Section */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            UI Components
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Badge variant="default">Default Badge</Badge>
              <Badge variant="primary">Primary Badge</Badge>
              <Badge variant="success">Success Badge</Badge>
              <Badge variant="warning">Warning Badge</Badge>
              <Badge variant="error">Error Badge</Badge>
            </div>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Avatar size="sm">AB</Avatar>
              <Avatar size="md">CD</Avatar>
              <Avatar size="lg">EF</Avatar>
              <Avatar size="xl">GH</Avatar>
            </div>

            <div style={{ maxWidth: "400px" }}>
              <Progress
                value={progressValue}
                showLabel
                variant="default"
                size="md"
              />
              <div
                style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}
              >
                <Button
                  appName="web"
                  onClick={() =>
                    setProgressValue(Math.max(0, progressValue - 10))
                  }
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
          </div>
        </section>

        {/* Alert Section */}
        {showAlert && (
          <section>
            <Alert
              variant="info"
              title="Information"
              dismissible
              onClose={() => setShowAlert(false)}
            >
              This is an informational alert that can be dismissed.
            </Alert>
          </section>
        )}

        {/* Cards Section */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Cards</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            <Card title="Card 1" href="https://example.com" className="p-4">
              This is a card component with some content.
            </Card>
            <Card title="Card 2" href="https://example.com" className="p-4">
              Another card with different content.
            </Card>
            <Card title="Card 3" href="https://example.com" className="p-4">
              Third card in the grid layout.
            </Card>
          </div>
        </section>

        <Divider label="Data Visualization" />

        {/* Data Visualization Section */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Data Visualization
          </h2>
          <DataVisualization
            colorScheme="primary"
            width={600}
            height={250}
            showLineChart={true}
            showBarChart={true}
            showPieChart={true}
          />
        </section>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Test Modal"
        size="lg"
      >
        <div>
          <p style={{ marginBottom: "1rem" }}>
            This is a modal dialog with form controls inside.
          </p>
          <Input label="Modal Input" placeholder="Type here..." fullWidth />
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
            <Button appName="web" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button appName="web">Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
