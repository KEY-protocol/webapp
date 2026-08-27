import axios from "axios";

const BLOCKCHAIN_BASE_URL =
  process.env.NEXT_PUBLIC_BLOCKCHAIN_URL || "http://localhost:3000/api/blockchain";

export interface BlockchainIdentity {
  certId: string;
  identityCommitment: string;
  biometricCommitment: string;
  cid: string;
  issuedAt: number | null;
  revoked: boolean;
  clave?: string;
}

export async function getTechnicianIdentityOnChain(
  certId: string,
): Promise<BlockchainIdentity | null> {
  try {
    const response = await axios.get(
      `${BLOCKCHAIN_BASE_URL}/technician-identity/${certId}`,
    );
    return response.data?.data || response.data || null;
  } catch (error) {
    console.error("Error al consultar la identidad en blockchain:", error);
    return null;
  }
}

/**
 * Invoca la aprobación del Administrador para procesar el TEE en Phala y acuñar en Blockchain.
 */
export async function approveEvidenceTEE(id: string): Promise<any> {
  try {
    const response = await axios.post(`${BLOCKCHAIN_BASE_URL}/approve-tee/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al aprobar evidencia en TEE:", error);
    throw error;
  }
}
