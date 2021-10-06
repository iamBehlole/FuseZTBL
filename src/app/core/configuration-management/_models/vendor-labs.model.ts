export class VendorLabModel {
	lab_id: number;
	lab_name: string;
	vendor_id: number;
	region_id: number;

	clear() {
		this.lab_id = 0;
		this.lab_name = '';
		this.vendor_id = 0;
		this.region_id = 0;
	}
}
