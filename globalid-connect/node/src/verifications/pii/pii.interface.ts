export interface Pii {
  value: string;
  type: string;
  gid_uuid: string;
  attestation_request_uuid: string;
  has_attachment: boolean;
  attachment?: string;
}
