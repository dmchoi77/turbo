'use client';

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Table } from "@repo/ui/table";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@repo/ui/tabs";
import { Pagination } from "@repo/ui/pagination";
import { Badge } from "@repo/ui/badge";
import { Alert } from "@repo/ui/alert";
import { Progress } from "@repo/ui/progress";
import { Avatar } from "@repo/ui/avatar";
import { Divider } from "@repo/ui/divider";
import { Card } from "@repo/ui/card";
import { Spinner } from "@repo/ui/spinner";

export default function Test2Page(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  const [progressValue, setProgressValue] = useState(75);
  const [activeTab, setActiveTab] = useState("tab1");

  // Table data
  const tableData = [
    { id: 1, name: "Alice Johnson", age: 28, email: "alice@example.com", status: "Active", role: "Developer" },
    { id: 2, name: "Bob Smith", age: 35, email: "bob@example.com", status: "Active", role: "Designer" },
    { id: 3, name: "Charlie Brown", age: 42, email: "charlie@example.com", status: "Inactive", role: "Manager" },
    { id: 4, name: "Diana Prince", age: 29, email: "diana@example.com", status: "Active", role: "Developer" },
    { id: 5, name: "Eve Wilson", age: 31, email: "eve@example.com", status: "Pending", role: "Designer" },
  ];

  const tableColumns = [
    { key: "id", header: "ID", width: "80px" },
    { key: "name", header: "Name" },
    { key: "age", header: "Age", align: "center" as const },
    { key: "email", header: "Email" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => {
        const variant = value === "Active" ? "success" : value === "Inactive" ? "error" : "warning";
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
    { key: "role", header: "Role" },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: "bold" }}>
        Test Page 2 - Data Display Components
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Tabs Section */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Tabs</h2>
          <Tabs defaultTab="tab1">
            <TabList>
              <Tab value="tab1">Overview</Tab>
              <Tab value="tab2">Details</Tab>
              <Tab value="tab3">Settings</Tab>
              <Tab value="tab4">Analytics</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="tab1">
                <div style={{ padding: "1.5rem", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                  <h3 style={{ marginBottom: "1rem" }}>Overview Tab</h3>
                  <p>This is the overview content. It contains general information about the system.</p>
                  <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                    <Card
                      title="Total Users"
                      href="#"
                      className="p-4"
                    >
                      1,234 active users
                    </Card>
                    <Card
                      title="Revenue"
                      href="#"
                      className="p-4"
                    >
                      $45,678 this month
                    </Card>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="tab2">
                <div style={{ padding: "1.5rem", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                  <h3 style={{ marginBottom: "1rem" }}>Details Tab</h3>
                  <p>Detailed information and configuration options are displayed here.</p>
                  <div style={{ marginTop: "1rem" }}>
                    <Progress value={progressValue} showLabel variant="success" size="lg" />
                    <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                      <Button appName="web" onClick={() => setProgressValue(Math.max(0, progressValue - 10))}>
                        Decrease
                      </Button>
                      <Button appName="web" onClick={() => setProgressValue(Math.min(100, progressValue + 10))}>
                        Increase
                      </Button>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="tab3">
                <div style={{ padding: "1.5rem", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                  <h3 style={{ marginBottom: "1rem" }}>Settings Tab</h3>
                  <p>Configure your application settings from this tab.</p>
                  <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <Alert variant="info" title="Settings Info">
                      Changes made here will affect all users.
                    </Alert>
                    <Alert variant="warning" title="Warning">
                      Please review changes before saving.
                    </Alert>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="tab4">
                <div style={{ padding: "1.5rem", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                  <h3 style={{ marginBottom: "1rem" }}>Analytics Tab</h3>
                  <p>View analytics and performance metrics.</p>
                  <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                    <div style={{ padding: "1rem", backgroundColor: "white", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6" }}>1,234</div>
                      <div style={{ color: "#6b7280" }}>Total Views</div>
                    </div>
                    <div style={{ padding: "1rem", backgroundColor: "white", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>567</div>
                      <div style={{ color: "#6b7280" }}>Active Users</div>
                    </div>
                    <div style={{ padding: "1rem", backgroundColor: "white", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b" }}>89</div>
                      <div style={{ color: "#6b7280" }}>New Signups</div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </section>

        <Divider label="Data Tables" />

        {/* Table Section */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Data Table</h2>
          <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "1rem", overflow: "auto" }}>
            <Table
              columns={tableColumns}
              data={tableData}
              striped
              hoverable
              onRowClick={(row) => {
                console.log("Row clicked:", row);
                alert(`Clicked on ${row.name}`);
              }}
            />
          </div>
        </section>

        <Divider label="Progress Indicators" />

        {/* Progress Section */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Progress Indicators</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "600px" }}>
            <div>
              <Progress value={25} showLabel variant="default" size="sm" />
            </div>
            <div>
              <Progress value={50} showLabel variant="success" size="md" />
            </div>
            <div>
              <Progress value={75} showLabel variant="warning" size="lg" />
            </div>
            <div>
              <Progress value={100} showLabel variant="error" size="md" />
            </div>
          </div>
        </section>

        <Divider label="User Profiles" />

        {/* User Profiles Section */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>User Profiles</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
            {tableData.map((user) => (
              <Card
                key={user.id}
                title={user.name}
                href="#"
                className="p-4"
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                  <Avatar size="lg">{user.name.split(" ").map(n => n[0]).join("")}</Avatar>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: "bold" }}>{user.name}</div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>{user.role}</div>
                    <div style={{ marginTop: "0.5rem" }}>
                      <Badge variant={user.status === "Active" ? "success" : user.status === "Inactive" ? "error" : "warning"}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Divider label="Pagination" />

        {/* Pagination Section */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Pagination</h2>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              currentPage={currentPage}
              totalPages={20}
              onPageChange={setCurrentPage}
              showFirstLast
              maxVisible={7}
            />
          </div>
          <div style={{ marginTop: "1rem", textAlign: "center", color: "#6b7280" }}>
            Current Page: {currentPage} of 20
          </div>
        </section>

        <Divider label="Loading States" />

        {/* Loading States Section */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Loading States</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              <div>
                <div style={{ marginBottom: "0.5rem" }}>Small Spinner</div>
                <Spinner size="sm" />
              </div>
              <div>
                <div style={{ marginBottom: "0.5rem" }}>Medium Spinner</div>
                <Spinner size="md" />
              </div>
              <div>
                <div style={{ marginBottom: "0.5rem" }}>Large Spinner</div>
                <Spinner size="lg" />
              </div>
            </div>
            <Alert variant="info" title="Loading">
              Content is being loaded. Please wait...
            </Alert>
          </div>
        </section>

        <Divider label="Alert Variants" />

        {/* Alert Variants Section */}
        <section>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Alert Variants</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Alert variant="info" title="Information">
              This is an informational alert with important details.
            </Alert>
            <Alert variant="success" title="Success">
              Operation completed successfully!
            </Alert>
            <Alert variant="warning" title="Warning">
              Please review the following information carefully.
            </Alert>
            <Alert variant="error" title="Error">
              An error occurred while processing your request.
            </Alert>
          </div>
        </section>
      </div>
    </div>
  );
}

