export interface Attestation {
  uuid: string;
  tracking_id: string;
  type: string;
  attestee: string;
  attestee_uuid: string;
  attestor: string;
  related_attestations: string;
  data_hash: string;
  attestor_signed_at: Date;
  attestee_signed_at: Date;
  attestor_signature: string;
  attestee_signature: string;
  sig_version: number;
  public_data: string;
  public_attestor_note: string;
  app_uuid: string;
}