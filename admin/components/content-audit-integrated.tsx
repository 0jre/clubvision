"use client"

import { useState } from "react"
import { Search, Download, Calendar, ChevronDown, ChevronUp } from "lucide-react"
import { useAuditLogs } from "@/admin/hooks/use-admin-api"

export function ContentAudit() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    actionType: "all",
    startDate: "",
    endDate: "",
    userId: "",
    limit: 50,
  })
  const [sortField, setSortField] = useState("timestamp")
  const [sortDirection, setSortDirection] = useState("desc")

  // Buscar logs de auditoria usando a API
  const { data, loading, error, refetch } = useAuditLogs({
    ...filters,
    page,
    sort: `${sortDirection === "desc" ? "-" : ""}${sortField}`,
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
  }

  const getActionColor = (action: string) => {
    if (action.includes("delete")) return "#ef4444"
    if (action.includes("update")) return "#f59e0b"
    if (action.includes("create")) return "#10b981"
    if (action.includes("view")) return "#3b82f6"
    return "#6b7280"
  }

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
          Content Audit
        </h1>
        <p style={{ color: "#6b7280", margin: 0 }}>Track and review all content moderation actions and system events</p>
      </div>

      {/* Filters */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>Audit Log Filters</h3>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              backgroundColor: "#f3f4f6",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <Download size={16} />
            Export Logs
          </button>
        </div>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "6px",
                color: "#374151",
              }}
            >
              Action Type
            </label>
            <select
              value={filters.actionType}
              onChange={(e) => setFilters({ ...filters, actionType: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              <option value="all">All Actions</option>
              <option value="update_content_status">Update Content Status</option>
              <option value="delete_content">Delete Content</option>
              <option value="delete_comment">Delete Comment</option>
              <option value="update_comment">Update Comment</option>
              <option value="analyze_content">Analyze Content</option>
              <option value="view_content_details">View Content Details</option>
              <option value="user_warn">User Warning</option>
              <option value="user_suspend">User Suspension</option>
              <option value="user_ban">User Ban</option>
            </select>
          </div>

          <div style={{ flex: "1 1 200px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "6px",
                color: "#374151",
              }}
            >
              User ID
            </label>
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                placeholder="Filter by user ID"
                value={filters.userId}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 36px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          <div style={{ flex: "1 1 200px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "6px",
                color: "#374151",
              }}
            >
              Start Date
            </label>
            <div style={{ position: "relative" }}>
              <Calendar
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 36px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          <div style={{ flex: "1 1 200px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "6px",
                color: "#374151",
              }}
            >
              End Date
            </label>
            <div style={{ position: "relative" }}>
              <Calendar
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 36px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => {
              setPage(1)
              refetch()
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#151618",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Carregando logs de auditoria...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>
          <p>Erro ao carregar logs de auditoria: {error}</p>
          <button
            onClick={() => refetch()}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              marginTop: "16px",
            }}
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSort("timestamp")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      Timestamp {getSortIcon("timestamp")}
                    </div>
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSort("action")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      Action {getSortIcon("action")}
                    </div>
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSort("userId")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      User {getSortIcon("userId")}
                    </div>
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Content ID
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.logs?.map((log: any) => (
                  <tr key={log._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#1f2937" }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px" }}>
                      <div
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          backgroundColor: getActionColor(log.action) + "20",
                          color: getActionColor(log.action),
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {log.action.replace(/_/g, " ")}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#1f2937" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img
                          src={log.user?.avatar || "/placeholder.svg?height=24&width=24"}
                          alt="Avatar"
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: "#f3f4f6",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: "500" }}>{log.user?.displayName || "Unknown User"}</div>
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>ID: {log.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6b7280" }}>
                      {log.contentId || log.details?.contentId || "-"}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6b7280" }}>
                      {log.details ? (
                        <div>
                          {Object.entries(log.details).map(([key, value]) => (
                            <div key={key}>
                              <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                              {typeof value === "object"
                                ? JSON.stringify(value).substring(0, 50) + "..."
                                : String(value).substring(0, 50)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}

                {data?.logs?.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: "24px", textAlign: "center", color: "#6b7280" }}>
                      Nenhum log de auditoria encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.logs?.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                Mostrando {data?.logs?.length} de {data?.pagination?.totalItems} logs
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: page === 1 ? "#f3f4f6" : "#151618",
                    color: page === 1 ? "#9ca3af" : "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: page === 1 ? "default" : "pointer",
                    fontSize: "14px",
                  }}
                >
                  Anterior
                </button>
                <button
                  disabled={page >= (data?.pagination?.totalPages || 1)}
                  onClick={() => setPage(page + 1)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: page >= (data?.pagination?.totalPages || 1) ? "#f3f4f6" : "#151618",
                    color: page >= (data?.pagination?.totalPages || 1) ? "#9ca3af" : "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: page >= (data?.pagination?.totalPages || 1) ? "default" : "pointer",
                    fontSize: "14px",
                  }}
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
