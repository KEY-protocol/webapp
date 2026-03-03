import { ServerData } from "../types/api";

/**
 * MOCK SERVER DATABASE
 * Use this as the single source of truth for the frontend development.
 * TODO: Replace with real API calls once the backend is ready.
 */
export const MOCK_DB: ServerData = {
  currentUser: {
    id: "usr_1",
    name: "Admin Key Protocol",
    email: "admin@keyprotocol.io",
    role: "admin",
    avatar:
      "https://ui-avatars.com/api/?name=Admin+Key&background=0D8ABC&color=fff",
  },
  identities: [
    {
      id: "id_001",
      fullName: "Juan Pérez",
      documentNumber: "12345678",
      documentType: "DNI",
      status: "approved",
      createdAt: "2024-02-20T10:00:00Z",
      updatedAt: "2024-02-21T14:30:00Z",
      verificationDetails: {
        faceScore: 0.98,
        documentScore: 0.95,
        notes: "Verificación exitosa automática.",
      },
    },
    {
      id: "id_002",
      fullName: "María García",
      documentNumber: "87654321",
      documentType: "PASSPORT",
      status: "pending",
      createdAt: "2024-02-23T09:15:00Z",
      updatedAt: "2024-02-23T09:15:00Z",
    },
    {
      id: "id_003",
      fullName: "Ricardo Darín",
      documentNumber: "11223344",
      documentType: "DNI",
      status: "rejected",
      createdAt: "2024-02-22T11:45:00Z",
      updatedAt: "2024-02-22T12:00:00Z",
      verificationDetails: {
        faceScore: 0.45,
        documentScore: 0.88,
        notes: "Fallo en reconocimiento facial. Imagen borrosa.",
      },
    },
    {
      id: "id_004",
      fullName: "Elena White",
      documentNumber: "AA998877",
      documentType: "LICENSE",
      status: "in_review",
      createdAt: "2024-02-24T08:00:00Z",
      updatedAt: "2024-02-24T08:30:00Z",
    },
  ],
  stats: {
    totalPending: 1,
    totalApproved: 1,
    totalRejected: 1,
  },
  notifications: [
    {
      id: "not_1",
      message: "Nueva identidad pendiente de revisión: Elena White",
      type: "info",
      read: false,
      timestamp: "2024-02-24T08:01:00Z",
    },
    {
      id: "not_2",
      message: "El sistema de verificación facial se ha actualizado.",
      type: "success",
      read: true,
      timestamp: "2024-02-23T15:00:00Z",
    },
  ],
};

// Helper function to simulate a fetch call
export const fetchMockData = async (): Promise<ServerData> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DB);
    }, 500);
  });
};
