export class VendorModel {
	vendor_id: number;
	vendor_name: string;

	clear() {
		this.vendor_id = 0;
		this.vendor_name = '';
	}
}
