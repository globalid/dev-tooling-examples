export interface Requirement {
  value: string;
  name: string;
  selected: boolean;
}

export interface QrCodeViewModel {
  wsUrl: string;
  trackingId: string;
  qrCodeUrl: URL;
  selectedRequirement: {
    flowName: string;
    purpose: string;
  };
  requirements: Requirement[];
}
