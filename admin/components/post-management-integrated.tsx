"use client"

import { useState } from "react"
import { Eye, CheckCircle, XCircle, AlertTriangle, Search, Filter, Grid, List, Download, Flag } from "lucide-react"
import { useContentList, updateContentStatus, deleteContent, analyzeContent } from "@/admin/hooks/use-admin-api"

export function PostManagement() {
  const [viewMode, setViewMode] = useState("grid")
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    contentType: "all",
    status: "all",
    sortBy: "recent",
    search: "",
    limit: 12,
  })

  // Buscar conteúdo usando a API
  const { data, loading, error, refetch } = useContentList({
    ...filters,
    page,
  })

  const handleApprove = async (contentId: string) => {
    try {
      await updateContentStatus(contentId, "active", "Conteúdo aprovado após revisão")
      refetch()
    } catch (err) {
      console.error("Erro ao aprovar conteúdo:", err)
      alert("Erro ao aprovar conteúdo. Tente novamente.")
    }
  }

  const handleRemove = async (contentId: string, contentType: string) => {
    if (confirm("Tem certeza que deseja remover este conteúdo?")) {
      try {
        await deleteContent(contentId, contentType)
        refetch()
      } catch (err) {
        console.error("Erro ao remover conteúdo:", err)
        alert("Erro ao remover conteúdo. Tente novamente.")
      }
    }
  }

  const handleReject = async (contentId: string) => {
    try {
      await updateContentStatus(contentId, "removed", "Conteúdo removido por violar diretrizes da comunidade")
      refetch()
    } catch (err) {
      console.error("Erro ao rejeitar conteúdo:", err)
      alert("Erro ao rejeitar conteúdo. Tente novamente.")
    }
  }

  const handleAnalyzeContent = async (contentId: string, contentType: string, text: string) => {
    try {
      const result = await analyzeContent(contentId, contentType, text) as any
      alert(
        `Análise concluída: ${result.analysis.hasContentViolation ? "Conteúdo impróprio detectado" : "Conteúdo seguro"}`,
      )
      refetch()
    } catch (err) {
      console.error("Erro ao analisar conteúdo:", err)
      alert("Erro ao analisar conteúdo. Tente novamente.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10b981"
      case "under_review":
        return "#f59e0b"
      case "removed":
        return "#ef4444"
      case "hidden":
        return "#6b7280"
      default:
        return "#6b7280"
    }
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
          Post Management
        </h1>
        <p style={{ color: "#6b7280", margin: 0 }}>Manage and moderate all posts across the platform</p>
      </div>

      {/* Filters and Search */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ position: "relative", width: "300px" }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                placeholder="Search posts..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 40px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={16} color="#6b7280" />
              <span style={{ fontSize: "14px", color: "#6b7280" }}>Filter by:</span>
            </div>

            <select
              value={filters.contentType}
              onChange={(e) => setFilters({ ...filters, contentType: e.target.value })}
              style={{
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              <option value="all">All Types</option>
              <option value="post">Posts</option>
              <option value="video">Videos</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              style={{
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="under_review">Under Review</option>
              <option value="removed">Removed</option>
              <option value="hidden">Hidden</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              style={{
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="most_reported">Most Reported</option>
              <option value="most_viewed">Most Viewed</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: "8px",
                backgroundColor: viewMode === "grid" ? "#f3f4f6" : "transparent",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <Grid size={16} color={viewMode === "grid" ? "#3b82f6" : "#6b7280"} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "8px",
                backgroundColor: viewMode === "list" ? "#f3f4f6" : "transparent",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <List size={16} color={viewMode === "list" ? "#3b82f6" : "#6b7280"} />
            </button>
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
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Content Display */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Carregando conteúdo...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>
          <p>Erro ao carregar conteúdo: {error}</p>
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
      ) : viewMode === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {data?.content?.map((item: any) => (
            <div
              key={item._id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ position: "relative", paddingBottom: "56.25%", backgroundColor: "#f3f4f6" }}>
                <img
                  src={item.thumbnail || item.image || "/placeholder.svg?height=200&width=400"}
                  alt={item.title || "Post thumbnail"}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    padding: "4px 8px",
                    backgroundColor: item.contentType === "post" ? "#dbeafe" : "#fef3c7",
                    color: item.contentType === "post" ? "#1e40af" : "#92400e",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "500",
                    textTransform: "uppercase",
                  }}
                >
                  {item.contentType}
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    padding: "4px 8px",
                    backgroundColor: getStatusColor(item.status) + "20",
                    color: getStatusColor(item.status),
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  {item.status?.replace("_", " ") || "active"}
                </div>
              </div>

              <div style={{ padding: "16px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    margin: "0 0 8px 0",
                    color: "#1f2937",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: "1.5",
                  }}
                >
                  {item.title || "Sem título"}
                </h3>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <img
                    src={item.author?.avatar || "/placeholder.svg?height=32&width=32"}
                    alt="Avatar"
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: "#f3f4f6",
                    }}
                  />
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    {item.author?.displayName || "Usuário desconhecido"}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    marginBottom: "16px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: "1.5",
                  }}
                >
                  {item.description || "Sem descrição"}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                    fontSize: "12px",
                    color: "#6b7280",
                  }}
                >
                  <div>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div>👁️ {item.metrics?.views || 0}</div>
                    <div>❤️ {item.metrics?.likes || 0}</div>
                    <div>💬 {item.metrics?.comments || 0}</div>
                    {item.metrics?.reports > 0 && <div style={{ color: "#ef4444" }}>🚩 {item.metrics.reports}</div>}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    style={{
                      flex: 1,
                      padding: "8px",
                      backgroundColor: "#f3f4f6",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      color: "#374151",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "8px",
                      backgroundColor: "#dcfce7",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      color: "#166534",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => handleApprove(item._id)}
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "8px",
                      backgroundColor: "#fee2e2",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      color: "#dc2626",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => handleReject(item._id)}
                  >
                    <XCircle size={16} />
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "8px",
                      backgroundColor: "#fef3c7",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      color: "#92400e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() =>
                      handleAnalyzeContent(item._id, item.contentType, item.description || item.title || "")
                    }
                  >
                    <AlertTriangle size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {data?.content?.map((item: any) => (
            <div
              key={item._id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                display: "flex",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "80px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#f3f4f6",
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.thumbnail || item.image || "/placeholder.svg?height=80&width=120"}
                  alt={item.title || "Post thumbnail"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        padding: "4px 8px",
                        backgroundColor: item.contentType === "post" ? "#dbeafe" : "#fef3c7",
                        color: item.contentType === "post" ? "#1e40af" : "#92400e",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "500",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.contentType}
                    </div>
                    <div
                      style={{
                        padding: "4px 8px",
                        backgroundColor: getStatusColor(item.status) + "20",
                        color: getStatusColor(item.status),
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {item.status?.replace("_", " ") || "active"}
                    </div>
                    {item.metrics?.reports > 0 && (
                      <div
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#fee2e2",
                          color: "#dc2626",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Flag size={12} />
                        {item.metrics.reports} reports
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>ID: {item._id}</div>
                </div>

                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    margin: "0 0 8px 0",
                    color: "#1f2937",
                  }}
                >
                  {item.title || "Sem título"}
                </h3>

                <div
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    marginBottom: "8px",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.description || "Sem descrição"}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#6b7280" }}
                  >
                    <img
                      src={item.author?.avatar || "/placeholder.svg?height=24&width=24"}
                      alt="Avatar"
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "#f3f4f6",
                      }}
                    />
                    <span>{item.author?.displayName || "Usuário desconhecido"}</span>
                    <span>•</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>👁️ {item.metrics?.views || 0}</span>
                    <span>•</span>
                    <span>❤️ {item.metrics?.likes || 0}</span>
                    <span>•</span>
                    <span>💬 {item.metrics?.comments || 0}</span>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      style={{
                        padding: "6px",
                        backgroundColor: "#f3f4f6",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        color: "#374151",
                      }}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      style={{
                        padding: "6px",
                        backgroundColor: "#dcfce7",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        color: "#166534",
                      }}
                      onClick={() => handleApprove(item._id)}
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      style={{
                        padding: "6px",
                        backgroundColor: "#fee2e2",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        color: "#dc2626",
                      }}
                      onClick={() => handleReject(item._id)}
                    >
                      <XCircle size={16} />
                    </button>
                    <button
                      style={{
                        padding: "6px",
                        backgroundColor: "#fef3c7",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        color: "#92400e",
                      }}
                      onClick={() =>
                        handleAnalyzeContent(item._id, item.contentType, item.description || item.title || "")
                      }
                    >
                      <AlertTriangle size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.content?.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
          <p>Nenhum conteúdo encontrado.</p>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            Mostrando {data?.content?.length} de {data?.pagination?.totalItems} itens
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              style={{
                padding: "8px 16px",
                backgroundColor: page === 1 ? "#f3f4f6" : "#3b82f6",
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
                backgroundColor: page >= (data?.pagination?.totalPages || 1) ? "#f3f4f6" : "#3b82f6",
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
  )
}
