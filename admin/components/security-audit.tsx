"use client"

import { useState } from "react"
import { Shield, AlertTriangle, Eye, Download, Filter } from "lucide-react"

export function SecurityAudit() {
  const [selectedTab, setSelectedTab] = useState("logs")

  const auditLogs = [
    {
      id: "log_001",
      timestamp: "2024-01-20 15:30:25",
      user: "admin_001",
      action: "User Account Suspended",
      target: "user_12345",
      ip: "192.168.1.100",
      severity: "high",
      details: "Account suspended for policy violation",
    },
    {
      id: "log_002",
      timestamp: "2024-01-20 15:25:10",
      user: "admin_002",
      action: "Content Removed",
      target: "post_67890",
      ip: "192.168.1.101",
      severity: "medium",
      details: "Post removed for community guidelines violation",
    },
    {
      id: "log_003",
      timestamp: "2024-01-20 15:20:45",
      user: "system",
      action: "Security Scan Completed",
      target: "system_wide",
      ip: "internal",
      severity: "low",
      details: "Automated security scan completed successfully",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "#ef4444"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const tabs = [
    { id: "logs", label: "Audit Logs", count: 1247 },
    { id: "permissions", label: "Permissions", count: 45 },
    { id: "access", label: "Access Control", count: 12 },
  ]

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "600",
            color: "#1f2937",
            margin: "0 0 8px 0",
          }}
        >
          Security & Audit
        </h1>
        <p style={{ color: "#6b7280", margin: 0 }}>Monitor system security, audit trails, and access controls</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {[
          { label: "Security Alerts", value: "3", icon: AlertTriangle, color: "#ef4444" },
          { label: "Failed Logins", value: "127", icon: Shield, color: "#f59e0b" },
          { label: "Active Sessions", value: "2,456", icon: Eye, color: "#10b981" },
          { label: "Audit Events", value: "1,247", icon: Shield, color: "#3b82f6" },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              style={{
                backgroundColor: "#ffffff",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: stat.color + "20",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={24} color={stat.color} />
                </div>
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#1f2937",
                  marginBottom: "4px",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                {stat.label}
              </div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                padding: "16px 24px",
                backgroundColor: selectedTab === tab.id ? "#f9fafb" : "transparent",
                border: "none",
                borderBottom: selectedTab === tab.id ? "2px solid #3b82f6" : "2px solid transparent",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                color: selectedTab === tab.id ? "#3b82f6" : "#6b7280",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {tab.label}
              <div
                style={{
                  padding: "2px 6px",
                  backgroundColor: selectedTab === tab.id ? "#3b82f6" : "#e5e7eb",
                  color: selectedTab === tab.id ? "white" : "#6b7280",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {tab.count}
              </div>
            </button>
          ))}
        </div>

        <div style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                <Filter size={16} />
                Filter
              </button>

              <select
                style={{
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                }}
              >
                <option>All Severity</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <Download size={16} />
              Export Logs
            </button>
          </div>

          <div style={{ overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Timestamp
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    User
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Action
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Target
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    IP Address
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Severity
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa",
                    }}
                  >
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#374151",
                        fontFamily: "monospace",
                      }}
                    >
                      {log.timestamp}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px", color: "#374151" }}>{log.user}</td>
                    <td style={{ padding: "16px", fontSize: "14px", color: "#374151", fontWeight: "500" }}>
                      {log.action}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                        fontFamily: "monospace",
                      }}
                    >
                      {log.target}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                        fontFamily: "monospace",
                      }}
                    >
                      {log.ip}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor: getSeverityColor(log.severity) + "20",
                          color: getSeverityColor(log.severity),
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: getSeverityColor(log.severity),
                          }}
                        />
                        {log.severity}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                        maxWidth: "200px",
                      }}
                    >
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {log.details}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
